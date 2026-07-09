-- Create the cms_data table
CREATE TABLE IF NOT EXISTS public.cms_data (
  id TEXT PRIMARY KEY DEFAULT 'main',
  animals JSONB NOT NULL,
  memories JSONB NOT NULL,
  dialogues JSONB NOT NULL,
  quiz_questions JSONB NOT NULL,
  spin_rewards JSONB NOT NULL,
  surprises JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Grant permissions to public
GRANT SELECT ON public.cms_data TO anon;
GRANT SELECT, UPDATE, INSERT ON public.cms_data TO authenticated;
GRANT ALL ON public.cms_data TO service_role;

-- Enable Row Level Security
ALTER TABLE public.cms_data ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous guests) to read the configuration
CREATE POLICY "CMS data is publicly readable"
  ON public.cms_data FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated admins to update/insert the configuration
CREATE POLICY "Admins can update CMS data"
  ON public.cms_data FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
