import { describe, expect, it } from "vitest";

describe("conexão pública do Supabase", () => {
  it("aceita a chave pública e responde à verificação segura do catálogo", async () => {
    const url = process.env.VITE_SUPABASE_URL;
    const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    expect(url, "VITE_SUPABASE_URL precisa estar configurada").toBeTruthy();
    expect(publishableKey, "VITE_SUPABASE_PUBLISHABLE_KEY precisa estar configurada").toBeTruthy();

    const response = await fetch(`${url}/rest/v1/rpc/keep_project_active`, {
      method: "POST",
      headers: {
        apikey: publishableKey!,
        Authorization: `Bearer ${publishableKey!}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });

    expect(response.status).toBe(204);
  }, 15_000);
});
