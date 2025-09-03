import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CRMLayout } from '@/components/crm/CRMLayout'
import { LeadStatusBadge } from '@/components/crm/LeadStatusBadge'
import { useRealTimeLeads } from '@/hooks/useRealTimeLeads'
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart'
import { FilterPanel, FilterState } from '@/components/dashboard/FilterPanel'
import { Link } from 'react-router-dom'
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Target,
  Plus,
  ArrowUpRight,
  Calendar,
  Phone,
  Mail,
  BarChart3,
  Activity,
  Zap,
  Filter
} from 'lucide-react'
import { format } from 'date-fns'

export default function Dashboard() {
  const { leads, isLoading } = useRealTimeLeads()
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar')
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    assignedTo: '',
    dateRange: { from: null, to: null },
    searchTerm: ''
  })

  // Filter leads based on active filters
  const filteredLeads = leads.filter(lead => {
    if (filters.status && filters.status !== 'all' && lead.status !== filters.status) return false
    if (filters.assignedTo && filters.assignedTo !== 'all' && lead.assigned_to !== filters.assignedTo) return false
    if (filters.searchTerm && !lead.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !lead.email.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false
    if (filters.dateRange.from && filters.dateRange.to) {
      const leadDate = new Date(lead.created_at)
      if (leadDate < filters.dateRange.from || leadDate > filters.dateRange.to) return false
    }
    return true
  })

  const stats = {
    total: filteredLeads.length,
    new: filteredLeads.filter(lead => lead.status === 'New').length,
    contacted: filteredLeads.filter(lead => lead.status === 'Contacted').length,
    inProgress: filteredLeads.filter(lead => lead.status === 'In Progress').length,
    won: filteredLeads.filter(lead => lead.status === 'Won').length,
    lost: filteredLeads.filter(lead => lead.status === 'Lost').length
  }

  const conversionRate = stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : '0'
  const recentLeads = filteredLeads.slice(0, 5)

  // Real-time indicator
  useEffect(() => {
    const interval = setInterval(() => {
      // This creates a subtle pulse effect for real-time indication
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <CRMLayout>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Real-Time Dashboard
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full animate-glow-pulse"></div>
                  <span className="text-sm font-medium text-primary">Live</span>
                </div>
              </div>
              <p className="text-muted-foreground">
                Real-time analytics with purple theme • {filteredLeads.length} of {leads.length} leads shown
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="backdrop-blur-sm bg-background/80 border-primary/20">
                <Link to="/settings">
                  <Activity className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button asChild className="shadow-glow bg-gradient-primary hover:shadow-elegant transition-smooth">
                <Link to="/leads/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            <Card className="backdrop-blur-md bg-card/80 shadow-glass border-0 hover:shadow-glow transition-smooth group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                <Users className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active prospects in pipeline
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-card/80 shadow-glass border-0 hover:shadow-glow transition-smooth group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">New Leads</CardTitle>
                <UserPlus className="h-5 w-5 text-info group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-info">{stats.new}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Fresh opportunities
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-card/80 shadow-glass border-0 hover:shadow-glow transition-smooth group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                <Target className="h-5 w-5 text-success group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">{conversionRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Leads converted to wins
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-card/80 shadow-glass border-0 hover:shadow-glow transition-smooth group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Won Deals</CardTitle>
                <TrendingUp className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{stats.won}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Successful conversions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Analytics */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-1">
              <FilterPanel onFilterChange={setFilters} activeFilters={filters} />
            </div>
            
            <div className="xl:col-span-3 space-y-6">
              {/* Chart Type Selector */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Analytics Overview</h2>
                <Select value={chartType} onValueChange={(value: 'bar' | 'line' | 'pie') => setChartType(value)}>
                  <SelectTrigger className="w-48 backdrop-blur-sm bg-background/80">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Analytics Chart */}
              <AnalyticsChart leads={filteredLeads} chartType={chartType} />
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pipeline Status */}
            <Card className="backdrop-blur-md bg-card/80 shadow-glass border-0 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  Pipeline Status
                  <Target className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-glass">
                  <div className="flex items-center gap-3">
                    <LeadStatusBadge status="New" />
                    <span className="font-medium text-foreground">New</span>
                  </div>
                  <span className="text-2xl font-bold text-info">{stats.new}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-glass">
                  <div className="flex items-center gap-3">
                    <LeadStatusBadge status="Contacted" />
                    <span className="font-medium text-foreground">Contacted</span>
                  </div>
                  <span className="text-2xl font-bold text-warning">{stats.contacted}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-glass">
                  <div className="flex items-center gap-3">
                    <LeadStatusBadge status="In Progress" />
                    <span className="font-medium text-foreground">In Progress</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">{stats.inProgress}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-glass">
                  <div className="flex items-center gap-3">
                    <LeadStatusBadge status="Won" />
                    <span className="font-medium text-foreground">Won</span>
                  </div>
                  <span className="text-2xl font-bold text-success">{stats.won}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-glass">
                  <div className="flex items-center gap-3">
                    <LeadStatusBadge status="Lost" />
                    <span className="font-medium text-foreground">Lost</span>
                  </div>
                  <span className="text-2xl font-bold text-destructive">{stats.lost}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Leads */}
            <Card className="backdrop-blur-md bg-card/80 shadow-glass border-0 animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  Recent Activity
                  <Calendar className="h-5 w-5 text-primary" />
                </CardTitle>
                <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
                  <Link to="/leads" className="gap-1">
                    View All
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-muted-foreground">Loading real-time data...</p>
                    </div>
                  </div>
                ) : recentLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">No leads match your filters</p>
                    <Button asChild className="shadow-glow bg-gradient-primary">
                      <Link to="/leads/new">Add Your First Lead</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentLeads.map((lead, index) => (
                      <div 
                        key={lead.id} 
                        className="p-4 rounded-xl bg-gradient-glass border border-primary/10 hover:shadow-glow transition-smooth animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-foreground">{lead.name}</span>
                              <LeadStatusBadge status={lead.status} />
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {lead.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {lead.phone}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(lead.created_at), 'MMM d')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CRMLayout>
  )
}