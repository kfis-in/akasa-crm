import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useUserRole } from '@/hooks/useUserRole'
import type { Lead, LeadStatus } from '@/lib/supabase'

export function useRealTimeLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { isAdmin } = useUserRole()

  useEffect(() => {
    if (!user) {
      setLeads([])
      setIsLoading(false)
      return
    }

    // Initial fetch (all leads for admin, user-specific for regular users)
    const fetchLeads = async () => {
      try {
        let query = supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })

        // Regular users only see their own leads, admins see all
        if (!isAdmin) {
          query = query.eq('user_id', user.id)
        }

        const { data, error } = await query

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
          table: 'leads',
          // Only filter by user_id if not admin
          ...(isAdmin ? {} : { filter: `user_id=eq.${user.id}` })
        },
        (payload) => {
          console.log('Real-time update:', payload)
          
          // For admins, show all changes; for users, only show their own
          const isRelevantChange = isAdmin || 
            (payload.new && 'user_id' in payload.new && payload.new.user_id === user.id) || 
            (payload.old && 'user_id' in payload.old && payload.old.user_id === user.id)
          
          if (!isRelevantChange) return
          
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
  }, [user, isAdmin])

  return { leads, isLoading }
}