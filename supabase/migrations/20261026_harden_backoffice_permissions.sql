-- Align direct Supabase access with the backoffice permission policy.
-- This does not grant team members new content/settings write permissions.
begin;

create or replace function public.is_active_business_member(target_business_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1 from public.team_members
    where business_id = target_business_id
      and user_id = auth.uid()
      and status = 'active'
      and role in ('admin', 'editor', 'viewer')
  );
$$;

create or replace function public.can_manage_business_calendar(target_business_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1 from public.businesses
    where id = target_business_id and user_id = auth.uid()
  ) or exists (
    select 1 from public.team_members
    where business_id = target_business_id
      and user_id = auth.uid()
      and status = 'active'
      and role in ('admin', 'editor')
  );
$$;

drop policy if exists "Sections are viewable by everyone." on public.business_sections;
create policy "Published sections are public; active teams can read drafts."
on public.business_sections for select using (
  (is_visible = true and status = 'published')
  or exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  or public.is_active_business_member(business_id)
);

drop policy if exists "Calendar events are viewable by business owners and team." on public.calendar_events;
create policy "Calendar events are readable by active teams."
on public.calendar_events for select using (
  exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  or public.is_active_business_member(business_id)
);

drop policy if exists "Calendar events are manageble by business owners and team." on public.calendar_events;
create policy "Calendar writes require an active editing role."
on public.calendar_events for all
using (public.can_manage_business_calendar(business_id))
with check (public.can_manage_business_calendar(business_id));

drop policy if exists "Analytics are viewable by business owners and team." on public.analytics_events;
create policy "Analytics are readable by active teams."
on public.analytics_events for select using (
  exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  or public.is_active_business_member(business_id)
);

drop policy if exists "Audit logs are viewable by business owners and team." on public.audit_logs;
create policy "Audit logs are readable by active teams."
on public.audit_logs for select using (
  exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  or public.is_active_business_member(business_id)
);

commit;
