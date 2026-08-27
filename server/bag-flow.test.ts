import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("fluxo da sacola na vitrine", () => {
  it("mantém o acesso permanente, contador e estado vazio", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(source).toContain('className={`bag-trigger${cartQuantity > 0 ? " has-items" : ""}`}');
    expect(source).toContain('<span>Sacola</span><strong>{cartQuantity}</strong>');
    expect(source).toContain("Sua sacola está vazia.");
    expect(source).toContain("Ver produtos");
    expect(source).toContain("Enviar pedido para o WhatsApp");
  });

  it("mantém a vitrine objetiva, sem blocos decorativos e convites repetidos", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(source).not.toContain('id="cuidado"');
    expect(source).not.toContain('id="visite"');
    expect(source).not.toContain('className="about-symbol"');
    expect(source).toContain('href="#localizacao"');
    expect(source).toContain("Abrir rota no Maps");
    expect(source).toContain('document.querySelector<HTMLElement>("#localizacao .map-wrap")');
    expect(source).toContain('https://maps.google.com/maps?hl=pt-BR');
  });
});
