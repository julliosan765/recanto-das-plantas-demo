-- Galeria opcional por produto; os campos antigos continuam para compatibilidade.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT ARRAY[]::text[];

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_focus_ys integer[] NOT NULL DEFAULT ARRAY[]::integer[];

UPDATE public.products
SET image_urls = ARRAY[image_url]
WHERE COALESCE(array_length(image_urls, 1), 0) = 0
  AND image_url IS NOT NULL
  AND image_url <> '';

UPDATE public.products
SET image_focus_ys = ARRAY[COALESCE(image_focus_y, 50)]
WHERE COALESCE(array_length(image_focus_ys, 1), 0) = 0
  AND image_url IS NOT NULL
  AND image_url <> '';
