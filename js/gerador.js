/* Gerador de links de proposta personalizada (uso interno do comercial).
   Salva a proposta na planilha (via /api/proposta) e devolve um link curto /p/<código>.
  A pré-visualização usa o link longo (#p=), que não grava nada. */
(function () {
  "use strict";
  const C = window.SEGANTINI;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MAX_SOL = 6;
  const sel = { d: new Set(), s: new Set() };
  let id = "";

  /* Biblioteca de itens criados pelo vendedor (fica salva neste navegador para reaproveitar).
     d: [{ id, titulo, texto }]  s: [{ id, nome, descricao, problema, resultado }] */
  let lib = { d: [], s: [] };
  try { lib = Object.assign(lib, JSON.parse(localStorage.getItem("seg_lib") || "{}")); } catch {}
  const saveLib = () => { try { localStorage.setItem("seg_lib", JSON.stringify(lib)); } catch {} };
  const isCustom = (x) => x.startsWith("x-");

  function drawChips(kind) {
    const el = kind === "d" ? $("#g-desafios") : $("#g-solucoes");
    const set = sel[kind];
    const base = kind === "d" ? C.desafios : C.solucoes;
    const items = [...base, ...lib[kind]];
    el.innerHTML = items.map((x) => {
      const custom = isCustom(x.id);
      const off = kind === "s" && set.size >= MAX_SOL && !set.has(x.id);
      return `<span class="gen__chipwrap"><button type="button" class="gen__chip ${custom ? "is-custom" : ""}" data-id="${esc(x.id)}" aria-pressed="${set.has(x.id)}" ${off ? "disabled" : ""}>${esc(x.titulo || x.nome)}</button>${custom ? `<button type="button" class="gen__del" data-del="${esc(x.id)}" aria-label="Excluir ${esc(x.titulo || x.nome)}" title="Excluir">×</button>` : ""}</span>`;
    }).join("");
    if (kind === "s") $("#g-sol-list").innerHTML = items.map((x) => `<option value="${esc(x.nome)}"></option>`).join("");
  }
  ["d", "s"].forEach((kind) => {
    const el = kind === "d" ? $("#g-desafios") : $("#g-solucoes");
    el.addEventListener("click", (e) => {
      const del = e.target.closest("[data-del]");
      if (del) {
        const x = del.dataset.del;
        const item = lib[kind].find((i) => i.id === x);
        if (!confirm(`Excluir “${item.titulo || item.nome}” da sua lista?`)) return;
        lib[kind] = lib[kind].filter((i) => i.id !== x);
        sel[kind].delete(x);
        saveLib(); drawChips(kind); update();
        return;
      }
      const b = e.target.closest(".gen__chip");
      if (!b || b.disabled) return;
      const x = b.dataset.id;
      sel[kind].has(x) ? sel[kind].delete(x) : sel[kind].add(x);
      drawChips(kind); update();
    });
  });
  const newKey = () => "x-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  $("#g-add-d").addEventListener("click", () => {
    const titulo = $("#g-nd-t").value.trim();
    if (!titulo) return $("#g-nd-t").focus();
    const item = { id: newKey(), titulo: titulo.slice(0, 80), texto: $("#g-nd-x").value.trim().slice(0, 140) };
    lib.d.push(item); sel.d.add(item.id); saveLib();
    $("#g-nd-t").value = ""; $("#g-nd-x").value = "";
    drawChips("d"); update(); toast("Desafio adicionado");
  });
  $("#g-add-s").addEventListener("click", () => {
    const nome = $("#g-ns-n").value.trim();
    if (!nome) return $("#g-ns-n").focus();
    const item = { id: newKey(), nome: nome.slice(0, 80), descricao: $("#g-ns-d").value.trim().slice(0, 140), problema: $("#g-ns-p").value.trim().slice(0, 240), resultado: $("#g-ns-r").value.trim().slice(0, 240) };
    lib.s.push(item);
    if (sel.s.size < MAX_SOL) sel.s.add(item.id);
    saveLib();
    ["#g-ns-n", "#g-ns-d", "#g-ns-p", "#g-ns-r"].forEach((f) => ($(f).value = ""));
    drawChips("s"); update(); toast("Solução adicionada");
  });
  drawChips("d"); drawChips("s");

  // Validade padrão: 7 dias a partir de hoje (como na proposta institucional)
  const vd = new Date(Date.now() + 7 * 864e5).toLocaleDateString("pt-BR");
  $("#g-vd").value = `7 dias a partir do envio (até ${vd})`;

  const F = { ctx: "#g-ctx", dor: "#g-dor", obj: "#g-obj", sol: "#g-sol", pr: "#g-pr", cad: "#g-cad", resp: "#g-resp",
    pl: "#g-pl", val: "#g-val", per: "#g-per", tx: "#g-tx", oc: "#g-oc", pg: "#g-pg", ini: "#g-ini", vd: "#g-vd" };
  const v = (sel) => $(sel).value.trim();

  const slug = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "").toUpperCase().slice(0, 10);
  function newId() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0") + String(d.getMonth() + 1).padStart(2, "0");
    return `${slug($("#g-empresa").value) || "PROP"}-${dd}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
  }
  function encode(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function phone() {
    let d = $("#g-fone").value.replace(/\D/g, "");
    if (d && d.length <= 11) d = "55" + d;
    return d.length >= 12 ? d : "";
  }

  let lastEmpresa = "";
  let current = null; // proposta montada a partir do formulário
  let shortLink = "";
  function build() {
    const empresa = $("#g-empresa").value.trim();
    const nome = $("#g-nome").value.trim();
    if (empresa !== lastEmpresa) { id = empresa ? newId() : ""; lastEmpresa = empresa; }
    const pick = (kind) => [...sel[kind]].map((x) => lib[kind].find((i) => i.id === x)).filter(Boolean);
    const obj = {
      n: nome, e: empresa, v: $("#g-vendedor").value.trim(), m: $("#g-msg").value.trim(), id,
      d: [...sel.d].filter((x) => !isCustom(x)), s: [...sel.s].filter((x) => !isCustom(x)),
      cd: pick("d").map((i) => [i.titulo, i.texto]),
      cs: pick("s").map((i) => [i.nome, i.descricao, i.problema, i.resultado]),
    };
    Object.entries(F).forEach(([k, sel]) => (obj[k] = v(sel)));
    obj.ent = $("#g-ent").value.split("\n").map((x) => x.replace(/^[\s•\-*]+/, "").trim()).filter(Boolean).slice(0, 12);
    Object.keys(obj).forEach((k) => (obj[k] === "" || (Array.isArray(obj[k]) && !obj[k].length)) && delete obj[k]);
    return obj;
  }
  function update() {
    $("#g-cc").textContent = $("#g-msg").value.length;
    current = build();
    const ok = !!current.e;
    $("#g-preview").href = ok ? `${location.origin}/#p=${encode(current)}` : "#";
    $("#g-preview").classList.toggle("is-off", !ok);
    $("#g-gen").disabled = !ok;
    // Se algo mudou depois de gerar, o link curto antigo não reflete mais o formulário
    if (shortLink) {
      $("#g-result").classList.add("is-stale");
      $("#g-gen").textContent = "Gerar novo link (houve alterações)";
    }
    $("#g-hint").textContent = ok ? "Pré-visualize, confira e clique em “Gerar link curto”." : "Preencha ao menos a empresa para gerar o link.";
    const chk = [["Empresa", current.e], ["Solução recomendada", current.sol], ["Entregáveis", (current.ent || []).length], ["Valor", current.val], ["Forma de pagamento", current.pg]];
    $("#g-check").innerHTML = chk.map(([t, x]) => `<span class="${x ? "ok" : ""}">${t}</span>`).join("");
  }
  function waHref() {
    const first = (current.n || "").split(/\s+/)[0];
    const text = `Olá${first ? `, ${first}` : ""}! Conforme conversamos, preparei a proposta da Segantini para a ${current.e}: ${shortLink}`;
    $("#g-wa").href = `https://wa.me/${phone()}?text=${encodeURIComponent(text)}`;
  }
  async function generate() {
    const btn = $("#g-gen");
    btn.disabled = true; btn.textContent = "Gerando…";
    let j = {};
    try {
      const r = await fetch("/api/proposta", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: current }) });
      j = await r.json();
    } catch {}
    btn.disabled = false; btn.textContent = "Gerar link curto";
    if (!j.ok) {
      const msg = j.error === "script_outdated"
        ? "O Apps Script publicado ainda é a versão antiga. Cole o Code.gs novo e implante uma Nova versão."
        : ["not_configured", "sheet_error", "bad_upstream", "unauthorized"].includes(j.error)
          ? "A planilha não respondeu como esperado — confira o Apps Script (ver README)."
          : "Não foi possível gerar o link agora. Tente de novo.";
      $("#g-hint").textContent = msg;
      toast(msg);
      return;
    }
    shortLink = `${location.origin}/p/${j.code}`;
    $("#g-link").value = shortLink;
    $("#g-result").hidden = false;
    $("#g-result").classList.remove("is-stale");
    waHref();
    hist({ id: j.code, empresa: current.e, link: shortLink, data: new Date().toLocaleDateString("pt-BR") });
    toast("Link curto gerado!");
  }
  $("#g-gen").addEventListener("click", generate);
  ["#g-nome", "#g-empresa", "#g-vendedor", "#g-msg", "#g-ent", ...Object.values(F)].forEach((s) => $(s).addEventListener("input", update));
  $("#g-fone").addEventListener("input", () => { if (shortLink) waHref(); });

  // Vendedor lembrado neste navegador
  try { $("#g-vendedor").value = localStorage.getItem("seg_vendedor") || ""; } catch {}
  $("#g-vendedor").addEventListener("change", (e) => { try { localStorage.setItem("seg_vendedor", e.target.value.trim()); } catch {} });

  // Histórico local (apenas neste navegador)
  function hist(add) {
    let h = [];
    try { h = JSON.parse(localStorage.getItem("seg_hist") || "[]"); } catch {}
    if (add) { h = [add, ...h.filter((x) => x.id !== add.id)].slice(0, 30); try { localStorage.setItem("seg_hist", JSON.stringify(h)); } catch {} }
    $("#g-hist").innerHTML = h.length
      ? h.map((x, k) => `<li><div>${esc(x.empresa)} <span>· ${esc(x.id)} · ${esc(x.data)}</span></div><button type="button" data-k="${k}">Copiar</button></li>`).join("")
      : '<li class="muted">Nenhum ainda.</li>';
    $("#g-hist").onclick = (e) => { const b = e.target.closest("button[data-k]"); if (b) copy(h[+b.dataset.k].link); };
  }
  async function copy(t) {
    try { await navigator.clipboard.writeText(t); } catch { $("#g-link").select(); document.execCommand("copy"); }
    toast("Link copiado!");
  }
  $("#g-copy").addEventListener("click", () => copy($("#g-link").value));

  let tt;
  function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2000); }

  hist();
  update();
})();
