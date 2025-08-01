"""
Velocity AI Platform - Error Handling and Retry Mechanisms
Enterprise-grade error handling, retry logic, and resilience patterns
"""

import asyncio
import logging
import traceback
import time
from datetime import datetime, timezone, timedelta
from typing import Any, Callable, Dict, List, Optional, Union, Type
from enum import Enum
from dataclasses import dataclass
from functools import wraps
import json
import random

from validation import VelocityException

logger = logging.getLogger(__name__)

class ErrorType(Enum):
    """Error classification types"""
    TRANSIENT = "transient"  # Temporary errors that can be retried
    PERMANENT = "permanent"  # Permanent errors that should not be retried
    RATE_LIMITED = "rate_limited"  # Rate limiting errors
    AUTHENTICATION = "authentication"  # Auth/permission errors
    VALIDATION = "validation"  # Input validation errors
    NETWORK = "network"  # Network connectivity issues
    SERVICE_UNAVAILABLE = "service_unavailable"  # External service down
    QUOTA_EXCEEDED = "quota_exceeded"  # Usage quota exceeded
    TIMEOUT = "timeout"  # Operation timeout
    UNKNOWN = "unknown"  # Unclassified errors

class RetryStrategy(Enum):
    """Retry strategy types"""
    FIXED_DELAY = "fixed_delay"
    EXPONENTIAL_BACKOFF = "exponential_backoff"
    LINEAR_BACKOFF = "linear_backoff"
    JITTERED_BACKOFF = "jittered_backoff"
    FIBONACCI_BACKOFF = "fibonacci_backoff"

@dataclass
class RetryConfig:
    """Retry configuration"""
    max_attempts: int = 3
    strategy: RetryStrategy = RetryStrategy.EXPONENTIAL_BACKOFF
    base_delay: float = 1.0  # seconds
    max_delay: float = 60.0  # seconds
    backoff_multiplier: float = 2.0
    jitter: bool = True
    retryable_errors: List[ErrorType] = None
    
    def __post_init__(self):
        if self.retryable_errors is None:
            self.retryable_errors = [
                ErrorType.TRANSIENT,
                ErrorType.RATE_LIMITED,
                ErrorType.NETWORK,
                ErrorType.SERVICE_UNAVAILABLE,
                ErrorType.TIMEOUT
            ]

@dataclass
class ErrorContext:
    """Error context information"""
    error_id: str
    timestamp: datetime
    error_type: ErrorType
    operation: str
    user_id: Optional[str]
    organization_id: Optional[str]
    agent_id: Optional[str]
    request_id: Optional[str]
    error_message: str
    stack_trace: str
    metadata: Dict[str, Any]
    retry_attempt: int = 0
    is_retryable: bool = True

class ErrorClassifier:
    """Classifies errors into types for appropriate handling"""
    
    ERROR_PATTERNS = {
        # Network errors
        ErrorType.NETWORK: [
            "connection refused", "connection timeout", "network unreachable",
            "dns resolution failed", "socket timeout", "connection reset"
        ],
        
        # Service unavailable
        ErrorType.SERVICE_UNAVAILABLE: [
            "service unavailable", "502 bad gateway", "503 service unavailable",
            "504 gateway timeout", "internal server error", "502", "503", "504"
        ],
        
        # Rate limiting
        ErrorType.RATE_LIMITED: [
            "rate limit", "too many requests", "429", "quota exceeded",
            "throttled", "rate exceeded"
        ],
        
        # Authentication
        ErrorType.AUTHENTICATION: [
            "unauthorized", "authentication failed", "invalid credentials",
            "access denied", "forbidden", "401", "403"
        ],
        
        # Timeout
        ErrorType.TIMEOUT: [
            "timeout", "timed out", "deadline exceeded", "request timeout"
        ],
        
        # Validation
        ErrorType.VALIDATION: [
            "validation error", "invalid input", "bad request", "400",
            "missing required", "invalid format"
        ]
    }
    
    @classmethod
    def classify_error(cls, error: Exception) -> ErrorType:
        """Classify error into appropriate type"""
        error_message = str(error).lower()
        
        # Check for specific error types
        for error_type, patterns in cls.ERROR_PATTERNS.items():
            for pattern in patterns:
                if pattern in error_message:
                    return error_type
        
        # Check exception types
        if isinstance(error, (ConnectionError, OSError)):
            return ErrorType.NETWORK
        elif isinstance(error, TimeoutError):
            return ErrorType.TIMEOUT
        elif isinstance(error, PermissionError):
            return ErrorType.AUTHENTICATION
        elif isinstance(error, ValueError):
            return ErrorType.VALIDATION
        
        # Default to transient for unknown errors
        return ErrorType.TRANSIENT

