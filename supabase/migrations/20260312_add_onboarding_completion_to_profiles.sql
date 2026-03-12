ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamp with time zone;

UPDATE public.profiles p
SET
  onboarding_completed = true,
  onboarding_completed_at = COALESCE(p.onboarding_completed_at, now())
WHERE
  p.onboarding_completed = false
  AND EXISTS (
    SELECT 1
    FROM public.businesses b
    WHERE b.user_id = p.id
  );
