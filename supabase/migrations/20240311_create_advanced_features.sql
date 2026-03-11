-- Create a table for audit logs
create table audit_logs (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  action text not null, -- 'create', 'update', 'delete', 'publish'
  entity_type text not null, -- 'section', 'service', 'settings', 'team'
  entity_id text,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table audit_logs enable row level security;

create policy "Audit logs are viewable by business owners and team." on audit_logs 
  for select using (
    exists (
      select 1 from businesses where id = business_id and user_id = auth.uid()
    ) OR
    exists (
      select 1 from team_members where business_id = audit_logs.business_id and user_id = auth.uid()
    )
  );

-- Create a table for calendar events
create table calendar_events (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  title text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  type text default 'general', -- 'meeting', 'deadline', 'promo'
  created_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table calendar_events enable row level security;

create policy "Calendar events are viewable by business owners and team." on calendar_events 
  for select using (
    exists (
      select 1 from businesses where id = business_id and user_id = auth.uid()
    ) OR
    exists (
      select 1 from team_members where business_id = calendar_events.business_id and user_id = auth.uid()
    )
  );

create policy "Calendar events are manageble by business owners and team." on calendar_events 
  for all using (
    exists (
      select 1 from businesses where id = business_id and user_id = auth.uid()
    ) OR
    exists (
      select 1 from team_members where business_id = calendar_events.business_id and user_id = auth.uid()
    )
  );

-- Add status to sections for review workflow
alter table business_sections add column if not exists status text default 'published' check (status in ('draft', 'review', 'published'));
alter table business_sections add column if not exists last_edited_by uuid references auth.users;
