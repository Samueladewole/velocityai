import React, { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Play, Square, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface AgentStatus {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  estimatedCompletion?: Date;
  currentTask?: string;
  lastUpdate: Date;
}

interface AgentTask {
  id: string;
  agentId: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

interface QueueMetrics {
  pending: number;
  running: number;
  completed: number;
  failed: number;
  totalToday: number;
  successRate: number;
}

const AgentMonitor: React.FC = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [queueMetrics, setQueueMetrics] = useState<QueueMetrics>({
    pending: 0,
    running: 0,
    completed: 0,
    failed: 0,
    totalToday: 0,
    successRate: 0
  });
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // WebSocket for real-time updates
  const { connect, disconnect, send, lastMessage } = useWebSocket(
    `${process.env.REACT_APP_WS_URL}/agents/monitor`
  );

  // Connect to WebSocket on mount
  useEffect(() => {
    if (isRealTimeEnabled) {
      connect();
      return () => disconnect();
    }
  }, [isRealTimeEnabled, connect, disconnect]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      
      switch (data.type) {
        case 'agent_status_update':
          updateAgentStatus(data.payload);
          break;
        case 'task_update':
          updateTask(data.payload);
          break;
        case 'queue_metrics':
          setQueueMetrics(data.payload);
          break;
      }
    }
  }, [lastMessage]);

  const updateAgentStatus = useCallback((agentData: AgentStatus) => {
    setAgents(prev => {
      const index = prev.findIndex(a => a.id === agentData.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...agentData, lastUpdate: new Date() };
        return updated;
      } else {
        return [...prev, { ...agentData, lastUpdate: new Date() }];
      }
    });
  }, []);

  const updateTask = useCallback((taskData: AgentTask) => {
    setTasks(prev => {
      const index = prev.findIndex(t => t.id === taskData.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = taskData;
        return updated;
      } else {
        return [...prev, taskData].slice(-100); // Keep last 100 tasks
      }
    });
  }, []);

  const startAgent = async (agentId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to start agent');
      
      send(JSON.stringify({
        type: 'subscribe_agent',
        agentId
      }));
    } catch (error) {
      console.error('Failed to start agent:', error);
    }
  };

  const stopAgent = async (agentId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to stop agent');
    } catch (error) {
      console.error('Failed to stop agent:', error);
    }
  };

  const retryTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to retry task');
    } catch (error) {
      console.error('Failed to retry task:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = Math.round((end.getTime() - startTime.getTime()) / 1000);
    
    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.round(duration / 60)}m`;
    return `${Math.round(duration / 3600)}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Agent Monitor</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isRealTimeEnabled}
              onChange={(e) => setIsRealTimeEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">Real-time updates</span>
          </label>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-600">
              {isRealTimeEnabled ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Queue Metrics */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{queueMetrics.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{queueMetrics.running}</div>
          <div className="text-sm text-gray-600">Running</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{queueMetrics.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{queueMetrics.failed}</div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{queueMetrics.totalToday}</div>
          <div className="text-sm text-gray-600">Total Today</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{queueMetrics.successRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>

      {/* Agent List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Agents</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {agents.map((agent) => (
            <div key={agent.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(agent.status)}
                  <div>
                    <div className="font-semibold text-gray-900">{agent.name}</div>
                    <div className="text-sm text-gray-600">{agent.currentTask || 'Idle'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {agent.status === 'running' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${agent.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{agent.progress}%</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {agent.status === 'idle' && (
                      <button
                        onClick={() => startAgent(agent.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                        title="Start Agent"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    
                    {agent.status === 'running' && (
                      <button
                        onClick={() => stopAgent(agent.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        title="Stop Agent"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      {selectedAgent === agent.id ? 'Hide Tasks' : 'Show Tasks'}
                    </button>
                  </div>
                </div>
              </div>
              
              {agent.estimatedCompletion && agent.status === 'running' && (
                <div className="mt-2 text-sm text-gray-600">
                  Estimated completion: {agent.estimatedCompletion.toLocaleTimeString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Task List for Selected Agent */}
      {selectedAgent && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Tasks for {agents.find(a => a.id === selectedAgent)?.name}
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {tasks
              .filter(task => task.agentId === selectedAgent)
              .slice(0, 20)
              .map((task) => (
                <div key={task.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(task.status)}
                      <div>
                        <div className="font-medium text-gray-900">{task.type}</div>
                        <div className="text-sm text-gray-600">ID: {task.id.slice(0, 8)}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {task.startedAt && (
                        <div className="text-sm text-gray-600">
                          {formatDuration(task.startedAt, task.completedAt)}
                        </div>
                      )}
                      
                      {task.status === 'failed' && (
                        <button
                          onClick={() => retryTask(task.id)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 rounded"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {task.error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      {task.error}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentMonitor;