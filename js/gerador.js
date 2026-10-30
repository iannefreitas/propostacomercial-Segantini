/* Gerador de links de proposta personalizada (uso interno do comercial).
   Monta o parâmetro #p= que a apresentação (js/app.js) lê para se personalizar. */
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
  function update() {
    const empresa = $("#g-empresa").value.trim();
    const nome = $("#g-nome").value.trim();
    const vendedor = $("#g-vendedor").value.trim();
    const msg = $("#g-msg").value.trim();
    $("#g-cc").textContent = $("#g-msg").value.length;
    if (empresa !== lastEmpresa) { id = empresa ? newId() : ""; lastEmpresa = empresa; }
    const ok = !!empresa;
    const pick = (kind) => [...sel[kind]].map((x) => lib[kind].find((i) => i.id === x)).filter(Boolean);
    const obj = {
      n: nome, e: empresa, v: vendedor, m: msg, id,
      d: [...sel.d].filter((x) => !isCustom(x)), s: [...sel.s].filter((x) => !isCustom(x)),
      cd: pick("d").map((i) => [i.titulo, i.texto]),
      cs: pick("s").map((i) => [i.nome, i.descricao, i.problema, i.resultado]),
    };
    Object.entries(F).forEach(([k, sel]) => (obj[k] = v(sel)));
    const ent = $("#g-ent").value.split("\n").map((x) => x.replace(/^[\s•\-*]+/, "").trim()).filter(Boolean).slice(0, 12);
    obj.ent = ent;
    Object.keys(obj).forEach((k) => (obj[k] === "" || (Array.isArray(obj[k]) && !obj[k].length)) && delete obj[k]);
    const link = ok ? `${location.origin}/#p=${encode(obj)}` : "";
    $("#g-link").value = link;
    $("#g-id").textContent = id || "—";
    $("#g-preview").href = link || "#";
    const first = nome.split(/\s+/)[0];
    const text = `Olá${first ? `, ${first}` : ""}! Conforme conversamos, preparei a proposta da Segantini para a ${empresa}. É rápida e interativa: ${link}`;
    $("#g-wa").href = ok ? `https://wa.me/${phone()}?text=${encodeURIComponent(text)}` : "#";
    ["#g-copy", "#g-preview", "#g-wa"].forEach((s) => $(s).classList.toggle("is-off", !ok));
    $("#g-hint").textContent = ok
      ? "No final, o botão “Quero avançar” abre o WhatsApp do comercial com o nome, a empresa e este código."
      : "Preencha ao menos a empresa para gerar o link.";
    const chk = [["Empresa", empresa], ["Solução recomendada", v("#g-sol")], ["Entregáveis", ent.length], ["Valor", v("#g-val")], ["Forma de pagamento", v("#g-pg")]];
    $("#g-check").innerHTML = chk.map(([t, x]) => `<span class="${x ? "ok" : ""}">${t}</span>`).join("");
  }
  ["#g-nome", "#g-empresa", "#g-vendedor", "#g-fone", "#g-msg", "#g-ent", ...Object.values(F)].forEach((s) => $(s).addEventListener("input", update));

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
  function save() {
    const link = $("#g-link").value;
    if (link) hist({ id, empresa: $("#g-empresa").value.trim(), link, data: new Date().toLocaleDateString("pt-BR") });
  }
  async function copy(t) {
    try { await navigator.clipboard.writeText(t); } catch { $("#g-link").select(); document.execCommand("copy"); }
    toast("Link copiado!");
  }
  $("#g-copy").addEventListener("click", () => { copy($("#g-link").value); save(); });
  $("#g-wa").addEventListener("click", save);
  $("#g-preview").addEventListener("click", save);

  let tt;
  function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2000); }

  hist();
  update();
})();
