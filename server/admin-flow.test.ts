import { describe, expect, it } from "vitest";
import type { StoreProduct } from "../client/src/lib/catalog";
import {
  buildStoreSettingsDraft,
  getPublicStoreUrl,
  mergeProductWithForm,
  productFormToData,
  productToForm,
  validateProductForm,
  type ProductFormState,
} from "../client/src/lib/admin-logic";

const existingProduct: StoreProduct = {
  id: "product-real-1",
  name: "Jiboia",
  category: "Plantas",
  description: "Verde para dentro de casa.",
  imageUrl: "https://cdn.example.com/jiboia-antiga.jpg",
  imageFocusY: 40,
  priceCents: 2990,
  isAvailable: true,
  isFeatured: false,
  sortOrder: 3,
};

const editedForm: ProductFormState = {
  name: "Jiboia grande",
  category: "Plantas de interior",
  description: "Folhagem resistente para ambientes iluminados.",
  price: "39,90",
  imageUrl: "https://cdn.example.com/jiboia-nova.jpg",
  imageFocusY: 62,
  isAvailable: false,
};

describe("fluxos administrativos da loja", () => {
  it("converte o formulário de edição em dados persistíveis", () => {
    expect(productFormToData(editedForm)).toEqual({
      name: "Jiboia grande",
      category: "Plantas de interior",
      description: "Folhagem resistente para ambientes iluminados.",
      imageUrl: "https://cdn.example.com/jiboia-nova.jpg",
      imageFocusY: 62,
      priceCents: 3990,
      isAvailable: false,
      isFeatured: false,
      sortOrder: 0,
    });
  });

  it("edita o mesmo produto e preserva o identificador ao trocar a foto", () => {
    const updated = mergeProductWithForm(existingProduct, editedForm);
    expect(updated.id).toBe(existingProduct.id);
    expect(updated.imageUrl).toBe("https://cdn.example.com/jiboia-nova.jpg");
    expect(updated.imageFocusY).toBe(62);
    expect(updated.isAvailable).toBe(false);
  });

  it("reabre um produto existente no formulário com preço formatado", () => {
    expect(productToForm(existingProduct)).toEqual({
      name: "Jiboia",
      category: "Plantas",
      description: "Verde para dentro de casa.",
      price: "29,90",
      imageUrl: "https://cdn.example.com/jiboia-antiga.jpg",
      imageFocusY: 40,
      isAvailable: true,
    });
  });

  it("exige preço para produto disponível e permite deixar sem preço quando indisponível", () => {
    expect(validateProductForm({ ...editedForm, price: "", isAvailable: true })).toContain("preço");
    expect(validateProductForm({ ...editedForm, price: "", isAvailable: false })).toBeNull();
    expect(validateProductForm({ ...editedForm, price: "39,90", isAvailable: true })).toBeNull();
  });

  it("normaliza WhatsApp e remove espaços do Instagram para os links públicos", () => {
    expect(buildStoreSettingsDraft(" (82) 99999-8888 ", " https://www.instagram.com/recanto/ ")).toEqual({
      whatsappNumber: "5582999998888",
      instagramUrl: "https://www.instagram.com/recanto/",
    });
  });

  it("monta o retorno do painel para a raiz pública, inclusive no subcaminho do GitHub Pages", () => {
    expect(getPublicStoreUrl("https://julliosan765.github.io", "/recanto-das-plantas-demo/")).toBe("https://julliosan765.github.io/recanto-das-plantas-demo/");
    expect(getPublicStoreUrl("https://recantoplt-9svuvrks.manus.space", "/")).toBe("https://recantoplt-9svuvrks.manus.space/");
  });
});
