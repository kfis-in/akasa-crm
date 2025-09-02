import { useState } from 'react'
import { CRMLayout } from '@/components/crm/CRMLayout'
import { LeadTable } from '@/components/crm/LeadTable'
import { LeadForm } from '@/components/crm/LeadForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useLeads } from '@/hooks/useLeads'
import { Lead, CreateLeadData, UpdateLeadData } from '@/lib/supabase'
import { Link } from 'react-router-dom'
import { Plus, Users, Eye, Mail, Phone, Calendar, User } from 'lucide-react'
import { LeadStatusBadge } from '@/components/crm/LeadStatusBadge'
import { format } from 'date-fns'

export default function Leads() {
  const { leads, isLoading, createLead, updateLead, deleteLead } = useLeads()
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [viewingLead, setViewingLead] = useState<Lead | null>(null)
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null)
  const [isFormLoading, setIsFormLoading] = useState(false)

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead)
  }

  const handleViewLead = (lead: Lead) => {
    setViewingLead(lead)
  }

  const handleDeleteLead = (id: string) => {
    setDeletingLeadId(id)
  }

  const confirmDeleteLead = async () => {
    if (deletingLeadId) {
      await deleteLead(deletingLeadId)
      setDeletingLeadId(null)
    }
  }

  const handleSubmitEdit = async (data: CreateLeadData | UpdateLeadData) => {
    setIsFormLoading(true)
    try {
      if (editingLead) {
        await updateLead(data as UpdateLeadData)
        setEditingLead(null)
      }
    } finally {
      setIsFormLoading(false)
    }
  }

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              All Leads
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your lead pipeline
            </p>
          </div>
          <Button asChild className="gap-2 shadow-elegant">
            <Link to="/leads/new">
              <Plus className="h-4 w-4" />
              Add New Lead
            </Link>
          </Button>
        </div>

        {/* Leads Table */}
        <LeadTable
          leads={leads}
          onEditLead={handleEditLead}
          onDeleteLead={handleDeleteLead}
          onViewLead={handleViewLead}
          isLoading={isLoading}
        />

        {/* Edit Lead Dialog */}
        <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Lead</DialogTitle>
            </DialogHeader>
            {editingLead && (
              <LeadForm
                lead={editingLead}
                onSubmit={handleSubmitEdit}
                onCancel={() => setEditingLead(null)}
                isLoading={isFormLoading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Lead Dialog */}
        <Dialog open={!!viewingLead} onOpenChange={() => setViewingLead(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Lead Details
              </DialogTitle>
            </DialogHeader>
            {viewingLead && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {viewingLead.name}
                    </span>
                    <LeadStatusBadge status={viewingLead.status} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{viewingLead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{viewingLead.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Assigned to: {viewingLead.assigned_to}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {format(new Date(viewingLead.created_at), 'PPP')}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          setViewingLead(null)
                          setEditingLead(viewingLead)
                        }}
                        className="flex-1"
                      >
                        Edit Lead
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setViewingLead(null)}
                        className="flex-1"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingLeadId} onOpenChange={() => setDeletingLeadId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this lead
                from your database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteLead} className="bg-destructive hover:bg-destructive/90">
                Delete Lead
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CRMLayout>
  )
}