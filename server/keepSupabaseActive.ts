import type { Request, Response } from "express";
import { sdk } from "./_core/sdk";

/**
 * Rota exclusiva de rotina programada. Não lê nem altera produtos, clientes ou pedidos.
 */
export async function keepSupabaseActive(req: Request, res: Response) {
  try {
    let user;
    try { user = await sdk.authenticateRequest(req); } catch { return res.status(403).json({ error: "cron-only" }); }
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });

    const url = process.env.VITE_SUPABASE_URL;
    const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !publishableKey) return res.status(500).json({ error: "supabase-not-configured" });

    const response = await fetch(`${url}/rest/v1/rpc/keep_project_active`, {
      method: "POST",
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });

    if (!response.ok) throw new Error(`Supabase respondeu ${response.status}`);
    return res.status(200).json({ ok: true, taskUid: user.taskUid, checkedAt: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[Supabase activity]", message);
    return res.status(500).json({ error: "activity-check-failed", message, timestamp: new Date().toISOString() });
  }
}
