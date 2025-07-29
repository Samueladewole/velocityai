"""
Cross-Agent Data Sharing and Context Management System
Enables intelligent data sharing and context preservation across the 10-agent system
"""

import asyncio
import json
import uuid
import time
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Union, Set, Tuple
from enum import Enum
from dataclasses import dataclass, field, asdict
from collections import defaultdict, deque
import logging
import hashlib

from pydantic import BaseModel, Field
import structlog
import redis.asyncio as redis
from sqlalchemy.orm import Session
from sqlalchemy import desc

from agent_orchestration import AgentType, TaskType
from models import Organization, User

logger = structlog.get_logger()

class ContextType(Enum):
    """Types of context data"""
    EVIDENCE = "evidence"
    RISK_PROFILE = "risk_profile"
    COMPLIANCE_STATE = "compliance_state"
    SECURITY_POSTURE = "security_posture"
    CONFIGURATION = "configuration"
    POLICY = "policy"
    WORKFLOW_STATE = "workflow_state"
    LEARNING_DATA = "learning_data"
    PERFORMANCE_METRICS = "performance_metrics"
    INTEGRATION_STATE = "integration_state"

class ContextScope(Enum):
    """Scope of context sharing"""
    GLOBAL = "global"           # All agents can access
    ORGANIZATION = "organization"  # Organization-specific
    WORKFLOW = "workflow"       # Workflow-specific
    AGENT_TYPE = "agent_type"   # Specific agent type
    PRIVATE = "private"         # Single agent instance

class DataSensitivity(Enum):
    """Data sensitivity levels"""
    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    SECRET = "secret"

@dataclass
class ContextEntry:
    """Individual context entry"""
    entry_id: str
    context_type: ContextType
    scope: ContextScope
    sensitivity: DataSensitivity
    
    # Data
    data: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    # Ownership and access
    created_by: AgentType
    organization_id: str
    allowed_agents: Set[AgentType] = field(default_factory=set)
    
    # Lifecycle
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: Optional[datetime] = None
    last_accessed: Optional[datetime] = None
    access_count: int = 0
    
    # Versioning
    version: int = 1
    parent_entry_id: Optional[str] = None
    
    # Tags for filtering
    tags: Set[str] = field(default_factory=set)
    
    # Encryption status
    is_encrypted: bool = False
    encryption_key_id: Optional[str] = None

@dataclass
class ContextQuery:
    """Query for context data"""
    context_types: List[ContextType] = field(default_factory=list)
    agent_types: List[AgentType] = field(default_factory=list)
    organization_id: Optional[str] = None
    workflow_id: Optional[str] = None
    tags: Set[str] = field(default_factory=set)
    time_range: Optional[Tuple[datetime, datetime]] = None
    max_age_hours: Optional[int] = None
    limit: int = 100

@dataclass
class DataShareRequest:
    """Request to share data between agents"""
    request_id: str
    requesting_agent: AgentType
    target_agents: List[AgentType]
    data_description: str
    
    # Data payload
    context_type: ContextType
    data: Dict[str, Any]
    sensitivity: DataSensitivity = DataSensitivity.INTERNAL
    
    # Request metadata
    organization_id: str
    workflow_id: Optional[str] = None
    justification: str = ""
    expires_in_hours: int = 24
    
    # Status
    status: str = "pending"  # pending, approved, denied, expired
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    approved_by: List[AgentType] = field(default_factory=list)
    denied_by: List[AgentType] = field(default_factory=list)

