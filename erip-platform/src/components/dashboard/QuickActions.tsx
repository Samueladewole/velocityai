import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  Share2, 
  Play, 
  Search,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  Command,
  Zap
} from 'lucide-react';


interface QuickActionItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  shortcut?: string;
  route: string;
}

interface QuickActionsProps {
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);

  const quickActions: QuickActionItem[] = [
    {
      id: 'upload-questionnaire',
      label: 'Upload Questionnaire',
      description: 'Process with QIE',
      icon: <Upload className="h-5 w-5" />,
      color: 'from-blue-400 to-blue-600',
      shortcut: 'Cmd+U',
      route: '/qie-enhanced'
    },
    {
      id: 'share-trust-score',
      label: 'Share Trust Score',
      description: 'Generate public URL',
      icon: <Share2 className="h-5 w-5" />,
      color: 'from-green-400 to-green-600',
      shortcut: 'Cmd+S',
      route: '/trust-score'
    },
    {
      id: 'run-simulation',
      label: 'Run Risk Simulation',
      description: 'Launch PRISM',
      icon: <Play className="h-5 w-5" />,
      color: 'from-purple-400 to-purple-600',
      shortcut: 'Cmd+R',
      route: '/tools/prism'
    },
    {
      id: 'view-gaps',
      label: 'View Compliance Gaps',
      description: 'Priority items',
      icon: <Search className="h-5 w-5" />,
      color: 'from-amber-400 to-amber-600',
      shortcut: 'Cmd+G',
      route: '/app/compass'
    }
  ];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick Actions Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
        </div>
        <button 
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <Command className="h-3 w-3" />
          <span className="text-sm font-medium">Cmd+K</span>
        </button>
      </div>

      {/* Quick Action Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card 
            key={action.id}
            onClick={() => navigate(action.route)}
            className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
            <CardContent className="relative p-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{action.label}</h3>
                  <p className="text-xs text-slate-600">{action.description}</p>
                </div>
                {action.shortcut && (
                  <span className="absolute top-2 right-2 text-xs font-mono text-slate-400">{action.shortcut}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Command Palette (would be a modal in production) */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  className="flex-1 outline-none text-lg"
                  autoFocus
                />
                <button 
                  onClick={() => setIsCommandPaletteOpen(false)}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  ESC
                </button>
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {[
                  { icon: <Upload />, label: 'Upload questionnaire → QIE', shortcut: 'Cmd+U' },
                  { icon: <Play />, label: 'Run risk simulation → PRISM', shortcut: 'Cmd+R' },
                  { icon: <Share2 />, label: 'Share Trust Score → BEACON', shortcut: 'Cmd+S' },
                  { icon: <Search />, label: 'View compliance gaps → COMPASS', shortcut: 'Cmd+G' },
                  { icon: <BarChart3 />, label: 'Check security posture → ATLAS', shortcut: '' },
                  { icon: <FileText />, label: 'Generate report → Custom', shortcut: '' },
                  { icon: <Users />, label: 'Schedule expert consult', shortcut: '' },
                  { icon: <TrendingUp />, label: 'View analytics dashboard', shortcut: '' }
                ].map((cmd, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors text-left"
                    onClick={() => {
                      setIsCommandPaletteOpen(false);
                      // Navigate based on the command
                      if (cmd.label.includes('QIE')) navigate('/qie-enhanced');
                      else if (cmd.label.includes('PRISM')) navigate('/tools/prism');
                      else if (cmd.label.includes('BEACON')) navigate('/trust-score');
                      else if (cmd.label.includes('COMPASS')) navigate('/app/compass');
                      else if (cmd.label.includes('ATLAS')) navigate('/app/atlas');
                      else if (cmd.label.includes('dashboard')) navigate('/dashboard');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-slate-400">{cmd.icon}</div>
                      <span className="font-medium text-slate-900">{cmd.label}</span>
                    </div>
                    {cmd.shortcut && (
                      <span className="text-xs font-mono text-slate-500">{cmd.shortcut}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};