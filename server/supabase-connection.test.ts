import { describe, expect, it } from "vitest";

describe("conexão pública do Supabase", () => {
  it("aceita a chave pública e responde à verificação segura do catálogo", async () => {
    const url = process.env.VITE_SUPABASE_URL;
    const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    expect(url, "VITE_SUPABASE_URL precisa estar configurada").toBeTruthy();
    expect(publishableKey, "VITE_SUPABASE_PUBLISHABLE_KEY precisa estar configurada").toBeTruthy();

    const response = await fetch(`${url}/rest/v1/products?select=id&is_active=eq.true&is_available=eq.true&price_cents=not.is.null&limit=1`, {
      method: "GET",
      headers: {
        apikey: publishableKey!,
        Authorization: `Bearer ${publishableKey!}`,
      },
    });

    expect(response.status).toBe(200);
  }, 15_000);
});
