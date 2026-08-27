import { describe, expect, it } from "vitest";
import { type StoreProduct, whatsappOrderUrl } from "../client/src/lib/catalog";
import { buildCategoryFilters, filterCatalogProducts } from "../client/src/lib/catalog-filters";

const products: StoreProduct[] = [
  { id: "p1", name: "Jiboia em vaso", category: "Plantas", description: "Folhagem para ambientes internos.", imageUrl: "", imageFocusY: 50, priceCents: 3490, isAvailable: true, isFeatured: false, sortOrder: 1 },
  { id: "p2", name: "Vaso cerâmico areia", category: "Vasos", description: "Peça para compor o seu recanto.", imageUrl: "", imageFocusY: 50, priceCents: 4590, isAvailable: true, isFeatured: false, sortOrder: 2 },
  { id: "p3", name: "Cesto organizador", category: "Organização", description: "Item de arrumação para a casa.", imageUrl: "", imageFocusY: 50, priceCents: null, isAvailable: true, isFeatured: false, sortOrder: 3 },
  { id: "p4", name: "Suporte de parede", category: "Utilidades", description: "Acessório para plantas e vasos.", imageUrl: "", imageFocusY: 50, priceCents: null, isAvailable: true, isFeatured: false, sortOrder: 4 },
];

describe("filtros do catálogo", () => {
  it("oferece Todos, categorias principais e categorias extras cadastradas", () => {
    expect(buildCategoryFilters(products)).toEqual(["Todos", "Plantas", "Vasos", "Organização", "Acessórios", "Utilidades"]);
  });

  it("filtra por texto sem diferenciar maiúsculas ou acentos", () => {
    expect(filterCatalogProducts(products, "JIBOIA", "Todos").map((product) => product.id)).toEqual(["p1"]);
    expect(filterCatalogProducts(products, "arrumação", "Todos").map((product) => product.id)).toEqual(["p3"]);
  });

  it("filtra a categoria Organização por termos de arrumação", () => {
    expect(filterCatalogProducts(products, "", "Organização").map((product) => product.id)).toEqual(["p3"]);
  });

  it("combina categoria e busca e retorna vazio quando não há correspondência", () => {
    expect(filterCatalogProducts(products, "cerâmica", "Plantas")).toEqual([]);
    expect(filterCatalogProducts(products, "parede", "Acessórios").map((product) => product.id)).toEqual(["p4"]);
  });

  it("mantém o produto filtrado apto a gerar um pedido no WhatsApp", () => {
    const [product] = filterCatalogProducts(products, "jiboia", "Plantas");
    const orderUrl = whatsappOrderUrl([{ ...product, quantity: 1 }], "(82) 3328-7315");
    expect(orderUrl).toContain("https://wa.me/558233287315");
    expect(decodeURIComponent(orderUrl)).toContain("Jiboia em vaso");
  });
});
