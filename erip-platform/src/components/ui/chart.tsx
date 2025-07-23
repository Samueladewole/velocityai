import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Color palettes for charts
const colorPalettes = {
  primary: ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a'],
  success: ['#10b981', '#059669', '#047857', '#065f46'],
  warning: ['#f59e0b', '#d97706', '#b45309', '#92400e'],
  purple: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'],
  gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
}

interface ChartProps {
  title?: string
  description?: string
  data: any[]
  className?: string
  height?: number
}

interface LineChartComponentProps extends ChartProps {
  xDataKey: string
  yDataKey: string
  color?: keyof typeof colorPalettes
  strokeWidth?: number
  showGrid?: boolean
  showTooltip?: boolean
}

interface AreaChartComponentProps extends ChartProps {
  xDataKey: string
  yDataKey: string
  color?: keyof typeof colorPalettes
  gradient?: boolean
  showGrid?: boolean
  showTooltip?: boolean
}

interface BarChartComponentProps extends ChartProps {
  xDataKey: string
  yDataKey: string
  color?: keyof typeof colorPalettes
  showGrid?: boolean
  showTooltip?: boolean
}

interface PieChartComponentProps extends ChartProps {
  dataKey: string
  nameKey?: string
  color?: keyof typeof colorPalettes
  showTooltip?: boolean
}

export function LineChartComponent({
  title,
  description,
  data,
  xDataKey,
  yDataKey,
  color = 'primary',
  strokeWidth = 3,
  showGrid = true,
  showTooltip = true,
  className,
  height = 300
}: LineChartComponentProps) {
  const colors = colorPalettes[color]

  return (
    <Card className={cn("border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-slate-900">{title}</CardTitle>}
          {description && <CardDescription className="text-slate-600">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
            <XAxis 
              dataKey={xDataKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
            )}
            <Line 
              type="monotone" 
              dataKey={yDataKey} 
              stroke={colors[0]} 
              strokeWidth={strokeWidth}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2, fill: 'white' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function AreaChartComponent({
  title,
  description,
  data,
  xDataKey,
  yDataKey,
  color = 'primary',
  gradient = true,
  showGrid = true,
  showTooltip = true,
  className,
  height = 300
}: AreaChartComponentProps) {
  const colors = colorPalettes[color]
  const gradientId = `gradient-${color}-${Math.random().toString(36).substr(2, 9)}`

  return (
    <Card className={cn("border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-slate-900">{title}</CardTitle>}
          {description && <CardDescription className="text-slate-600">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
            <XAxis 
              dataKey={xDataKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
            )}
            <Area 
              type="monotone" 
              dataKey={yDataKey} 
              stroke={colors[0]} 
              strokeWidth={2}
              fill={gradient ? `url(#${gradientId})` : colors[0]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function BarChartComponent({
  title,
  description,
  data,
  xDataKey,
  yDataKey,
  color = 'primary',
  showGrid = true,
  showTooltip = true,
  className,
  height = 300
}: BarChartComponentProps) {
  const colors = colorPalettes[color]

  return (
    <Card className={cn("border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-slate-900">{title}</CardTitle>}
          {description && <CardDescription className="text-slate-600">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
            <XAxis 
              dataKey={xDataKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
            )}
            <Bar 
              dataKey={yDataKey} 
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function PieChartComponent({
  title,
  description,
  data,
  dataKey,
  color = 'gradient',
  showTooltip = true,
  className,
  height = 300
}: PieChartComponentProps) {
  const colors = colorPalettes[color]

  return (
    <Card className={cn("border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-slate-900">{title}</CardTitle>}
          {description && <CardDescription className="text-slate-600">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey={dataKey}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}