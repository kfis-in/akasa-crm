-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Won', 'Lost')),
  assigned_to TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since no auth is implemented yet)
CREATE POLICY "Allow public read access" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.leads FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.leads (name, email, phone, status, assigned_to) VALUES
  ('John Smith', 'john.smith@email.com', '+1-555-0101', 'New', 'Sarah Smith'),
  ('Emily Johnson', 'emily.johnson@email.com', '+1-555-0102', 'Contacted', 'John Doe'),
  ('Michael Brown', 'michael.brown@email.com', '+1-555-0103', 'In Progress', 'Mike Johnson'),
  ('Sarah Wilson', 'sarah.wilson@email.com', '+1-555-0104', 'Won', 'Emily Brown'),
  ('David Miller', 'david.miller@email.com', '+1-555-0105', 'Lost', 'David Wilson'),
  ('Lisa Davis', 'lisa.davis@email.com', '+1-555-0106', 'New', 'Sarah Smith'),
  ('Robert Garcia', 'robert.garcia@email.com', '+1-555-0107', 'Contacted', 'John Doe'),
  ('Jennifer Martinez', 'jennifer.martinez@email.com', '+1-555-0108', 'In Progress', 'Mike Johnson'),
  ('William Anderson', 'william.anderson@email.com', '+1-555-0109', 'New', 'Emily Brown'),
  ('Jessica Taylor', 'jessica.taylor@email.com', '+1-555-0110', 'Won', 'David Wilson');