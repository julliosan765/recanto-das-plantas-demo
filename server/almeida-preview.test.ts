import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("prévia Almeida Móveis Usados", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/AlmeidaStorefront.tsx"), "utf8");
  const styles = readFileSync(resolve(process.cwd(), "client/src/almeida.css"), "utf8");

  it("mantém os três produtos selecionados e suas imagens próprias de vitrine", () => {
    expect(source).toContain("Sofá 2 lugares em tecido");
    expect(source).toContain("Poltrona em tecido claro");
    expect(source).toContain("Armário multiuso madeira e branco");
    expect(source).toContain("ASSET_BASE_URL");
    expect(source).toContain("almeida-sofa-marrom-vitrine_fa370271.png");
    expect(source).toContain("almeida-poltrona-clara-vitrine_35e9a318.png");
    expect(source).toContain("almeida-armario-madeira-vitrine_adcd6966.png");
    expect(source).toContain("almeida-fachada-vitrine_a707c2f7.png");
  });

  it("organiza a consulta para o vendedor por WhatsApp", () => {
    expect(source).toContain("Itens selecionados");
    expect(source).toContain("Enviar consulta pelo WhatsApp");
    expect(source).toContain("confirmar disponibilidade e condições destas peças");
    expect(source).toContain("5582988066137");
  });

  it("mantém busca, categorias e adaptação para telas pequenas", () => {
    expect(source).toContain("Busque sofá, poltrona, armário...");
    expect(source).toContain('const categories: Category[] = ["Todos", "Sofás", "Poltronas", "Armários"]');
    expect(styles).toContain("@media (max-width: 660px)");
    expect(styles).toContain(".mobile-quote-bar { display: block;");
  });
});
