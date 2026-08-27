-- Recanto das Plantas: catálogo público, administradores autenticados e imagens enviadas apenas por administradores.
-- Execute no SQL Editor do Supabase depois de criar o projeto. Nunca inclua a service_role no frontend.

create table if not exists public.store_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  category text not null check (char_length(category) between 2 and 80),
  description text not null default '' check (char_length(description) <= 420),
  image_url text,
  image_focus_y integer not null default 50 check (image_focus_y between 0 and 100),
  price_cents integer check (price_cents is null or price_cents >= 0),
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists image_focus_y integer not null default 50 check (image_focus_y between 0 and 100);

create table if not exists public.store_settings (
  id smallint primary key default 1 check (id = 1),
  whatsapp_number text not null,
  instagram_url text not null,
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id, whatsapp_number, instagram_url)
values (1, '558233287315', 'https://www.instagram.com/recantodasplantasal/')
on conflict (id) do nothing;

create index if not exists products_public_catalog_idx on public.products (is_active, is_available, sort_order);

create or replace function public.is_store_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select exists (select 1 from public.store_admins where user_id = (select auth.uid())) $$;

revoke all on function public.is_store_admin() from public;
grant execute on function public.is_store_admin() to authenticated;

alter table public.store_admins enable row level security;
alter table public.products enable row level security;
alter table public.store_settings enable row level security;
revoke all on table public.store_admins from anon, authenticated;
revoke all on table public.products from anon, authenticated;
revoke all on table public.store_settings from anon, authenticated;
grant select on table public.products to authenticated;
grant insert, update, delete on table public.products to authenticated;
grant select on table public.store_admins to authenticated;
grant select on table public.store_settings to authenticated;
grant insert, update on table public.store_settings to authenticated;

create policy "Store admins can read their own record" on public.store_admins for select to authenticated using ((select auth.uid()) = user_id);
create policy "Authenticated visitors can read store settings" on public.store_settings for select to authenticated using (true);
create policy "Store admins can change store settings" on public.store_settings for all to authenticated using (public.is_store_admin()) with check (public.is_store_admin());
create policy "Authenticated visitors can read active products" on public.products for select to authenticated using (is_active = true and is_available = true);
create policy "Store admins can read every product" on public.products for select to authenticated using (public.is_store_admin());
create policy "Store admins can insert products" on public.products for insert to authenticated with check (public.is_store_admin());
create policy "Store admins can update products" on public.products for update to authenticated using (public.is_store_admin()) with check (public.is_store_admin());
create policy "Store admins can delete products" on public.products for delete to authenticated using (public.is_store_admin());

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do update set public = true;
create policy "Visitors can view product images" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
create policy "Store admins can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_store_admin());
create policy "Store admins can update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_store_admin()) with check (bucket_id = 'product-images' and public.is_store_admin());
create policy "Store admins can delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_store_admin());

-- Chamado diariamente por uma rotina protegida por segredo no GitHub Actions.
-- Não lê nem altera produtos e não expõe nenhum dado da loja.
create or replace function public.keep_project_active()
returns void
language sql
security definer
set search_path = public
as $$ select; $$;

revoke all on function public.keep_project_active() from public;
grant execute on function public.keep_project_active() to anon, authenticated;
