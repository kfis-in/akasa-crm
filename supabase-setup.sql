-- Lead CRM Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create the leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('New', 'Contacted', 'In Progress', 'Won', 'Lost')),
  assigned_to VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster searches
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Create an index on assigned_to for team filtering
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);

-- Insert dummy data for testing
INSERT INTO leads (name, email, phone, status, assigned_to) VALUES
  ('Alice Johnson', 'alice.johnson@email.com', '+1-555-0101', 'New', 'John Doe'),
  ('Bob Smith', 'bob.smith@company.com', '+1-555-0102', 'Contacted', 'Sarah Smith'),
  ('Carol Williams', 'carol.williams@business.com', '+1-555-0103', 'In Progress', 'Mike Johnson'),
  ('David Brown', 'david.brown@enterprise.com', '+1-555-0104', 'Won', 'John Doe'),
  ('Eva Davis', 'eva.davis@startup.com', '+1-555-0105', 'Lost', 'Emily Brown'),
  ('Frank Miller', 'frank.miller@tech.com', '+1-555-0106', 'New', 'David Wilson'),
  ('Grace Wilson', 'grace.wilson@innovate.com', '+1-555-0107', 'Contacted', 'Sarah Smith'),
  ('Henry Taylor', 'henry.taylor@solutions.com', '+1-555-0108', 'In Progress', 'Mike Johnson'),
  ('Ivy Anderson', 'ivy.anderson@digital.com', '+1-555-0109', 'Won', 'John Doe'),
  ('Jack Thompson', 'jack.thompson@consulting.com', '+1-555-0110', 'New', 'Emily Brown'),
  ('Karen Garcia', 'karen.garcia@services.com', '+1-555-0111', 'Contacted', 'David Wilson'),
  ('Luke Martinez', 'luke.martinez@agency.com', '+1-555-0112', 'In Progress', 'Sarah Smith'),
  ('Monica Rodriguez', 'monica.rodriguez@firm.com', '+1-555-0113', 'Won', 'Mike Johnson'),
  ('Nathan Lopez', 'nathan.lopez@corp.com', '+1-555-0114', 'Lost', 'John Doe'),
  ('Olivia Gonzalez', 'olivia.gonzalez@group.com', '+1-555-0115', 'New', 'Emily Brown')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- You can modify this based on your security requirements
CREATE POLICY "Allow all operations for authenticated users" ON leads
  FOR ALL USING (true);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on row updates
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();