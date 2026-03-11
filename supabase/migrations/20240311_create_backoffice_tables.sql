-- Create a table for services
create table services (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10, 2),
  duration integer, -- in minutes
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for leads (contact form submissions)
create table leads (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  email text not null,
  phone text,
  message text,
  status text default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for working hours
create table working_hours (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  day_of_week integer check (day_of_week between 0 and 6), -- 0 = Sunday, 1 = Monday, etc.
  open_time time,
  close_time time,
  is_closed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(business_id, day_of_week)
);

-- Create a table for subscriptions
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text check (status in ('active', 'past_due', 'canceled', 'incomplete', 'trialing')),
  plan_id text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table services enable row level security;
alter table leads enable row level security;
alter table working_hours enable row level security;
alter table subscriptions enable row level security;

-- Policies for Services
create policy "Services are viewable by everyone." on services for select using (true);
create policy "Users can insert services for their own businesses." on services for insert with check (exists (select 1 from businesses where id = business_id and user_id = auth.uid()));
create policy "Users can update services for their own businesses." on services for update using (exists (select 1 from businesses where id = business_id and user_id = auth.uid()));
create policy "Users can delete services for their own businesses." on services for delete using (exists (select 1 from businesses where id = business_id and user_id = auth.uid()));

-- Policies for Leads
create policy "Leads are insertable by everyone." on leads for insert with check (true);
create policy "Users can view leads for their own businesses." on leads for select using (exists (select 1 from businesses where id = business_id and user_id = auth.uid()));
create policy "Users can update leads for their own businesses." on leads for update using (exists (select 1 from businesses where id = business_id and user_id = auth.uid()));

-- Policies for Working Hours
create policy "Working hours are viewable by everyone." on working_hours for select using (true);
create policy "Users can manage working hours for their own businesses." on working_hours for all using (exists (select 1 from businesses where id = business_id and user_id = auth.uid()));

-- Policies for Subscriptions
create policy "Users can view their own subscription." on subscriptions for select using (auth.uid() = user_id);
-- Only service_role should be able to insert/update subscriptions usually (via webhooks), but for now allow users to read.
