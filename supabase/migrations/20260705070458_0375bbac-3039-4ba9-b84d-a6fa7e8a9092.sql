
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Submission status enum
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Found friends submissions
CREATE TABLE public.found_friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  location TEXT NOT NULL,
  story TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  video_url TEXT,
  status submission_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.found_friends TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.found_friends TO authenticated;
GRANT ALL ON public.found_friends TO service_role;

ALTER TABLE public.found_friends ENABLE ROW LEVEL SECURITY;

-- Public can read approved submissions
CREATE POLICY "Approved submissions are public"
  ON public.found_friends FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Submitter can view own submissions (any status)
CREATE POLICY "Users can view own submissions"
  ON public.found_friends FOR SELECT
  TO authenticated
  USING (auth.uid() = submitted_by);

-- Admins can view everything
CREATE POLICY "Admins can view all submissions"
  ON public.found_friends FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Signed-in users can submit
CREATE POLICY "Users can insert own submissions"
  ON public.found_friends FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by AND status = 'pending');

-- Only admins can update (approve/reject)
CREATE POLICY "Admins can update submissions"
  ON public.found_friends FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete submissions"
  ON public.found_friends FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated-at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_found_friends_updated_at
  BEFORE UPDATE ON public.found_friends
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage RLS: public read, authenticated write to own folder
-- Buckets are created via the storage tool separately.
CREATE POLICY "Public can read pawbook media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('animal-photos', 'memory-photos', 'pawbook-videos'));

CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('animal-photos', 'memory-photos', 'pawbook-videos')
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own uploads"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('animal-photos', 'memory-photos', 'pawbook-videos')
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own uploads"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('animal-photos', 'memory-photos', 'pawbook-videos')
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins can delete any pawbook media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('animal-photos', 'memory-photos', 'pawbook-videos')
    AND public.has_role(auth.uid(), 'admin')
  );
