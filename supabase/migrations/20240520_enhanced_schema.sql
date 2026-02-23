-- Migration: Enhanced Schema for SatuJuz
-- Ref: Goal 2 (Bulletproof completion logic) & Goal 4 (Daily Target)

-- 1) Settings table for user preferences
CREATE TABLE IF NOT EXISTS public.settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_target INT NOT NULL DEFAULT 1 CHECK (daily_target >= 1),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'settings_select_own') THEN
    CREATE POLICY "settings_select_own" ON public.settings FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'settings_insert_own') THEN
    CREATE POLICY "settings_insert_own" ON public.settings FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'settings_update_own') THEN
    CREATE POLICY "settings_update_own" ON public.settings FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- 2) Enhanced constraints for completion_items
-- NOTE: We use "ON CONFLICT" in the application to handle existing duplicates or prevent new ones.
-- This constraint ensures the DB is the source of truth.
ALTER TABLE public.completion_items 
ADD CONSTRAINT completion_items_unique_user_date_juz UNIQUE (user_id, date_id, juz_number);

-- Ensure correct indexes for performance (Goal 7)
CREATE INDEX IF NOT EXISTS completion_items_user_date_idx ON public.completion_items(user_id, date_id);
CREATE INDEX IF NOT EXISTS completion_items_date_id_idx ON public.completion_items(date_id);

-- 3) Badges Table (Goal 5)
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL, -- e.g. 'streak_7', 'khatam_1', 'monthly_hero'
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'badges_select_own') THEN
    CREATE POLICY "badges_select_own" ON public.badges FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'badges_insert_system') THEN
    -- In a real app, this might be restricted to a service role or a specific function,
    -- but for simplicity here we allow the user to insert if we want client-side logic to award them.
    -- Better practice: use a DB function. For now, allow user insert for matching parity with Guest logic.
    CREATE POLICY "badges_insert_own" ON public.badges FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- 4) Trigger to automatically refresh updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_settings_updated_at ON public.settings;
CREATE TRIGGER set_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
