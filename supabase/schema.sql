-- ============================================================
-- Habits Tracker — Supabase Schema
-- Execute no SQL Editor do seu projeto Supabase
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users profile ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  todoist_access_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile"
  ON public.profiles FOR ALL USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Areas ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#246fe0',
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own areas"
  ON public.areas FOR ALL USING (auth.uid() = user_id);

-- ─── Objectives ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  color TEXT NOT NULL DEFAULT '#058527',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own objectives"
  ON public.objectives FOR ALL USING (auth.uid() = user_id);

-- ─── Habits ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
  objective_id UUID REFERENCES public.objectives(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  metric_type TEXT NOT NULL DEFAULT 'binary'
    CHECK (metric_type IN ('binary', 'quantity', 'duration', 'rating', 'checklist', 'note')),
  metric_config JSONB NOT NULL DEFAULT '{}',
  frequency TEXT NOT NULL DEFAULT 'daily'
    CHECK (frequency IN ('daily', 'weekly', 'monthly', 'custom')),
  frequency_config JSONB NOT NULL DEFAULT '{}',
  color TEXT NOT NULL DEFAULT '#e34432',
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  order_index INTEGER NOT NULL DEFAULT 0,
  todoist_task_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own habits"
  ON public.habits FOR ALL USING (auth.uid() = user_id);

-- ─── Tracking entries ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tracking_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  tracked_date DATE NOT NULL,
  value JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (habit_id, tracked_date)
);

ALTER TABLE public.tracking_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tracking entries"
  ON public.tracking_entries FOR ALL USING (auth.uid() = user_id);

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_area_id ON public.habits(area_id);
CREATE INDEX IF NOT EXISTS idx_tracking_habit_date ON public.tracking_entries(habit_id, tracked_date);
CREATE INDEX IF NOT EXISTS idx_tracking_user_date ON public.tracking_entries(user_id, tracked_date);

-- ─── Updated_at trigger ──────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.areas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.objectives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tracking_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
