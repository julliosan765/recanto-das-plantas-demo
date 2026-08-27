/**
 * Estufa Editorial: integração discreta e segura; credenciais públicas ficam no ambiente e acesso administrativo é validado por RLS.
 */
import { createClient, type Session } from "@supabase/supabase-js";
import type { StoreProduct } from "./catalog";
import { defaultStoreSettings, type StoreSettings } from "./store-settings";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(url && publishableKey);
export const supabase = isSupabaseConfigured
  ? createClient(url!, publishableKey!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

/** Remove only Supabase auth fragments; ordinary anchors such as #catalogo remain intact. */
export function stripSupabaseAuthHash(input: string): string {
  const parsed = new URL(input);
  const fragment = new URLSearchParams(parsed.hash.replace(/^#/, ""));
  const hasAuthData = ["access_token", "refresh_token", "provider_token", "expires_at", "token_type"].some((key) => fragment.has(key));
  if (!hasAuthData) return input;
  parsed.hash = "";
  return parsed.toString();
}

function clearSupabaseAuthHash() {
  if (typeof window === "undefined" || !window.location.hash) return;
  const cleanUrl = stripSupabaseAuthHash(window.location.href);
  if (cleanUrl !== window.location.href) window.history.replaceState({}, document.title, cleanUrl);
}

type ProductRow = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  image_url: string | null;
  image_focus_y: number;
  price_cents: number | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
};

function toProduct(row: ProductRow): StoreProduct {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
    imageFocusY: row.image_focus_y ?? 50,
    priceCents: row.price_cents,
    isAvailable: row.is_available,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
  };
}

const productSelect = "id,name,category,description,image_url,image_focus_y,price_cents,is_available,is_featured,sort_order";

export async function getPublicProducts(): Promise<StoreProduct[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .eq("is_available", true)
    .not("price_cents", "is", null)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as ProductRow[]).map(toProduct);
}

export async function getAdminSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  clearSupabaseAuthHash();
  return data.session;
}

export async function signInAdminWithGoogle() {
  if (!supabase) throw new Error("Configure o Supabase antes de entrar.");
  const redirectTo = new URL(`${import.meta.env.BASE_URL}admin.html`, window.location.origin).toString();
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
  if (error) throw error;
}

export async function signInVisitorWithGoogle() {
  if (!supabase) throw new Error("O acesso da loja ainda está sendo configurado.");
  const redirectTo = new URL(import.meta.env.BASE_URL, window.location.origin).toString();
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
  if (error) throw error;
}

export async function currentUserIsStoreAdmin(userId: string) {
  if (!supabase) return false;
  const { data, error } = await supabase.from("store_admins").select("user_id").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function getAdminProducts(): Promise<StoreProduct[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProductRow[]).map(toProduct);
}

export async function createProduct(product: Omit<StoreProduct, "id">) {
  if (!supabase) throw new Error("Configure o Supabase antes de cadastrar produtos.");
  const { error } = await supabase.from("products").insert({
    name: product.name,
    category: product.category,
    description: product.description,
    image_url: product.imageUrl || null,
    image_focus_y: product.imageFocusY,
    price_cents: product.priceCents,
    is_available: product.isAvailable,
    is_featured: product.isFeatured,
    is_active: true,
    sort_order: product.sortOrder,
  });
  if (error) throw error;
}

export async function updateProduct(product: StoreProduct) {
  if (!supabase) throw new Error("Configure o Supabase antes de alterar produtos.");
  const { error } = await supabase.from("products").update({
    name: product.name,
    category: product.category,
    description: product.description,
    image_url: product.imageUrl || null,
    image_focus_y: product.imageFocusY,
    price_cents: product.priceCents,
    is_available: product.isAvailable,
  }).eq("id", product.id);
  if (error) throw error;
}

export async function getStoreSettings(): Promise<StoreSettings> {
  if (!supabase) return defaultStoreSettings;
  const { data, error } = await supabase.from("store_settings").select("whatsapp_number,instagram_url").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data ? { whatsappNumber: data.whatsapp_number, instagramUrl: data.instagram_url } : defaultStoreSettings;
}

export async function saveStoreSettings(settings: StoreSettings) {
  if (!supabase) throw new Error("Configure o Supabase antes de alterar as informações da loja.");
  const { error } = await supabase.from("store_settings").upsert({ id: 1, whatsapp_number: settings.whatsappNumber, instagram_url: settings.instagramUrl });
  if (error) throw error;
}

export async function setProductAvailability(productId: string, isAvailable: boolean) {
  if (!supabase) throw new Error("Configure o Supabase antes de alterar produtos.");
  const { error } = await supabase.from("products").update({ is_available: isAvailable }).eq("id", productId);
  if (error) throw error;
}

export async function uploadProductImage(userId: string, file: File) {
  if (!supabase) throw new Error("Configure o Supabase antes de enviar imagens.");
  if (!file.type.startsWith("image/")) throw new Error("Escolha uma imagem válida.");
  if (file.size > 5 * 1024 * 1024) throw new Error("A imagem deve ter no máximo 5 MB.");
  const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}
