import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  Treemap
} from 'recharts';

// Color palette
const COLORS = {
  primary: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'],
  success: ['#10b981', '#059669', '#047857', '#065f46'],
  danger: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b'],
  warning: ['#f59e0b', '#d97706', '#b45309', '#92400e'],
  purple: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'],
  gradient: {
    blue: 'url(#blueGradient)',
    green: 'url(#greenGradient)',
    red: 'url(#redGradient)',
    purple: 'url(#purpleGradient)'
  }
};

// Compliance Trend Chart
export const ComplianceTrendChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          labelStyle={{ color: '#111827', fontWeight: 'bold' }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="compliance" 
          stroke="#3b82f6" 
          strokeWidth={3}
          dot={{ fill: '#3b82f6', r: 6 }}
          activeDot={{ r: 8 }}
        />
        <Line 
          type="monotone" 
          dataKey="target" 
          stroke="#10b981" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Risk Heatmap Chart
export const RiskHeatmapChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="category" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
        />
        <Legend />
        <Bar dataKey="high" stackId="a" fill="#ef4444" />
        <Bar dataKey="medium" stackId="a" fill="#f59e0b" />
        <Bar dataKey="low" stackId="a" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Framework Coverage Pie Chart
export const FrameworkCoverageChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `€{name} €{(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-€{index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Risk Radar Chart
export const RiskRadarChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="risk" stroke="#6b7280" fontSize={12} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" fontSize={12} />
        <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
        <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
        <Legend />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

// Financial Impact Area Chart
export const FinancialImpactChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `€€{value/1000}k`} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          formatter={(value: any) => `€€{(value/1000).toFixed(0)}k`}
        />
        <Legend />
        <Area type="monotone" dataKey="prevented" stackId="1" stroke="#10b981" fill="url(#greenGradient)" />
        <Area type="monotone" dataKey="potential" stackId="1" stroke="#ef4444" fill="url(#redGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Security Score Radial Chart
export const SecurityScoreRadialChart: React.FC<{ score: number }> = ({ score }) => {
  const data = [
    {
      name: 'Score',
      value: score,
      fill: score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444'
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data}>
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          background
          dataKey="value"
          cornerRadius={10}
          fill={data[0].fill}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold">
          {score}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

// Vulnerability Timeline Chart
export const VulnerabilityTimelineChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
        <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
        <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="found" fill="#ef4444" />
        <Bar yAxisId="left" dataKey="fixed" fill="#10b981" />
        <Line yAxisId="right" type="monotone" dataKey="openCount" stroke="#3b82f6" strokeWidth={3} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Policy Compliance Treemap
export const PolicyComplianceTreemap: React.FC<{ data: any[] }> = ({ data }) => {
  const CustomContent: React.FC<any> = ({ x, y, width, height, name, value }) => {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: value >= 90 ? '#10b981' : value >= 70 ? '#f59e0b' : '#ef4444',
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1,
          }}
        />
        {width > 80 && height > 40 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 10}
              fill="#fff"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={14}
              fontWeight="bold"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 10}
              fill="#fff"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={12}
            >
              {value}%
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <Treemap
        data={data}
        dataKey="value"
        aspectRatio={4 / 3}
        stroke="#fff"
        content={<CustomContent />}
      />
    </ResponsiveContainer>
  );
};

// Real-time Activity Chart
export const ActivityStreamChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <defs>
          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
        />
        <Area 
          type="monotone" 
          dataKey="events" 
          stroke="#8b5cf6" 
          fill="url(#purpleGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};