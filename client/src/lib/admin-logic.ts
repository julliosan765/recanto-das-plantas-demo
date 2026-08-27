import type { StoreProduct } from "./catalog";
import { normalizeWhatsAppNumber, type StoreSettings } from "./store-settings";

export type ProductFormState = {
  name: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string;
  imageFocusY: number;
  isAvailable: boolean;
};

export const emptyProductForm: ProductFormState = {
  name: "",
  category: "Plantas",
  description: "",
  price: "",
  imageUrl: "",
  imageFocusY: 50,
  isAvailable: true,
};

export function productToForm(product: StoreProduct): ProductFormState {
  return {
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.priceCents === null ? "" : (product.priceCents / 100).toFixed(2).replace(".", ","),
    imageUrl: product.imageUrl,
    imageFocusY: product.imageFocusY,
    isAvailable: product.isAvailable,
  };
}

export function validateProductForm(form: ProductFormState) {
  if (!form.name.trim() || !form.category.trim()) return "Informe pelo menos o nome e a categoria.";
  if (form.isAvailable && !form.price.trim()) return "Informe o preço antes de deixar o produto disponível para venda.";
  if (form.price.trim()) {
    const price = Math.round(Number(form.price.replace(",", ".")) * 100);
    if (!Number.isFinite(price) || price < 0) return "Informe um preço válido.";
  }
  return null;
}

export function productFormToData(form: ProductFormState): Omit<StoreProduct, "id"> {
  const price = form.price.trim() ? Math.round(Number(form.price.replace(",", ".")) * 100) : null;
  if (form.price.trim() && (!Number.isFinite(price) || price! < 0)) {
    throw new Error("Informe um preço válido.");
  }
  return {
    name: form.name.trim(),
    category: form.category.trim(),
    description: form.description.trim(),
    imageUrl: form.imageUrl,
    imageFocusY: form.imageFocusY,
    priceCents: price,
    isAvailable: form.isAvailable,
    isFeatured: false,
    sortOrder: 0,
  };
}

export function mergeProductWithForm(product: StoreProduct, form: ProductFormState): StoreProduct {
  return { ...product, ...productFormToData(form) };
}

export function buildStoreSettingsDraft(whatsappNumber: string, instagramUrl: string): StoreSettings {
  return {
    whatsappNumber: normalizeWhatsAppNumber(whatsappNumber),
    instagramUrl: instagramUrl.trim(),
  };
}

export function getPublicStoreUrl(origin: string, basePath: string): string {
  return new URL(basePath || "/", origin).toString();
}
