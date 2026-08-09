-- Add email confirmation tracking to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN NOT NULL DEFAULT false;

-- Replace the signup trigger so it also writes display_name and email_confirmed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    email,
    display_name,
    email_confirmed
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NULL),
    NEW.email_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sync profile when auth.users is updated (e.g., email confirmed, display name changed)
CREATE OR REPLACE FUNCTION public.handle_user_updated()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    email = NEW.email,
    display_name = COALESCE(NEW.raw_user_meta_data->>'display_name', display_name),
    email_confirmed = NEW.email_confirmed_at IS NOT NULL,
    updated_at = now()
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the signup trigger is attached and the update trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_updated();

-- Backfill email_confirmed for existing profiles based on auth.users state
UPDATE public.profiles AS p
SET email_confirmed = u.email_confirmed_at IS NOT NULL,
    email = COALESCE(u.email, p.email),
    display_name = COALESCE(p.display_name, u.raw_user_meta_data->>'display_name')
FROM auth.users AS u
WHERE p.user_id = u.id;