class RetryHandler:
    """Handles retry logic with various strategies"""
    
    def __init__(self, config: RetryConfig):
        self.config = config
    
    def calculate_delay(self, attempt: int) -> float:
        """Calculate delay for retry attempt"""
        if self.config.strategy == RetryStrategy.FIXED_DELAY:
            delay = self.config.base_delay
        
        elif self.config.strategy == RetryStrategy.EXPONENTIAL_BACKOFF:
            delay = self.config.base_delay * (self.config.backoff_multiplier ** (attempt - 1))
        
        elif self.config.strategy == RetryStrategy.LINEAR_BACKOFF:
            delay = self.config.base_delay * attempt
        
        elif self.config.strategy == RetryStrategy.FIBONACCI_BACKOFF:
            # Generate fibonacci sequence for delay
            if attempt <= 2:
                delay = self.config.base_delay
            else:
                fib_a, fib_b = 1, 1
                for _ in range(attempt - 2):
                    fib_a, fib_b = fib_b, fib_a + fib_b
                delay = self.config.base_delay * fib_b
        
        else:  # JITTERED_BACKOFF
            delay = self.config.base_delay * (self.config.backoff_multiplier ** (attempt - 1))
        
        # Apply jitter if enabled
        if self.config.jitter:
            jitter_factor = random.uniform(0.5, 1.5)
            delay *= jitter_factor
        
        # Cap at max delay
        return min(delay, self.config.max_delay)
    
    def should_retry(self, error_type: ErrorType, attempt: int) -> bool:
        """Determine if error should be retried"""
        if attempt >= self.config.max_attempts:
            return False
        
        return error_type in self.config.retryable_errors

