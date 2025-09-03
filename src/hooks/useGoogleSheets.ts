import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import type { Lead } from '@/lib/supabase'

export function useGoogleSheets() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const backupToSheets = async (leads: Lead[], webhookUrl: string) => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please configure your Google Sheets webhook URL in settings",
        variant: "destructive",
      })
      return false
    }

    setIsLoading(true)

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          leads: leads.map(lead => ({
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            status: lead.status,
            assigned_to: lead.assigned_to,
            created_at: lead.created_at,
            updated_at: lead.updated_at
          })),
          backup_type: 'full_sync'
        }),
      })

      toast({
        title: "Backup Complete",
        description: `Successfully backed up ${leads.length} leads to Google Sheets`,
      })

      return true
    } catch (error) {
      console.error('Error backing up to Google Sheets:', error)
      toast({
        title: "Backup Failed",
        description: "Failed to backup data to Google Sheets. Please check your webhook URL.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const syncSingleLead = async (lead: Lead, webhookUrl: string) => {
    if (!webhookUrl) return

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          leads: [lead],
          backup_type: 'single_update'
        }),
      })
    } catch (error) {
      console.error('Error syncing lead to Google Sheets:', error)
    }
  }

  return {
    backupToSheets,
    syncSingleLead,
    isLoading
  }
}