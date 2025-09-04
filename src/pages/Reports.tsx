import { CRMLayout } from '@/components/crm/CRMLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRealTimeLeads } from '@/hooks/useRealTimeLeads'
import { BarChart3, TrendingUp, Users, Target, PieChart, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function Reports() {
  const { leads, isLoading } = useRealTimeLeads()

  if (isLoading) {
    return (
      <CRMLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </CRMLayout>
    )
  }

  const totalLeads = leads.length
  const newLeads = leads.filter(lead => lead.status === 'New').length
  const wonLeads = leads.filter(lead => lead.status === 'Won').length
  const lostLeads = leads.filter(lead => lead.status === 'Lost').length
  const inProgressLeads = leads.filter(lead => lead.status === 'In Progress').length
  const contactedLeads = leads.filter(lead => lead.status === 'Contacted').length

  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0'
  const lossRate = totalLeads > 0 ? ((lostLeads / totalLeads) * 100).toFixed(1) : '0.0'

  const statusStats = [
    { status: 'New', count: newLeads, color: 'bg-blue-500' },
    { status: 'Contacted', count: contactedLeads, color: 'bg-yellow-500' },
    { status: 'In Progress', count: inProgressLeads, color: 'bg-orange-500' },
    { status: 'Won', count: wonLeads, color: 'bg-green-500' },
    { status: 'Lost', count: lostLeads, color: 'bg-red-500' },
  ]

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your lead performance and conversion metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                All leads in pipeline
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Won / Total leads
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Won Leads</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{wonLeads}</div>
              <p className="text-xs text-muted-foreground">
                Successfully converted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loss Rate</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lossRate}%</div>
              <p className="text-xs text-muted-foreground">
                Lost / Total leads
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lead Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Lead Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusStats.map((stat) => (
                <div key={stat.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                    <span className="font-medium">{stat.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{stat.count} leads</Badge>
                    <span className="text-sm text-muted-foreground">
                      {totalLeads > 0 ? ((stat.count / totalLeads) * 100).toFixed(1) : '0.0'}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...new Set(leads.map(lead => lead.assigned_to))].map((teamMember) => {
                const memberLeads = leads.filter(lead => lead.assigned_to === teamMember)
                const memberWon = memberLeads.filter(lead => lead.status === 'Won').length
                const memberConversion = memberLeads.length > 0 ? ((memberWon / memberLeads.length) * 100).toFixed(1) : '0.0'
                
                return (
                  <div key={teamMember} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{teamMember}</h4>
                      <p className="text-sm text-muted-foreground">
                        {memberLeads.length} total leads • {memberWon} won
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{memberConversion}%</div>
                      <p className="text-xs text-muted-foreground">Conversion rate</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </CRMLayout>
  )
}