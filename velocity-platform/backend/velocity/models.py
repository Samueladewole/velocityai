"""
Velocity AI Platform - Database Models
Production-ready SQLAlchemy models for live data
"""
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, JSON, Float, ForeignKey, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
import enum
from pydantic import BaseModel

Base = declarative_base()

# Enums
class AgentStatus(enum.Enum):
    IDLE = "idle"
    RUNNING = "running"
    PAUSED = "paused"
    ERROR = "error"
    COMPLETED = "completed"

class EvidenceType(enum.Enum):
    SCREENSHOT = "screenshot"
    API_RESPONSE = "api_response"
    CONFIGURATION = "configuration"
    LOG_ENTRY = "log_entry"
    POLICY_DOCUMENT = "policy_document"
    SCAN_RESULT = "scan_result"

class EvidenceStatus(enum.Enum):
    PENDING = "pending"
    VALIDATED = "validated"
    REJECTED = "rejected"
    PROCESSING = "processing"

class IntegrationStatus(enum.Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"
    SYNCING = "syncing"

class Platform(enum.Enum):
    AWS = "aws"
    GCP = "gcp"
    AZURE = "azure"
    GITHUB = "github"
    GOOGLE_WORKSPACE = "google_workspace"
    SLACK = "slack"
    CUSTOM = "custom"

class Framework(enum.Enum):
    SOC2 = "soc2"
    ISO27001 = "iso27001"
    CIS_CONTROLS = "cis_controls"
    GDPR = "gdpr"
    HIPAA = "hipaa"
    PCI_DSS = "pci_dss"

# Database Models
class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    domain = Column(String(255), unique=True, nullable=False)
    tier = Column(String(50), default="starter")  # starter, growth, enterprise
    settings = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    users = relationship("User", back_populates="organization")
    agents = relationship("Agent", back_populates="organization")
    integrations = relationship("Integration", back_populates="organization")
    evidence_items = relationship("EvidenceItem", back_populates="organization")

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(50), default="user")  # admin, user, readonly
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    organization = relationship("Organization", back_populates="users")

class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    platform = Column(SQLEnum(Platform), nullable=False)
    framework = Column(SQLEnum(Framework), nullable=False)
    status = Column(SQLEnum(AgentStatus), default=AgentStatus.IDLE)
    configuration = Column(JSONB, default={})
    schedule = Column(JSONB, default={})  # Cron-like scheduling
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    integration_id = Column(UUID(as_uuid=True), ForeignKey("integrations.id"))
    
    # Metrics
    evidence_collected = Column(Integer, default=0)
    success_rate = Column(Float, default=0.0)
    avg_collection_time = Column(Float, default=0.0)  # seconds
    last_run = Column(DateTime(timezone=True))
    next_run = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    organization = relationship("Organization", back_populates="agents")
    integration = relationship("Integration", back_populates="agents")
    evidence_items = relationship("EvidenceItem", back_populates="agent")
    execution_logs = relationship("AgentExecutionLog", back_populates="agent")

class Integration(Base):
    __tablename__ = "integrations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    platform = Column(SQLEnum(Platform), nullable=False)
    status = Column(SQLEnum(IntegrationStatus), default=IntegrationStatus.DISCONNECTED)
    credentials = Column(JSONB, default={})  # Encrypted credentials
    configuration = Column(JSONB, default={})
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    
    # Connection metrics
    last_sync = Column(DateTime(timezone=True))
    sync_frequency = Column(Integer, default=3600)  # seconds
    error_count = Column(Integer, default=0)
    last_error = Column(Text)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    organization = relationship("Organization", back_populates="integrations")
    agents = relationship("Agent", back_populates="integration")

class EvidenceItem(Base):
    __tablename__ = "evidence_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    evidence_type = Column(SQLEnum(EvidenceType), nullable=False)
    status = Column(SQLEnum(EvidenceStatus), default=EvidenceStatus.PENDING)
    
    # Evidence data
    data = Column(JSONB, default={})  # The actual evidence content
    evidence_metadata = Column(JSONB, default={})  # Collection metadata
    file_path = Column(String(500))  # For screenshots/documents
    
    # Compliance mapping
    framework = Column(SQLEnum(Framework), nullable=False)
    control_id = Column(String(100))  # e.g. "CC6.1", "A.8.2.3"
    confidence_score = Column(Float, default=0.0)  # 0.0 to 1.0
    trust_points = Column(Integer, default=0)
    
    # Relationships
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"))
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    
    # Validation
    validated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    validated_at = Column(DateTime(timezone=True))
    validation_notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    agent = relationship("Agent", back_populates="evidence_items")
    organization = relationship("Organization", back_populates="evidence_items")

class AgentExecutionLog(Base):
    __tablename__ = "agent_execution_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"), nullable=False)
    execution_id = Column(String(255))  # Unique execution identifier
    
    # Execution details
    started_at = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True))
    status = Column(SQLEnum(AgentStatus), nullable=False)
    
    # Results
    evidence_collected = Column(Integer, default=0)
    errors_encountered = Column(Integer, default=0)
    execution_time = Column(Float, default=0.0)  # seconds
    
    # Logs and debugging
    logs = Column(JSONB, default=[])  # Array of log entries
    error_details = Column(JSONB, default={})
    performance_metrics = Column(JSONB, default={})
    
    # Relationships
    agent = relationship("Agent", back_populates="execution_logs")

class TrustScore(Base):
    __tablename__ = "trust_scores"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    
    # Current scores
    total_score = Column(Integer, default=0)
    framework_scores = Column(JSONB, default={})  # Per-framework breakdown
    
    # Historical tracking
    previous_score = Column(Integer, default=0)
    score_change = Column(Integer, default=0)
    last_updated = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Contributing factors
    evidence_count = Column(Integer, default=0)
    automation_rate = Column(Float, default=0.0)
    coverage_percentage = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class ScheduledTask(Base):
    __tablename__ = "scheduled_tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"), nullable=False)
    
    # Scheduling
    cron_expression = Column(String(100))  # e.g., "0 */6 * * *"
    next_run = Column(DateTime(timezone=True), nullable=False)
    last_run = Column(DateTime(timezone=True))
    
    # Configuration
    enabled = Column(Boolean, default=True)
    retry_count = Column(Integer, default=3)
    timeout_seconds = Column(Integer, default=3600)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

# Pydantic models for API responses
class AgentResponse(BaseModel):
    id: str
    name: str
    platform: str
    framework: str
    status: str
    evidence_collected: int
    success_rate: float
    last_run: Optional[datetime]
    next_run: Optional[datetime]
    
    class Config:
        from_attributes = True

class EvidenceResponse(BaseModel):
    id: str
    title: str
    evidence_type: str
    status: str
    framework: str
    control_id: str
    confidence_score: float
    trust_points: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TrustScoreResponse(BaseModel):
    total_score: int
    framework_scores: Dict[str, int]
    score_change: int
    evidence_count: int
    automation_rate: float
    coverage_percentage: float
    last_updated: datetime
    
    class Config:
        from_attributes = True

# Database initialization
def create_database_engine(database_url: str):
    """Create database engine with connection pooling"""
    engine = create_engine(
        database_url,
        pool_size=20,
        max_overflow=30,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=False  # Set to True for SQL debugging
    )
    return engine

def create_tables(engine):
    """Create all tables"""
    Base.metadata.create_all(bind=engine)

def get_session_maker(engine):
    """Get session maker for database operations"""
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)