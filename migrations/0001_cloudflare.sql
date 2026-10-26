CREATE TABLE users (id TEXT PRIMARY KEY NOT NULL, name TEXT, email TEXT UNIQUE COLLATE NOCASE NOT NULL, emailVerified TEXT, image TEXT, password_hash TEXT, session_version INTEGER NOT NULL DEFAULT 0);
CREATE TABLE accounts (id TEXT PRIMARY KEY NOT NULL, userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, type TEXT NOT NULL, provider TEXT NOT NULL, providerAccountId TEXT NOT NULL, refresh_token TEXT, access_token TEXT, expires_at INTEGER, token_type TEXT, scope TEXT, id_token TEXT, session_state TEXT, oauth_token TEXT, oauth_token_secret TEXT, UNIQUE(provider, providerAccountId));
CREATE TABLE sessions (id TEXT PRIMARY KEY NOT NULL, sessionToken TEXT UNIQUE NOT NULL, userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires TEXT NOT NULL);
CREATE TABLE verification_tokens (identifier TEXT NOT NULL, token TEXT NOT NULL, expires TEXT NOT NULL, PRIMARY KEY(identifier, token));
CREATE TABLE auth_tokens (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, purpose TEXT NOT NULL CHECK(purpose IN ('verify','reset')), expires_at INTEGER NOT NULL);
CREATE INDEX auth_tokens_user ON auth_tokens(user_id, purpose);
CREATE TABLE rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL);
CREATE TABLE profiles (
  id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  username TEXT UNIQUE, full_name TEXT, avatar_url TEXT, website TEXT,
  stripe_customer_id TEXT, stripe_subscription_id TEXT, stripe_price_id TEXT, stripe_current_period_end TEXT,
  trial_ends_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now','+14 days')),
  onboarding_completed INTEGER NOT NULL DEFAULT 0 CHECK(onboarding_completed IN (0,1)), onboarding_completed_at TEXT
);
CREATE TRIGGER user_profile AFTER INSERT ON users BEGIN
  INSERT INTO profiles(id, full_name, avatar_url) VALUES(new.id, new.name, new.image);
END;
CREATE TABLE businesses (
  id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL REFERENCES users(id), name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
  description TEXT, category TEXT, address TEXT, phone TEXT, email TEXT, website TEXT,
  social_links TEXT NOT NULL DEFAULT '{}', images TEXT NOT NULL DEFAULT '[]', google_place_id TEXT, place_data TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX businesses_owner ON businesses(user_id);
CREATE TABLE services (
  id TEXT PRIMARY KEY NOT NULL, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL, description TEXT, price REAL, duration INTEGER, image_url TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX services_business ON services(business_id);
CREATE TABLE working_hours (
  id TEXT PRIMARY KEY NOT NULL, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6), open_time TEXT, close_time TEXT,
  is_closed INTEGER NOT NULL DEFAULT 0 CHECK(is_closed IN (0,1)), created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), UNIQUE(business_id, day_of_week)
);
CREATE TABLE business_sections (
  id TEXT PRIMARY KEY NOT NULL, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  type TEXT NOT NULL, content TEXT NOT NULL DEFAULT '{}', order_index INTEGER NOT NULL DEFAULT 0,
  is_visible INTEGER NOT NULL DEFAULT 1 CHECK(is_visible IN (0,1)), status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('draft','review','published')),
  last_edited_by TEXT REFERENCES users(id), created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX sections_business ON business_sections(business_id, order_index);
CREATE TABLE team_members (
  id TEXT PRIMARY KEY NOT NULL, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id), role TEXT NOT NULL DEFAULT 'editor' CHECK(role IN ('owner','admin','editor','viewer')),
  invited_email TEXT, status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','pending','inactive')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), UNIQUE(business_id, user_id)
);
CREATE INDEX team_user ON team_members(user_id, status);
CREATE TABLE leads (
  id TEXT PRIMARY KEY NOT NULL, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, message TEXT, status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','closed')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX leads_business ON leads(business_id, created_at);
CREATE TABLE calendar_events (
  id TEXT PRIMARY KEY NOT NULL, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL, start_time TEXT NOT NULL, end_time TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'general', created_by TEXT REFERENCES users(id), created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX calendar_business ON calendar_events(business_id, start_time);
CREATE TABLE analytics_events (
  id TEXT PRIMARY KEY NOT NULL, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, path TEXT, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX analytics_business ON analytics_events(business_id, created_at);
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY NOT NULL, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id), action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT, details TEXT, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX audit_business ON audit_logs(business_id, created_at);
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL REFERENCES users(id), stripe_customer_id TEXT, stripe_subscription_id TEXT,
  status TEXT CHECK(status IN ('active','past_due','canceled','incomplete','trialing')), plan_id TEXT, current_period_end TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE business_domains (
  id TEXT PRIMARY KEY NOT NULL, business_id TEXT NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  hostname TEXT NOT NULL UNIQUE CHECK(hostname = lower(hostname)), status TEXT NOT NULL DEFAULT 'pending_dns' CHECK(status IN ('pending_dns','pending_ssl','active','moved','error')),
  verification_method TEXT NOT NULL DEFAULT 'txt' CHECK(verification_method IN ('txt','http')),
  cloudflare_custom_hostname_id TEXT UNIQUE, cloudflare_ssl_status TEXT, cloudflare_ssl_method TEXT,
  cloudflare_ownership_verification TEXT NOT NULL DEFAULT '{}', cloudflare_verification_errors TEXT NOT NULL DEFAULT '[]', cloudflare_ssl_validation_records TEXT NOT NULL DEFAULT '[]',
  verification_record_name TEXT, verification_record_value TEXT, activated_at TEXT, last_checked_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE business_generation_usage (
  id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL REFERENCES users(id), business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK(source_type IN ('google','url')), created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX generation_user_month ON business_generation_usage(user_id, created_at);
