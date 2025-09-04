import { CRMLayout } from '@/components/crm/CRMLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRealTimeLeads } from '@/hooks/useRealTimeLeads'
import { LeadStatusBadge } from '@/components/crm/LeadStatusBadge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GitBranch, ArrowRight, Users, Mail, Phone, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LeadStatus } from '@/lib/supabase'

const statusOrder: LeadStatus[] = ['New', 'Contacted', 'In Progress', 'Won', 'Lost']

export default function Pipeline() {
  const { leads, isLoading } = useRealTimeLeads()

  if (isLoading) {
    return (
      <CRMLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CRMLayout>
    )
  }

  const getLeadsByStatus = (status: LeadStatus) => {
    return leads.filter(lead => lead.status === status)
  }

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'New': return 'bg-blue-50 border-blue-200'
      case 'Contacted': return 'bg-yellow-50 border-yellow-200'
      case 'In Progress': return 'bg-orange-50 border-orange-200'
      case 'Won': return 'bg-green-50 border-green-200'
      case 'Lost': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <GitBranch className="h-8 w-8 text-primary" />
              Sales Pipeline
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualize your leads through the sales process
            </p>
          </div>
          <Button asChild>
            <Link to="/leads/new" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Lead
            </Link>
          </Button>
        </div>

        {/* Pipeline Summary */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {statusOrder.map((status) => {
            const statusLeads = getLeadsByStatus(status)
            return (
              <Card key={status} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{statusLeads.length}</div>
                  <LeadStatusBadge status={status} />
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pipeline Board */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {statusOrder.map((status, index) => {
            const statusLeads = getLeadsByStatus(status)
            
            return (
              <div key={status} className="space-y-4">
                {/* Column Header */}
                <Card className={`${getStatusColor(status)}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LeadStatusBadge status={status} />
                        <Badge variant="secondary" className="text-xs">
                          {statusLeads.length}
                        </Badge>
                      </div>
                      {index < statusOrder.length - 2 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </Card>

                {/* Lead Cards */}
                <div className="space-y-3 min-h-[400px]">
                  {statusLeads.map((lead) => (
                    <Card key={lead.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm mb-2">{lead.name}</h4>
                        
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span>{lead.phone}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <span>{lead.assigned_to}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-border">
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                          {lead.updated_at !== lead.created_at && (
                            <div className="text-xs text-muted-foreground">
                              Updated: {new Date(lead.updated_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {statusLeads.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </CRMLayout>
  )
}