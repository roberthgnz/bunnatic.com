-- Run only in the disposable database created by check-backoffice-rls.py.
insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0000-000000000005'),
  ('00000000-0000-0000-0000-000000000006');
insert into businesses (id, user_id, name, slug) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Test A', 'test-a'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Test B', 'test-b');
insert into team_members (business_id, user_id, role, status) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'editor', 'active'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'viewer', 'active'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'editor', 'inactive'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'editor', 'pending');
insert into business_sections (business_id, type, status, is_visible) values
  ('10000000-0000-0000-0000-000000000001', 'hero', 'published', true),
  ('10000000-0000-0000-0000-000000000001', 'about', 'draft', true),
  ('10000000-0000-0000-0000-000000000001', 'contact', 'published', false),
  ('10000000-0000-0000-0000-000000000002', 'hero', 'draft', true);
insert into calendar_events (business_id, title, start_time, end_time) values
  ('10000000-0000-0000-0000-000000000001', 'A', now(), now() + interval '1 hour'),
  ('10000000-0000-0000-0000-000000000002', 'B', now(), now() + interval '1 hour');
insert into analytics_events (business_id, event_type) values
  ('10000000-0000-0000-0000-000000000001', 'page_view'),
  ('10000000-0000-0000-0000-000000000002', 'page_view');
insert into audit_logs (business_id, user_id, action, entity_type) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'create', 'section'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'create', 'section');

set role anon;
do $$ begin
  assert (select count(*) from business_sections) = 1, 'Anonymous readers must see only visible, published content.';
  assert (select count(*) from calendar_events) = 0, 'Anonymous calendar read leaked.';
  assert (select count(*) from audit_logs) = 0, 'Anonymous audit read leaked.';
  assert (select count(*) from analytics_events) = 0, 'Anonymous analytics read leaked.';
end $$;

reset role;
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000004', false);
do $$ begin
  assert (select count(*) from business_sections) = 3, 'Active viewer should see only its own shared drafts and public content.';
  assert (select count(*) from calendar_events) = 1, 'Cross-business calendar data leaked to viewer.';
  assert (select count(*) from analytics_events) = 1, 'Cross-business analytics data leaked.';
  assert (select count(*) from audit_logs) = 1, 'Cross-business audit data leaked.';
  begin
    insert into calendar_events (business_id, title, start_time, end_time) values ('10000000-0000-0000-0000-000000000001', 'denied', now(), now());
    raise exception 'Viewer calendar write unexpectedly allowed';
  exception when insufficient_privilege then null; end;
  begin
    insert into services (business_id, name) values ('10000000-0000-0000-0000-000000000001', 'denied');
    raise exception 'Viewer content write unexpectedly allowed';
  exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000003', false);
do $$ begin
  insert into calendar_events (business_id, title, start_time, end_time) values ('10000000-0000-0000-0000-000000000001', 'allowed', now(), now());
  assert (select count(*) from calendar_events) = 2, 'Active editor cannot manage its calendar.';
  begin
    insert into calendar_events (business_id, title, start_time, end_time) values ('10000000-0000-0000-0000-000000000002', 'denied', now(), now());
    raise exception 'Cross-business calendar write unexpectedly allowed';
  exception when insufficient_privilege then null; end;
  begin
    insert into services (business_id, name) values ('10000000-0000-0000-0000-000000000001', 'denied');
    raise exception 'Editor owner-only content write unexpectedly allowed';
  exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000005', false);
do $$ begin
  assert (select count(*) from business_sections) = 1, 'Inactive member can read drafts.';
  assert (select count(*) from calendar_events) = 0, 'Inactive member can read calendars.';
  assert (select count(*) from analytics_events) = 0, 'Inactive member can read analytics.';
  assert (select count(*) from audit_logs) = 0, 'Inactive member can read audit logs.';
  begin
    insert into calendar_events (business_id, title, start_time, end_time) values ('10000000-0000-0000-0000-000000000001', 'denied', now(), now());
    raise exception 'Inactive member write unexpectedly allowed';
  exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000006', false);
do $$ begin
  assert (select count(*) from business_sections) = 1, 'Pending member can read drafts.';
  assert (select count(*) from calendar_events) = 0, 'Pending member can read calendars.';
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', false);
do $$ begin
  assert (select count(*) from business_sections) = 3, 'Owner cannot read own drafts and hidden content.';
  insert into services (business_id, name) values ('10000000-0000-0000-0000-000000000001', 'allowed');
  assert (select count(*) from services) = 1, 'Owner cannot create services.';
  begin
    insert into services (business_id, name) values ('10000000-0000-0000-0000-000000000002', 'denied');
    raise exception 'Cross-business owner write unexpectedly allowed';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
select 'RLS verified: anonymous, owner, editor, viewer, inactive, pending and cross-business isolation.' as result;