class ContextAccessManager:
    """Manages access control for context data"""
    
    def __init__(self):
        self.access_policies: Dict[str, Dict[str, Any]] = {}
        self.access_log: deque = deque(maxlen=10000)
        self._initialize_default_policies()
    
    def _initialize_default_policies(self):
        """Initialize default access control policies"""
        
        # Global policies for different sensitivity levels
        self.access_policies = {
            "public_data": {
                "allowed_agents": list(AgentType),
                "sensitivity_levels": [DataSensitivity.PUBLIC],
                "requires_approval": False,
                "audit_access": False
            },
            
            "internal_data": {
                "allowed_agents": list(AgentType),
                "sensitivity_levels": [DataSensitivity.INTERNAL],
                "requires_approval": False,
                "audit_access": True
            },
            
            "confidential_data": {
                "allowed_agents": [
                    AgentType.COMPASS,
                    AgentType.PRISM,
                    AgentType.CIPHER
                ],
                "sensitivity_levels": [DataSensitivity.CONFIDENTIAL],
                "requires_approval": True,
                "audit_access": True
            },
            
            "secret_data": {
                "allowed_agents": [
                    AgentType.CRYPTO_VERIFICATION,
                    AgentType.CIPHER
                ],
                "sensitivity_levels": [DataSensitivity.SECRET],
                "requires_approval": True,
                "audit_access": True,
                "encryption_required": True
            }
        }
    
    def can_access(
        self, 
        agent: AgentType, 
        entry: ContextEntry, 
        organization_id: str
    ) -> Tuple[bool, str]:
        """Check if agent can access context entry"""
        
        # Check organization scope
        if entry.scope == ContextScope.ORGANIZATION and entry.organization_id != organization_id:
            return False, "Organization access denied"
        
        # Check agent-specific permissions
        if entry.scope == ContextScope.AGENT_TYPE and agent not in entry.allowed_agents:
            return False, "Agent type access denied"
        
        if entry.scope == ContextScope.PRIVATE and agent != entry.created_by:
            return False, "Private context access denied"
        
        # Check sensitivity-based policies
        policy_key = f"{entry.sensitivity.value}_data"
        if policy_key in self.access_policies:
            policy = self.access_policies[policy_key]
            
            if agent not in policy.get("allowed_agents", []):
                return False, f"Agent not authorized for {entry.sensitivity.value} data"
            
            if policy.get("requires_approval", False):
                # Check if access was pre-approved
                if not self._has_approval(agent, entry):
                    return False, "Approval required for access"
        
        # Check expiration
        if entry.expires_at and datetime.now(timezone.utc) > entry.expires_at:
            return False, "Context entry expired"
        
        return True, "Access granted"
    
    def _has_approval(self, agent: AgentType, entry: ContextEntry) -> bool:
        """Check if agent has approval to access entry"""
        # This would check approval records
        # For now, assume approval exists for demonstration
        return True
    
    def log_access(
        self, 
        agent: AgentType, 
        entry: ContextEntry, 
        access_type: str, 
        success: bool,
        reason: str = ""
    ):
        """Log context access for audit purposes"""
        
        access_record = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "agent": agent.value,
            "entry_id": entry.entry_id,
            "context_type": entry.context_type.value,
            "sensitivity": entry.sensitivity.value,
            "access_type": access_type,
            "success": success,
            "reason": reason,
            "organization_id": entry.organization_id
        }
        
        self.access_log.append(access_record)
        
        if entry.sensitivity in [DataSensitivity.CONFIDENTIAL, DataSensitivity.SECRET]:
            logger.info(
                "Sensitive context access",
                **access_record
            )

class ContextEncryption:
    """Handles encryption/decryption of sensitive context data"""
    
    def __init__(self):
        self.encryption_keys: Dict[str, str] = {}
        self.key_rotation_schedule: Dict[str, datetime] = {}
    
    async def encrypt_data(self, data: Dict[str, Any], sensitivity: DataSensitivity) -> Tuple[Dict[str, Any], str]:
        """Encrypt sensitive data"""
        
        if sensitivity not in [DataSensitivity.CONFIDENTIAL, DataSensitivity.SECRET]:
            return data, ""
        
        # Generate encryption key
        key_id = str(uuid.uuid4())
        
        # In production, use proper encryption
        encrypted_data = {
            "encrypted": True,
            "algorithm": "AES-256-GCM",
            "data": json.dumps(data)  # Simplified - would use actual encryption
        }
        
        self.encryption_keys[key_id] = "encryption_key_placeholder"
        
        return encrypted_data, key_id
    
    async def decrypt_data(self, encrypted_data: Dict[str, Any], key_id: str) -> Dict[str, Any]:
        """Decrypt sensitive data"""
        
        if not encrypted_data.get("encrypted", False):
            return encrypted_data
        
        if key_id not in self.encryption_keys:
            raise ValueError(f"Encryption key not found: {key_id}")
        
        # In production, use proper decryption
        decrypted_data = json.loads(encrypted_data["data"])
        
        return decrypted_data

