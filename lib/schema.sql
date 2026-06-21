-- DROP EXISTING TABLES FOR CLEAN SLATE RE-RUN
drop table if exists property_catalog cascade;
drop table if exists rentals cascade;
drop table if exists properties cascade;
drop table if exists cms_content cascade;
drop table if exists announcements cascade;
drop table if exists fraud_logs cascade;
drop table if exists admin_logs cascade;
drop table if exists support_tickets cascade;
drop table if exists notifications cascade;
drop table if exists wallet_addresses cascade;
drop table if exists transactions cascade;
drop table if exists referrals cascade;
drop table if exists withdrawals cascade;
drop table if exists deposits cascade;
drop table if exists investments cascade;
drop table if exists investment_plans cascade;
drop table if exists users cascade;

-- USERS TABLE
create table users (
  id uuid references auth.users primary key,
  full_name text not null,
  email text unique not null,
  phone text,
  country text default 'Nigeria',
  password_hash text,
  avatar_url text,
  referral_code text unique,
  referred_by uuid,
  kyc_status text default 'pending',
  kyc_id_url text,
  kyc_selfie_url text,
  kyc_submitted_at timestamp,
  kyc_reviewed_at timestamp,
  account_status text default 'active',
  investor_level text default 'starter',
  total_invested decimal default 0,
  total_returns decimal default 0,
  wallet_balance decimal default 0,
  two_fa_enabled boolean default false,
  two_fa_secret text,
  last_login timestamp,
  login_ip text,
  created_at timestamp default now(),
  is_active boolean default true
);

-- INVESTMENT PLANS TABLE
create table investment_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  roi_percent decimal not null,
  duration_days integer not null,
  min_deposit decimal not null,
  max_deposit decimal,
  is_active boolean default true,
  is_featured boolean default false,
  icon text default '💼',
  created_at timestamp default now()
);

-- INVESTMENTS TABLE
create table investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  plan_id uuid references investment_plans(id),
  plan_name text not null check (plan_name in ('Starter Plan', 'Growth Plan', 'Premium Plan', 'Elite Plan', '7-Day Quick Plan', '30-Day Standard Plan', 'Foundation Plan', 'Growth Plan', 'Premium Plan', 'Elite Plan')),
  amount decimal not null,
  amount_usd decimal,
  roi_percent decimal not null,
  duration_days integer not null,
  daily_profit decimal,
  monthly_return decimal,
  total_profit decimal,
  total_return decimal,
  start_date timestamp default now(),
  end_date timestamp,
  maturity_date date,
  status text default 'active' check (status in ('active', 'matured', 'withdrawn', 'completed')),
  created_at timestamp default now()
);

-- DEPOSITS TABLE
create table deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  amount decimal not null,
  method text not null,
  wallet_address text,
  transaction_hash text,
  bank_reference text,
  proof_url text,
  status text default 'pending',
  confirmed_by uuid,
  confirmed_at timestamp,
  notes text,
  created_at timestamp default now()
);

-- WITHDRAWALS TABLE
create table withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  amount decimal not null,
  method text not null,
  wallet_address text,
  bank_name text,
  account_number text,
  cashapp_tag text,
  zelle_email text,
  status text default 'pending',
  approved_by uuid,
  approved_at timestamp,
  rejected_reason text,
  fraud_score integer default 0,
  created_at timestamp default now()
);

-- REFERRALS TABLE
create table referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references users(id) not null,
  referred_id uuid references users(id) not null,
  level integer default 1,
  commission_percent decimal default 5,
  commission_amount decimal default 0,
  investment_id uuid references investments(id),
  status text default 'pending',
  paid_at timestamp,
  created_at timestamp default now()
);

