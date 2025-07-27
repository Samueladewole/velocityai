import React, { useState, useMemo } from 'react';
import { ComponentPageTemplate, StatCard, TabConfiguration } from '@/components/templates/ComponentPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrustPointsDisplay } from '@/components/shared/TrustPointsDisplay';
import { 
  GraduationCap, 
  Play, 
  CheckCircle, 
  Clock, 
  Trophy,
  Star,
  Users,
  Zap,
  Shield,
  Globe,
  Building2,
  Search,
  Filter,
  Download,
  Plus,
  Award,
  Target,
  Brain,
  BookOpen,
  Video,
  FileText,
  Gamepad2,
  TrendingUp,
  Calendar,
  Medal,
  Flame,
  Crown,
  Eye,
  Edit3,
  BarChart3,
  Activity,
  Cpu,
  Lock,
  FileCheck,
  Code,
  Network,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Settings
} from 'lucide-react';
import { RiskLevel, ImplementationStatus, SystemStatus, ApprovalStatus } from '@/types/shared';

// ===== ENHANCED TRAINING DATA MODELS =====

export type TrainingCategory = 'security' | 'privacy' | 'compliance' | 'ai-ethics' | 'technical' | 'leadership' | 'soft-skills';
export type TrainingDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type TrainingType = 'video' | 'interactive' | 'quiz' | 'simulation' | 'assessment' | 'workshop' | 'certification';
export type LearningPathStatus = 'not_started' | 'in_progress' | 'completed' | 'certified';
export type ComplianceRequirement = 'mandatory' | 'recommended' | 'optional';

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  difficulty: TrainingDifficulty;
  duration: number; // minutes
  type: TrainingType;
  completionRate: number;
  trustPoints: number;
  enrolledUsers: number;
  averageScore: number;
  rating: number;
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  certification: boolean;
  complianceRequirement: ComplianceRequirement;
  expirationPeriod?: number; // months
  version: string;
  author: string;
  lastUpdated: string;
  approvalStatus: ApprovalStatus;
  gamification: {
    badges: string[];
    streakBonus: number;
    leaderboardPoints: number;
    achievements: string[];
    competencyPoints: number;
  };
  accessibility: {
    subtitles: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    highContrast: boolean;
  };
  analytics: {
    engagementScore: number;
    dropOffPoints: number[];
    averageTimeSpent: number;
    feedbackScore: number;
  };
}

export interface UserProgress {
  userId: string;
  userName: string;
  avatar: string;
  level: number;
  totalPoints: number;
  completedModules: number;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  achievements: string[];
  rank: number;
  department: string;
  role: string;
  joinDate: string;
  lastActivity: string;
  learningPaths: {
    pathId: string;
    pathName: string;
    progress: number;
    status: LearningPathStatus;
    estimatedCompletion: string;
  }[];
  competencies: {
    skill: string;
    level: number;
    certified: boolean;
    lastAssessed: string;
    expiresAt?: string;
  }[];
  personalizedRecommendations: string[];
  mentorshipRole?: 'mentor' | 'mentee' | 'both';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  points: number;
  unlockedBy: number;
  totalUsers: number;
  requirements: string[];
  category: 'completion' | 'streak' | 'score' | 'leadership' | 'collaboration' | 'innovation';
  hidden: boolean;
  tier: number;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  category: TrainingCategory;
  difficulty: TrainingDifficulty;
  estimatedDuration: number; // hours
  modules: string[];
  prerequisiteSkills: string[];
  targetRoles: string[];
  certificationEligible: boolean;
  trustPointsTotal: number;
  enrolledUsers: number;
  completionRate: number;
  rating: number;
  badges: string[];
  businessImpact: {
    productivity: number;
    compliance: number;
    riskReduction: number;
    innovation: number;
  };
}

export interface ComplianceTraining {
  id: string;
  moduleId: string;
  framework: string;
  regulatoryRequirement: string;
  frequency: 'annual' | 'quarterly' | 'monthly';
  grace_period: number; // days
  autoEnrollment: boolean;
  exemptions: string[];
  penalties: {
    warningAfter: number; // days overdue
    escalationAfter: number;
    managerNotification: boolean;
  };
}

export interface SkillAssessment {
  id: string;
  skillName: string;
  category: TrainingCategory;
  questions: number;
  passingScore: number;
  timeLimit: number; // minutes
  attempts: number;
  retakePolicy: number; // days
  certificationPoints: number;
  industry_recognition: boolean;
  validityPeriod: number; // months
}

