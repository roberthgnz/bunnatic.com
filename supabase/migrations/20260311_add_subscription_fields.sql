-- Add subscription fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
ADD COLUMN IF NOT EXISTS stripe_price_id text,
ADD COLUMN IF NOT EXISTS stripe_current_period_end timestamp with time zone,
ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone DEFAULT (now() + interval '14 days');

-- Update the handle_new_user function to set trial_ends_at explicitly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, trial_ends_at)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    (now() + interval '14 days')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
