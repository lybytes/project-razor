-- Harden the UPDATE row-level security policies on profiles and progress.
--
-- The original policies declared only a USING clause. Postgres falls back to
-- the USING expression for the WITH CHECK case when none is given, so ownership
-- was in fact enforced on the proposed row too — but relying on that implicit
-- behaviour is easy to break in a later edit. These policies state both clauses
-- explicitly so the intent is unambiguous: a user may update only rows they own
-- (USING), and may not rewrite a row to hand ownership to someone else
-- (WITH CHECK). Both expressions pin user_id to auth.uid().

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON public.progress;
CREATE POLICY "Users can update their own progress" ON public.progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
