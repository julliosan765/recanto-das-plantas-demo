-- O catálogo usa RLS diretamente. Nenhuma função SECURITY DEFINER fica exposta pela API pública.
BEGIN;

DROP POLICY IF EXISTS "Store admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Store admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Store admins can read every product" ON public.products;
DROP POLICY IF EXISTS "Store admins can update products" ON public.products;
DROP POLICY IF EXISTS "Store admins can change store settings" ON public.store_settings;
DROP POLICY IF EXISTS "Store admins can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Store admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Store admins can upload product images" ON storage.objects;

CREATE POLICY "Store admins can delete products"
ON public.products FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.store_admins WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Store admins can insert products"
ON public.products FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.store_admins WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Store admins can read every product"
ON public.products FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.store_admins WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Store admins can update products"
ON public.products FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.store_admins WHERE user_id = (SELECT auth.uid())))
WITH CHECK (EXISTS (SELECT 1 FROM public.store_admins WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Store admins can change store settings"
ON public.store_settings FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.store_admins WHERE user_id = (SELECT auth.uid())))
WITH CHECK (EXISTS (SELECT 1 FROM public.store_admins WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Store admins can delete product images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.store_admins WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Store admins can update product images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.store_admins WHERE user_id = (SELECT auth.uid())))
WITH CHECK (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.store_admins WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Store admins can upload product images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.store_admins WHERE user_id = (SELECT auth.uid())));

REVOKE ALL ON FUNCTION public.is_store_admin() FROM PUBLIC, anon, authenticated;
DROP FUNCTION IF EXISTS public.is_store_admin();
REVOKE ALL ON FUNCTION public.keep_project_active() FROM PUBLIC, anon, authenticated;
DROP FUNCTION IF EXISTS public.keep_project_active();

COMMIT;
