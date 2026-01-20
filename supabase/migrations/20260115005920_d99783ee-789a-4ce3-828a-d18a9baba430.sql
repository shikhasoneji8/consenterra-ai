-- Create scan_history table
CREATE TABLE public.scan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  url TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  summary TEXT,
  findings JSONB,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own scan history
CREATE POLICY "Users can view their own scans"
ON public.scan_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own scans
CREATE POLICY "Users can insert their own scans"
ON public.scan_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own scans
CREATE POLICY "Users can delete their own scans"
ON public.scan_history
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_scan_history_user_id ON public.scan_history(user_id);
CREATE INDEX idx_scan_history_scanned_at ON public.scan_history(scanned_at DESC);