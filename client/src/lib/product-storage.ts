import { getProductImages, type StoreProduct } from "./catalog";

const PUBLIC_PRODUCT_IMAGE_PREFIX = "/storage/v1/object/public/product-images/";

/** Extracts a Supabase Storage object path only from this app's public product bucket URLs. */
export function getProductStoragePath(imageUrl: string): string | null {
  try {
    const pathname = new URL(imageUrl).pathname;
    const prefixIndex = pathname.indexOf(PUBLIC_PRODUCT_IMAGE_PREFIX);
    if (prefixIndex === -1) return null;
    const encodedPath = pathname.slice(prefixIndex + PUBLIC_PRODUCT_IMAGE_PREFIX.length);
    return encodedPath ? decodeURIComponent(encodedPath) : null;
  } catch {
    return null;
  }
}

export function getProductStoragePaths(product: StoreProduct): string[] {
  return Array.from(new Set(getProductImages(product).map(({ url }) => getProductStoragePath(url)).filter((path): path is string => Boolean(path))));
}
