import type { StoreProduct } from "./catalog";
import { normalizeWhatsAppNumber, type StoreSettings } from "./store-settings";

export type ProductFormState = {
  name: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string;
  imageFocusY: number;
  imageUrls: string[];
  imageFocusYs: number[];
  isAvailable: boolean;
};

export const emptyProductForm: ProductFormState = {
  name: "",
  category: "Plantas",
  description: "",
  price: "",
  imageUrl: "",
  imageFocusY: 50,
  imageUrls: [],
  imageFocusYs: [],
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
    imageUrls: product.imageUrls?.length ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [],
    imageFocusYs: product.imageFocusYs?.length ? product.imageFocusYs : product.imageUrl ? [product.imageFocusY] : [],
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
    imageUrls: form.imageUrls,
    imageFocusYs: form.imageFocusYs,
    priceCents: price,
    isAvailable: form.isAvailable,
    isFeatured: false,
    sortOrder: 0,
  };
}

export function mergeProductWithForm(product: StoreProduct, form: ProductFormState): StoreProduct {
  return { ...product, ...productFormToData(form) };
}

export function updateImageFocusY(imageFocusYs: number[], index: number, value: number) {
  const next = [...imageFocusYs];
  next[index] = Math.max(0, Math.min(100, Math.round(value)));
  return next;
}

export function getDeleteProductConfirmation(productName: string) {
  return `Apagar o produto “${productName}”? Essa ação não pode ser desfeita.`;
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
