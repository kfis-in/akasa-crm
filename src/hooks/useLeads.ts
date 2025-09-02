import { useState, useEffect } from 'react'
import { supabase, Lead, CreateLeadData, UpdateLeadData } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all leads
  const fetchLeads = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching leads:', err)
      setError('Failed to fetch leads')
      toast({
        title: "Error",
        description: "Failed to fetch leads. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create new lead
  const createLead = async (leadData: CreateLeadData) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single()

      if (error) throw error

      setLeads(prev => [data, ...prev])
      toast({
        title: "Success",
        description: "Lead created successfully.",
      })
      return data
    } catch (err) {
      console.error('Error creating lead:', err)
      toast({
        title: "Error",
        description: "Failed to create lead. Please try again.",
        variant: "destructive",
      })
      throw err
    }
  }

  // Update existing lead
  const updateLead = async (leadData: UpdateLeadData) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          status: leadData.status,
          assigned_to: leadData.assigned_to,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadData.id)
        .select()
        .single()

      if (error) throw error

      setLeads(prev => prev.map(lead => 
        lead.id === leadData.id ? data : lead
      ))
      toast({
        title: "Success",
        description: "Lead updated successfully.",
      })
      return data
    } catch (err) {
      console.error('Error updating lead:', err)
      toast({
        title: "Error",
        description: "Failed to update lead. Please try again.",
        variant: "destructive",
      })
      throw err
    }
  }

  // Delete lead
  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)

      if (error) throw error

      setLeads(prev => prev.filter(lead => lead.id !== id))
      toast({
        title: "Success",
        description: "Lead deleted successfully.",
      })
    } catch (err) {
      console.error('Error deleting lead:', err)
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive",
      })
      throw err
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  return {
    leads,
    isLoading,
    error,
    createLead,
    updateLead,
    deleteLead,
    refetch: fetchLeads
  }
}