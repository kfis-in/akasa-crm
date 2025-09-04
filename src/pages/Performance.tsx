import { CRMLayout } from '@/components/crm/CRMLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRealTimeLeads } from '@/hooks/useRealTimeLeads'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Award, Target, Clock, Users, Star } from 'lucide-react'

export default function Performance() {
  const { leads, isLoading } = useRealTimeLeads()

  if (isLoading) {
    return (
      <CRMLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </CRMLayout>
    )
  }

  const totalLeads = leads.length
  const wonLeads = leads.filter(lead => lead.status === 'Won').length
  const lostLeads = leads.filter(lead => lead.status === 'Lost').length
  const inProgressLeads = leads.filter(lead => lead.status === 'In Progress').length
  
  const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0
  const lossRate = totalLeads > 0 ? (lostLeads / totalLeads) * 100 : 0
  const activeRate = totalLeads > 0 ? (inProgressLeads / totalLeads) * 100 : 0

  // Team performance calculations
  const teamMembers = [...new Set(leads.map(lead => lead.assigned_to))]
  const teamPerformance = teamMembers.map(member => {
    const memberLeads = leads.filter(lead => lead.assigned_to === member)
    const memberWon = memberLeads.filter(lead => lead.status === 'Won').length
    const memberTotal = memberLeads.length
    const memberConversion = memberTotal > 0 ? (memberWon / memberTotal) * 100 : 0
    
    return {
      name: member,
      totalLeads: memberTotal,
      wonLeads: memberWon,
      conversionRate: memberConversion,
      rank: 0 // Will be calculated after sorting
    }
  }).sort((a, b) => b.conversionRate - a.conversionRate)
  
  // Assign ranks
  teamPerformance.forEach((member, index) => {
    member.rank = index + 1
  })

  const topPerformer = teamPerformance[0]
  const avgConversion = teamPerformance.reduce((sum, member) => sum + member.conversionRate, 0) / teamPerformance.length

  // Recent activity (last 7 days)
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  const recentLeads = leads.filter(lead => new Date(lead.created_at) >= oneWeekAgo)
  const recentWins = leads.filter(lead => 
    lead.status === 'Won' && new Date(lead.updated_at) >= oneWeekAgo
  )

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            Performance Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track team performance and conversion metrics
          </p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {conversionRate.toFixed(1)}%
              </div>
              <Progress value={conversionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {wonLeads} of {totalLeads} leads converted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Pipeline</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {activeRate.toFixed(1)}%
              </div>
              <Progress value={activeRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {inProgressLeads} leads in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loss Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {lossRate.toFixed(1)}%
              </div>
              <Progress value={lossRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {lostLeads} leads lost
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{recentLeads.length}</div>
              <p className="text-xs text-muted-foreground">
                New leads this week
              </p>
              <div className="text-sm font-medium text-green-600 mt-1">
                {recentWins.length} wins this week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performer Card */}
        {topPerformer && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{topPerformer.name}</h3>
                  <p className="text-muted-foreground">
                    {topPerformer.wonLeads} wins from {topPerformer.totalLeads} leads
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {topPerformer.conversionRate.toFixed(1)}%
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    #1 Rank
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Performance Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPerformance.map((member) => (
                <div key={member.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={member.rank === 1 ? "default" : "secondary"}
                      className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                    >
                      {member.rank}
                    </Badge>
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {member.wonLeads} wins • {member.totalLeads} total leads
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right min-w-[120px]">
                    <div className="text-lg font-bold">
                      {member.conversionRate.toFixed(1)}%
                    </div>
                    <Progress 
                      value={member.conversionRate} 
                      className="w-20 h-2 mt-1" 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {teamPerformance.length > 1 && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Team Average Conversion Rate: <span className="font-semibold text-foreground">
                    {avgConversion.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CRMLayout>
  )
}