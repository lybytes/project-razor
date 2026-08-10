-- Add server-side validation and sanitization for display names.
-- This defends against SQL injection payloads, HTML/script injection, and control characters
-- even if a request bypasses the frontend whitelist. Supabase queries are already
-- parameterized, so SQL injection is not possible through the client; this adds a
-- defense-in-depth check at the data layer.

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS check_display_name_format;

ALTER TABLE public.profiles
  ADD CONSTRAINT check_display_name_format
  CHECK (
    display_name IS NULL
    OR display_name ~ $re$^[A-Za-z0-9'’ _-]{2,30}$$re$
  )
  NOT VALID;

CREATE OR REPLACE FUNCTION public.sanitize_display_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.display_name IS NOT NULL THEN
    NEW.display_name := regexp_replace(trim(NEW.display_name), '\s+', ' ', 'g');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS sanitize_profiles_display_name ON public.profiles;
CREATE TRIGGER sanitize_profiles_display_name
  BEFORE INSERT OR UPDATE OF display_name ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_display_name();
