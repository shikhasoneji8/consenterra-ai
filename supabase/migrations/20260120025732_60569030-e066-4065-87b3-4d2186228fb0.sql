-- Create enum for pitch stage
CREATE TYPE public.pitch_stage AS ENUM ('mvp', 'pre_seed', 'seed', 'growth');

-- Create enum for deal status
CREATE TYPE public.deal_status AS ENUM ('draft', 'accepted', 'declined', 'paid');

-- Create pitches table
CREATE TABLE public.pitches (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    raw_pitch_text TEXT NOT NULL,
    startup_name TEXT,
    stage pitch_stage,
    arr NUMERIC,
    mrr NUMERIC,
    ask_amount NUMERIC NOT NULL,
    equity_percent NUMERIC NOT NULL,
    parsed_json JSONB
);

-- Create panels table
CREATE TABLE public.panels (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pitch_id UUID REFERENCES public.pitches(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    personas JSONB NOT NULL DEFAULT '[]'::jsonb,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    offers JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Create deals table
CREATE TABLE public.deals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    panel_id UUID REFERENCES public.panels(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status deal_status NOT NULL DEFAULT 'draft',
    deal_terms JSONB NOT NULL DEFAULT '{}'::jsonb,
    checkout_url TEXT
);

-- Enable RLS
ALTER TABLE public.pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Pitches policies
CREATE POLICY "Users can view their own pitches"
ON public.pitches FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create pitches"
ON public.pitches FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own pitches"
ON public.pitches FOR UPDATE
USING (auth.uid() = user_id OR user_id IS NULL);

-- Panels policies (access via pitch ownership)
CREATE POLICY "Users can view panels for their pitches"
ON public.panels FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.pitches 
    WHERE pitches.id = panels.pitch_id 
    AND (pitches.user_id = auth.uid() OR pitches.user_id IS NULL)
));

CREATE POLICY "Users can create panels for their pitches"
ON public.panels FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.pitches 
    WHERE pitches.id = panels.pitch_id 
    AND (pitches.user_id = auth.uid() OR pitches.user_id IS NULL)
));

CREATE POLICY "Users can update panels for their pitches"
ON public.panels FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.pitches 
    WHERE pitches.id = panels.pitch_id 
    AND (pitches.user_id = auth.uid() OR pitches.user_id IS NULL)
));

-- Deals policies (access via panel/pitch ownership)
CREATE POLICY "Users can view deals for their panels"
ON public.deals FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.panels 
    JOIN public.pitches ON pitches.id = panels.pitch_id
    WHERE panels.id = deals.panel_id 
    AND (pitches.user_id = auth.uid() OR pitches.user_id IS NULL)
));

CREATE POLICY "Users can create deals for their panels"
ON public.deals FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.panels 
    JOIN public.pitches ON pitches.id = panels.pitch_id
    WHERE panels.id = deals.panel_id 
    AND (pitches.user_id = auth.uid() OR pitches.user_id IS NULL)
));

CREATE POLICY "Users can update deals for their panels"
ON public.deals FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.panels 
    JOIN public.pitches ON pitches.id = panels.pitch_id
    WHERE panels.id = deals.panel_id 
    AND (pitches.user_id = auth.uid() OR pitches.user_id IS NULL)
));