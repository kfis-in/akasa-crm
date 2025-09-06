-- Add user_id column to leads table for proper user association
ALTER TABLE public.leads ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing leads to have a temporary user_id (this will be properly assigned when users authenticate)
-- For now, we'll leave them NULL to prevent access until authentication is implemented

-- Drop all existing permissive RLS policies
DROP POLICY IF EXISTS "Allow public delete access" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert access" ON public.leads;
DROP POLICY IF EXISTS "Allow public read access" ON public.leads;
DROP POLICY IF EXISTS "Allow public update access" ON public.leads;

-- Create secure RLS policies that require authentication and user ownership
CREATE POLICY "Users can view their own leads" 
ON public.leads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" 
ON public.leads 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" 
ON public.leads 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create an index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);