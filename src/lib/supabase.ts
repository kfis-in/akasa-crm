import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://llkgrbmxpzdpqvazpxqv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsa2dyYm14cHpkcHF2YXpweHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTE3NDMsImV4cCI6MjA3MjM4Nzc0M30.oyaA-Kd4QWi338R-MysRYYh7yjBLygAXVg99uOtwn0k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  status: LeadStatus
  assigned_to: string
  created_at: string
  updated_at: string
}

export type LeadStatus = 'New' | 'Contacted' | 'In Progress' | 'Won' | 'Lost'

export interface CreateLeadData {
  name: string
  email: string
  phone: string
  status: LeadStatus
  assigned_to: string
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  id: string
}