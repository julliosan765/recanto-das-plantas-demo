/**
 * Estufa Editorial: dados de produtos sustentam um catálogo simples, com linguagem clara e pedido por WhatsApp.
 */
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
  isDemo?: boolean;
};

export type CartLine = StoreProduct & { quantity: number };
import { storeAsset } from "./assets";
import { makeWhatsAppUrl } from "./store-settings";

export const demoProducts: StoreProduct[] = [
  {
    id: "cactos-decorativos-demo",
    name: "Cactos decorativos",
    category: "Plantas",
    description: "Seleção de cactos para dar um toque verde, resistente e cheio de personalidade ao ambiente.",
    imageUrl: storeAsset("recanto-cactos_5b0cc2c6.png"),
    imageFocusY: 50,
    imageUrls: [storeAsset("recanto-cactos_5b0cc2c6.png")],
    imageFocusYs: [50],
    priceCents: 2490,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 1,
    isDemo: true,
  },
  {
    id: "rosa-do-deserto-demo",
    name: "Rosa-do-deserto",
    category: "Flores",
    description: "Flor de presença marcante para quem quer levar mais cor e delicadeza para o seu recanto.",
    imageUrl: storeAsset("recanto-flor-deserto_f9c7231c.png"),
    imageFocusY: 50,
    imageUrls: [storeAsset("recanto-flor-deserto_f9c7231c.png")],
    imageFocusYs: [50],
    priceCents: 4590,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 2,
    isDemo: true,
  },
];

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
    return `• ${line.quantity}x ${line.name} — ${price}${line.isDemo ? " (valor de demonstração)" : ""}`;
  });
  const total = lines.every((line) => line.priceCents !== null)
    ? `\nTotal: ${formatPrice(lines.reduce((sum, line) => sum + (line.priceCents ?? 0) * line.quantity, 0))}`
    : "";
  const text = `Olá, gostaria de fazer este pedido pelo site:\n\n${items.join("\n")}${total}\n\nPodem confirmar a disponibilidade?`;
  return makeWhatsAppUrl(whatsappNumber, text);
}