export interface TrainingAnalytics {
  overview: {
    totalModules: number;
    activeUsers: number;
    hoursCompleted: number;
    certificationIssued: number;
    complianceRate: number;
    engagementScore: number;
  };
  trends: {
    enrollment: { month: string; count: number }[];
    completion: { month: string; rate: number }[];
    satisfaction: { month: string; score: number }[];
  };
  departmentPerformance: {
    department: string;
    completion: number;
    satisfaction: number;
    timeToComplete: number;
    complianceRate: number;
  }[];
  skillGaps: {
    skill: string;
    currentLevel: number;
    targetLevel: number;
    gap: number;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export const EmployeeTrainingNew: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'popularity' | 'recent' | 'difficulty'>('rating');

  // ===== ENHANCED SAMPLE DATA =====

  const trainingModules: TrainingModule[] = [
    {
      id: 'mod-001',
      title: 'Cybersecurity Fundamentals',
      description: 'Essential cybersecurity concepts and best practices for all employees',
      category: 'security',
      difficulty: 'beginner',
      duration: 45,
      type: 'interactive',
      completionRate: 87,
      trustPoints: 100,
      enrolledUsers: 245,
      averageScore: 88,
      rating: 4.6,
      tags: ['security', 'fundamentals', 'mandatory'],
      prerequisites: [],
      learningOutcomes: ['Identify common security threats', 'Apply password best practices', 'Recognize phishing attempts'],
      certification: true,
      complianceRequirement: 'mandatory',
      expirationPeriod: 12,
      version: '3.2',
      author: 'Sarah Chen',
      lastUpdated: '2024-01-15',
      approvalStatus: 'approved',
      gamification: {
        badges: ['Security Rookie', 'Phishing Detector'],
        streakBonus: 10,
        leaderboardPoints: 150,
        achievements: ['First Steps', 'Threat Awareness'],
        competencyPoints: 25
      },
      accessibility: {
        subtitles: true,
        screenReader: true,
        keyboardNavigation: true,
        highContrast: true
      },
      analytics: {
        engagementScore: 94,
        dropOffPoints: [15, 30],
        averageTimeSpent: 52,
        feedbackScore: 4.6
      }
    },
    {
      id: 'mod-002',
      title: 'GDPR Privacy Essentials',
      description: 'Data protection and privacy regulations compliance training',
      category: 'privacy',
      difficulty: 'intermediate',
      duration: 60,
      type: 'video',
      completionRate: 72,
      trustPoints: 150,
      enrolledUsers: 198,
      averageScore: 85,
      rating: 4.4,
      tags: ['privacy', 'gdpr', 'compliance'],
      prerequisites: ['mod-001'],
      learningOutcomes: ['Understand GDPR principles', 'Handle data subject requests', 'Implement privacy by design'],
      certification: true,
      complianceRequirement: 'mandatory',
      expirationPeriod: 24,
      version: '2.1',
      author: 'Mike Johnson',
      lastUpdated: '2024-02-01',
      approvalStatus: 'approved',
      gamification: {
        badges: ['Privacy Guardian', 'GDPR Expert'],
        streakBonus: 15,
        leaderboardPoints: 200,
        achievements: ['Data Protector', 'Compliance Champion'],
        competencyPoints: 35
      },
      accessibility: {
        subtitles: true,
        screenReader: true,
        keyboardNavigation: true,
        highContrast: false
      },
      analytics: {
        engagementScore: 89,
        dropOffPoints: [25, 45],
        averageTimeSpent: 68,
        feedbackScore: 4.4
      }
    },
    {
      id: 'mod-003',
      title: 'Advanced Threat Detection',
      description: 'Advanced cybersecurity techniques for security professionals',
      category: 'security',
      difficulty: 'advanced',
      duration: 90,
      type: 'simulation',
      completionRate: 45,
      trustPoints: 250,
      enrolledUsers: 67,
      averageScore: 92,
      rating: 4.8,
      tags: ['security', 'advanced', 'threat-detection'],
      prerequisites: ['mod-001', 'mod-004'],
      learningOutcomes: ['Analyze threat patterns', 'Use advanced security tools', 'Respond to incidents'],
      certification: true,
      complianceRequirement: 'recommended',
      version: '1.5',
      author: 'Alex Rivera',
      lastUpdated: '2024-01-28',
      approvalStatus: 'approved',
      gamification: {
        badges: ['Threat Hunter', 'Security Expert', 'Elite Defender'],
        streakBonus: 25,
        leaderboardPoints: 350,
        achievements: ['Master Defender', 'Threat Neutralizer'],
        competencyPoints: 50
      },
      accessibility: {
        subtitles: true,
        screenReader: false,
        keyboardNavigation: true,
        highContrast: true
      },
      analytics: {
        engagementScore: 96,
        dropOffPoints: [35, 60],
        averageTimeSpent: 105,
        feedbackScore: 4.8
      }
    },
    {
      id: 'mod-004',
      title: 'AI Ethics & Governance',
      description: 'Responsible AI development and ethical considerations',
      category: 'ai-ethics',
      difficulty: 'intermediate',
      duration: 55,
      type: 'interactive',
      completionRate: 68,
      trustPoints: 180,
      enrolledUsers: 134,
      averageScore: 89,
      rating: 4.5,
      tags: ['ai', 'ethics', 'governance'],
      prerequisites: [],
      learningOutcomes: ['Understand AI bias', 'Apply ethical frameworks', 'Implement responsible AI'],
      certification: true,
      complianceRequirement: 'recommended',
      version: '2.0',
      author: 'Dr. Lisa Wang',
      lastUpdated: '2024-02-10',
      approvalStatus: 'approved',
      gamification: {
        badges: ['AI Ethics Advocate', 'Responsible Developer'],
        streakBonus: 20,
        leaderboardPoints: 250,
        achievements: ['Ethical Pioneer', 'AI Guardian'],
        competencyPoints: 40
      },
      accessibility: {
        subtitles: true,
        screenReader: true,
        keyboardNavigation: true,
        highContrast: true
      },
      analytics: {
        engagementScore: 91,
        dropOffPoints: [20, 40],
        averageTimeSpent: 62,
        feedbackScore: 4.5
      }
    },
    {
      id: 'mod-005',
      title: 'Leadership in Digital Transformation',
      description: 'Strategic leadership skills for managing digital change initiatives',
      category: 'leadership',
      difficulty: 'advanced',
      duration: 75,
      type: 'workshop',
      completionRate: 54,
      trustPoints: 220,
      enrolledUsers: 89,
      averageScore: 91,
      rating: 4.7,
      tags: ['leadership', 'digital-transformation', 'strategy'],
      prerequisites: ['mod-006'],
      learningOutcomes: ['Lead digital initiatives', 'Manage change resistance', 'Drive innovation culture'],
      certification: true,
      complianceRequirement: 'optional',
      version: '1.0',
      author: 'Maria Rodriguez',
      lastUpdated: '2024-02-05',
      approvalStatus: 'approved',
      gamification: {
        badges: ['Digital Leader', 'Change Champion', 'Innovation Driver'],
        streakBonus: 22,
        leaderboardPoints: 300,
        achievements: ['Transformation Leader', 'Culture Architect'],
        competencyPoints: 45
      },
      accessibility: {
        subtitles: true,
        screenReader: true,
        keyboardNavigation: true,
        highContrast: false
      },
      analytics: {
        engagementScore: 93,
        dropOffPoints: [30, 55],
        averageTimeSpent: 82,
        feedbackScore: 4.7
      }
    },
    {
      id: 'mod-006',
      title: 'Effective Communication & Collaboration',
      description: 'Essential soft skills for modern workplace collaboration',
      category: 'soft-skills',
      difficulty: 'beginner',
      duration: 40,
      type: 'video',
      completionRate: 78,
      trustPoints: 80,
      enrolledUsers: 312,
      averageScore: 84,
      rating: 4.3,
      tags: ['communication', 'collaboration', 'soft-skills'],
      prerequisites: [],
      learningOutcomes: ['Communicate effectively', 'Collaborate remotely', 'Manage conflicts'],
      certification: false,
      complianceRequirement: 'recommended',
      version: '1.8',
      author: 'John Carter',
      lastUpdated: '2024-01-20',
      approvalStatus: 'approved',
      gamification: {
        badges: ['Team Player', 'Communication Pro'],
        streakBonus: 8,
        leaderboardPoints: 120,
        achievements: ['Collaborator', 'Communicator'],
        competencyPoints: 20
      },
      accessibility: {
        subtitles: true,
        screenReader: true,
        keyboardNavigation: true,
        highContrast: true
      },
      analytics: {
        engagementScore: 87,
        dropOffPoints: [18, 32],
        averageTimeSpent: 44,
        feedbackScore: 4.3
      }
    }
  ];

  const topLearners: UserProgress[] = [
    {
      userId: 'usr-001',
      userName: 'Sarah Chen',
      avatar: '👩‍💼',
      level: 15,
      totalPoints: 2450,
      completedModules: 12,
      currentStreak: 23,
      longestStreak: 45,
      badges: ['Security Expert', 'Privacy Guardian', 'Threat Hunter', 'AI Ethics Advocate'],
      achievements: ['First Steps', 'Threat Awareness', 'Data Protector', 'Master Defender'],
      rank: 1,
      department: 'Security',
      role: 'Security Architect',
      joinDate: '2023-08-15',
      lastActivity: '2024-02-20',
      learningPaths: [
        {
          pathId: 'path-001',
          pathName: 'Cybersecurity Mastery',
          progress: 95,
          status: 'completed',
          estimatedCompletion: '2024-01-15'
        },
        {
          pathId: 'path-002',
          pathName: 'AI Security Specialist',
          progress: 75,
          status: 'in_progress',
          estimatedCompletion: '2024-03-15'
        }
      ],
      competencies: [
        { skill: 'Threat Detection', level: 9, certified: true, lastAssessed: '2024-01-20', expiresAt: '2025-01-20' },
        { skill: 'Incident Response', level: 8, certified: true, lastAssessed: '2024-02-01' },
        { skill: 'Privacy Compliance', level: 7, certified: false, lastAssessed: '2024-01-15' }
      ],
      personalizedRecommendations: ['mod-005', 'mod-007'],
      mentorshipRole: 'mentor'
    },
    {
      userId: 'usr-002',
      userName: 'Mike Johnson',
      avatar: '👨‍💻',
      level: 12,
      totalPoints: 1980,
      completedModules: 9,
      currentStreak: 18,
      longestStreak: 32,
      badges: ['Security Rookie', 'GDPR Expert', 'Compliance Expert'],
      achievements: ['First Steps', 'Data Protector', 'Compliance Champion'],
      rank: 2,
      department: 'IT',
      role: 'Systems Administrator',
      joinDate: '2023-09-01',
      lastActivity: '2024-02-19',
      learningPaths: [
        {
          pathId: 'path-003',
          pathName: 'IT Security Fundamentals',
          progress: 85,
          status: 'in_progress',
          estimatedCompletion: '2024-03-01'
        }
      ],
      competencies: [
        { skill: 'System Security', level: 7, certified: true, lastAssessed: '2024-01-25' },
        { skill: 'Data Protection', level: 8, certified: true, lastAssessed: '2024-02-05', expiresAt: '2026-02-05' }
      ],
      personalizedRecommendations: ['mod-003', 'mod-004'],
      mentorshipRole: 'mentee'
    },
    {
      userId: 'usr-003',
      userName: 'Lisa Wang',
      avatar: '👩‍🔬',
      level: 11,
      totalPoints: 1750,
      completedModules: 8,
      currentStreak: 15,
      longestStreak: 28,
      badges: ['Privacy Guardian', 'AI Ethics Advocate', 'Responsible Developer'],
      achievements: ['Ethical Pioneer', 'AI Guardian', 'Data Protector'],
      rank: 3,
      department: 'Data Science',
      role: 'Senior Data Scientist',
      joinDate: '2023-07-20',
      lastActivity: '2024-02-18',
      learningPaths: [
        {
          pathId: 'path-004',
          pathName: 'Responsible AI Development',
          progress: 90,
          status: 'completed',
          estimatedCompletion: '2024-01-30'
        }
      ],
      competencies: [
        { skill: 'AI Ethics', level: 9, certified: true, lastAssessed: '2024-02-10', expiresAt: '2026-02-10' },
        { skill: 'Data Science', level: 8, certified: true, lastAssessed: '2024-01-10' }
      ],
      personalizedRecommendations: ['mod-005', 'mod-008'],
      mentorshipRole: 'both'
    },
    {
      userId: 'usr-004',
      userName: 'Tom Rodriguez',
      avatar: '👨‍⚖️',
      level: 10,
      totalPoints: 1620,
      completedModules: 7,
      currentStreak: 12,
      longestStreak: 25,
      badges: ['Compliance Expert', 'ISO Champion'],
      achievements: ['Compliance Champion', 'First Steps'],
      rank: 4,
      department: 'Legal',
      role: 'Compliance Officer',
      joinDate: '2023-10-05',
      lastActivity: '2024-02-17',
      learningPaths: [
        {
          pathId: 'path-005',
          pathName: 'Regulatory Compliance',
          progress: 70,
          status: 'in_progress',
          estimatedCompletion: '2024-04-01'
        }
      ],
      competencies: [
        { skill: 'Regulatory Knowledge', level: 8, certified: true, lastAssessed: '2024-01-30' },
        { skill: 'Risk Assessment', level: 6, certified: false, lastAssessed: '2024-01-05' }
      ],
      personalizedRecommendations: ['mod-002', 'mod-009'],
      mentorshipRole: 'mentor'
    },
    {
      userId: 'usr-005',
      userName: 'Emma Wilson',
      avatar: '👩‍🎓',
      level: 9,
      totalPoints: 1450,
      completedModules: 6,
      currentStreak: 9,
      longestStreak: 22,
      badges: ['Security Rookie', 'Phishing Detector', 'Team Player'],
      achievements: ['First Steps', 'Collaborator', 'Communicator'],
      rank: 5,
      department: 'HR',
      role: 'HR Business Partner',
      joinDate: '2023-11-12',
      lastActivity: '2024-02-16',
      learningPaths: [
        {
          pathId: 'path-006',
          pathName: 'HR Digital Skills',
          progress: 60,
          status: 'in_progress',
          estimatedCompletion: '2024-04-15'
        }
      ],
      competencies: [
        { skill: 'Digital Communication', level: 7, certified: true, lastAssessed: '2024-02-01' },
        { skill: 'Security Awareness', level: 5, certified: false, lastAssessed: '2024-01-20' }
      ],
      personalizedRecommendations: ['mod-001', 'mod-006'],
      mentorshipRole: 'mentee'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 'ach-001',
      name: 'Security Rookie',
      description: 'Complete your first security training module',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      rarity: 'common',
      points: 50,
      unlockedBy: 234,
      totalUsers: 265,
      requirements: ['Complete any security module'],
      category: 'completion',
      hidden: false,
      tier: 1
    },
    {
      id: 'ach-002',
      name: 'Privacy Guardian',
      description: 'Master all privacy and data protection modules',
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      rarity: 'rare',
      points: 200,
      unlockedBy: 89,
      totalUsers: 265,
      requirements: ['Complete all privacy modules', 'Score 90%+ on assessments'],
      category: 'completion',
      hidden: false,
      tier: 2
    },
    {
      id: 'ach-003',
      name: 'Threat Hunter',
      description: 'Complete advanced threat detection with 95%+ score',
      icon: Target,
      color: 'from-red-500 to-red-600',
      rarity: 'epic',
      points: 350,
      unlockedBy: 23,
      totalUsers: 265,
      requirements: ['Complete Advanced Threat Detection', 'Score 95%+', 'Complete in single session'],
      category: 'score',
      hidden: false,
      tier: 3
    },
    {
      id: 'ach-004',
      name: 'Response Legend',
      description: 'Excel in incident response simulations',
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      rarity: 'legendary',
      points: 500,
      unlockedBy: 8,
      totalUsers: 265,
      requirements: ['Complete incident response training', 'Lead 3 simulations', 'Score 98%+'],
      category: 'leadership',
      hidden: false,
      tier: 4
    },
    {
      id: 'ach-005',
      name: 'Streak Master',
      description: 'Maintain a 30-day learning streak',
      icon: Flame,
      color: 'from-orange-500 to-orange-600',
      rarity: 'rare',
      points: 250,
      unlockedBy: 45,
      totalUsers: 265,
      requirements: ['Complete training for 30 consecutive days'],
      category: 'streak',
      hidden: false,
      tier: 2
    },
    {
      id: 'ach-006',
      name: 'Knowledge Sharer',
      description: 'Help 10 colleagues complete their training',
      icon: Users,
      color: 'from-teal-500 to-teal-600',
      rarity: 'epic',
      points: 300,
      unlockedBy: 17,
      totalUsers: 265,
      requirements: ['Mentor 10 colleagues', 'Achieve 90%+ mentee success rate'],
      category: 'collaboration',
      hidden: false,
      tier: 3
    },
    {
      id: 'ach-007',
      name: 'Innovation Pioneer',
      description: 'Complete cutting-edge AI and emerging technology modules',
      icon: Brain,
      color: 'from-violet-500 to-violet-600',
      rarity: 'mythic',
      points: 750,
      unlockedBy: 3,
      totalUsers: 265,
      requirements: ['Complete 5 AI modules', 'Score 95%+', 'Submit innovation proposal'],
      category: 'innovation',
      hidden: true,
      tier: 5
    }
  ];

  // ===== CALCULATIONS AND DERIVED DATA =====

  const totalModules = trainingModules.length;
  const averageCompletion = Math.round(
    trainingModules.reduce((sum, module) => sum + module.completionRate, 0) / totalModules
  );
  const totalEnrolled = trainingModules.reduce((sum, module) => sum + module.enrolledUsers, 0);
  const totalTrustPoints = trainingModules.reduce((sum, module) => sum + module.trustPoints, 0);
  const totalHoursCompleted = Math.round(
    trainingModules.reduce((sum, module) => 
      sum + (module.duration * module.enrolledUsers * module.completionRate / 100), 0
    ) / 60
  );

  const filteredModules = useMemo(() => {
    return trainingModules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'popularity': return b.enrolledUsers - a.enrolledUsers;
        case 'recent': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'difficulty': 
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default: return 0;
      }
    });
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy, trainingModules]);

  // ===== UTILITY FUNCTIONS =====

  const getDifficultyColor = (difficulty: TrainingDifficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      case 'expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTypeIcon = (type: TrainingType) => {
    switch (type) {
      case 'video': return Video;
      case 'interactive': return Gamepad2;
      case 'quiz': return FileText;
      case 'simulation': return Target;
      case 'assessment': return CheckCircle;
      case 'workshop': return Users;
      case 'certification': return Award;
      default: return BookOpen;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-slate-500 to-slate-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-yellow-600';
      case 'mythic': return 'from-pink-500 to-pink-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getCategoryIcon = (category: TrainingCategory) => {
    switch (category) {
      case 'security': return Shield;
      case 'privacy': return Lock;
      case 'compliance': return FileCheck;
      case 'ai-ethics': return Brain;
      case 'technical': return Code;
      case 'leadership': return Crown;
      case 'soft-skills': return Users;
      default: return BookOpen;
    }
  };

  // ===== COMPONENTPAGETEMPLATE CONFIGURATION =====

  const quickStats: StatCard[] = [
    {
      label: 'Training Modules',
      value: totalModules.toString(),
      change: '+3 this month',
      trend: 'up',
      icon: <GraduationCap className="h-6 w-6 text-blue-600" />,
      description: 'Active learning modules',
      color: 'text-blue-600'
    },
    {
      label: 'Completion Rate',
      value: `${averageCompletion}%`,
      change: '+5% vs last month',
      trend: 'up',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      description: 'Average module completion',
      color: 'text-green-600'
    },
    {
      label: 'Active Learners',
      value: totalEnrolled.toLocaleString(),
      change: '+18 this week',
      trend: 'up',
      icon: <Users className="h-6 w-6 text-purple-600" />,
      description: 'Enrolled participants',
      color: 'text-purple-600'
    },
    {
      label: 'Trust Points Earned',
      value: totalTrustPoints.toLocaleString(),
      change: '+1,250 this month',
      trend: 'up',
      icon: <Award className="h-6 w-6 text-orange-600" />,
      description: 'Total trust equity generated',
      color: 'text-orange-600'
    },
    {
      label: 'Learning Hours',
      value: `${totalHoursCompleted.toLocaleString()}h`,
      change: '+15% vs last month',
      trend: 'up',
      icon: <Clock className="h-6 w-6 text-teal-600" />,
      description: 'Total hours completed',
      color: 'text-teal-600'
    },
    {
      label: 'Certifications Issued',
      value: '284',
      change: '+42 this month',
      trend: 'up',
      icon: <Medal className="h-6 w-6 text-indigo-600" />,
      description: 'Professional certifications',
      color: 'text-indigo-600'
    }
  ];

  // ===== TAB CONFIGURATIONS =====

  const trainingModulesTab = (
    <div className="space-y-6">
      {/* Enhanced Search and Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search modules, descriptions, skills, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
              >
                <option value="all">All Categories</option>
                <option value="security">Security</option>
                <option value="privacy">Privacy</option>
                <option value="compliance">Compliance</option>
                <option value="ai-ethics">AI Ethics</option>
                <option value="technical">Technical</option>
                <option value="leadership">Leadership</option>
                <option value="soft-skills">Soft Skills</option>
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
              >
                <option value="rating">Rating</option>
                <option value="popularity">Popularity</option>
                <option value="recent">Recent</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {filteredModules.length} of {totalModules} modules
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const TypeIcon = getTypeIcon(module.type);
          const CategoryIcon = getCategoryIcon(module.category);
          return (
            <Card 
              key={module.id}
              className="card-professional border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
            >
              {/* Module Header */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              
              {/* Certification Badge */}
              {module.certification && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
                    <Award className="h-3 w-3 mr-1" />
                    Certified
                  </Badge>
                </div>
              )}

              {/* Compliance Requirement */}
              {module.complianceRequirement === 'mandatory' && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Required
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4 pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                      <TypeIcon className="h-7 w-7 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Badge className={getDifficultyColor(module.difficulty)} variant="outline">
                        {module.difficulty}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-3 w-3 text-slate-500" />
                        <span className="text-xs text-slate-500 capitalize">{module.category.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {module.title}
                </CardTitle>
                <p className="text-sm text-slate-600 line-clamp-2">{module.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Module Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-slate-500 text-xs">Duration</span>
                    <div className="font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-500" />
                      {module.duration} min
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-xs">Enrolled</span>
                    <div className="font-semibold flex items-center gap-1">
                      <Users className="h-3 w-3 text-purple-500" />
                      {module.enrolledUsers}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-xs">Avg Score</span>
                    <div className="font-semibold flex items-center gap-1">
                      <Target className="h-3 w-3 text-green-500" />
                      {module.averageScore}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-xs">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="font-semibold">{module.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Completion Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Completion Rate</span>
                    <span className="font-semibold">{module.completionRate}%</span>
                  </div>
                  <Progress value={module.completionRate} className="h-2" />
                </div>

                {/* Learning Outcomes Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-700">Learning Outcomes:</span>
                  <div className="text-xs text-slate-600">
                    {module.learningOutcomes.slice(0, 2).map((outcome, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                    {module.learningOutcomes.length > 2 && (
                      <div className="text-xs text-slate-500 mt-1">
                        +{module.learningOutcomes.length - 2} more outcomes
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {module.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                      {tag}
                    </Badge>
                  ))}
                  {module.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs px-2 py-1">
                      +{module.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Gamification Elements */}
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-semibold text-slate-700">Rewards</span>
                    </div>
                    <TrustPointsDisplay points={module.trustPoints} size="sm" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Streak Bonus:</span>
                      <span className="font-semibold text-orange-600">+{module.gamification.streakBonus}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Leaderboard Points:</span>
                      <span className="font-semibold text-blue-600">{module.gamification.leaderboardPoints}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {module.gamification.badges.slice(0, 2).map((badge) => (
                      <Badge key={badge} className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                        <Medal className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                    {module.gamification.badges.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{module.gamification.badges.length - 2} badges
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Prerequisites */}
                {module.prerequisites.length > 0 && (
                  <div className="text-xs">
                    <span className="text-slate-600">Prerequisites:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {module.prerequisites.map((prereq) => (
                        <Badge key={prereq} variant="outline" className="text-xs">
                          {trainingModules.find(m => m.id === prereq)?.title || prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More Button */}
      {filteredModules.length < totalModules && (
        <div className="flex justify-center pt-6">
          <Button variant="outline" className="px-8">
            <RefreshCw className="h-4 w-4 mr-2" />
            Load More Modules
          </Button>
        </div>
      )}
    </div>
  );

  const leaderboardTab = (
    <div className="space-y-6">
      {/* Leaderboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Learning Champions</h3>
          <p className="text-slate-600 mt-1">Top performers in our learning community</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
            <TrendingUp className="h-3 w-3 mr-1" />
            Weekly Rankings
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Rankings
          </Button>
        </div>
      </div>

      {/* Podium Display */}
      <Card className="border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-8">
          <div className="flex justify-center items-end gap-8">
            {topLearners.slice(0, 3).map((learner, index) => {
              const podiumHeights = ['h-32', 'h-40', 'h-28'];
              const positions = [2, 1, 3];
              const actualIndex = positions.indexOf(index + 1);
              return (
                <div key={learner.userId} className="flex flex-col items-center">
                  <div className="mb-4 text-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                        {learner.avatar}
                      </div>
                      <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                        'bg-gradient-to-r from-orange-500 to-orange-600'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                    </div>
                    <h4 className="font-bold text-lg mt-2">{learner.userName}</h4>
                    <p className="text-sm text-slate-600">{learner.department}</p>
                    <div className="text-xl font-bold text-blue-600 mt-1">
                      {learner.totalPoints.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500">Trust Points</p>
                  </div>
                  <div className={`${podiumHeights[actualIndex]} w-24 bg-gradient-to-t from-blue-200 to-blue-300 rounded-t-lg flex items-end justify-center pb-2`}>
                    <span className="text-2xl font-bold text-blue-800">#{index + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Leaderboard */}
      <div className="space-y-4">
        {topLearners.map((learner, index) => (
          <Card key={learner.userId} className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-2xl">
                      {learner.avatar}
                    </div>
                    <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                      'bg-slate-500'
                    }`}>
                      #{learner.rank}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-xl text-slate-900">{learner.userName}</h4>
                      <Badge variant="outline" className="border-slate-300">
                        {learner.department}
                      </Badge>
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        Level {learner.level}
                      </Badge>
                      {learner.mentorshipRole && (
                        <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200">
                          {learner.mentorshipRole === 'mentor' ? '👨‍🏫 Mentor' : 
                           learner.mentorshipRole === 'mentee' ? '👨‍🎓 Mentee' : '🤝 Both'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {learner.completedModules} modules completed
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        {learner.currentStreak} day streak
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Joined {new Date(learner.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Learning Path Progress */}
                    {learner.learningPaths.length > 0 && (
                      <div className="mt-3">
                        <span className="text-xs font-medium text-slate-700">Active Learning Paths:</span>
                        <div className="flex gap-2 mt-1">
                          {learner.learningPaths.slice(0, 2).map((path) => (
                            <div key={path.pathId} className="text-xs bg-slate-100 px-2 py-1 rounded">
                              {path.pathName}: {path.progress}%
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {learner.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500">Trust Points</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {learner.badges.slice(0, 3).map((badge) => (
                      <Badge key={badge} className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                        <Award className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                    {learner.badges.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{learner.badges.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leaderboard Actions */}
      <div className="flex justify-center gap-4 pt-6">
        <Button variant="outline">
          <Users className="h-4 w-4 mr-2" />
          View All Learners
        </Button>
        <Button variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          Department Rankings
        </Button>
        <Button variant="outline">
          <Trophy className="h-4 w-4 mr-2" />
          Competition History
        </Button>
      </div>
    </div>
  );

  const achievementsTab = (
    <div className="space-y-6">
      {/* Achievement Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Achievement Gallery</h3>
          <p className="text-slate-600 mt-1">Unlock badges and earn recognition for your learning journey</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200">
            <Trophy className="h-3 w-3 mr-1" />
            {achievements.length} Total Achievements
          </Badge>
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-2" />
            My Progress
          </Button>
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {['completion', 'streak', 'score', 'leadership', 'collaboration', 'innovation'].map((category) => {
          const categoryAchievements = achievements.filter(a => a.category === category);
          const unlockedCount = categoryAchievements.filter(a => a.unlockedBy > 0).length;
          return (
            <Card key={category} className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
                  {category === 'completion' && <CheckCircle className="h-6 w-6 text-green-600" />}
                  {category === 'streak' && <Flame className="h-6 w-6 text-orange-600" />}
                  {category === 'score' && <Target className="h-6 w-6 text-blue-600" />}
                  {category === 'leadership' && <Crown className="h-6 w-6 text-purple-600" />}
                  {category === 'collaboration' && <Users className="h-6 w-6 text-teal-600" />}
                  {category === 'innovation' && <Brain className="h-6 w-6 text-violet-600" />}
                </div>
                <h4 className="font-semibold text-sm capitalize">{category.replace('-', ' ')}</h4>
                <p className="text-xs text-slate-600 mt-1">
                  {unlockedCount}/{categoryAchievements.length}
                </p>
                <Progress value={(unlockedCount / categoryAchievements.length) * 100} className="h-1 mt-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const IconComponent = achievement.icon;
          const unlockRate = Math.round((achievement.unlockedBy / achievement.totalUsers) * 100);
          const isUnlocked = achievement.unlockedBy > 0;
          
          return (
            <Card 
              key={achievement.id} 
              className={cn(
                "border-slate-200 overflow-hidden transition-all duration-300 hover:scale-105",
                isUnlocked ? "hover:shadow-xl" : "opacity-75"
              )}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300",
                    isUnlocked 
                      ? `bg-gradient-to-r ${achievement.color} shadow-lg` 
                      : "bg-gradient-to-r from-slate-300 to-slate-400"
                  )}>
                    <IconComponent className={cn(
                      "h-8 w-8",
                      isUnlocked ? "text-white" : "text-slate-500"
                    )} />
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={cn(
                      "text-white border-0",
                      isUnlocked 
                        ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}`
                        : "bg-gradient-to-r from-slate-400 to-slate-500"
                    )}>
                      {achievement.rarity}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-sm font-semibold">{achievement.points}</span>
                    </div>
                  </div>
                </div>
                <CardTitle className={cn(
                  "text-lg",
                  isUnlocked ? "text-slate-900" : "text-slate-500"
                )}>
                  {achievement.name}
                </CardTitle>
                <p className={cn(
                  "text-sm",
                  isUnlocked ? "text-slate-600" : "text-slate-400"
                )}>
                  {achievement.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Unlock Rate</span>
                    <span className="font-medium">{unlockRate}%</span>
                  </div>
                  <Progress value={unlockRate} className="h-2" />
                </div>
                
                {/* Requirements */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-700">Requirements:</span>
                  <div className="space-y-1">
                    {achievement.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Statistics */}
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Unlocked by:</span>
                    <span className="font-semibold">
                      {achievement.unlockedBy} / {achievement.totalUsers} users
                    </span>
                  </div>
                  {achievement.hidden && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-purple-600">
                      <Eye className="h-3 w-3" />
                      Hidden Achievement
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {!isUnlocked && (
                  <Button variant="outline" className="w-full" disabled={achievement.hidden}>
                    <Target className="h-4 w-4 mr-2" />
                    {achievement.hidden ? 'Hidden Achievement' : 'View Progress'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Achievement Stats */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Achievement Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {achievements.reduce((sum, a) => sum + a.unlockedBy, 0)}
              </div>
              <div className="text-sm text-slate-600">Total Unlocks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {achievements.filter(a => a.rarity === 'legendary' || a.rarity === 'mythic').length}
              </div>
              <div className="text-sm text-slate-600">Rare Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(achievements.reduce((sum, a) => sum + (a.unlockedBy / a.totalUsers), 0) / achievements.length * 100)}%
              </div>
              <div className="text-sm text-slate-600">Avg Unlock Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {achievements.reduce((sum, a) => sum + a.points, 0)}
              </div>
              <div className="text-sm text-slate-600">Total Points Available</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const analyticsTab = (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Progress Trends */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Training Progress Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingModules.slice(0, 6).map((module) => (
                <div key={module.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{module.title}</div>
                      <div className="text-xs text-slate-600">{module.enrolledUsers} enrolled</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={module.completionRate} 
                      className="w-24 h-2" 
                    />
                    <span className="text-sm font-medium w-12 text-right">
                      {module.completionRate}%
                    </span>
                    <Badge 
                      variant={module.completionRate >= 80 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {module.completionRate >= 80 ? "Good" : "Needs Focus"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Security', 'IT', 'Data Science', 'Legal', 'HR', 'Marketing'].map((department, index) => {
                const performance = [92, 87, 84, 78, 75, 71][index];
                const learners = [45, 38, 22, 15, 28, 19][index];
                return (
                  <div key={department} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{department}</div>
                        <div className="text-xs text-slate-600">{learners} active learners</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress 
                        value={performance} 
                        className="w-24 h-2" 
                      />
                      <span className="text-sm font-medium w-12 text-right">
                        {performance}%
                      </span>
                      <div className="flex items-center gap-1">
                        {performance >= 85 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingUp className="h-3 w-3 text-yellow-500 transform rotate-90" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Metrics */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Daily Active Users</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Avg Session Time</span>
                <span className="font-semibold">24 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Weekly Retention</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Course Satisfaction</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="font-semibold">4.6</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">GDPR Training</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">94% Complete</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Security Awareness</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">98% Complete</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Code of Conduct</span>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">87% Complete</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Safety Training</span>
                <Badge className="bg-red-100 text-red-800 border-red-200">72% Complete</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Development */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Skill Development
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { skill: 'Cybersecurity', level: 85, trend: 'up' },
                { skill: 'Data Privacy', level: 78, trend: 'up' },
                { skill: 'AI Ethics', level: 71, trend: 'neutral' },
                { skill: 'Leadership', level: 64, trend: 'down' }
              ].map((item) => (
                <div key={item.skill} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{item.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{item.level}%</span>
                      {item.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                      {item.trend === 'down' && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
                    </div>
                  </div>
                  <Progress value={item.level} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Learning Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2,847</div>
              <div className="text-sm text-blue-700">Total Learning Hours</div>
              <div className="text-xs text-blue-600 mt-1">+15% this month</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-green-700">Knowledge Retention</div>
              <div className="text-xs text-green-600 mt-1">Above industry avg</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">284</div>
              <div className="text-sm text-purple-700">Certifications Earned</div>
              <div className="text-xs text-purple-600 mt-1">42 this month</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">4.7</div>
              <div className="text-sm text-orange-700">Learning Experience</div>
              <div className="text-xs text-orange-600 mt-1">Excellent rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs: TabConfiguration[] = [
    {
      id: 'modules',
      label: 'Training Modules',
      content: trainingModulesTab,
      badge: filteredModules.length.toString()
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      content: leaderboardTab,
      badge: topLearners.length.toString()
    },
    {
      id: 'achievements',
      label: 'Achievements',
      content: achievementsTab,
      badge: achievements.length.toString()
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: analyticsTab
    }
  ];

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
        <Settings className="h-4 w-4 mr-2" />
        Learning Preferences
      </Button>
      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
        <Plus className="h-4 w-4 mr-2" />
        Create Module
      </Button>
    </div>
  );

  // ===== MARK COMPLETION =====
  const [currentTask, setCurrentTask] = useState<string>('training-migration-2');

  return (
    <ComponentPageTemplate
      title="Employee Training Platform"
      subtitle="Gamified Learning & Development Hub"
      description="Advanced training management with Trust Equity rewards, comprehensive analytics, and engaging gamification features to drive continuous learning and professional development."
      trustScore={94}
      trustPoints={totalTrustPoints}
      quickStats={quickStats}
      tabs={tabs}
      actions={headerActions}
      headerGradient="from-blue-50 via-purple-50 to-indigo-50"
      className="training-platform"
    />
  );
};

export default EmployeeTrainingNew;