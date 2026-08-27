import { describe, expect, it } from "vitest";
import { stripSupabaseAuthHash } from "../client/src/lib/supabase";

describe("stripSupabaseAuthHash", () => {
  it("remove fragmentos que carregam tokens do Supabase", () => {
    const input = "https://recantoplt-9svuvrks.manus.space/#access_token=secret&refresh_token=secret&expires_at=123";
    expect(stripSupabaseAuthHash(input)).toBe("https://recantoplt-9svuvrks.manus.space/");
  });

  it("preserva âncoras comuns do site", () => {
    const input = "https://recantoplt-9svuvrks.manus.space/#catalogo";
    expect(stripSupabaseAuthHash(input)).toBe(input);
  });
});
