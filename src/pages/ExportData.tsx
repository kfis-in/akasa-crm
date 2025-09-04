import { CRMLayout } from '@/components/crm/CRMLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRealTimeLeads } from '@/hooks/useRealTimeLeads'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download, FileText, Calendar, Users, Filter, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { LeadStatus } from '@/lib/supabase'

export default function ExportData() {
  const { leads, isLoading } = useRealTimeLeads()
  const [exportOptions, setExportOptions] = useState({
    includeAll: true,
    statusFilter: [] as LeadStatus[],
    dateRange: 'all' as 'all' | 'thisMonth' | 'lastMonth' | 'thisYear'
  })

  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast({
        title: "No Data",
        description: "No leads available to export.",
        variant: "destructive"
      })
      return
    }

    // Filter leads based on options
    let filteredLeads = leads

    if (!exportOptions.includeAll && exportOptions.statusFilter.length > 0) {
      filteredLeads = leads.filter(lead => exportOptions.statusFilter.includes(lead.status))
    }

    if (exportOptions.dateRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (exportOptions.dateRange) {
        case 'thisMonth':
          filterDate.setMonth(now.getMonth(), 1)
          break
        case 'lastMonth':
          filterDate.setMonth(now.getMonth() - 1, 1)
          break
        case 'thisYear':
          filterDate.setFullYear(now.getFullYear(), 0, 1)
          break
      }
      
      filteredLeads = filteredLeads.filter(lead => new Date(lead.created_at) >= filterDate)
    }

    if (filteredLeads.length === 0) {
      toast({
        title: "No Data",
        description: "No leads match the selected filters.",
        variant: "destructive"
      })
      return
    }

    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Assigned To', 'Created At', 'Updated At']
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.phone}"`,
        `"${lead.status}"`,
        `"${lead.assigned_to}"`,
        `"${new Date(lead.created_at).toLocaleString()}"`,
        `"${new Date(lead.updated_at).toLocaleString()}"`
      ].join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: `${filteredLeads.length} leads exported to CSV.`
    })
  }

  const toggleStatusFilter = (status: LeadStatus) => {
    setExportOptions(prev => ({
      ...prev,
      statusFilter: prev.statusFilter.includes(status)
        ? prev.statusFilter.filter(s => s !== status)
        : [...prev.statusFilter, status]
    }))
  }

  const statusOptions: LeadStatus[] = ['New', 'Contacted', 'In Progress', 'Won', 'Lost']

  if (isLoading) {
    return (
      <CRMLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </CRMLayout>
    )
  }

  const getFilteredCount = () => {
    let filteredLeads = leads

    if (!exportOptions.includeAll && exportOptions.statusFilter.length > 0) {
      filteredLeads = leads.filter(lead => exportOptions.statusFilter.includes(lead.status))
    }

    if (exportOptions.dateRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (exportOptions.dateRange) {
        case 'thisMonth':
          filterDate.setMonth(now.getMonth(), 1)
          break
        case 'lastMonth':
          filterDate.setMonth(now.getMonth() - 1, 1)
          break
        case 'thisYear':
          filterDate.setFullYear(now.getFullYear(), 0, 1)
          break
      }
      
      filteredLeads = filteredLeads.filter(lead => new Date(lead.created_at) >= filterDate)
    }

    return filteredLeads.length
  }

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Download className="h-8 w-8 text-primary" />
            Export Data
          </h1>
          <p className="text-muted-foreground mt-1">
            Export your lead data in various formats
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Include All Toggle */}
              <div className="space-y-3">
                <h4 className="font-medium">Data Selection</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant={exportOptions.includeAll ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportOptions(prev => ({ ...prev, includeAll: !prev.includeAll }))}
                  >
                    {exportOptions.includeAll && <CheckCircle className="h-4 w-4 mr-1" />}
                    Include All Leads
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Status Filter */}
              {!exportOptions.includeAll && (
                <>
                  <div className="space-y-3">
                    <h4 className="font-medium">Filter by Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map(status => (
                        <Button
                          key={status}
                          variant={exportOptions.statusFilter.includes(status) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleStatusFilter(status)}
                          className="gap-1"
                        >
                          {exportOptions.statusFilter.includes(status) && <CheckCircle className="h-3 w-3" />}
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Date Range */}
              <div className="space-y-3">
                <h4 className="font-medium">Date Range</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: 'thisMonth', label: 'This Month' },
                    { value: 'lastMonth', label: 'Last Month' },
                    { value: 'thisYear', label: 'This Year' }
                  ].map(option => (
                    <Button
                      key={option.value}
                      variant={exportOptions.dateRange === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExportOptions(prev => ({ ...prev, dateRange: option.value as any }))}
                      className="gap-1"
                    >
                      {exportOptions.dateRange === option.value && <CheckCircle className="h-3 w-3" />}
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Export Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Statistics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Leads Available:</span>
                  <Badge variant="secondary">{leads.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Leads to Export:</span>
                  <Badge variant="default">{getFilteredCount()}</Badge>
                </div>
              </div>

              <Separator />

              {/* Export Format */}
              <div className="space-y-3">
                <h4 className="font-medium">Export Format</h4>
                <div className="p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">CSV (Comma Separated Values)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Includes: Name, Email, Phone, Status, Assigned To, Created At, Updated At
                  </p>
                </div>
              </div>

              <Separator />

              {/* Export Button */}
              <Button 
                onClick={handleExportCSV}
                className="w-full gap-2"
                disabled={getFilteredCount() === 0}
              >
                <Download className="h-4 w-4" />
                Export to CSV ({getFilteredCount()} leads)
              </Button>

              {getFilteredCount() === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  No leads match the selected filters
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Export History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Exports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Export history will appear here after your first export.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CRMLayout>
  )
}