import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CRMLayout } from '@/components/crm/CRMLayout'
import { LeadForm } from '@/components/crm/LeadForm'
import { useLeads } from '@/hooks/useLeads'
import { CreateLeadData } from '@/lib/supabase'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NewLead() {
  const navigate = useNavigate()
  const { createLead } = useLeads()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: CreateLeadData) => {
    setIsLoading(true)
    try {
      await createLead(data)
      navigate('/leads')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/leads')
  }

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/leads')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Leads
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-primary" />
            Add New Lead
          </h1>
          <p className="text-muted-foreground mt-1">
            Enter the details for your new lead prospect
          </p>
        </div>

        {/* Form */}
        <div className="max-w-4xl">
          <LeadForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </CRMLayout>
  )
}