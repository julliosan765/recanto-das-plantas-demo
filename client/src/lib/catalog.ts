import { makeWhatsAppUrl } from "./store-settings";

/** Estufa Editorial: dados de produtos sustentam um catálogo simples, com linguagem clara e pedido por WhatsApp. */
export type StoreProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  imageFocusY: number;
  imageUrls?: string[];
  imageFocusYs?: number[];
  priceCents: number | null;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

export type CartLine = StoreProduct & { quantity: number };

export function getProductImages(product: StoreProduct) {
  const urls = product.imageUrls?.length ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [];
  const focusYs = urls.map((_, index) => product.imageFocusYs?.[index] ?? product.imageFocusY ?? 50);
  return urls.map((url, index) => ({ url, focusY: focusYs[index] ?? 50 }));
}

export function formatPrice(priceCents: number | null) {
  if (priceCents === null) return "Consulte o valor";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(priceCents / 100);
}

export function whatsappOrderUrl(lines: CartLine[], whatsappNumber: string) {
  const items = lines.map((line) => {
    const price = line.priceCents === null ? "valor a consultar" : formatPrice(line.priceCents);
    return `• ${line.quantity}x ${line.name} — ${price}`;
  });
  const total = lines.every((line) => line.priceCents !== null)
    ? `\nTotal: ${formatPrice(lines.reduce((sum, line) => sum + (line.priceCents ?? 0) * line.quantity, 0))}`
    : "";
  const text = `Olá, gostaria de fazer este pedido pelo site:\n\n${items.join("\n")}${total}\n\nPodem confirmar a disponibilidade?`;
  return makeWhatsAppUrl(whatsappNumber, text);
}
