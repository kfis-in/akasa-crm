import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CRMLayout } from '@/components/crm/CRMLayout'
import { LeadStatusBadge } from '@/components/crm/LeadStatusBadge'
import { useLeads } from '@/hooks/useLeads'
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
  Mail
} from 'lucide-react'
import { format } from 'date-fns'

export default function Dashboard() {
  const { leads, isLoading } = useLeads()

  const stats = {
    total: leads.length,
    new: leads.filter(lead => lead.status === 'New').length,
    contacted: leads.filter(lead => lead.status === 'Contacted').length,
    inProgress: leads.filter(lead => lead.status === 'In Progress').length,
    won: leads.filter(lead => lead.status === 'Won').length,
    lost: leads.filter(lead => lead.status === 'Lost').length
  }

  const conversionRate = stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : '0'
  const recentLeads = leads.slice(0, 5)

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your sales overview.
            </p>
          </div>
          <Button asChild className="gap-2 shadow-elegant">
            <Link to="/leads/new">
              <Plus className="h-4 w-4" />
              Add New Lead
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card hover:shadow-glow transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Active prospects in pipeline
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Week</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info">{stats.new}</div>
              <p className="text-xs text-muted-foreground">
                Fresh opportunities
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Leads converted to wins
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.won}</div>
              <p className="text-xs text-muted-foreground">
                Successful conversions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pipeline Status
                <Target className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <LeadStatusBadge status="New" />
                  <span className="text-sm text-muted-foreground">New</span>
                </div>
                <span className="font-medium">{stats.new}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <LeadStatusBadge status="Contacted" />
                  <span className="text-sm text-muted-foreground">Contacted</span>
                </div>
                <span className="font-medium">{stats.contacted}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <LeadStatusBadge status="In Progress" />
                  <span className="text-sm text-muted-foreground">In Progress</span>
                </div>
                <span className="font-medium">{stats.inProgress}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <LeadStatusBadge status="Won" />
                  <span className="text-sm text-muted-foreground">Won</span>
                </div>
                <span className="font-medium">{stats.won}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <LeadStatusBadge status="Lost" />
                  <span className="text-sm text-muted-foreground">Lost</span>
                </div>
                <span className="font-medium">{stats.lost}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Recent Leads
                <Calendar className="h-5 w-5" />
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/leads" className="gap-1">
                  View All
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  Loading recent leads...
                </div>
              ) : recentLeads.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No leads yet</p>
                  <Button asChild size="sm" className="mt-3">
                    <Link to="/leads/new">Add Your First Lead</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{lead.name}</span>
                          <LeadStatusBadge status={lead.status} />
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-4">
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
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(lead.created_at), 'MMM d')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </CRMLayout>
  )
}