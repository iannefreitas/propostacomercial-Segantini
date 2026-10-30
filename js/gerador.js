/* Gerador de links de proposta personalizada (uso interno do comercial).
   Monta o parâmetro ?p= que a apresentação (js/app.js) lê para se personalizar. */
(function () {
  "use strict";
  const C = window.SEGANTINI;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MAX_SOL = 4;
  const sel = { d: new Set(), s: new Set() };
  let id = "";

  function chips(el, list, set, max) {
    el.innerHTML = list.map((x) => `<button type="button" class="gen__chip" data-id="${esc(x.id)}" aria-pressed="false">${esc(x.titulo || x.nome)}</button>`).join("");
    el.addEventListener("click", (e) => {
      const b = e.target.closest(".gen__chip");
      if (!b) return;
      const v = b.dataset.id;
      set.has(v) ? set.delete(v) : set.add(v);
      b.setAttribute("aria-pressed", set.has(v));
      if (max) el.querySelectorAll(".gen__chip").forEach((c) => (c.disabled = set.size >= max && !set.has(c.dataset.id)));
      update();
    });
  }
  chips($("#g-desafios"), C.desafios, sel.d);
  chips($("#g-solucoes"), C.solucoes, sel.s, MAX_SOL);
  $("#g-sol-list").innerHTML = C.solucoes.map((x) => `<option value="${esc(x.nome)}"></option>`).join("");

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
    const obj = { n: nome, e: empresa, v: vendedor, m: msg, d: [...sel.d], s: [...sel.s], id };
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
