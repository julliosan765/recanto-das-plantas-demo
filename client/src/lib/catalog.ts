/**
 * Estufa Editorial: dados de produtos sustentam um catálogo simples, com linguagem clara e pedido por WhatsApp.
 */
export type StoreProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  priceCents: number | null;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

export type CartLine = StoreProduct & { quantity: number };
import { storeAsset } from "./assets";

export const demoProducts: StoreProduct[] = [
  {
    id: "cactos-suculentas",
    name: "Cactos & suculentas",
    category: "Para cultivar",
    description: "Pequenos, resistentes e cheios de personalidade para diferentes cantos da casa.",
    imageUrl: storeAsset("recanto-cactos_5b0cc2c6.png"),
    priceCents: null,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: "vasos-detalhes",
    name: "Vasos & detalhes",
    category: "Para compor",
    description: "Peças e enfeites para dar um toque especial ao jardim ou a um presente.",
    imageUrl: storeAsset("recanto-joaninhas_d2016244.png"),
    priceCents: null,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 2,
  },
  {
    id: "flores-destaque",
    name: "Flores em destaque",
    category: "Para florescer",
    description: "Cores que transformam o ambiente e tornam qualquer ocasião ainda mais especial.",
    imageUrl: storeAsset("recanto-flor-deserto_f9c7231c.png"),
    priceCents: null,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 3,
  },
];

export function formatPrice(priceCents: number | null) {
  if (priceCents === null) return "Consulte o valor";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(priceCents / 100);
}

export function whatsappOrderUrl(lines: CartLine[]) {
  const items = lines.map((line) => {
    const price = line.priceCents === null ? "valor a consultar" : formatPrice(line.priceCents);
    return `• ${line.quantity}x ${line.name} — ${price}`;
  });
  const total = lines.every((line) => line.priceCents !== null)
    ? `\nTotal: ${formatPrice(lines.reduce((sum, line) => sum + (line.priceCents ?? 0) * line.quantity, 0))}`
    : "";
  const text = `Olá, gostaria de fazer este pedido pelo site:\n\n${items.join("\n")}${total}\n\nPodem confirmar a disponibilidade?`;
  return `https://wa.me/558233287315?text=${encodeURIComponent(text)}`;
}
