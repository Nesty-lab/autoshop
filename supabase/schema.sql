-- ============================================================
-- Car Parts E-Commerce — Supabase Schema
-- Run this in the Supabase SQL editor (Project > SQL Editor)
-- ============================================================

-- 1. BRANDS (BMW, Toyota, Mercedes, etc.)
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  logo_url text,
  created_at timestamptz default now()
);

-- 2. MODELS (belongs to a brand — e.g. BMW -> M8)
create table if not exists models (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references brands(id) on delete cascade,
  name text not null,
  image_url text,
  created_at timestamptz default now(),
  unique (brand_id, name)
);

-- 3. PARTS (belongs to a model)
create table if not exists parts (
  id uuid primary key default gen_random_uuid(),
  model_id uuid references models(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,          -- Supabase Storage public URL; admin overwrites this when restocking
  stock_quantity int default 0,
  is_available boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. ORDERS
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address text,
  payment_method text check (payment_method in ('online', 'delivery')) not null,
  payment_status text check (payment_status in ('pending', 'paid', 'failed')) default 'pending',
  paystack_reference text,
  order_status text check (order_status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) default 'pending',
  total_amount numeric(10,2) not null,
  user_id uuid references auth.users(id), -- null for guest checkout
  created_at timestamptz default now()
);

-- 5. ORDER ITEMS
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  part_id uuid references parts(id),
  part_name text not null,   -- snapshot in case the part is later renamed/removed
  unit_price numeric(10,2) not null,
  quantity int not null,
  subtotal numeric(10,2) not null
);

-- 6. SUPPORT MESSAGES (from the Support page contact form)
create table if not exists support_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  reply text,
  replied_at timestamptz,
  status text check (status in ('open', 'resolved')) default 'open',
  created_at timestamptz default now()
);

-- 7. ADMIN PROFILES (marks which auth.users are admins)
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

alter table support_messages add column if not exists reply text;
alter table support_messages add column if not exists replied_at timestamptz;

alter table brands enable row level security;

drop policy if exists "users can check own admin record" on admin_users;
create policy "users can check own admin record" on admin_users
for select to authenticated using (id = auth.uid());

alter table parts enable row level security;
drop policy if exists "admins manage brands" on brands;
create policy "admins manage brands" on brands for all using (exists (select 1 from admin_users where id = auth.uid())) with check (exists (select 1 from admin_users where id = auth.uid()));
drop policy if exists "admins manage models" on models;
create policy "admins manage models" on models for all using (exists (select 1 from admin_users where id = auth.uid())) with check (exists (select 1 from admin_users where id = auth.uid()));
drop policy if exists "admins manage parts" on parts;
create policy "admins manage parts" on parts for all using (exists (select 1 from admin_users where id = auth.uid())) with check (exists (select 1 from admin_users where id = auth.uid()));
drop policy if exists "admins manage orders" on orders;
create policy "admins manage orders" on orders for all using (exists (select 1 from admin_users where id = auth.uid())) with check (exists (select 1 from admin_users where id = auth.uid()));
drop policy if exists "admins manage support" on support_messages;
create policy "admins manage support" on support_messages for all using (exists (select 1 from admin_users where id = auth.uid())) with check (exists (select 1 from admin_users where id = auth.uid()));
-- Public (anyone) can READ brands, models, available parts
create policy "public read brands" on brands for select using (true);
create policy "public read models" on models for select using (true);
create policy "public read parts" on parts for select using (true);

-- Anyone can INSERT an order + order items (guest checkout) and a support message
create policy "anyone can create orders" on orders for insert with check (true);
create policy "anyone can create order items" on order_items for insert with check (true);
create policy "anyone can create support messages" on support_messages for insert with check (true);

-- Customers can view only their own orders (if logged in)
create policy "users read own orders" on orders for select using (auth.uid() = user_id);

-- Admins (checked via admin_users table) can do everything
drop policy if exists "admins manage support" on support_messages;
create policy "admins manage support" on support_messages for all using (exists (select 1 from admin_users where id = auth.uid())) with check (exists (select 1 from admin_users where id = auth.uid()));
create policy "admins manage brands" on brands for all using (exists (select 1 from admin_users where id = auth.uid()));
create policy "admins manage models" on models for all using (exists (select 1 from admin_users where id = auth.uid()));
create policy "admins manage parts" on parts for all using (exists (select 1 from admin_users where id = auth.uid()));
create policy "admins manage orders" on orders for all using (exists (select 1 from admin_users where id = auth.uid()));
create policy "admins manage support" on support_messages for all using (exists (select 1 from admin_users where id = auth.uid()));

-- ============================================================
-- Storage bucket for car/part images (create via Supabase dashboard
-- Storage > New bucket > name: "part-images", public: true)
-- Recommended file path convention: parts/{part_id}.jpg
-- Re-uploading to the SAME path overwrites the old image automatically —
-- this is how "upload new image when sold out" works without extra code.
-- ============================================================
