-- Create a table for team members
create table team_members (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  role text default 'editor' check (role in ('owner', 'admin', 'editor', 'viewer')),
  invited_email text, -- For pending invites
  status text default 'active' check (status in ('active', 'pending', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(business_id, user_id)
);

-- Enable RLS
alter table team_members enable row level security;

-- Policies
create policy "Team members are viewable by business owners and members." on team_members 
  for select using (
    exists (
      select 1 from businesses where id = business_id and user_id = auth.uid()
    ) OR 
    auth.uid() = user_id
  );

create policy "Business owners can manage team members." on team_members 
  for all using (
    exists (
      select 1 from businesses where id = business_id and user_id = auth.uid()
    )
  );

-- Create a table for analytics events (simple internal tracking)
create table analytics_events (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  event_type text not null, -- 'page_view', 'click', 'lead'
  path text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for analytics
alter table analytics_events enable row level security;

create policy "Analytics are insertable by public (anon)." on analytics_events 
  for insert with check (true);

create policy "Analytics are viewable by business owners and team." on analytics_events 
  for select using (
    exists (
      select 1 from businesses where id = business_id and user_id = auth.uid()
    ) OR
    exists (
      select 1 from team_members where business_id = analytics_events.business_id and user_id = auth.uid()
    )
  );
