import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  Clock, 
  Trophy,
  AlertTriangle,
  CheckCircle,
  Users,
  FileText,
  Bot,
  Shield,
  Zap,
  MessageCircle,
  ThumbsUp,
  Target,
  Rocket
} from 'lucide-react';

interface ActivityItem {
  id: string;
  user: string;
  avatar?: string;
  action: string;
  target: string;
  impact?: string;
  time: string;
  type: 'achievement' | 'alert' | 'update' | 'collaboration';
  celebrate?: boolean;
  severity?: 'low' | 'medium' | 'high';
  reactions?: number;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    user: 'Sarah Chen',
    action: 'completed',
    target: 'GDPR assessment',
    impact: '+150 Trust Points',
    time: '2 min ago',
    type: 'achievement',
    celebrate: true,
    reactions: 5
  },
  {
    id: '2',
    user: 'System',
    action: 'detected',
    target: 'New Azure compliance issue',
    severity: 'medium',
    time: '15 min ago',
    type: 'alert'
  },
  {
    id: '3',
    user: 'Tom Richards',
    action: 'shared',
    target: 'Trust Score with BMW Group',
    impact: 'Deal accelerated',
    time: '1 hour ago',
    type: 'update',
    reactions: 12
  },
  {
    id: '4',
    user: 'AI Assistant',
    action: 'recommended',
    target: 'Enable SOC 2 Type II',
    impact: 'Unlock 2 enterprise deals',
    time: '2 hours ago',
    type: 'update'
  },
  {
    id: '5',
    user: 'Maria Garcia',
    action: 'unlocked',
    target: 'Compliance Champion badge',
    impact: '+300 Trust Points',
    time: '3 hours ago',
    type: 'achievement',
    celebrate: true,
    reactions: 8
  },
  {
    id: '6',
    user: 'Security Team',
    action: 'resolved',
    target: 'Critical vulnerability in production',
    severity: 'high',
    time: '4 hours ago',
    type: 'alert',
    reactions: 3
  }
];

const typeConfig = {
  achievement: {
    icon: <Trophy className="h-4 w-4" />,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  alert: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  update: {
    icon: <Activity className="h-4 w-4" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  collaboration: {
    icon: <Users className="h-4 w-4" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  }
};

const severityColors = {
  low: 'bg-green-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500'
};

const reactionEmojis = ['👍', '🎯', '🚀', '⚡'];

interface ActivityStreamProps {
  className?: string;
}

export const ActivityStream: React.FC<ActivityStreamProps> = ({ className = '' }) => {
  const [filter, setFilter] = React.useState<'all' | 'my-team' | 'following' | 'mentions'>('all');

  return (
    <Card className={`border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg €{className}`}>
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-slate-900">Activity Stream</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'my-team', 'following', 'mentions'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors €{
                  filter === filterOption
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="group relative">
              <div className="flex items-start gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-lg €{typeConfig[activity.type].bg} €{typeConfig[activity.type].color}`}>
                    {typeConfig[activity.type].icon}
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-px h-full bg-slate-200 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-slate-900">
                          <span className="font-semibold">{activity.user}</span>
                          {' '}
                          <span className="text-slate-600">{activity.action}</span>
                          {' '}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        {activity.impact && (
                          <p className="text-sm text-green-600 font-medium mt-1">{activity.impact}</p>
                        )}
                      </div>
                      {activity.severity && (
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full €{severityColors[activity.severity]}`} />
                          <span className="text-xs text-slate-500 capitalize">{activity.severity}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>

                      <div className="flex items-center gap-2">
                        {activity.reactions && activity.reactions > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="flex -space-x-1">
                              {reactionEmojis.slice(0, 3).map((emoji, i) => (
                                <span key={i} className="text-xs">{emoji}</span>
                              ))}
                            </div>
                            <span className="text-xs text-slate-600 font-medium">{activity.reactions}</span>
                          </div>
                        )}
                        <button className="p-1 rounded hover:bg-slate-100 transition-colors">
                          <MessageCircle className="h-3 w-3 text-slate-400" />
                        </button>
                        <button className="p-1 rounded hover:bg-slate-100 transition-colors">
                          <ThumbsUp className="h-3 w-3 text-slate-400" />
                        </button>
                      </div>
                    </div>

                    {activity.celebrate && (
                      <div className="absolute -top-1 -right-1">
                        <div className="animate-bounce">
                          <Rocket className="h-4 w-4 text-orange-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Load more activities
        </button>
      </CardContent>
    </Card>
  );
};