-- TRANSACTIONS TABLE
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  type text not null check (type in ('deposit', 'withdrawal', 'return', 'referral_bonus', 'withdrawal_hold')),
  amount decimal not null,
  method text check (method in ('cashapp', 'zelle', 'bitcoin', 'usdt', 'eth', 'wire', 'bank_transfer', 'credit_card')),
  reference text,
  proof_url text,
  status text default 'completed' check (status in ('pending', 'confirmed', 'rejected', 'completed')),
  balance_before decimal,
  balance_after decimal,
  description text,
  created_at timestamp default now()
);

-- WALLET ADDRESSES TABLE
create table wallet_addresses (
  id uuid primary key default gen_random_uuid(),
  currency text not null,
  network text,
  address text not null,
  label text,
  is_active boolean default true,
  created_at timestamp default now()
);

-- NOTIFICATIONS TABLE
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  title text not null,
  message text not null,
  type text default 'info',
  is_read boolean default false,
  is_broadcast boolean default false,
  created_at timestamp default now()
);

-- SUPPORT TICKETS TABLE
create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  subject text not null,
  message text not null,
  category text default 'general',
  status text default 'open',
  priority text default 'normal',
  admin_reply text,
  replied_at timestamp,
  created_at timestamp default now()
);

-- ADMIN LOGS TABLE
create table admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references users(id),
  action text not null,
  target_table text,
  target_id text,
  details jsonb,
  ip_address text,
  created_at timestamp default now()
);

-- FRAUD LOGS TABLE
create table fraud_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  event_type text not null,
  ip_address text,
  details jsonb,
  risk_score integer,
  created_at timestamp default now()
);

-- ANNOUNCEMENTS TABLE
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  type text default 'info',
  is_active boolean default true,
  target text default 'all',
  created_at timestamp default now()
);

-- CMS TABLE
create table cms_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  title text,
  content text,
  type text default 'text',
  is_published boolean default true,
  updated_at timestamp default now()
);

-- PROPERTIES TABLE
create table properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  property_name text not null,
  address text not null,
  city text,
  state text,
  type text check (type in ('commercial', 'standard', 'luxury')),
  price_usd decimal default 0,
  purchase_date date default current_date,
  status text check (status in ('payment_confirmed', 'documents_signed', 'under_construction', 'completed', 'title_transferred')),
  progress_percent integer default 0,
  estimated_completion date,
  created_at timestamp default now()
);

-- RENTALS TABLE
create table rentals (
  id uuid primary key default gen_random_uuid(),
  apartment_type text check (apartment_type in ('2bed', '3bed')),
  guest_name text not null,
  guest_email text not null,
  guest_phone text,
  checkin_date date not null,
  checkout_date date not null,
  duration_type text check (duration_type in ('daily', 'weekly', 'monthly', 'yearly')),
  total_price decimal default 0,
  status text default 'pending' check (status in ('pending', 'confirmed', 'checked_in', 'checked_out')),
  created_at timestamp default now()
);

-- PROPERTY CATALOG TABLE
create table property_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  type text not null,
  type_display text,
  price text,
  roi text,
  status text,
  image_url text,
  created_at timestamp default now()
);

-- Enable RLS for property_catalog
alter table property_catalog enable row level security;

-- Policy for select (public can view catalog)
create policy "catalog_public_select" on property_catalog
  for select using (true);

-- DEFAULT INVESTMENT PLANS
insert into investment_plans
  (name, description, roi_percent, duration_days, min_deposit, max_deposit, is_featured, icon)
values
  ('7-Day Quick Plan', 'Quick Returns. Perfect for short term needs.', 8, 7, 20000, 200000, false, '⚡'),
  ('30-Day Standard Plan', 'Perfect standard plan for monthly savings.', 15, 30, 50000, 1000000, false, '📅'),
  ('Foundation Plan', 'Steady capital growth with annual returns paid monthly.', 15, 90, 50000, 500000, false, '🧱'),
  ('Growth Plan', 'High yield balanced plan for consistent growth.', 20, 180, 100000, 2000000, false, '📈'),
  ('Premium Plan', 'Maximum returns for serious wealth generation.', 28, 365, 500000, 10000000, true, '💎'),
  ('Elite Plan', 'Exclusive plan for high-net-worth investors.', 35, 365, 2000000, 9999999999, false, '👑');

