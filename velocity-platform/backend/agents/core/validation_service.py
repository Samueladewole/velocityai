"""
High-performance validation service for evidence quality assessment.
Replaces TypeScript validation.ts with optimized Python implementation.
"""

import cv2
import numpy as np
import pytesseract
from PIL import Image, ImageStat
import io
import asyncio
from typing import Dict, List, Any, Optional, Tuple
import structlog
from dataclasses import dataclass
from datetime import datetime, timedelta
import hashlib

logger = structlog.get_logger()


@dataclass
class ValidationResult:
    status: str  # 'valid' | 'invalid' | 'pending'
    score: float
    issues: Optional[List[Dict[str, str]]] = None
    validated_at: Optional[datetime] = None
    validated_by: Optional[str] = None


@dataclass
class ValidationIssue:
    type: str  # 'quality' | 'completeness' | 'accuracy' | 'compliance'
    severity: str  # 'low' | 'medium' | 'high'
    message: str
    suggestion: Optional[str] = None


class HighPerformanceValidationService:
    """Optimized validation service using Python's superior image processing"""
    
    def __init__(self):
        self.min_image_width = 800
        self.min_image_height = 600
        self.min_quality_score = 0.7
        self.max_file_size = 10 * 1024 * 1024  # 10MB
        
        # OCR configuration for better performance
        self.ocr_config = '--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,()-'
    
    async def validate_screenshot_batch(
        self, 
        image_buffers: List[bytes]
    ) -> List[ValidationResult]:
        """Validate multiple screenshots in parallel for maximum efficiency"""
        
        tasks = [
            self._validate_single_screenshot(buffer, i) 
            for i, buffer in enumerate(image_buffers)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        validated_results = []
        for result in results:
            if isinstance(result, Exception):
                validated_results.append(ValidationResult(
                    status='invalid',
                    score=0.0,
                    issues=[ValidationIssue(
                        type='quality',
                        severity='high',
                        message=f'Validation failed: {str(result)}',
                        suggestion='Retry screenshot capture'
                    ).__dict__],
                    validated_at=datetime.utcnow(),
                    validated_by='automated-validation'
                ))
            else:
                validated_results.append(result)
        
        return validated_results
    
    async def _validate_single_screenshot(
        self, 
        buffer: bytes, 
        index: int = 0
    ) -> ValidationResult:
        """Validate single screenshot with comprehensive checks"""
        
        issues = []
        score = 1.0
        
        try:
            # Basic file checks
            if len(buffer) > self.max_file_size:
                issues.append(ValidationIssue(
                    type='quality',
                    severity='medium',
                    message=f'File size {len(buffer)} exceeds 10MB limit',
                    suggestion='Optimize image compression'
                ).__dict__)
                score -= 0.1
            
            # Convert to numpy array for OpenCV processing
            nparr = np.frombuffer(buffer, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise ValueError("Unable to decode image")
            
            height, width = img.shape[:2]
            
            # Dimension checks
            if width < self.min_image_width:
                issues.append(ValidationIssue(
                    type='quality',
                    severity='medium',
                    message=f'Width {width}px below minimum {self.min_image_width}px',
                    suggestion='Capture at higher resolution'
                ).__dict__)
                score -= 0.2
            
            if height < self.min_image_height:
                issues.append(ValidationIssue(
                    type='quality',
                    severity='medium',
                    message=f'Height {height}px below minimum {self.min_image_height}px',
                    suggestion='Capture at higher resolution'
                ).__dict__)
                score -= 0.2
            
            # Advanced quality checks using OpenCV
            quality_metrics = await self._analyze_image_quality(img)
            
            if quality_metrics['sharpness'] < 0.3:
                issues.append(ValidationIssue(
                    type='quality',
                    severity='medium',
                    message='Image appears blurry or out of focus',
                    suggestion='Ensure page is fully loaded before capture'
                ).__dict__)
                score -= 0.2
            
            if quality_metrics['brightness'] < 0.2 or quality_metrics['brightness'] > 0.9:
                issues.append(ValidationIssue(
                    type='quality',
                    severity='low',
                    message='Image brightness is suboptimal',
                    suggestion='Check display settings or lighting'
                ).__dict__)
                score -= 0.1
            
            # Content analysis
            content_issues = await self._analyze_content(img)
            issues.extend([issue.__dict__ for issue in content_issues])
            score -= len(content_issues) * 0.1
            
            # Text detection and OCR
            text_quality = await self._analyze_text_quality(img)
            if text_quality['readable_text_ratio'] < 0.5:
                issues.append(ValidationIssue(
                    type='completeness',
                    severity='medium',
                    message='Low readable text content detected',
                    suggestion='Verify page content is fully visible'
                ).__dict__)
                score -= 0.15
            
            score = max(0, score)
            
            return ValidationResult(
                status='valid' if score >= 0.7 else 'invalid',
                score=score,
                issues=issues if issues else None,
                validated_at=datetime.utcnow(),
                validated_by='automated-validation'
            )
            
        except Exception as e:
            logger.error("screenshot_validation_failed", error=str(e), index=index)
            return ValidationResult(
                status='invalid',
                score=0.0,
                issues=[ValidationIssue(
                    type='quality',
                    severity='high',
                    message=f'Validation error: {str(e)}',
                    suggestion='Retry screenshot capture'
                ).__dict__],
                validated_at=datetime.utcnow(),
                validated_by='automated-validation'
            )
    
    async def _analyze_image_quality(self, img: np.ndarray) -> Dict[str, float]:
        """Analyze image quality metrics using OpenCV"""
        
        # Convert to grayscale for analysis
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Sharpness using Laplacian variance
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        sharpness = min(1.0, laplacian_var / 1000)  # Normalize
        
        # Brightness analysis
        brightness = np.mean(gray) / 255.0
        
        # Contrast analysis
        contrast = np.std(gray) / 255.0
        
        # Edge density (indicates content richness)
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / (img.shape[0] * img.shape[1])
        
        return {
            'sharpness': sharpness,
            'brightness': brightness,
            'contrast': contrast,
            'edge_density': edge_density
        }
    
    async def _analyze_content(self, img: np.ndarray) -> List[ValidationIssue]:
        """Analyze image content for common issues"""
        
        issues = []
        
        # Check for mostly blank image
        if self._is_mostly_blank(img):
            issues.append(ValidationIssue(
                type='completeness',
                severity='high',
                message='Screenshot appears mostly blank',
                suggestion='Ensure page loaded completely before capture'
            ))
        
        # Check for error patterns using template matching
        if await self._detect_error_patterns(img):
            issues.append(ValidationIssue(
                type='accuracy',
                severity='high',
                message='Error page or dialog detected',
                suggestion='Check network connectivity and permissions'
            ))
        
        # Check for login patterns
        if await self._detect_login_patterns(img):
            issues.append(ValidationIssue(
                type='accuracy',
                severity='high',
                message='Login page detected',
                suggestion='Ensure authentication completed before capture'
            ))
        
        return issues
    
    def _is_mostly_blank(self, img: np.ndarray, threshold: float = 0.95) -> bool:
        """Check if image is mostly blank/white"""
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Count pixels above brightness threshold
        bright_pixels = np.sum(gray > 240)
        total_pixels = gray.shape[0] * gray.shape[1]
        
        return (bright_pixels / total_pixels) > threshold
    
    async def _detect_error_patterns(self, img: np.ndarray) -> bool:
        """Detect common error page patterns"""
        
        # Use OCR to detect error text
        try:
            # Extract text from image
            pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
            text = pytesseract.image_to_string(pil_img, config=self.ocr_config)
            text_lower = text.lower()
            
            error_keywords = [
                '404', '403', '500', 'error', 'not found', 
                'forbidden', 'unauthorized', 'access denied',
                'page not found', 'server error', 'bad request'
            ]
            
            return any(keyword in text_lower for keyword in error_keywords)
            
        except Exception:
            return False
    
    async def _detect_login_patterns(self, img: np.ndarray) -> bool:
        """Detect login page patterns"""
        
        try:
            pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
            text = pytesseract.image_to_string(pil_img, config=self.ocr_config)
            text_lower = text.lower()
            
            login_keywords = [
                'sign in', 'log in', 'login', 'username', 'password',
                'forgot password', 'remember me', 'create account'
            ]
            
            keyword_count = sum(1 for keyword in login_keywords if keyword in text_lower)
            return keyword_count >= 2  # Require multiple login indicators
            
        except Exception:
            return False
    
    async def _analyze_text_quality(self, img: np.ndarray) -> Dict[str, float]:
        """Analyze text readability and content"""
        
        try:
            # Preprocess image for better OCR
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Apply denoising
            denoised = cv2.fastNlMeansDenoising(gray)
            
            # Extract text with confidence scores
            pil_img = Image.fromarray(denoised)
            
            # Get detailed OCR data
            ocr_data = pytesseract.image_to_data(
                pil_img, 
                config=self.ocr_config,
                output_type=pytesseract.Output.DICT
            )
            
            # Calculate text quality metrics
            confidences = [int(conf) for conf in ocr_data['conf'] if int(conf) > 0]
            avg_confidence = np.mean(confidences) if confidences else 0
            
            # Count readable characters
            text_chars = ''.join(ocr_data['text']).strip()
            readable_chars = sum(1 for c in text_chars if c.isalnum() or c.isspace())
            
            total_pixels = img.shape[0] * img.shape[1]
            text_density = len(text_chars) / (total_pixels / 10000)  # Normalize
            
            return {
                'avg_confidence': avg_confidence / 100.0,
                'readable_text_ratio': min(1.0, readable_chars / max(1, len(text_chars))),
                'text_density': min(1.0, text_density),
                'total_characters': len(text_chars)
            }
            
        except Exception as e:
            logger.warning("text_analysis_failed", error=str(e))
            return {
                'avg_confidence': 0.5,
                'readable_text_ratio': 0.5,
                'text_density': 0.5,
                'total_characters': 0
            }
    
    async def validate_evidence_metadata(self, evidence_data: Dict[str, Any]) -> ValidationResult:
        """Validate evidence metadata completeness and accuracy"""
        
        issues = []
        score = 1.0
        
        # Required fields check
        required_fields = ['framework_id', 'control_id', 'timestamp', 'collected_by']
        for field in required_fields:
            if not evidence_data.get(field):
                issues.append(ValidationIssue(
                    type='completeness',
                    severity='high' if field in ['framework_id', 'control_id'] else 'medium',
                    message=f'Required field {field} is missing',
                    suggestion=f'Provide {field} for compliance mapping'
                ).__dict__)
                score -= 0.2 if field in ['framework_id', 'control_id'] else 0.1
        
        # Timestamp validation
        if evidence_data.get('timestamp'):
            try:
                timestamp = datetime.fromisoformat(evidence_data['timestamp'].replace('Z', '+00:00'))
                age_days = (datetime.utcnow() - timestamp.replace(tzinfo=None)).days
                
                if age_days > 90:
                    issues.append(ValidationIssue(
                        type='compliance',
                        severity='medium',
                        message=f'Evidence is {age_days} days old',
                        suggestion='Consider refreshing evidence for current compliance'
                    ).__dict__)
                    score -= 0.1
                    
            except ValueError:
                issues.append(ValidationIssue(
                    type='accuracy',
                    severity='medium',
                    message='Invalid timestamp format',
                    suggestion='Use ISO format timestamp'
                ).__dict__)
                score -= 0.1
        
        # Framework validation
        valid_frameworks = ['SOC2', 'ISO27001', 'GDPR', 'HIPAA', 'PCI_DSS']
        if evidence_data.get('framework_id') and evidence_data['framework_id'] not in valid_frameworks:
            issues.append(ValidationIssue(
                type='accuracy',
                severity='low',
                message=f'Unknown framework: {evidence_data["framework_id"]}',
                suggestion=f'Use one of: {", ".join(valid_frameworks)}'
            ).__dict__)
            score -= 0.05
        
        score = max(0, score)
        
        return ValidationResult(
            status='valid' if score >= 0.8 else 'invalid',
            score=score,
            issues=issues if issues else None,
            validated_at=datetime.utcnow(),
            validated_by='metadata-validator'
        )


# Singleton instance for global use
validation_service = HighPerformanceValidationService()