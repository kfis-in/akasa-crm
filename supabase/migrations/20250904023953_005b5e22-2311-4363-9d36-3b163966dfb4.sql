-- Enable realtime for leads table
ALTER TABLE public.leads REPLICA IDENTITY FULL;

-- Add leads table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;