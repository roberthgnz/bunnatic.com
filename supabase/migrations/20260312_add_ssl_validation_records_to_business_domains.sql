alter table if exists business_domains
  add column if not exists cloudflare_ssl_validation_records jsonb not null default '[]'::jsonb;
