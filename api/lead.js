/* Vercel Function: recebe as respostas do lead e repassa ao Google Apps Script,
   que grava uma linha na planilha.

   Por que existe este intermediário:
   - A URL do Apps Script e o segredo NÃO aparecem no navegador do visitante.
   - Aqui validamos/limitamos os dados antes de chegarem à planilha.

   Variáveis de ambiente (Vercel → Project → Settings → Environment Variables):
   - SHEETS_WEBHOOK_URL : URL do app da Web do Apps Script (termina em /exec)
   - SHEETS_SECRET      : o mesmo segredo definido no Apps Script
*/

const LIMITS = { nome: 80, empresa: 100, contato: 100, porte: 40, rh: 80, melhoria: 600, vendedor: 60, origem: 60, dispositivo: 20 };
const MAX_ITEMS = 20;
const MAX_ITEM_LEN = 80;

// Limite simples por IP (melhor esforço: vale por instância da função)
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 8;
}

const str = (v, max) => (typeof v === "string" ? v : "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
const list = (v) => (Array.isArray(v) ? v : []).slice(0, MAX_ITEMS).map((x) => str(x, MAX_ITEM_LEN)).filter(Boolean);

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  // Aceita apenas chamadas vindas da própria página
  const origin = req.headers.origin || "";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  if (origin && host && new URL(origin).host !== host) {
    return res.status(403).json({ ok: false, error: "forbidden" });
  }

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ ok: false, error: "too_many_requests" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== "object") return res.status(400).json({ ok: false, error: "invalid_body" });

  // Honeypot: robôs preenchem o campo oculto "website". Respondemos ok sem gravar.
  if (str(body.website, 200)) return res.status(200).json({ ok: true });

  const data = {
    nome: str(body.nome, LIMITS.nome),
    empresa: str(body.empresa, LIMITS.empresa),
    contato: str(body.contato, LIMITS.contato),
    porte: str(body.porte, LIMITS.porte),
    rh: str(body.rh, LIMITS.rh),
    desafios: list(body.desafios),
    solucoes: list(body.solucoes),
    recomendadas: list(body.recomendadas),
    melhoria: str(body.melhoria, LIMITS.melhoria),
    consentimento: body.consentimento === true,
    vendedor: str(body.vendedor, LIMITS.vendedor),
    origem: str(body.origem, LIMITS.origem),
    dispositivo: str(body.dispositivo, LIMITS.dispositivo),
    duracao_seg: Math.max(0, Math.min(86400, parseInt(body.duracao_seg, 10) || 0)),
    reenvio: body.reenvio === true,
  };

  if (data.nome.length < 2 || data.empresa.length < 2 || !data.consentimento) {
    return res.status(400).json({ ok: false, error: "missing_fields" });
  }

  const url = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_SECRET;
  if (!url || !secret) {
    console.error("SHEETS_WEBHOOK_URL ou SHEETS_SECRET não configurados");
    return res.status(503).json({ ok: false, error: "not_configured" });
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, data }),
      redirect: "follow",
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const text = await r.text();
    let out = {};
    try { out = JSON.parse(text); } catch { /* resposta não-JSON */ }
    if (!r.ok || !out.ok) {
      console.error("Apps Script recusou:", r.status, text.slice(0, 300));
      return res.status(502).json({ ok: false, error: "sheet_error" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Falha ao chamar o Apps Script:", err && err.message);
    return res.status(502).json({ ok: false, error: "upstream_unreachable" });
  }
};
