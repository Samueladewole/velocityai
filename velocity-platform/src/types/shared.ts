// Shared types across ERIP platform

export type RiskLevel = 'minimal' | 'low' | 'limited' | 'medium' | 'high' | 'critical' | 'unacceptable';

export type ComplianceStatus = 
  | 'compliant' 
  | 'partial' 
  | 'non_compliant' 
  | 'not_assessed' 
  | 'in_progress'
  | 'needs_review';

export type ImplementationStatus = 
  | 'not_implemented' 
  | 'partial' 
  | 'implemented' 
  | 'fully_compliant';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

export type SystemStatus = 'development' | 'testing' | 'production' | 'deprecated' | 'maintenance';

export interface TrustEquityEvent {
  id: string;
  event_type: string;
  entity_id: string;
  points_earned: number;
  description: string;
  timestamp: string;
}

export interface BaseEntity {
  id: string;
  created_at: string;
  last_updated: string;
  trust_points?: number;
}

export interface Risk {
  category: string;
  description: string;
  likelihood: number; // 1-5 scale
  impact: number;     // 1-5 scale
  mitigation: string;
  residual_risk?: number;
}

export interface Evidence {
  id: string;
  name: string;
  type: 'document' | 'screenshot' | 'certificate' | 'assessment' | 'other';
  url?: string;
  upload_date: string;
  validity_period?: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
}

// Framework-specific interfaces
export interface FrameworkControl {
  id: string;
  framework: string;
  control_id: string;
  title: string;
  description: string;
  category: string;
  implementation_status: ImplementationStatus;
  evidence: Evidence[];
  responsible_party: Stakeholder;
  last_reviewed: string;
  next_review: string;
  trust_points: number;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  description: string;
  mandatory_controls: number;
  implemented_controls: number;
  compliance_percentage: number;
  last_assessment: string;
  certification_status?: 'certified' | 'in_progress' | 'expired' | 'not_certified';
}

// Trust Equity calculation interfaces
export interface TrustScoreBreakdown {
  total_score: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  component_scores: {
    compliance: number;
    risk_management: number;
    training_completion: number;
    automation_level: number;
    expert_validation: number;
  };
  industry_percentile: number;
  peer_comparison: number;
}

// Common utility types
export type DataCategory = 
  | 'Personal Data'
  | 'Sensitive Data' 
  | 'Financial Data'
  | 'Health Data'
  | 'Business Data'
  | 'Technical Data'
  | 'Behavioral Data';

export type BusinessImpact = 'low' | 'medium' | 'high' | 'critical';

export type Industry = 
  | 'Technology'
  | 'Healthcare'
  | 'Financial Services'
  | 'Manufacturing'
  | 'Retail'
  | 'Government'
  | 'Education'
  | 'Other';

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface DashboardData {
  trust_score: TrustScoreBreakdown;
  recent_activities: TrustEquityEvent[];
  compliance_summary: {
    frameworks: ComplianceFramework[];
    overall_compliance: number;
  };
  risk_summary: {
    total_risks: number;
    high_risks: number;
    overdue_assessments: number;
  };
  training_summary: {
    completion_rate: number;
    mandatory_completion: number;
    upcoming_deadlines: number;
  };
}