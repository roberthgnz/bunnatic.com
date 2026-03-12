-- Custom domains connected through Cloudflare for SaaS
create table if not exists business_domains (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references businesses(id) on delete cascade not null unique,
  hostname text not null unique,
  status text not null default 'pending_dns' check (status in ('pending_dns', 'pending_ssl', 'active', 'moved', 'error')),
  verification_method text not null default 'txt' check (verification_method in ('txt', 'http')),
  cloudflare_custom_hostname_id text unique,
  cloudflare_ssl_status text,
  cloudflare_ssl_method text,
  cloudflare_ownership_verification jsonb not null default '{}'::jsonb,
  cloudflare_verification_errors jsonb not null default '[]'::jsonb,
  verification_record_name text,
  verification_record_value text,
  activated_at timestamp with time zone,
  last_checked_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  check (hostname = lower(hostname)),
  check (hostname ~ '^[a-z0-9.-]+$')
);

create index if not exists business_domains_status_idx on business_domains(status);

alter table business_domains enable row level security;

create policy "Business domains are viewable when active or member-owned." on business_domains
  for select using (
    status = 'active'
    or exists (
      select 1
      from businesses
      where businesses.id = business_domains.business_id
        and businesses.user_id = auth.uid()
    )
    or exists (
      select 1
      from team_members
      where team_members.business_id = business_domains.business_id
        and team_members.user_id = auth.uid()
        and team_members.status = 'active'
    )
  );

create policy "Business owners can insert business domains." on business_domains
  for insert with check (
    exists (
      select 1
      from businesses
      where businesses.id = business_domains.business_id
        and businesses.user_id = auth.uid()
    )
  );

create policy "Business owners can update business domains." on business_domains
  for update using (
    exists (
      select 1
      from businesses
      where businesses.id = business_domains.business_id
        and businesses.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from businesses
      where businesses.id = business_domains.business_id
        and businesses.user_id = auth.uid()
    )
  );

create policy "Business owners can delete business domains." on business_domains
  for delete using (
    exists (
      select 1
      from businesses
      where businesses.id = business_domains.business_id
        and businesses.user_id = auth.uid()
    )
  );
