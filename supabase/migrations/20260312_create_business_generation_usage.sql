create table if not exists business_generation_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  business_id uuid references businesses(id) on delete cascade not null,
  source_type text not null check (source_type in ('google', 'url')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_business_generation_usage_user_month
  on business_generation_usage (user_id, created_at desc);

create index if not exists idx_business_generation_usage_business
  on business_generation_usage (business_id);

alter table business_generation_usage enable row level security;

create policy "Users can view their own generation usage."
  on business_generation_usage
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generation usage."
  on business_generation_usage
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from businesses
      where businesses.id = business_generation_usage.business_id
      and businesses.user_id = auth.uid()
    )
  );
