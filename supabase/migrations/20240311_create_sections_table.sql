-- Create a table for business sections (content blocks)
create table business_sections (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  type text not null, -- 'hero', 'about', 'services', 'reviews', 'contact', 'gallery', 'custom'
  content jsonb default '{}'::jsonb, -- Flexible content storage
  order_index integer not null default 0,
  is_visible boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table business_sections enable row level security;

-- Policies
create policy "Sections are viewable by everyone." on business_sections for select using (true);
create policy "Users can manage sections for their own businesses." on business_sections using (exists (select 1 from businesses where id = business_id and user_id = auth.uid())) with check (exists (select 1 from businesses where id = business_id and user_id = auth.uid()));

-- Add google_place_id to businesses if not exists
alter table businesses add column if not exists google_place_id text;
alter table businesses add column if not exists place_data jsonb; -- Store raw Google data for reference/updates
