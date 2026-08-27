import { spawn } from "node:child_process";

const port = 9232;
const appUrl = "http://127.0.0.1:3000/#catalogo";
const chrome = spawn("chromium", [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--no-first-run",
  "--remote-debugging-address=127.0.0.1",
  `--remote-debugging-port=${port}`,
  "--user-data-dir=/tmp/recanto-mobile-check",
  "about:blank",
], { stdio: "ignore" });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDebugger() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (response.ok) return response.json();
    } catch {
      // O Chromium ainda está iniciando.
    }
    await wait(150);
  }
  throw new Error("O Chromium não iniciou o protocolo de depuração.");
}

async function main() {
  try {
    const pages = await waitForDebugger();
    const page = pages.find((item) => item.type === "page");
    if (!page?.webSocketDebuggerUrl) throw new Error("Não foi possível encontrar a aba de teste.");

    const socket = new WebSocket(page.webSocketDebuggerUrl);
    const replies = new Map();
    let nextId = 1;
    socket.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      const reply = replies.get(payload.id);
      if (reply) {
        replies.delete(payload.id);
        payload.error ? reply.reject(new Error(payload.error.message)) : reply.resolve(payload.result);
      }
    });
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    });
    const command = (method, params = {}) => new Promise((resolve, reject) => {
      const id = nextId++;
      replies.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });

    await command("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await command("Page.enable");
    await command("Page.navigate", { url: appUrl });
    await wait(1800);
    const evaluation = await command("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `
        (async () => {
          const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          const input = document.querySelector('#catalog-search');
          if (!input) throw new Error('Campo de pesquisa não encontrado no mobile.');
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          setter.call(input, 'cactos');
          input.dispatchEvent(new Event('input', { bubbles: true }));
          await pause(100);
          const plants = [...document.querySelectorAll('.catalog-filter')].find((button) => button.textContent.trim() === 'Plantas');
          if (!plants) throw new Error('Filtro Plantas não encontrado no mobile.');
          plants.click();
          await pause(100);
          const add = document.querySelector('.catalog-action');
          if (!add) throw new Error('Botão de adicionar não encontrado depois da busca/filtro.');
          add.click();
          await pause(100);
          const drawer = document.querySelector('.order-drawer');
          const orderLink = drawer?.querySelector('a[href*="wa.me/"]');
          return {
            viewport: [window.innerWidth, window.innerHeight],
            visibleProducts: document.querySelectorAll('.catalog-card').length,
            cartIsOpen: Boolean(drawer),
            cartText: drawer?.innerText ?? '',
            whatsappUrl: orderLink?.href ?? '',
          };
        })()
      `,
    });
    const result = evaluation.result.value;
    if (result.viewport[0] !== 390 || result.visibleProducts !== 1 || !result.cartIsOpen || !result.cartText.includes("Cactos decorativos") || !result.whatsappUrl.includes("wa.me/558233287315")) {
      throw new Error(`Validação mobile incompleta: ${JSON.stringify(result)}`);
    }
    console.log(JSON.stringify(result, null, 2));
    socket.close();
  } finally {
    chrome.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
