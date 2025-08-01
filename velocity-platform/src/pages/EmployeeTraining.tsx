import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TrustPointsDisplay } from '@/components/shared/TrustPointsDisplay';
import { StatCard } from '@/components/shared/StatCard';
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
  ChevronRight
} from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'security' | 'privacy' | 'compliance' | 'ai-ethics' | 'technical';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  type: 'video' | 'interactive' | 'quiz' | 'simulation' | 'assessment';
  completionRate: number;
  trustPoints: number;
  enrolledUsers: number;
  averageScore: number;
  rating: number;
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  certification: boolean;
  gamification: {
    badges: string[];
    streakBonus: number;
    leaderboardPoints: number;
  };
}

interface UserProgress {
  userId: string;
  userName: string;
  avatar: string;
  level: number;
  totalPoints: number;
  completedModules: number;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  rank: number;
  department: string;
  joinDate: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedBy: number;
  totalUsers: number;
}

export const EmployeeTraining: React.FC = () => {
  const [activeTab, setActiveTab] = useState('modules');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

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
      gamification: {
        badges: ['Security Rookie', 'Phishing Detector'],
        streakBonus: 10,
        leaderboardPoints: 150
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
      gamification: {
        badges: ['Privacy Guardian', 'GDPR Expert'],
        streakBonus: 15,
        leaderboardPoints: 200
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
      gamification: {
        badges: ['Threat Hunter', 'Security Expert', 'Elite Defender'],
        streakBonus: 25,
        leaderboardPoints: 350
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
      gamification: {
        badges: ['AI Ethics Advocate', 'Responsible Developer'],
        streakBonus: 20,
        leaderboardPoints: 250
      }
    },
    {
      id: 'mod-005',
      title: 'Incident Response Simulation',
      description: 'Real-world incident response training with interactive scenarios',
      category: 'security',
      difficulty: 'advanced',
      duration: 120,
      type: 'simulation',
      completionRate: 38,
      trustPoints: 300,
      enrolledUsers: 45,
      averageScore: 94,
      rating: 4.9,
      tags: ['incident-response', 'simulation', 'advanced'],
      prerequisites: ['mod-001', 'mod-003'],
      learningOutcomes: ['Lead incident response', 'Coordinate teams', 'Minimize business impact'],
      certification: true,
      gamification: {
        badges: ['Incident Commander', 'Crisis Manager', 'Response Legend'],
        streakBonus: 30,
        leaderboardPoints: 400
      }
    },
    {
      id: 'mod-006',
      title: 'ISO 27001 Implementation',
      description: 'Information security management system implementation',
      category: 'compliance',
      difficulty: 'intermediate',
      duration: 75,
      type: 'assessment',
      completionRate: 62,
      trustPoints: 200,
      enrolledUsers: 89,
      averageScore: 86,
      rating: 4.3,
      tags: ['iso27001', 'compliance', 'isms'],
      prerequisites: ['mod-001'],
      learningOutcomes: ['Implement ISMS', 'Conduct risk assessments', 'Manage compliance'],
      certification: true,
      gamification: {
        badges: ['Compliance Expert', 'ISO Champion'],
        streakBonus: 18,
        leaderboardPoints: 280
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
      rank: 1,
      department: 'Security',
      joinDate: '2023-08-15'
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
      rank: 2,
      department: 'IT',
      joinDate: '2023-09-01'
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
      rank: 3,
      department: 'Data Science',
      joinDate: '2023-07-20'
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
      rank: 4,
      department: 'Legal',
      joinDate: '2023-10-05'
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
      badges: ['Security Rookie', 'Phishing Detector'],
      rank: 5,
      department: 'HR',
      joinDate: '2023-11-12'
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
      totalUsers: 265
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
      totalUsers: 265
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
      totalUsers: 265
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
      totalUsers: 265
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
      totalUsers: 265
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
      totalUsers: 265
    }
  ];

  const totalModules = trainingModules.length;
  const averageCompletion = Math.round(
    trainingModules.reduce((sum, module) => sum + module.completionRate, 0) / totalModules
  );
  const totalEnrolled = trainingModules.reduce((sum, module) => sum + module.enrolledUsers, 0);
  const totalTrustPoints = trainingModules.reduce((sum, module) => sum + module.trustPoints, 0);

  const filteredModules = trainingModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'interactive': return Gamepad2;
      case 'quiz': return FileText;
      case 'simulation': return Target;
      case 'assessment': return CheckCircle;
      default: return BookOpen;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-slate-500 to-slate-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-yellow-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Employee Training Platform</h1>
            <p className="text-slate-600">
              Gamified security and compliance training with Trust Equity rewards
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TrustPointsDisplay points={totalTrustPoints} size="lg" />
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Module
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Training Modules"
            value={totalModules.toString()}
            icon={GraduationCap}
            trend={{ value: 15, isPositive: true }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
          />
          <StatCard
            title="Avg Completion"
            value={`€{averageCompletion}%`}
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
            className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
          />
          <StatCard
            title="Total Enrolled"
            value={totalEnrolled.toString()}
            icon={Users}
            trend={{ value: 22, isPositive: true }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
          />
          <StatCard
            title="Trust Points"
            value={totalTrustPoints.toLocaleString()}
            icon={Award}
            trend={{ value: 18, isPositive: true }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules">Training Modules</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Training Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search modules, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="security">Security</option>
                <option value="privacy">Privacy</option>
                <option value="compliance">Compliance</option>
                <option value="ai-ethics">AI Ethics</option>
                <option value="technical">Technical</option>
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => {
                const TypeIcon = getTypeIcon(module.type);
                return (
                  <Card 
                    key={module.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-slate-200 relative overflow-hidden"
                  >
                    {module.certification && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                          <Award className="h-3 w-3 mr-1" />
                          Certified
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                            <TypeIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <Badge className={getDifficultyColor(module.difficulty)}>
                              {module.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <p className="text-sm text-slate-600">{module.description}</p>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Module Stats */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Duration:</span>
                            <div className="font-medium">{module.duration} min</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Enrolled:</span>
                            <div className="font-medium">{module.enrolledUsers}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Avg Score:</span>
                            <div className="font-medium">{module.averageScore}%</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="font-medium">{module.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Completion Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Completion Rate</span>
                            <span className="font-medium">{module.completionRate}%</span>
                          </div>
                          <Progress value={module.completionRate} className="h-2" />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {module.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {module.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{module.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Gamification Elements */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-yellow-600" />
                              <span className="font-medium">Streak Bonus: +{module.gamification.streakBonus}</span>
                            </div>
                            <TrustPointsDisplay points={module.trustPoints} size="sm" />
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {module.gamification.badges.slice(0, 2).map((badge) => (
                              <Badge key={badge} className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                <Medal className="h-3 w-3 mr-1" />
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                          <Play className="h-4 w-4 mr-2" />
                          Start Training
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Top Learners</h3>
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                Weekly Rankings
              </Badge>
            </div>

            <div className="space-y-4">
              {topLearners.map((learner, index) => (
                <Card key={learner.userId} className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-2xl">
                            {learner.avatar}
                          </div>
                          <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white €{
                            index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                            index === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                            'bg-slate-500'
                          }`}>
                            #{learner.rank}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-lg">{learner.userName}</h4>
                            <Badge variant="outline">{learner.department}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span>Level {learner.level}</span>
                            <span>{learner.completedModules} modules completed</span>
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {learner.currentStreak} day streak
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{learner.totalPoints.toLocaleString()}</div>
                          <div className="text-sm text-slate-500">Trust Points</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {learner.badges.slice(0, 3).map((badge) => (
                            <Badge key={badge} className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Achievement Gallery</h3>
              <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800">
                <Trophy className="h-3 w-3 mr-1" />
                {achievements.length} Achievements
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                const unlockRate = Math.round((achievement.unlockedBy / achievement.totalUsers) * 100);
                return (
                  <Card key={achievement.id} className="border-slate-200 overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r €{achievement.color} flex items-center justify-center`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-right">
                          <Badge className={`€{getRarityColor(achievement.rarity)} text-white`}>
                            {achievement.rarity}
                          </Badge>
                          <div className="text-sm text-slate-500 mt-1">
                            {achievement.points} points
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{achievement.name}</CardTitle>
                      <p className="text-sm text-slate-600">{achievement.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Unlock Rate</span>
                            <span className="font-medium">{unlockRate}%</span>
                          </div>
                          <Progress value={unlockRate} className="h-2" />
                        </div>
                        
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">{achievement.unlockedBy}</span> of{' '}
                          <span className="font-medium">{achievement.totalUsers}</span> users have unlocked this
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Training Progress Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trainingModules.slice(0, 4).map((module) => (
                      <div key={module.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-medium">{module.title}</div>
                          <div className="text-sm text-slate-600">{module.enrolledUsers} enrolled</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress 
                            value={module.completionRate} 
                            className="w-24 h-2" 
                          />
                          <span className="text-sm font-medium w-12 text-right">
                            {module.completionRate}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Department Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Security', 'IT', 'Data Science', 'Legal', 'HR'].map((department, index) => {
                      const performance = [92, 87, 84, 78, 75][index];
                      return (
                        <div key={department} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <div className="font-medium">{department}</div>
                            <div className="text-sm text-slate-600">Department avg</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress 
                              value={performance} 
                              className="w-24 h-2" 
                            />
                            <span className="text-sm font-medium w-12 text-right">
                              {performance}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};