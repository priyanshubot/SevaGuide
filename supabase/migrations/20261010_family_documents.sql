-- ==========================================================
-- SevaGuide: Family Document Management Schema Migration
-- ==========================================================

-- 1. FAMILY MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.family_members (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  management_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  date_of_birth DATE,
  email TEXT,
  phone TEXT,
  notes TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_management_id ON public.family_members(management_id);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Row Level Security: strict user isolation
CREATE POLICY "Users can view own family members"
  ON public.family_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own family members"
  ON public.family_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own family members"
  ON public.family_members FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own family members"
  ON public.family_members FOR DELETE
  USING (auth.uid() = user_id);


-- 2. FAMILY DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.family_documents (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_member_id TEXT NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Identity Proof',
    'Address Proof',
    'Birth Certificate',
    'Educational Certificate',
    'Income Certificate',
    'Other Documents'
  )),
  status TEXT NOT NULL DEFAULT 'Not Uploaded' CHECK (status IN (
    'Not Uploaded',
    'Pending Review',
    'Verified',
    'Needs Attention'
  )),
  file_name TEXT,
  storage_path TEXT,
  file_size BIGINT,
  notes TEXT,
  uploaded_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_family_documents_user_id ON public.family_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_family_documents_member_id ON public.family_documents(family_member_id);

ALTER TABLE public.family_documents ENABLE ROW LEVEL SECURITY;

-- Row Level Security: strict user isolation
CREATE POLICY "Users can view own family documents"
  ON public.family_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own family documents"
  ON public.family_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own family documents"
  ON public.family_documents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own family documents"
  ON public.family_documents FOR DELETE
  USING (auth.uid() = user_id);
