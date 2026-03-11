-- Create a table for businesses
create table businesses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  slug text unique not null,
  description text,
  category text,
  address text,
  phone text,
  email text,
  website text,
  social_links jsonb default '{}'::jsonb,
  images text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table businesses enable row level security;

create policy "Businesses are viewable by everyone." on businesses
  for select using (true);

create policy "Users can insert their own businesses." on businesses
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own businesses." on businesses
  for update using (auth.uid() = user_id);

create policy "Users can delete their own businesses." on businesses
  for delete using (auth.uid() = user_id);
