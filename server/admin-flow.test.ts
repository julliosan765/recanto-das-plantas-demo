import { describe, expect, it } from "vitest";
import type { StoreProduct } from "../client/src/lib/catalog";
import { getProductStoragePaths } from "../client/src/lib/product-storage";
import {
  buildStoreSettingsDraft,
  getAdminAccessDeniedMessage,
  getDeleteProductConfirmation,
  getPublicStoreUrl,
  updateImageFocusY,
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
  imageUrls: ["https://cdn.example.com/jiboia-antiga.jpg"],
  imageFocusYs: [40],
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
  imageUrls: ["https://cdn.example.com/jiboia-nova.jpg", "https://cdn.example.com/jiboia-detalhe.jpg"],
  imageFocusYs: [62, 28],
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
      imageUrls: ["https://cdn.example.com/jiboia-nova.jpg", "https://cdn.example.com/jiboia-detalhe.jpg"],
      imageFocusYs: [62, 28],
      priceCents: 3990,
      isAvailable: false,
      isFeatured: false,
      sortOrder: 0,
    });
  });

  it("preserva a galeria e os enquadramentos ao editar o mesmo produto", () => {
    const updated = mergeProductWithForm(existingProduct, editedForm);
    expect(updated.id).toBe(existingProduct.id);
    expect(updated.imageUrl).toBe("https://cdn.example.com/jiboia-nova.jpg");
    expect(updated.imageFocusY).toBe(62);
    expect(updated.imageUrls).toEqual(["https://cdn.example.com/jiboia-nova.jpg", "https://cdn.example.com/jiboia-detalhe.jpg"]);
    expect(updated.imageFocusYs).toEqual([62, 28]);
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
      imageUrls: ["https://cdn.example.com/jiboia-antiga.jpg"],
      imageFocusYs: [40],
      isAvailable: true,
    });
  });

  it("normaliza uma galeria antiga de foto única ao reabrir o produto", () => {
    const legacyProduct = { ...existingProduct, imageUrls: [], imageFocusYs: [] };
    expect(productToForm(legacyProduct).imageUrls).toEqual(["https://cdn.example.com/jiboia-antiga.jpg"]);
    expect(productToForm(legacyProduct).imageFocusYs).toEqual([40]);
  });

  it("limita o enquadramento vertical e altera somente a foto escolhida", () => {
    expect(updateImageFocusY([18, 42], 1, 125)).toEqual([18, 100]);
    expect(updateImageFocusY([18, 42], 0, -10)).toEqual([0, 42]);
  });

  it("exige preço para produto disponível e permite deixar sem preço quando indisponível", () => {
    expect(validateProductForm({ ...editedForm, price: "", isAvailable: true })).toContain("preço");
    expect(validateProductForm({ ...editedForm, price: "", isAvailable: false })).toBeNull();
    expect(validateProductForm({ ...editedForm, price: "39,90", isAvailable: true })).toBeNull();
  });

  it("exibe uma confirmação explícita antes de apagar um produto", () => {
    expect(getDeleteProductConfirmation("Jiboia grande")).toBe("Apagar o produto “Jiboia grande”? Essa ação não pode ser desfeita.");
  });

  it("informa acesso negado sem expor identificadores da conta", () => {
    expect(getAdminAccessDeniedMessage()).toBe("Esta conta Google não tem permissão para acessar a área administrativa.");
    expect(getAdminAccessDeniedMessage()).not.toContain("proprietário");
  });

  it("seleciona somente as imagens do bucket de produtos para a limpeza após exclusão", () => {
    const productWithStorageImages = {
      ...existingProduct,
      imageUrl: "https://project.supabase.co/storage/v1/object/public/product-images/admin-user/capa.webp",
      imageUrls: [
        "https://project.supabase.co/storage/v1/object/public/product-images/admin-user/capa.webp",
        "https://project.supabase.co/storage/v1/object/public/product-images/admin-user/detalhe.jpg",
        "https://cdn.example.com/imagem-externa.jpg",
      ],
      imageFocusYs: [50, 24, 75],
    };
    expect(getProductStoragePaths(productWithStorageImages)).toEqual(["admin-user/capa.webp", "admin-user/detalhe.jpg"]);
    expect(getProductStoragePaths({ ...existingProduct, imageUrls: ["https://cdn.example.com/imagem-externa.jpg"] })).toEqual([]);
  });

  it("normaliza contatos e preserva os campos editáveis de Sobre nós", () => {
    expect(buildStoreSettingsDraft(" (82) 99999-8888 ", " https://www.instagram.com/recanto/ ", 2004, " História do Recanto em Maceió. ", " Atendimento próximo para cada espaço. ")).toEqual({
      whatsappNumber: "5582999998888",
      instagramUrl: "https://www.instagram.com/recanto/",
      aboutSinceYear: 2004,
      aboutIntro: "História do Recanto em Maceió.",
      aboutDetail: "Atendimento próximo para cada espaço.",
    });
  });

  it("usa valores padrão para ano inválido e textos vazios de Sobre nós", () => {
    expect(buildStoreSettingsDraft("5582999998888", "https://www.instagram.com/recanto/", 1800, " ", " ")).toMatchObject({
      aboutSinceYear: 1999,
      aboutIntro: expect.stringContaining("Em Maceió"),
      aboutDetail: expect.stringContaining("Fale com a equipe"),
    });
  });

  it("monta o retorno do painel para a raiz pública, inclusive no subcaminho do GitHub Pages", () => {
    expect(getPublicStoreUrl("https://julliosan765.github.io", "/recanto-das-plantas-demo/")).toBe("https://julliosan765.github.io/recanto-das-plantas-demo/");
    expect(getPublicStoreUrl("https://recantoplt-9svuvrks.manus.space", "/")).toBe("https://recantoplt-9svuvrks.manus.space/");
  });
});
