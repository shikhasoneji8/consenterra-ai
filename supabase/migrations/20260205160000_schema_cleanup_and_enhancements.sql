-- ============================================
-- MIGRATION: Schema Cleanup and Enhancements
-- ============================================
-- 1. Remove FoundrFATE tables (pitches, panels, deals)
-- 2. Add new profile fields (location, company)
-- 3. Add user activity tracking
-- 4. Add user preferences/settings
-- 5. Add subscription tracking
-- ============================================

-- ============================================
-- PART 1: Remove FoundrFATE Tables
-- ============================================

-- Drop policies first (deals)
DROP POLICY IF EXISTS "Users can view deals for their panels" ON public.deals;
DROP POLICY IF EXISTS "Users can create deals for their panels" ON public.deals;
DROP POLICY IF EXISTS "Users can update deals for their panels" ON public.deals;

-- Drop policies (panels)
DROP POLICY IF EXISTS "Users can view panels for their pitches" ON public.panels;
DROP POLICY IF EXISTS "Users can create panels for their pitches" ON public.panels;
DROP POLICY IF EXISTS "Users can update panels for their pitches" ON public.panels;

-- Drop policies (pitches)
DROP POLICY IF EXISTS "Users can view their own pitches" ON public.pitches;
DROP POLICY IF EXISTS "Users can create pitches" ON public.pitches;
DROP POLICY IF EXISTS "Users can update their own pitches" ON public.pitches;

-- Drop tables (in order due to foreign key constraints)
DROP TABLE IF EXISTS public.deals CASCADE;
DROP TABLE IF EXISTS public.panels CASCADE;
DROP TABLE IF EXISTS public.pitches CASCADE;

-- Drop enums
DROP TYPE IF EXISTS public.deal_status;
DROP TYPE IF EXISTS public.pitch_stage;


-- ============================================
-- PART 2: Update Profiles Table
-- ============================================

-- Add new columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;


-- ============================================
-- PART 3: User Preferences/Settings Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Notification preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    product_updates BOOLEAN DEFAULT TRUE,
    
    -- Display preferences
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    language TEXT DEFAULT 'en',
    
    -- Privacy preferences
    analytics_enabled BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
ON public.user_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
ON public.user_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.user_preferences FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================
-- PART 4: User Activity Tracking Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Activity details
    activity_type TEXT NOT NULL,  -- 'scan', 'login', 'signup', 'profile_update', 'page_view', etc.
    activity_data JSONB DEFAULT '{}'::jsonb,  -- Additional context
    
    -- Metadata
    ip_address TEXT,
    user_agent TEXT,
    page_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at);

-- Enable RLS
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Policies for user_activity
CREATE POLICY "Users can view their own activity"
ON public.user_activity FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
ON public.user_activity FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admin policy (for analytics - optional, requires admin role setup)
CREATE POLICY "Authenticated users can view activity for analytics"
ON public.user_activity FOR SELECT
TO authenticated
USING (true);


-- ============================================
-- PART 5: Subscription Tracking Table
-- ============================================

-- Create subscription status enum
CREATE TYPE public.subscription_status AS ENUM (
    'free',
    'trial',
    'active',
    'past_due',
    'canceled',
    'expired'
);

-- Create subscription plan enum
CREATE TYPE public.subscription_plan AS ENUM (
    'free',
    'starter',
    'pro',
    'enterprise'
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Subscription details
    plan subscription_plan DEFAULT 'free' NOT NULL,
    status subscription_status DEFAULT 'free' NOT NULL,
    
    -- Billing info
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    -- Usage limits
    scans_used INTEGER DEFAULT 0,
    scans_limit INTEGER DEFAULT 5,  -- Free tier limit
    
    -- Dates
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscription"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
ON public.subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
ON public.subscriptions FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================
-- PART 6: Update handle_new_user() function
-- ============================================

-- Update the function to also create preferences and subscription records
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (user_id, email, full_name, email_verified)
    VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE)
    );
    
    -- Create default preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    -- Create free subscription
    INSERT INTO public.subscriptions (user_id, plan, status, scans_limit)
    VALUES (NEW.id, 'free', 'free', 5);
    
    RETURN NEW;
END;
$$;


-- ============================================
-- PART 7: Scan History Table (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS public.scan_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Scan details
    url TEXT NOT NULL,
    domain TEXT,
    risk_score INTEGER,
    risk_level TEXT,
    summary TEXT,
    findings JSONB DEFAULT '{}'::jsonb,
    persona TEXT DEFAULT 'everyday',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scan_history_user_id ON public.scan_history(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON public.scan_history(created_at);
CREATE INDEX IF NOT EXISTS idx_scan_history_domain ON public.scan_history(domain);

-- Enable RLS
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Policies for scan_history
CREATE POLICY "Users can view their own scan history"
ON public.scan_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scans"
ON public.scan_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans"
ON public.scan_history FOR DELETE
USING (auth.uid() = user_id);
