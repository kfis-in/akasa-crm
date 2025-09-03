import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  status: string
  assigned_to: string
  created_at: string
  updated_at: string
}

interface AnalyticsChartProps {
  leads: Lead[]
  chartType: 'bar' | 'line' | 'pie'
}

export function AnalyticsChart({ leads, chartType }: AnalyticsChartProps) {
  // Prepare data for charts
  const statusData = [
    { name: 'New', count: leads.filter(l => l.status === 'New').length, color: 'hsl(var(--info))' },
    { name: 'Contacted', count: leads.filter(l => l.status === 'Contacted').length, color: 'hsl(var(--warning))' },
    { name: 'In Progress', count: leads.filter(l => l.status === 'In Progress').length, color: 'hsl(var(--primary))' },
    { name: 'Won', count: leads.filter(l => l.status === 'Won').length, color: 'hsl(var(--success))' },
    { name: 'Lost', count: leads.filter(l => l.status === 'Lost').length, color: 'hsl(var(--destructive))' }
  ]

  // Time-based data for line chart
  const timeData = leads.reduce((acc: any[], lead) => {
    const date = new Date(lead.created_at).toLocaleDateString()
    const existing = acc.find(item => item.date === date)
    if (existing) {
      existing.count += 1
    } else {
      acc.push({ date, count: 1 })
    }
    return acc
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7)

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  backdropFilter: 'blur(20px)'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  backdropFilter: 'blur(20px)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="hsl(var(--primary))"
                dataKey="count"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  backdropFilter: 'blur(20px)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )
      
      default:
        return null
    }
  }

  const getIcon = () => {
    switch (chartType) {
      case 'bar': return <BarChart3 className="h-5 w-5" />
      case 'line': return <TrendingUp className="h-5 w-5" />
      case 'pie': return <PieChartIcon className="h-5 w-5" />
    }
  }

  const getTitle = () => {
    switch (chartType) {
      case 'bar': return 'Lead Status Distribution'
      case 'line': return 'Lead Creation Trend (7 Days)'
      case 'pie': return 'Status Breakdown'
    }
  }

  return (
    <Card className="backdrop-blur-md bg-card/80 shadow-glass border-0 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          {getIcon()}
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  )
}