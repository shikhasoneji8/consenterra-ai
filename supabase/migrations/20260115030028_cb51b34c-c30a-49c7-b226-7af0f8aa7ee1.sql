-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  linkedin_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert applications (public form)
CREATE POLICY "Anyone can submit job applications"
ON public.job_applications
FOR INSERT
WITH CHECK (true);

-- Only allow authenticated admins to view (for now, no one can read - admin access via dashboard)
-- This keeps applications private

-- Add index for sorting by date
CREATE INDEX idx_job_applications_created_at ON public.job_applications(created_at DESC);