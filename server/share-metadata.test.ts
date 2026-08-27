import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("metadados de compartilhamento", () => {
  it("declara a prévia pública da Recanto das Plantas", () => {
    const html = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

    expect(html).toContain('<meta property="og:title" content="Recanto das Plantas | Maceió" />');
    expect(html).toContain('<meta property="og:description"');
    expect(html).toContain('<meta property="og:url" content="https://julliosan765.github.io/recanto-das-plantas-demo/" />');
    expect(html).toContain('<meta property="og:image" content="https://recantoplt-9svuvrks.manus.space/manus-storage/recanto-share_177097fb.jpg" />');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
  });
});
