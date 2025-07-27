from sqlalchemy import create_engine, Column, String, DateTime, JSON, Text, Integer, Boolean, Float, ForeignKey, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional
import os

Base = declarative_base()

class Customer(Base):
    __tablename__ = 'customers'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(String(255), nullable=False)
    tier = Column(String(50), default='starter')  # starter, growth, scale
    status = Column(String(50), default='active')  # trial, active, suspended, cancelled
    signup_date = Column(DateTime, default=datetime.utcnow)
    trial_ends_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    agent_sessions = relationship("AgentSession", back_populates="customer")
    evidence_items = relationship("Evidence", back_populates="customer")
    trust_scores = relationship("TrustScore", back_populates="customer")

class AgentSession(Base):
    __tablename__ = 'agent_sessions'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey('customers.id'), nullable=False)
    session_type = Column(String(50), nullable=False)  # browser, api, hybrid
    status = Column(String(50), default='idle')  # idle, active, completed, failed
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    metadata = Column(JSONB)
    
    # Relationships
    customer = relationship("Customer", back_populates="agent_sessions")
    tasks = relationship("AgentTask", back_populates="session")
    
    # Indexes
    __table_args__ = (
        Index('idx_agent_sessions_customer_status', 'customer_id', 'status'),
        Index('idx_agent_sessions_started_at', 'started_at'),
    )

class AgentTask(Base):
    __tablename__ = 'agent_tasks'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey('agent_sessions.id'), nullable=False)
    task_type = Column(String(100), nullable=False)
    status = Column(String(50), default='pending')  # pending, running, completed, failed, retrying
    priority = Column(Integer, default=5)  # 1-10, higher is more priority
    scheduled_at = Column(DateTime, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    # Task configuration
    target_url = Column(Text)
    selectors = Column(JSONB)
    instructions = Column(Text)
    expected_result = Column(JSONB)
    
    # Results
    result = Column(JSONB)
    error_message = Column(Text)
    
    # Relationships
    session = relationship("AgentSession", back_populates="tasks")
    evidence_items = relationship("Evidence", back_populates="task")
    
    # Indexes
    __table_args__ = (
        Index('idx_agent_tasks_status_priority', 'status', 'priority'),
        Index('idx_agent_tasks_scheduled_at', 'scheduled_at'),
        Index('idx_agent_tasks_session_id', 'session_id'),
    )

class Evidence(Base):
    __tablename__ = 'evidence'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey('customers.id'), nullable=False)
    task_id = Column(UUID(as_uuid=True), ForeignKey('agent_tasks.id'), nullable=True)
    
    # Evidence classification
    evidence_type = Column(String(50), nullable=False)  # screenshot, text, api_response, configuration
    framework_id = Column(String(100), nullable=False)
    control_id = Column(String(100), nullable=False)
    
    # Content
    title = Column(String(500))
    description = Column(Text)
    url = Column(Text)
    selector = Column(String(1000))
    
    # Storage
    storage_path = Column(String(1000))
    file_size = Column(Integer)
    content_type = Column(String(100))
    checksum = Column(String(64))
    encrypted = Column(Boolean, default=True)
    compressed = Column(Boolean, default=True)
    
    # Metadata
    collected_at = Column(DateTime, default=datetime.utcnow)
    collected_by = Column(String(100))  # agent_id or 'manual'
    source_system = Column(String(100))
    
    # Validation
    validation_status = Column(String(50), default='pending')  # pending, valid, invalid, reviewing
    validation_score = Column(Float)
    validation_issues = Column(JSONB)
    validated_at = Column(DateTime, nullable=True)
    validated_by = Column(String(100))
    
    # Compliance mapping
    compliance_mappings = Column(JSONB)  # Maps to multiple frameworks/controls
    trust_equity_points = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    customer = relationship("Customer", back_populates="evidence_items")
    task = relationship("AgentTask", back_populates="evidence_items")
    
    # Indexes
    __table_args__ = (
        Index('idx_evidence_customer_framework', 'customer_id', 'framework_id'),
        Index('idx_evidence_collected_at', 'collected_at'),
        Index('idx_evidence_validation_status', 'validation_status'),
        Index('idx_evidence_control_id', 'control_id'),
        Index('idx_evidence_type', 'evidence_type'),
    )

class TrustScore(Base):
    __tablename__ = 'trust_scores'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey('customers.id'), nullable=False)
    
    # Score details
    overall_score = Column(Float, nullable=False)
    security_score = Column(Float, nullable=False)
    compliance_score = Column(Float, nullable=False)
    operations_score = Column(Float, nullable=False)
    governance_score = Column(Float, nullable=False)
    
    # Score breakdown
    framework_scores = Column(JSONB)  # Per-framework scores
    control_scores = Column(JSONB)   # Per-control scores
    evidence_count = Column(Integer, default=0)
    automation_percentage = Column(Float, default=0.0)
    
    # Trust equity
    total_trust_points = Column(Integer, default=0)
    points_breakdown = Column(JSONB)
    
    # Timestamps
    calculated_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    customer = relationship("Customer", back_populates="trust_scores")
    
    # Indexes
    __table_args__ = (
        Index('idx_trust_scores_customer_calculated', 'customer_id', 'calculated_at'),
        Index('idx_trust_scores_overall_score', 'overall_score'),
    )