class CircuitBreaker:
    """Circuit breaker pattern for external service calls"""
    
    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_timeout: float = 60.0,
        expected_exception: Type[Exception] = Exception
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.expected_exception = expected_exception
        
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    def __call__(self, func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if self.state == "OPEN":
                if self._should_attempt_reset():
                    self.state = "HALF_OPEN"
                else:
                    raise VelocityException("Circuit breaker is OPEN - service unavailable")
            
            try:
                result = await func(*args, **kwargs)
                self._on_success()
                return result
            
            except self.expected_exception as e:
                self._on_failure()
                raise e
        
        return wrapper
    
    def _should_attempt_reset(self) -> bool:
        """Check if circuit breaker should attempt reset"""
        if self.last_failure_time is None:
            return True
        
        return (datetime.now() - self.last_failure_time).seconds >= self.recovery_timeout
    
    def _on_success(self):
        """Handle successful operation"""
        self.failure_count = 0
        self.state = "CLOSED"
    
    def _on_failure(self):
        """Handle failed operation"""
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"

class ErrorHandler:
    """Central error handling system"""
    
    def __init__(self):
        self.error_log: List[ErrorContext] = []
        self.classifier = ErrorClassifier()
        
        # Default retry configurations for different operations
        self.retry_configs = {
            "default": RetryConfig(),
            "cloud_api": RetryConfig(
                max_attempts=5,
                strategy=RetryStrategy.EXPONENTIAL_BACKOFF,
                base_delay=2.0,
                max_delay=120.0
            ),
            "database": RetryConfig(
                max_attempts=3,
                strategy=RetryStrategy.FIXED_DELAY,
                base_delay=0.5,
                retryable_errors=[ErrorType.TRANSIENT, ErrorType.NETWORK]
            ),
            "email": RetryConfig(
                max_attempts=3,
                strategy=RetryStrategy.EXPONENTIAL_BACKOFF,
                base_delay=5.0,
                max_delay=300.0
            ),
            "webhook": RetryConfig(
                max_attempts=4,
                strategy=RetryStrategy.JITTERED_BACKOFF,
                base_delay=1.0,
                max_delay=60.0
            )
        }
        
        # Circuit breakers for external services
        self.circuit_breakers = {
            "aws": CircuitBreaker(failure_threshold=3, recovery_timeout=30.0),
            "gcp": CircuitBreaker(failure_threshold=3, recovery_timeout=30.0),
            "azure": CircuitBreaker(failure_threshold=3, recovery_timeout=30.0),
            "openai": CircuitBreaker(failure_threshold=5, recovery_timeout=60.0),
            "anthropic": CircuitBreaker(failure_threshold=5, recovery_timeout=60.0)
        }
    
    async def handle_with_retry(
        self,
        operation: Callable,
        operation_name: str,
        retry_config_name: str = "default",
        context: Optional[Dict[str, Any]] = None,
        *args,
        **kwargs
    ) -> Any:
        """Execute operation with retry logic"""
        config = self.retry_configs.get(retry_config_name, self.retry_configs["default"])
        retry_handler = RetryHandler(config)
        
        last_error = None
        
        for attempt in range(1, config.max_attempts + 1):
            try:
                # Add context to operation if it accepts it
                if context:
                    kwargs.update(context)
                
                result = await operation(*args, **kwargs)
                
                # Log successful retry if this wasn't the first attempt
                if attempt > 1:
                    logger.info(f"Operation {operation_name} succeeded on attempt {attempt}")
                
                return result
            
            except Exception as error:
                last_error = error
                error_type = self.classifier.classify_error(error)
                
                # Create error context
                error_context = ErrorContext(
                    error_id=f"error_{int(time.time() * 1000)}",
                    timestamp=datetime.now(timezone.utc),
                    error_type=error_type,
                    operation=operation_name,
                    user_id=context.get("user_id") if context else None,
                    organization_id=context.get("organization_id") if context else None,
                    agent_id=context.get("agent_id") if context else None,
                    request_id=context.get("request_id") if context else None,
                    error_message=str(error),
                    stack_trace=traceback.format_exc(),
                    metadata=context or {},
                    retry_attempt=attempt,
                    is_retryable=retry_handler.should_retry(error_type, attempt)
                )
                
                # Store error context
                self.error_log.append(error_context)
                
                # Log error
                logger.error(
                    f"Operation {operation_name} failed on attempt {attempt}/{config.max_attempts}: "
                    f"{error_type.value} - {str(error)}"
                )
                
                # Check if we should retry
                if not retry_handler.should_retry(error_type, attempt):
                    logger.error(f"Operation {operation_name} failed permanently: {error_type.value}")
                    break
                
                # Calculate delay and wait
                if attempt < config.max_attempts:
                    delay = retry_handler.calculate_delay(attempt)
                    logger.info(f"Retrying {operation_name} in {delay:.2f} seconds...")
                    await asyncio.sleep(delay)
        
        # All retries exhausted, raise the last error
        raise VelocityException(
            f"Operation {operation_name} failed after {config.max_attempts} attempts: {str(last_error)}"
        ) from last_error
    
    def get_circuit_breaker(self, service: str) -> CircuitBreaker:
        """Get circuit breaker for service"""
        return self.circuit_breakers.get(service, self.circuit_breakers.get("default"))
    
    async def log_error(
        self,
        error: Exception,
        operation: str,
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Log error with context"""
        error_type = self.classifier.classify_error(error)
        
        error_context = ErrorContext(
            error_id=f"error_{int(time.time() * 1000)}",
            timestamp=datetime.now(timezone.utc),
            error_type=error_type,
            operation=operation,
            user_id=context.get("user_id") if context else None,
            organization_id=context.get("organization_id") if context else None,
            agent_id=context.get("agent_id") if context else None,
            request_id=context.get("request_id") if context else None,
            error_message=str(error),
            stack_trace=traceback.format_exc(),
            metadata=context or {},
            retry_attempt=0,
            is_retryable=error_type in RetryConfig().retryable_errors
        )
        
        self.error_log.append(error_context)
        
        # Log based on error severity
        if error_type in [ErrorType.PERMANENT, ErrorType.AUTHENTICATION]:
            logger.error(f"Critical error in {operation}: {str(error)}")
        else:
            logger.warning(f"Error in {operation}: {str(error)}")
        
        return error_context.error_id
    
    def get_error_statistics(self, hours_back: int = 24) -> Dict[str, Any]:
        """Get error statistics"""
        cutoff_time = datetime.now(timezone.utc) - timedelta(hours=hours_back)
        recent_errors = [e for e in self.error_log if e.timestamp >= cutoff_time]
        
        # Count by error type
        error_type_counts = {}
        operation_counts = {}
        
        for error in recent_errors:
            error_type_counts[error.error_type.value] = \
                error_type_counts.get(error.error_type.value, 0) + 1
            operation_counts[error.operation] = \
                operation_counts.get(error.operation, 0) + 1
        
        return {
            "total_errors": len(recent_errors),
            "period_hours": hours_back,
            "error_types": error_type_counts,
            "operations": operation_counts,
            "most_common_error": max(error_type_counts.items(), key=lambda x: x[1])[0] if error_type_counts else None,
            "most_failing_operation": max(operation_counts.items(), key=lambda x: x[1])[0] if operation_counts else None
        }

# Global error handler instance
error_handler = ErrorHandler()

# Decorators for common retry patterns
def retry_on_failure(
    operation_name: str,
    retry_config_name: str = "default",
    circuit_breaker_service: Optional[str] = None
):
    """Decorator for automatic retry on failure"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract context from kwargs if available
            context = {
                "user_id": kwargs.get("user_id"),
                "organization_id": kwargs.get("organization_id"),
                "agent_id": kwargs.get("agent_id"),
                "request_id": kwargs.get("request_id")
            }
            
            # Apply circuit breaker if specified
            if circuit_breaker_service:
                cb = error_handler.get_circuit_breaker(circuit_breaker_service)
                func = cb(func)
            
            return await error_handler.handle_with_retry(
                func,
                operation_name,
                retry_config_name,
                context,
                *args,
                **kwargs
            )
        
        return wrapper
    
    return decorator

def handle_errors(operation_name: str):
    """Decorator for error logging and handling"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                context = {
                    "user_id": kwargs.get("user_id"),
                    "organization_id": kwargs.get("organization_id"),
                    "agent_id": kwargs.get("agent_id"),
                    "request_id": kwargs.get("request_id")
                }
                
                error_id = await error_handler.log_error(e, operation_name, context)
                
                # Re-raise with error ID for tracking
                raise VelocityException(f"Operation failed (ID: {error_id}): {str(e)}") from e
        
        return wrapper
    
    return decorator

# Convenience functions
async def with_retry(
    operation: Callable,
    operation_name: str,
    retry_config_name: str = "default",
    **kwargs
) -> Any:
    """Execute operation with retry logic"""
    return await error_handler.handle_with_retry(
        operation,
        operation_name,
        retry_config_name,
        None,
        **kwargs
    )

async def log_error(error: Exception, operation: str, **context) -> str:
    """Log error with context"""
    return await error_handler.log_error(error, operation, context)

def get_error_stats(hours_back: int = 24) -> Dict[str, Any]:
    """Get error statistics"""
    return error_handler.get_error_statistics(hours_back)