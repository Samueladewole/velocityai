import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  Target, 
  Search, 
  Activity, 
  Zap, 
  Users,
  FileText,
  BarChart3,
  Cloud,
  Lock,
  Bot,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface ComponentStatus {
  id: string;
  name: string;
  status: 'active' | 'warning' | 'error' | 'idle';
  health: number;
  lastAction: string;
  trustPoints: string;
  quickAccess: string;
  category: string;
  icon: React.ReactNode;
  color: string;
}

const components: ComponentStatus[] = [
  {
    id: 'PRISM',
    name: 'Risk Quantification',
    status: 'active',
    health: 98,
    lastAction: 'Risk simulation completed',
    trustPoints: '+240 today',
    quickAccess: 'Run simulation',
    category: 'Value Discovery',
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'QIE',
    name: 'Questionnaire Intelligence',
    status: 'active',
    health: 95,
    lastAction: 'Questionnaire processed',
    trustPoints: '+180 today',
    quickAccess: 'Upload questionnaire',
    category: 'Trust Building',
    icon: <FileText className="h-5 w-5" />,
    color: 'from-teal-400 to-cyan-500'
  },
  {
    id: 'BEACON',
    name: 'Trust Score Sharing',
    status: 'active',
    health: 100,
    lastAction: 'Public URL generated',
    trustPoints: '+120 today',
    quickAccess: 'Share Trust Score',
    category: 'Value Discovery',
    icon: <Shield className="h-5 w-5" />,
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'COMPASS',
    name: 'Compliance Navigator',
    status: 'warning',
    health: 78,
    lastAction: 'Gap analysis completed',
    trustPoints: '+95 today',
    quickAccess: 'View gaps',
    category: 'Assessment',
    icon: <Target className="h-5 w-5" />,
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'ATLAS',
    name: 'Security Posture',
    status: 'active',
    health: 92,
    lastAction: 'Threat assessment updated',
    trustPoints: '+160 today',
    quickAccess: 'Check threats',
    category: 'Assessment',
    icon: <Search className="h-5 w-5" />,
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'PULSE',
    name: 'Continuous Monitoring',
    status: 'active',
    health: 96,
    lastAction: 'Real-time scan completed',
    trustPoints: '+200 today',
    quickAccess: 'View monitoring',
    category: 'Monitoring',
    icon: <Activity className="h-5 w-5" />,
    color: 'from-green-400 to-green-600'
  },
  {
    id: 'CLEARANCE',
    name: 'Risk Decisions',
    status: 'idle',
    health: 100,
    lastAction: 'Workflow completed',
    trustPoints: '+75 today',
    quickAccess: 'New decision',
    category: 'Automation',
    icon: <Zap className="h-5 w-5" />,
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 'PRIVACY',
    name: 'Privacy Management',
    status: 'active',
    health: 89,
    lastAction: 'DSAR processed',
    trustPoints: '+110 today',
    quickAccess: 'Manage privacy',
    category: 'Automation',
    icon: <Lock className="h-5 w-5" />,
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 'AI_GOV',
    name: 'AI Governance',
    status: 'active',
    health: 94,
    lastAction: 'AI system registered',
    trustPoints: '+135 today',
    quickAccess: 'View AI systems',
    category: 'Trust Building',
    icon: <Bot className="h-5 w-5" />,
    color: 'from-teal-400 to-cyan-500'
  },
  {
    id: 'CLOUD',
    name: 'Cloud Security',
    status: 'active',
    health: 87,
    lastAction: 'Multi-cloud scan completed',
    trustPoints: '+145 today',
    quickAccess: 'View findings',
    category: 'Monitoring',
    icon: <Cloud className="h-5 w-5" />,
    color: 'from-green-400 to-green-600'
  },
  {
    id: 'FRAMEWORK',
    name: 'Framework Management',
    status: 'active',
    health: 91,
    lastAction: '70% overlap optimized',
    trustPoints: '+165 today',
    quickAccess: 'View frameworks',
    category: 'Assessment',
    icon: <Settings className="h-5 w-5" />,
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'TRAINING',
    name: 'Employee Training',
    status: 'active',
    health: 88,
    lastAction: 'Achievement unlocked',
    trustPoints: '+125 today',
    quickAccess: 'View progress',
    category: 'Trust Building',
    icon: <Users className="h-5 w-5" />,
    color: 'from-teal-400 to-cyan-500'
  }
];

const categoryColors = {
  'Value Discovery': 'from-yellow-400 to-orange-500',
  'Assessment': 'from-blue-400 to-blue-600', 
  'Monitoring': 'from-green-400 to-green-600',
  'Automation': 'from-purple-400 to-purple-600',
  'Trust Building': 'from-teal-400 to-cyan-500'
};

const statusConfig = {
  active: { color: 'bg-green-500', label: 'Active' },
  warning: { color: 'bg-amber-500', label: 'Warning' },
  error: { color: 'bg-red-500', label: 'Error' },
  idle: { color: 'bg-gray-400', label: 'Idle' }
};

interface ComponentGridProps {
  className?: string;
}

export const ComponentGrid: React.FC<ComponentGridProps> = ({ className = '' }) => {
  const categories = Array.from(new Set(components.map(c => c.category)));

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Platform Components</h2>
          <p className="text-slate-600 mt-1">Real-time status and Trust Points activity</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>{components.filter(c => c.status === 'active').length} Active</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span>{components.filter(c => c.status === 'warning').length} Warnings</span>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]}`} />
            <h3 className="text-lg font-semibold text-slate-800">{category}</h3>
            <span className="text-sm text-slate-500">
              {components.filter(c => c.category === category).length} components
            </span>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {components
              .filter(component => component.category === category)
              .map(component => (
                <Card 
                  key={component.id} 
                  className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
                  <CardContent className="relative p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${component.color} text-white`}>
                          {component.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">{component.name}</h4>
                          <p className="text-xs text-slate-500">{component.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${statusConfig[component.status].color}`} />
                        <span className="text-xs text-slate-600">{statusConfig[component.status].label}</span>
                      </div>
                    </div>

                    {/* Health Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-700">Health Score</span>
                        <span className="text-sm font-bold text-slate-900">{component.health}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${component.color} h-2 rounded-full transition-all duration-1000`}
                          style={{ width: `${component.health}%` }}
                        />
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">Trust Points</span>
                        <span className="text-sm font-semibold text-green-600">{component.trustPoints}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-3 w-3 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-slate-600 leading-relaxed">{component.lastAction}</span>
                      </div>
                    </div>

                    {/* Quick Action */}
                    <button className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
                      <span className="text-sm font-medium">{component.quickAccess}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};