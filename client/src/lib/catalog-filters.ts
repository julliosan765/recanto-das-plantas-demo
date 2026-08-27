import type { StoreProduct } from "./catalog";

export const defaultCategoryFilters = ["Todos", "Plantas", "Vasos", "Flores", "Organização", "Acessórios"] as const;

const categoryTerms: Record<string, string[]> = {
  Plantas: ["planta", "plantas", "cacto", "cactos", "suculenta", "suculentas", "folhagem", "cultivar"],
  Vasos: ["vaso", "vasos", "cachepo", "cachepot", "compor"],
  Flores: ["flor", "flores", "floracao", "florescer", "bouquet", "buque"],
  Organização: ["organizacao", "organizacoes", "arrumacao", "cesto", "cestos", "caixa", "caixas", "organizador", "organizadores"],
  Acessórios: ["acessorio", "acessorios", "enfeite", "enfeites", "suporte", "suportes", "detalhe", "detalhes"],
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function searchableText(product: StoreProduct) {
  return normalize(`${product.name} ${product.category} ${product.description}`);
}

export function matchesCatalogCategory(product: StoreProduct, category: string) {
  if (category === "Todos") return true;
  const terms = categoryTerms[category];
  if (!terms) return normalize(product.category) === normalize(category);
  const text = searchableText(product);
  return terms.some((term) => text.includes(term));
}

export function filterCatalogProducts(products: StoreProduct[], query: string, category: string) {
  const normalizedQuery = normalize(query.trim());
  return products.filter((product) => {
    const matchesQuery = !normalizedQuery || searchableText(product).includes(normalizedQuery);
    return matchesQuery && matchesCatalogCategory(product, category);
  });
}

export function buildCategoryFilters(products: StoreProduct[]) {
  const availableDefaults = defaultCategoryFilters.slice(1).filter((category) => products.some((product) => matchesCatalogCategory(product, category)));
  const known = new Set(defaultCategoryFilters.slice(1).map(normalize));
  const extras = Array.from(new Set(products.map((product) => product.category.trim()).filter(Boolean)))
    .filter((category) => !known.has(normalize(category)));
  return ["Todos", ...availableDefaults, ...extras];
}