-- DEFAULT WALLET ADDRESSES
insert into wallet_addresses (currency, network, address, label)
values
  ('BTC', 'Bitcoin', 'YOUR_BITCOIN_ADDRESS', 'Bitcoin'),
  ('USDT', 'TRC20', 'YOUR_USDT_ADDRESS', 'USDT Tron'),
  ('ETH', 'Ethereum', 'YOUR_ETH_ADDRESS', 'Ethereum');

-- DEFAULT PROPERTIES FOR CATALOG
insert into property_catalog (name, location, type, type_display, price, roi, status)
values
  ('Williston Heights Phase 1', 'Awka Road, Onitsha, Anambra', 'Residential', 'Residential Duplexes', '₦8,500,000 / Unit', '28%', 'Open'),
  ('Williston Gardens Estate', 'Nnewi Road, Anambra', 'Residential', 'Residential Estates', '₦5,500,000 / Unit', '35%', 'Hot Deal'),
  ('Williston Commerce Plaza', 'Bridge Head, Onitsha, Anambra', 'Commercial', 'Mixed-Use Commercial', '₦15,000,000 / Unit', '22%', 'Open'),
  ('Williston Lekki Towers', 'Lekki Phase 1, Lagos', 'Commercial', 'Commercial Towers', '₦25,000,000 / Unit', '26%', 'Open'),
  ('Williston Abuja Estate', 'Gwarinpa, Abuja FCT', 'Residential', 'Residential Gardens', '₦18,000,000 / Unit', '22%', 'Hot Deal'),
  ('Williston PH Gardens', 'GRA Phase 2, Port Harcourt, Rivers', 'Residential', 'Residential Gardens', '₦12,000,000 / Unit', '24%', 'Open');

-- ROW LEVEL SECURITY
alter table users enable row level security;
alter table investments enable row level security;
alter table deposits enable row level security;
alter table withdrawals enable row level security;
alter table transactions enable row level security;
alter table notifications enable row level security;
alter table support_tickets enable row level security;
alter table referrals enable row level security;

create policy "users_own_data" on users
  for all using (auth.uid() = id);

create policy "investments_own_data" on investments
  for all using (auth.uid() = user_id);

create policy "deposits_own_data" on deposits
  for all using (auth.uid() = user_id);

create policy "withdrawals_own_data" on withdrawals
  for all using (auth.uid() = user_id);

create policy "transactions_own_data" on transactions
  for all using (auth.uid() = user_id);

create policy "notifications_own_data" on notifications
  for select using (auth.uid() = user_id or is_broadcast = true);

create policy "tickets_own_data" on support_tickets
  for all using (auth.uid() = user_id);

create policy "plans_public" on investment_plans
  for select using (is_active = true);

create policy "wallets_public" on wallet_addresses
  for select using (is_active = true);

create policy "announcements_public" on announcements
  for select using (is_active = true);

-- PROPERTIES POLICIES
alter table properties enable row level security;
create policy "properties_own_data" on properties
  for all using (auth.uid() = user_id);

-- RENTALS POLICIES
alter table rentals enable row level security;
create policy "rentals_insert_public" on rentals
  for insert with check (true);
create policy "rentals_select_public" on rentals
  for select using (true);

-- DEFAULT CMS CONTENT
insert into cms_content (key, title, content, type)
values 
  ('bank_name', 'Bank Name', 'OPay', 'text'),
  ('bank_account_number', 'Account Number', '9167455410', 'text'),
  ('bank_account_name', 'Account Name', 'Chukwuebuka Irenaus Onyegere', 'text'),
  ('bank_whatsapp', 'WhatsApp', '+2349167455410', 'text'),
  ('bank_ussd', 'USSD Code', '*955#', 'text')
on conflict (key) do update set
  content = excluded.content,
  updated_at = now();