class Workflow(Base):
    __tablename__ = 'workflows'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    workflow_type = Column(String(50))  # prebuilt, custom
    platform = Column(String(50))  # aws, google, github, azure, custom
    
    # Configuration
    steps = Column(JSONB, nullable=False)
    requirements = Column(JSONB)  # Credentials, permissions, etc.
    estimated_duration = Column(Integer)  # Minutes
    
    # Metadata
    created_by = Column(String(100))
    is_active = Column(Boolean, default=True)
    success_rate = Column(Float, default=0.0)
    average_duration = Column(Integer, default=0)
    usage_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Indexes
    __table_args__ = (
        Index('idx_workflows_platform_active', 'platform', 'is_active'),
        Index('idx_workflows_type', 'workflow_type'),
    )

class VelocityCustomer(Base):
    __tablename__ = 'velocity_customers'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey('customers.id'), nullable=False)
    
    # Velocity specific data
    onboarding_status = Column(String(50), default='not_started')
    current_step = Column(Integer, default=0)
    total_steps = Column(Integer, default=4)
    onboarding_started_at = Column(DateTime, nullable=True)
    onboarding_completed_at = Column(DateTime, nullable=True)
    time_to_trust_score = Column(Integer, nullable=True)  # Minutes
    
    # Usage tracking
    agents_run_count = Column(Integer, default=0)
    evidence_collected_count = Column(Integer, default=0)
    frameworks_enabled = Column(JSONB, default=list)
    
    # Metrics
    feature_adoption = Column(JSONB, default=dict)
    satisfaction_score = Column(Integer, nullable=True)  # 1-10
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AgentMetrics(Base):
    __tablename__ = 'agent_metrics'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(String(100), nullable=False)
    metric_type = Column(String(50), nullable=False)  # success_rate, avg_duration, error_rate
    metric_value = Column(Float, nullable=False)
    time_window = Column(String(20))  # hourly, daily, weekly
    recorded_at = Column(DateTime, default=datetime.utcnow)
    
    # Indexes
    __table_args__ = (
        Index('idx_agent_metrics_agent_type_time', 'agent_id', 'metric_type', 'recorded_at'),
    )

# Database connection and session management
class DatabaseManager:
    def __init__(self, database_url: str = None):
        self.database_url = database_url or os.getenv(
            'DATABASE_URL', 
            'postgresql://erip:password@localhost:5432/erip_agents'
        )
        self.engine = create_engine(
            self.database_url,
            pool_size=20,
            max_overflow=30,
            pool_pre_ping=True,
            pool_recycle=3600,
            echo=False
        )
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
    
    def create_tables(self):
        """Create all tables"""
        Base.metadata.create_all(bind=self.engine)
    
    def get_session(self):
        """Get database session"""
        session = self.SessionLocal()
        try:
            yield session
        finally:
            session.close()
    
    async def get_evidence_by_customer(
        self, 
        customer_id: str, 
        framework_id: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Evidence]:
        """Get evidence for customer with efficient querying"""
        session = self.SessionLocal()
        try:
            query = session.query(Evidence).filter(Evidence.customer_id == customer_id)
            
            if framework_id:
                query = query.filter(Evidence.framework_id == framework_id)
            
            return query.order_by(Evidence.collected_at.desc()).offset(offset).limit(limit).all()
        finally:
            session.close()
    
    async def get_agent_performance_metrics(self, agent_id: str, days: int = 7) -> Dict[str, Any]:
        """Get performance metrics for an agent"""
        session = self.SessionLocal()
        try:
            from sqlalchemy import func
            from datetime import timedelta
            
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            # Get task statistics
            task_stats = session.query(
                AgentTask.status,
                func.count(AgentTask.id).label('count'),
                func.avg(
                    func.extract('epoch', AgentTask.completed_at - AgentTask.started_at)
                ).label('avg_duration')
            ).filter(
                AgentTask.started_at >= cutoff_date
            ).group_by(AgentTask.status).all()
            
            # Get evidence statistics
            evidence_stats = session.query(
                func.count(Evidence.id).label('evidence_count'),
                func.avg(Evidence.validation_score).label('avg_quality')
            ).filter(
                Evidence.collected_at >= cutoff_date,
                Evidence.collected_by == agent_id
            ).first()
            
            return {
                'task_statistics': {stat.status: {'count': stat.count, 'avg_duration': stat.avg_duration} for stat in task_stats},
                'evidence_count': evidence_stats.evidence_count or 0,
                'average_quality': float(evidence_stats.avg_quality or 0),
                'time_period_days': days
            }
        finally:
            session.close()
    
    async def update_trust_score(self, customer_id: str, scores: Dict[str, float]) -> TrustScore:
        """Update customer trust score efficiently"""
        session = self.SessionLocal()
        try:
            trust_score = TrustScore(
                customer_id=customer_id,
                overall_score=scores.get('overall', 0.0),
                security_score=scores.get('security', 0.0),
                compliance_score=scores.get('compliance', 0.0),
                operations_score=scores.get('operations', 0.0),
                governance_score=scores.get('governance', 0.0),
                framework_scores=scores.get('frameworks', {}),
                control_scores=scores.get('controls', {}),
                evidence_count=scores.get('evidence_count', 0),
                automation_percentage=scores.get('automation_percentage', 0.0),
                total_trust_points=scores.get('trust_points', 0),
                points_breakdown=scores.get('points_breakdown', {})
            )
            session.add(trust_score)
            session.commit()
            session.refresh(trust_score)
            return trust_score
        finally:
            session.close()

# Initialize database manager
db_manager = DatabaseManager()