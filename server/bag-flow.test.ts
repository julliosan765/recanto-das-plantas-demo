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
});
