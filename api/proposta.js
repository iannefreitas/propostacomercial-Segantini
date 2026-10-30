/* Vercel Function: propostas com link curto (/p/<código>).
   POST  /api/proposta          → salva a proposta (JSON do gerador) na aba "Propostas" e devolve o código
   GET   /api/proposta?c=código → devolve a proposta para a apresentação (e conta a abertura)
   Usa as mesmas variáveis do /api/lead: SHEETS_WEBHOOK_URL e SHEETS_SECRET. */
const crypto = require("crypto");

const hits = new Map();
function rateLimited(ip, max) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}

async function callSheet(payload) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_SECRET;
  if (!url || !secret) return { ok: false, error: "not_configured" };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, ...payload }),
      redirect: "follow",
      signal: ctrl.signal,
    });
    const text = await r.text();
    try { return JSON.parse(text); } catch { return { ok: false, error: "bad_upstream", detail: text.slice(0, 200) }; }
  } catch (err) {
    return { ok: false, error: "upstream_unreachable" };
  } finally {
    clearTimeout(timer);
  }
}

const slug = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 14);
const randomPart = () => {
  const abc = "abcdefghijkmnpqrstuvwxyz23456789"; // sem caracteres ambíguos
  return Array.from(crypto.randomBytes(8), (b) => abc[b % abc.length]).join("");
};
const str = (v, n) => (typeof v === "string" ? v : "").trim().slice(0, n);

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";

  if (req.method === "GET") {
    const code = String(req.query?.c || "").toLowerCase();
    if (!/^[a-z0-9-]{6,40}$/.test(code)) return res.status(400).json({ ok: false, error: "bad_code" });
    if (rateLimited("g:" + ip, 120)) return res.status(429).json({ ok: false, error: "too_many_requests" });
    const out = await callSheet({ action: "getProposal", code, countOpen: req.query?.preview !== "1" });
    if (!out.ok) return res.status(out.error === "not_found" ? 404 : 502).json({ ok: false, error: out.error });
    let data = null;
    try { data = JSON.parse(out.json); } catch { return res.status(502).json({ ok: false, error: "bad_data" }); }
    return res.status(200).json({ ok: true, data });
  }

  if (req.method === "POST") {
    const origin = req.headers.origin || "";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "";
    if (origin && host && new URL(origin).host !== host) return res.status(403).json({ ok: false, error: "forbidden" });
    if (rateLimited("p:" + ip, 40)) return res.status(429).json({ ok: false, error: "too_many_requests" });

    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
    const data = body && body.data;
    if (!data || typeof data !== "object" || !str(data.e, 100)) return res.status(400).json({ ok: false, error: "missing_company" });
    const json = JSON.stringify(data);
    if (json.length > 20000) return res.status(413).json({ ok: false, error: "too_large" });

    const code = `${slug(data.e) || "proposta"}-${randomPart()}`;
    const out = await callSheet({
      action: "saveProposal",
      code,
      json,
      meta: { empresa: str(data.e, 100), gestor: str(data.n, 80), vendedor: str(data.v, 60), solucao: str(data.sol, 120), valor: str(data.val, 60) },
    });
    if (!out.ok) return res.status(out.error === "not_configured" ? 503 : 502).json({ ok: false, error: out.error || "sheet_error" });
    return res.status(200).json({ ok: true, code });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "method_not_allowed" });
};
