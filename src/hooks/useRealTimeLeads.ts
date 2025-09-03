import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { Lead, LeadStatus } from '@/lib/supabase'

export function useRealTimeLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initial fetch
    const fetchLeads = async () => {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        // Type assertion to ensure status is LeadStatus
        const typedData = (data || []).map(lead => ({
          ...lead,
          status: lead.status as LeadStatus
        }))
        setLeads(typedData)
      } catch (error) {
        console.error('Error fetching leads:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeads()

    // Set up real-time subscription
    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          console.log('Real-time update:', payload)
          
          if (payload.eventType === 'INSERT') {
            const newLead = { ...payload.new, status: payload.new.status as LeadStatus } as Lead
            setLeads(prev => [newLead, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            const updatedLead = { ...payload.new, status: payload.new.status as LeadStatus } as Lead
            setLeads(prev => prev.map(lead => 
              lead.id === updatedLead.id ? updatedLead : lead
            ))
          } else if (payload.eventType === 'DELETE') {
            setLeads(prev => prev.filter(lead => lead.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { leads, isLoading }
}