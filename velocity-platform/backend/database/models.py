"""
Database models for Velocity AI Platform
Implements complete schema for users, agents, evidence, and compliance tracking
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Dict, List, Optional
from uuid import uuid4

from sqlalchemy import (
    Boolean, Column, DateTime, Enum as SQLEnum, Float, ForeignKey, 
    Integer, JSON, String, Text, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

# Enums
class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

class SubscriptionPlan(str, Enum):
    STARTER = "starter"
    GROWTH = "growth"
    SCALE = "scale"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    PAST_DUE = "past_due"
    TRIALING = "trialing"

class AgentStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    FAILED = "failed"
    DEPLOYING = "deploying"

class Platform(str, Enum):
    AWS = "aws"
    AZURE = "azure"
    GCP = "gcp"
    GITHUB = "github"

class ComplianceFramework(str, Enum):
    SOC2 = "soc2"
    ISO27001 = "iso27001"
    GDPR = "gdpr"
    NIS2 = "nis2"
    DORA = "dora"
    EU_AI_ACT = "eu_ai_act"
    CIS = "cis"
    PCI_DSS = "pci_dss"
    HIPAA = "hipaa"
    NIST = "nist"

class EvidenceType(str, Enum):
    CONFIGURATION = "configuration"
    LOG = "log"
    SCREENSHOT = "screenshot"
    DOCUMENT = "document"
    METRIC = "metric"

class EvidenceStatus(str, Enum):
    COLLECTED = "collected"
    VALIDATED = "validated"
    FLAGGED = "flagged"
    REJECTED = "rejected"

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    company = Column(String(255), nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    agents = relationship("Agent", back_populates="user")
    integrations = relationship("PlatformIntegration", back_populates="user")
    evidence_reviews = relationship("EvidenceReview", back_populates="user")

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    plan = Column(SQLEnum(SubscriptionPlan), nullable=False)
    status = Column(SQLEnum(SubscriptionStatus), nullable=False)
    stripe_subscription_id = Column(String(255), unique=True, nullable=True)
    stripe_customer_id = Column(String(255), nullable=True)
    current_period_start = Column(DateTime(timezone=True), nullable=False)
    current_period_end = Column(DateTime(timezone=True), nullable=False)
    trial_end = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="subscription")

class PlatformIntegration(Base):
    __tablename__ = "platform_integrations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    platform = Column(SQLEnum(Platform), nullable=False)
    name = Column(String(255), nullable=False)  # User-friendly name
    credentials = Column(JSON, nullable=False)  # Encrypted credentials
    config = Column(JSON, nullable=True)  # Platform-specific config
    is_active = Column(Boolean, default=True)
    last_sync = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="integrations")
    agents = relationship("Agent", back_populates="integration")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'platform', 'name', name='unique_user_platform_name'),
    )

class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    integration_id = Column(UUID(as_uuid=True), ForeignKey("platform_integrations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    platform = Column(SQLEnum(Platform), nullable=False)
    framework = Column(SQLEnum(ComplianceFramework), nullable=False)
    status = Column(SQLEnum(AgentStatus), default=AgentStatus.DEPLOYING)
    schedule_cron = Column(String(100), nullable=False)  # Cron expression
    automation_level = Column(Float, nullable=False)  # 0-100%
    config = Column(JSON, nullable=False)  # Agent configuration
    controls = Column(JSON, nullable=False)  # Compliance controls to monitor
    last_run = Column(DateTime(timezone=True), nullable=True)
    next_run = Column(DateTime(timezone=True), nullable=True)
    success_rate = Column(Float, default=0.0)  # 0-100%
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="agents")
    integration = relationship("PlatformIntegration", back_populates="agents")
    executions = relationship("AgentExecution", back_populates="agent")
    evidence = relationship("Evidence", back_populates="agent")

class AgentExecution(Base):
    __tablename__ = "agent_executions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"), nullable=False)
    status = Column(String(50), nullable=False)  # running, completed, failed
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    evidence_collected = Column(Integer, default=0)
    errors = Column(JSON, nullable=True)  # Error details if any
    logs = Column(Text, nullable=True)
    
    # Relationships
    agent = relationship("Agent", back_populates="executions")

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"), nullable=False)
    execution_id = Column(UUID(as_uuid=True), ForeignKey("agent_executions.id"), nullable=True)
    control_id = Column(String(100), nullable=False)  # e.g., "CC6.1", "7.1"
    control_name = Column(String(255), nullable=False)
    evidence_type = Column(SQLEnum(EvidenceType), nullable=False)
    status = Column(SQLEnum(EvidenceStatus), default=EvidenceStatus.COLLECTED)
    confidence_score = Column(Float, nullable=False)  # AI validation score 0-100%
    data = Column(JSON, nullable=False)  # Evidence data
    metadata = Column(JSON, nullable=True)  # Additional metadata
    file_path = Column(String(500), nullable=True)  # For file-based evidence
    collected_at = Column(DateTime(timezone=True), server_default=func.now())
    validated_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    agent = relationship("Agent", back_populates="evidence")
    execution = relationship("AgentExecution")
    reviews = relationship("EvidenceReview", back_populates="evidence")

class EvidenceReview(Base):
    __tablename__ = "evidence_reviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    evidence_id = Column(UUID(as_uuid=True), ForeignKey("evidence.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(SQLEnum(EvidenceStatus), nullable=False)
    notes = Column(Text, nullable=True)
    reviewed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    evidence = relationship("Evidence", back_populates="reviews")
    user = relationship("User", back_populates="evidence_reviews")

class TrustScore(Base):
    __tablename__ = "trust_scores"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    framework = Column(SQLEnum(ComplianceFramework), nullable=False)
    score = Column(Float, nullable=False)  # 0-100%
    total_controls = Column(Integer, nullable=False)
    compliant_controls = Column(Integer, nullable=False)
    evidence_count = Column(Integer, nullable=False)
    calculation_data = Column(JSON, nullable=False)  # Detailed breakdown
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'framework', name='unique_user_framework_score'),
    )

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(String(255), nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")

class SystemHealth(Base):
    __tablename__ = "system_health"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float, nullable=False)
    tags = Column(JSON, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        {'postgresql_partition_by': 'RANGE (timestamp)'},
    )