class ContextStore:
    """Persistent storage for context data"""
    
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.local_cache: Dict[str, ContextEntry] = {}
        self.cache_stats = {"hits": 0, "misses": 0, "evictions": 0}
        self.max_cache_size = 1000
    
    async def store_context(self, entry: ContextEntry) -> bool:
        """Store context entry"""
        try:
            # Store in Redis
            key = f"context:{entry.organization_id}:{entry.entry_id}"
            data = asdict(entry)
            
            # Convert sets to lists for JSON serialization
            data["allowed_agents"] = list(data["allowed_agents"])
            data["tags"] = list(data["tags"])
            
            await self.redis.setex(
                key,
                timedelta(hours=48),  # Default TTL
                json.dumps(data, default=str)
            )
            
            # Update local cache
            self._update_cache(entry)
            
            # Index for queries
            await self._index_entry(entry)
            
            logger.debug(
                "Context entry stored",
                entry_id=entry.entry_id,
                context_type=entry.context_type.value,
                organization_id=entry.organization_id
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to store context entry: {e}")
            return False
    
    async def get_context(self, entry_id: str, organization_id: str) -> Optional[ContextEntry]:
        """Retrieve context entry by ID"""
        
        # Check local cache first
        cache_key = f"{organization_id}:{entry_id}"
        if cache_key in self.local_cache:
            self.cache_stats["hits"] += 1
            return self.local_cache[cache_key]
        
        self.cache_stats["misses"] += 1
        
        try:
            # Retrieve from Redis
            key = f"context:{organization_id}:{entry_id}"
            data = await self.redis.get(key)
            
            if not data:
                return None
            
            entry_dict = json.loads(data)
            
            # Convert lists back to sets
            entry_dict["allowed_agents"] = set(entry_dict["allowed_agents"])
            entry_dict["tags"] = set(entry_dict["tags"])
            
            # Convert enums
            entry_dict["context_type"] = ContextType(entry_dict["context_type"])
            entry_dict["scope"] = ContextScope(entry_dict["scope"])
            entry_dict["sensitivity"] = DataSensitivity(entry_dict["sensitivity"])
            entry_dict["created_by"] = AgentType(entry_dict["created_by"])
            
            # Convert datetime strings
            entry_dict["created_at"] = datetime.fromisoformat(entry_dict["created_at"].replace("Z", "+00:00"))
            if entry_dict["expires_at"]:
                entry_dict["expires_at"] = datetime.fromisoformat(entry_dict["expires_at"].replace("Z", "+00:00"))
            if entry_dict["last_accessed"]:
                entry_dict["last_accessed"] = datetime.fromisoformat(entry_dict["last_accessed"].replace("Z", "+00:00"))
            
            entry = ContextEntry(**entry_dict)
            
            # Update cache
            self._update_cache(entry)
            
            return entry
            
        except Exception as e:
            logger.error(f"Failed to retrieve context entry: {e}")
            return None
    
    async def query_context(self, query: ContextQuery) -> List[ContextEntry]:
        """Query context entries based on criteria"""
        
        try:
            # Build query pattern
            pattern = f"context:{query.organization_id or '*'}:*"
            
            # Get matching keys
            keys = []
            async for key in self.redis.scan_iter(match=pattern):
                keys.append(key)
            
            # Retrieve entries
            entries = []
            for key in keys[:query.limit]:
                data = await self.redis.get(key)
                if data:
                    try:
                        entry_dict = json.loads(data)
                        
                        # Apply filters
                        if not self._matches_query(entry_dict, query):
                            continue
                        
                        # Convert to ContextEntry
                        entry = self._dict_to_context_entry(entry_dict)
                        entries.append(entry)
                        
                    except Exception as e:
                        logger.warning(f"Failed to parse context entry: {e}")
            
            # Sort by creation time (newest first)
            entries.sort(key=lambda x: x.created_at, reverse=True)
            
            return entries[:query.limit]
            
        except Exception as e:
            logger.error(f"Failed to query context entries: {e}")
            return []
    
    def _matches_query(self, entry_dict: Dict[str, Any], query: ContextQuery) -> bool:
        """Check if entry matches query criteria"""
        
        # Filter by context types
        if query.context_types and entry_dict["context_type"] not in [ct.value for ct in query.context_types]:
            return False
        
        # Filter by agent types (creator or allowed agents)
        if query.agent_types:
            agent_values = [at.value for at in query.agent_types]
            if (entry_dict["created_by"] not in agent_values and 
                not any(agent in entry_dict.get("allowed_agents", []) for agent in agent_values)):
                return False
        
        # Filter by tags
        if query.tags and not query.tags.intersection(set(entry_dict.get("tags", []))):
            return False
        
        # Filter by age
        if query.max_age_hours:
            created_at = datetime.fromisoformat(entry_dict["created_at"].replace("Z", "+00:00"))
            age_hours = (datetime.now(timezone.utc) - created_at).total_seconds() / 3600
            if age_hours > query.max_age_hours:
                return False
        
        return True
    
    def _dict_to_context_entry(self, entry_dict: Dict[str, Any]) -> ContextEntry:
        """Convert dictionary to ContextEntry"""
        
        # Convert lists back to sets
        entry_dict["allowed_agents"] = set(AgentType(agent) for agent in entry_dict.get("allowed_agents", []))
        entry_dict["tags"] = set(entry_dict.get("tags", []))
        
        # Convert enums
        entry_dict["context_type"] = ContextType(entry_dict["context_type"])
        entry_dict["scope"] = ContextScope(entry_dict["scope"])
        entry_dict["sensitivity"] = DataSensitivity(entry_dict["sensitivity"])
        entry_dict["created_by"] = AgentType(entry_dict["created_by"])
        
        # Convert datetime strings
        entry_dict["created_at"] = datetime.fromisoformat(entry_dict["created_at"].replace("Z", "+00:00"))
        if entry_dict["expires_at"]:
            entry_dict["expires_at"] = datetime.fromisoformat(entry_dict["expires_at"].replace("Z", "+00:00"))
        if entry_dict["last_accessed"]:
            entry_dict["last_accessed"] = datetime.fromisoformat(entry_dict["last_accessed"].replace("Z", "+00:00"))
        
        return ContextEntry(**entry_dict)
    
    def _update_cache(self, entry: ContextEntry):
        """Update local cache with entry"""
        
        cache_key = f"{entry.organization_id}:{entry.entry_id}"
        
        # Evict if cache is full
        if len(self.local_cache) >= self.max_cache_size:
            # Remove oldest entry
            oldest_key = min(
                self.local_cache.keys(),
                key=lambda k: self.local_cache[k].last_accessed or self.local_cache[k].created_at
            )
            del self.local_cache[oldest_key]
            self.cache_stats["evictions"] += 1
        
        self.local_cache[cache_key] = entry
    
    async def _index_entry(self, entry: ContextEntry):
        """Create indexes for efficient querying"""
        
        # Index by context type
        type_key = f"index:context_type:{entry.context_type.value}:{entry.organization_id}"
        await self.redis.sadd(type_key, entry.entry_id)
        await self.redis.expire(type_key, timedelta(hours=48))
        
        # Index by agent type
        agent_key = f"index:agent:{entry.created_by.value}:{entry.organization_id}"
        await self.redis.sadd(agent_key, entry.entry_id)
        await self.redis.expire(agent_key, timedelta(hours=48))
        
        # Index by tags
        for tag in entry.tags:
            tag_key = f"index:tag:{tag}:{entry.organization_id}"
            await self.redis.sadd(tag_key, entry.entry_id)
            await self.redis.expire(tag_key, timedelta(hours=48))

class AgentContextManager:
    """Main context management system for cross-agent data sharing"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_client = None
        self.context_store = None
        self.access_manager = ContextAccessManager()
        self.encryption = ContextEncryption()
        
        # Share requests
        self.pending_requests: Dict[str, DataShareRequest] = {}
        self.approved_shares: Dict[str, Dict[str, Any]] = {}
        
        # Performance metrics
        self.metrics = {
            "contexts_created": 0,
            "contexts_accessed": 0,
            "share_requests": 0,
            "access_denied": 0,
            "cache_hit_rate": 0.0
        }
    
    async def start(self, redis_url: str = "redis://localhost:6379"):
        """Start the context management system"""
        
        self.redis_client = redis.from_url(redis_url)
        self.context_store = ContextStore(self.redis_client)
        
        # Start background tasks
        asyncio.create_task(self._cleanup_expired_contexts())
        
        logger.info("Agent context management system started")
    
    async def stop(self):
        """Stop the context management system"""
        
        if self.redis_client:
            await self.redis_client.close()
        
        logger.info("Agent context management system stopped")
    
    async def share_context(
        self,
        agent: AgentType,
        organization_id: str,
        context_type: ContextType,
        data: Dict[str, Any],
        scope: ContextScope = ContextScope.ORGANIZATION,
        sensitivity: DataSensitivity = DataSensitivity.INTERNAL,
        allowed_agents: Set[AgentType] = None,
        expires_in_hours: int = 24,
        tags: Set[str] = None
    ) -> Optional[str]:
        """Share context data with other agents"""
        
        try:
            # Generate entry ID
            entry_id = str(uuid.uuid4())
            
            # Encrypt data if needed
            if sensitivity in [DataSensitivity.CONFIDENTIAL, DataSensitivity.SECRET]:
                encrypted_data, key_id = await self.encryption.encrypt_data(data, sensitivity)
                data = encrypted_data
                is_encrypted = True
                encryption_key_id = key_id
            else:
                is_encrypted = False
                encryption_key_id = None
            
            # Create context entry
            entry = ContextEntry(
                entry_id=entry_id,
                context_type=context_type,
                scope=scope,
                sensitivity=sensitivity,
                data=data,
                created_by=agent,
                organization_id=organization_id,
                allowed_agents=allowed_agents or set(),
                expires_at=datetime.now(timezone.utc) + timedelta(hours=expires_in_hours),
                tags=tags or set(),
                is_encrypted=is_encrypted,
                encryption_key_id=encryption_key_id
            )
            
            # Store context
            success = await self.context_store.store_context(entry)
            
            if success:
                self.metrics["contexts_created"] += 1
                
                logger.info(
                    "Context shared",
                    entry_id=entry_id,
                    agent=agent.value,
                    context_type=context_type.value,
                    scope=scope.value,
                    sensitivity=sensitivity.value
                )
                
                return entry_id
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to share context: {e}")
            return None
    
    async def get_context(
        self,
        agent: AgentType,
        organization_id: str,
        entry_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get context data by entry ID"""
        
        try:
            # Retrieve context entry
            entry = await self.context_store.get_context(entry_id, organization_id)
            
            if not entry:
                return None
            
            # Check access permissions
            can_access, reason = self.access_manager.can_access(agent, entry, organization_id)
            
            if not can_access:
                self.access_manager.log_access(agent, entry, "read", False, reason)
                self.metrics["access_denied"] += 1
                
                logger.warning(
                    "Context access denied",
                    agent=agent.value,
                    entry_id=entry_id,
                    reason=reason
                )
                
                return None
            
            # Update access tracking
            entry.last_accessed = datetime.now(timezone.utc)
            entry.access_count += 1
            
            # Decrypt data if needed
            data = entry.data
            if entry.is_encrypted and entry.encryption_key_id:
                data = await self.encryption.decrypt_data(data, entry.encryption_key_id)
            
            # Log access
            self.access_manager.log_access(agent, entry, "read", True)
            self.metrics["contexts_accessed"] += 1
            
            # Update entry in store
            await self.context_store.store_context(entry)
            
            return {
                "entry_id": entry.entry_id,
                "context_type": entry.context_type.value,
                "data": data,
                "metadata": entry.metadata,
                "created_by": entry.created_by.value,
                "created_at": entry.created_at.isoformat(),
                "tags": list(entry.tags)
            }
            
        except Exception as e:
            logger.error(f"Failed to get context: {e}")
            return None
    
    async def query_contexts(
        self,
        agent: AgentType,
        organization_id: str,
        query: ContextQuery
    ) -> List[Dict[str, Any]]:
        """Query contexts based on criteria"""
        
        try:
            # Set organization filter
            query.organization_id = organization_id
            
            # Retrieve matching entries
            entries = await self.context_store.query_context(query)
            
            # Filter by access permissions and decrypt
            accessible_contexts = []
            
            for entry in entries:
                can_access, reason = self.access_manager.can_access(agent, entry, organization_id)
                
                if can_access:
                    # Decrypt data if needed
                    data = entry.data
                    if entry.is_encrypted and entry.encryption_key_id:
                        try:
                            data = await self.encryption.decrypt_data(data, entry.encryption_key_id)
                        except Exception as e:
                            logger.warning(f"Failed to decrypt context data: {e}")
                            continue
                    
                    accessible_contexts.append({
                        "entry_id": entry.entry_id,
                        "context_type": entry.context_type.value,
                        "data": data,
                        "metadata": entry.metadata,
                        "created_by": entry.created_by.value,
                        "created_at": entry.created_at.isoformat(),
                        "tags": list(entry.tags),
                        "access_count": entry.access_count
                    })
                    
                    # Update access tracking
                    entry.last_accessed = datetime.now(timezone.utc)
                    entry.access_count += 1
                    await self.context_store.store_context(entry)
                    
                    self.access_manager.log_access(agent, entry, "query", True)
                else:
                    self.access_manager.log_access(agent, entry, "query", False, reason)
            
            self.metrics["contexts_accessed"] += len(accessible_contexts)
            
            return accessible_contexts
            
        except Exception as e:
            logger.error(f"Failed to query contexts: {e}")
            return []
    
    async def request_data_share(
        self,
        requesting_agent: AgentType,
        target_agents: List[AgentType],
        organization_id: str,
        context_type: ContextType,
        data: Dict[str, Any],
        justification: str,
        sensitivity: DataSensitivity = DataSensitivity.INTERNAL
    ) -> str:
        """Request to share data with specific agents"""
        
        request_id = str(uuid.uuid4())
        
        request = DataShareRequest(
            request_id=request_id,
            requesting_agent=requesting_agent,
            target_agents=target_agents,
            data_description=f"{context_type.value} data share request",
            context_type=context_type,
            data=data,
            sensitivity=sensitivity,
            organization_id=organization_id,
            justification=justification
        )
        
        self.pending_requests[request_id] = request
        self.metrics["share_requests"] += 1
        
        # Auto-approve based on sensitivity level
        if sensitivity in [DataSensitivity.PUBLIC, DataSensitivity.INTERNAL]:
            await self._approve_share_request(request_id, requesting_agent)
        
        logger.info(
            "Data share request created",
            request_id=request_id,
            requesting_agent=requesting_agent.value,
            target_agents=[a.value for a in target_agents],
            sensitivity=sensitivity.value
        )
        
        return request_id
    
    async def approve_share_request(
        self,
        request_id: str,
        approving_agent: AgentType
    ) -> bool:
        """Approve a data share request"""
        
        if request_id not in self.pending_requests:
            return False
        
        return await self._approve_share_request(request_id, approving_agent)
    
    async def _approve_share_request(
        self,
        request_id: str,
        approving_agent: AgentType
    ) -> bool:
        """Internal method to approve share request"""
        
        try:
            request = self.pending_requests[request_id]
            request.status = "approved"
            request.approved_by.append(approving_agent)
            
            # Create context entry for shared data
            entry_id = await self.share_context(
                agent=request.requesting_agent,
                organization_id=request.organization_id,
                context_type=request.context_type,
                data=request.data,
                scope=ContextScope.AGENT_TYPE,
                sensitivity=request.sensitivity,
                allowed_agents=set(request.target_agents),
                expires_in_hours=request.expires_in_hours,
                tags={"shared_request", request_id}
            )
            
            if entry_id:
                self.approved_shares[request_id] = {
                    "entry_id": entry_id,
                    "approved_by": approving_agent.value,
                    "approved_at": datetime.now(timezone.utc).isoformat()
                }
                
                logger.info(
                    "Data share request approved",
                    request_id=request_id,
                    entry_id=entry_id,
                    approving_agent=approving_agent.value
                )
                
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Failed to approve share request: {e}")
            return False
    
    async def get_learning_context(
        self,
        agent: AgentType,
        organization_id: str,
        task_type: TaskType
    ) -> Dict[str, Any]:
        """Get learning context for agent optimization"""
        
        query = ContextQuery(
            context_types=[ContextType.LEARNING_DATA, ContextType.PERFORMANCE_METRICS],
            agent_types=[agent],
            organization_id=organization_id,
            tags={task_type.value, "learning"},
            max_age_hours=168,  # 1 week
            limit=50
        )
        
        contexts = await self.query_contexts(agent, organization_id, query)
        
        # Aggregate learning data
        performance_data = []
        learning_patterns = {}
        
        for context in contexts:
            if context["context_type"] == "performance_metrics":
                performance_data.append(context["data"])
            elif context["context_type"] == "learning_data":
                learning_patterns.update(context["data"])
        
        return {
            "performance_history": performance_data,
            "learning_patterns": learning_patterns,
            "context_count": len(contexts),
            "last_updated": datetime.now(timezone.utc).isoformat()
        }
    
    async def _cleanup_expired_contexts(self):
        """Background task to clean up expired contexts"""
        
        while True:
            try:
                current_time = datetime.now(timezone.utc)
                
                # Query for potentially expired contexts
                # This is a simplified cleanup - in production would be more efficient
                
                await asyncio.sleep(3600)  # Run every hour
                
            except Exception as e:
                logger.error(f"Context cleanup error: {e}")
                await asyncio.sleep(1800)  # Retry in 30 minutes
    
    def get_context_metrics(self) -> Dict[str, Any]:
        """Get context management metrics"""
        
        cache_stats = self.context_store.cache_stats if self.context_store else {}
        
        if cache_stats.get("hits", 0) + cache_stats.get("misses", 0) > 0:
            hit_rate = cache_stats["hits"] / (cache_stats["hits"] + cache_stats["misses"])
        else:
            hit_rate = 0.0
        
        return {
            "metrics": self.metrics,
            "cache_stats": cache_stats,
            "cache_hit_rate": hit_rate,
            "pending_requests": len(self.pending_requests),
            "approved_shares": len(self.approved_shares),
            "access_log_size": len(self.access_manager.access_log)
        }

# Global context manager instance
context_manager = None

async def get_context_manager(redis_url: str = "redis://localhost:6379") -> AgentContextManager:
    """Get or create context manager instance"""
    global context_manager
    if context_manager is None:
        context_manager = AgentContextManager()
        await context_manager.start(redis_url)
    return context_manager