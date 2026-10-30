/* Segantini · Apresentação comercial interativa
   Lógica de navegação, interações e envio das respostas.
   O conteúdo (textos, desafios, soluções, depoimentos) fica em js/content.js. */
(function () {
  "use strict";

  const C = window.SEGANTINI;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------- Ícones (traço, estilo da apresentação) ---------------- */
  const P = {
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    trend: '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    door: '<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.56v16.88a.5.5 0 0 1-.62.49L5 20V5.58a1 1 0 0 1 .76-.97l6-1.5A1 1 0 0 1 13 4.56z"/>',
    puzzle: '<path d="M19.44 7.85c-.47.47-1.11.63-1.71.42a2.4 2.4 0 1 0-1.54 3.06c.6-.21 1.24-.05 1.71.42l1.57 1.57c.47.47.47 1.23 0 1.7l-1.61 1.61c-.47.47-.63 1.11-.42 1.71a2.4 2.4 0 1 1-3.06-1.54c.6-.21.76-.85.29-1.32l-1.53-1.53a1.2 1.2 0 0 0-1.7 0l-1.57 1.57c-.47.47-1.11.63-1.71.42a2.4 2.4 0 1 0-1.54 3.06"/><path d="M4.56 16.15 3 14.6a1.2 1.2 0 0 1 0-1.7l1.61-1.61c.47-.47.63-1.11.42-1.71a2.4 2.4 0 1 1 3.06 1.54c-.6.21-.76.85-.29 1.32"/><path d="M12 3.03 13.6 1.4a1.2 1.2 0 0 1 1.7 0l1.57 1.57"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    "user-check": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
    dollar: '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    chart: '<path d="M3 3v18h18"/><path d="M8 17v-4"/><path d="M13 17V9"/><path d="M18 17V5"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
    pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    left: '<path d="M15 18l-6-6 6-6"/>',
    right: '<path d="M9 18l6-6-6-6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    sparkle: '<path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  };
  const ico = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${P[n] || P.sparkle}</svg>`;
  const WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" style="fill:currentColor;stroke:none"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm0-21.6A11.8 11.8 0 0 0 1.9 17.9L.2 24l6.3-1.6A11.8 11.8 0 1 0 12 .2z"/></svg>';

  /* ---------------- Estado ---------------- */
  const params = new URLSearchParams(location.search);
  const state = {
    i: 0,
    desafios: new Set(),
    interesse: new Set(),
    nome: "", empresa: "", contato: "", consent: false, hp: "",
    sendStatus: null, // "ok" | "fail" | null — envio do contato (link padrão)
    t0: Date.now(),
    vendedor: (params.get("v") || params.get("vendedor") || "").slice(0, 60),
    origem: (params.get("utm_source") || params.get("origem") || "").slice(0, 60),
  };

  let STEPS = []; // definido junto com as telas finais
  const solById = Object.fromEntries(C.solucoes.map((s) => [s.id, s]));
  const desById = Object.fromEntries(C.desafios.map((d) => [d.id, d]));

  /* ---------------- Proposta personalizada ----------------
     Links gerados em /gerador trazem #p=<código> (ou ?p=). O código é um JSON em
     base64. Ficar no "#" faz com que valores da proposta não cheguem a servidores/logs.
     Campos: n (gestor), e (empresa), v (vendedor), m (mensagem), id (código),
     d (ids de desafios), s (ids de soluções em destaque),
     ctx/dor/obj ("O seu momento"), sol (serviço), ent (entregáveis), pr/cad/resp ("Como acontece"),
     pl/val/per/tx/oc (investimento), pg/ini/vd (condições). */
  const PROP = (() => {
    try {
      const raw = new URLSearchParams(location.hash.slice(1)).get("p") || params.get("p");
      if (!raw) return null;
      const bin = atob(raw.replace(/-/g, "+").replace(/_/g, "/"));
      const o = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
      const txt = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
      const ids = (v, map) => (Array.isArray(v) ? v.filter((x) => map[x]).slice(0, 13) : []);
      // Desafios/soluções criados no gerador (cd/cs) entram nas listas desta visita
      const arr = (v, n) => (Array.isArray(v) ? v : []).filter(Array.isArray).slice(0, n);
      const cd = arr(o.cd, 8).map((x, k) => ({ id: "cd" + k, icone: "sparkle", titulo: txt(x[0], 80), texto: txt(x[1], 140), solucoes: [] })).filter((x) => x.titulo);
      const cs = arr(o.cs, 6).map((x, k) => ({ id: "cs" + k, icone: "sparkle", nome: txt(x[0], 80), descricao: txt(x[1], 140), problema: txt(x[2], 240), resultado: txt(x[3], 240) })).filter((x) => x.nome);
      cd.forEach((d) => { C.desafios.push(d); desById[d.id] = d; });
      cs.forEach((x) => { C.solucoes.push(x); solById[x.id] = x; });
      const lines = (v) => (Array.isArray(v) ? v : []).map((x) => txt(x, 200)).filter(Boolean).slice(0, 12);
      const r = {
        nome: txt(o.n, 80), empresa: txt(o.e, 100), vendedor: txt(o.v, 60),
        msg: txt(o.m, 400), id: txt(o.id, 30).replace(/[^\w-]/g, ""),
        desafios: [...ids(o.d, desById), ...cd.map((x) => x.id)], solucoes: [...ids(o.s, solById), ...cs.map((x) => x.id)].slice(0, 10),
        contexto: txt(o.ctx, 300), dor: txt(o.dor, 300), objetivo: txt(o.obj, 300),
        servico: txt(o.sol, 120), entregaveis: lines(o.ent),
        prazo: txt(o.pr, 160), cadencia: txt(o.cad, 200), responsavel: txt(o.resp, 160),
        plano: txt(o.pl, 120), valor: txt(o.val, 60), periodo: txt(o.per, 120),
        taxa: txt(o.tx, 200), outras: txt(o.oc, 300),
        pagamento: txt(o.pg, 200), inicio: txt(o.ini, 200), validade: txt(o.vd, 200),
      };
      r.temSolucao = !!(r.servico || r.entregaveis.length || r.contexto || r.dor || r.objetivo);
      r.temInvest = !!(r.valor || r.plano || r.pagamento || r.taxa || r.outras);
      return r;
    } catch { return null; }
  })();
  if (PROP) {
    state.nome = PROP.nome;
    state.empresa = PROP.empresa;
    if (PROP.vendedor) state.vendedor = PROP.vendedor;
    state.origem = ["Proposta " + (PROP.id || "personalizada"), state.origem].filter(Boolean).join(" · ").slice(0, 60);
    PROP.desafios.forEach((id) => state.desafios.add(id));
    document.title = `Segantini · Proposta para ${PROP.empresa || PROP.nome}`;
  }
  const firstName = (n) => (n || "").trim().split(/\s+/)[0];

  function recomendadas(set = state.desafios) {
    const score = {};
    set.forEach((id) => (desById[id]?.solucoes || []).forEach((s, idx) => (score[s] = (score[s] || 0) + (3 - Math.min(idx, 2)))));
    return Object.keys(score).sort((a, b) => score[b] - score[a]);
  }

  /* ---------------- Telas ---------------- */
  const screens = [
    /* 0 — Abertura */
    {
      step: 0, dark: true, hero: true, hideNav: true,
      render() {
        const a = C.abertura;
        return `
        <section class="screen screen--dark hero">
          <div class="wrap">
            <img class="hero__logo" src="/assets/logo-segantini-branca.png" alt="Segantini Psicologia Empresarial" width="716" height="438" />
            ${PROP && (PROP.empresa || PROP.nome) ? `<p class="hero__for">${ico("sparkle")} Preparada para ${esc(PROP.empresa || PROP.nome)}</p>` : ""}
            <h1 class="hero__title">${esc(a.titulo)}<em>${esc(a.tituloDestaque)}</em></h1>
            <p class="hero__sub">${PROP && PROP.nome ? `Olá, ${esc(firstName(PROP.nome))}! ` : ""}${esc(a.subtitulo)}</p>
            ${PROP && PROP.msg ? `<blockquote class="hero__msg"><p>${esc(PROP.msg)}</p>${PROP.vendedor ? `<cite>${esc(PROP.vendedor)} · Segantini</cite>` : ""}</blockquote>` : ""}
            <div class="hero__cta">
              <button class="btn btn--light btn--lg" type="button" data-next>Começar ${ico("right")}</button>
              <span class="hero__meta">${ico("clock")} Leva cerca de 3 minutos</span>
            </div>
            <div class="hero__stats">
              ${C.indicadores.map((s) => `<div><strong>${esc(s.valor)}</strong><span>${esc(s.rotulo)}</span></div>`).join("")}
            </div>
          </div>
        </section>`;
      },
    },
    /* 1 — Quem somos */
    {
      step: 0,
      render() {
        const a = C.abertura, f = a.fundadora;
        return `
        <section class="screen"><div class="wrap">
          <p class="eyebrow">Quem somos</p>
          <h2 class="h1">Parceiras no desenvolvimento <em>humano do seu negócio</em></h2>
          <p class="lead">${esc(a.quemSomos)}</p>
          <div class="about">
            <figure class="founder" style="margin:0">
              <img src="${esc(f.foto)}" alt="${esc(f.nome)}" loading="lazy" width="520" height="667" />
              <figcaption><strong>${esc(f.nome)}</strong><span>${esc(f.cargo)}</span><p>${esc(f.bio)}</p></figcaption>
            </figure>
            <div>
              <div class="pillars">
                ${a.pilares.map((p, k) => `<div class="pill-card" style="animation:rise .5s ${0.08 * k}s both"><div class="ico">${ico(p.icone)}</div><div><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></div></div>`).join("")}
              </div>
              <div class="manifesto"><p>${esc(a.manifesto.texto)} <em>${esc(a.manifesto.destaque)}</em></p></div>
              <ul class="notlist">
                ${a.naoSomos.map((n) => `<li><strong><i>×</i>${esc(n.titulo)}</strong>${esc(n.texto)}</li>`).join("")}
              </ul>
              <p class="notlist__close">${esc(a.naoSomosFechamento)}</p>
            </div>
          </div>
        </div></section>`;
      },
      hint: () => "Próximo: seus desafios",
    },
    /* 2 — Desafios */
    {
      step: 1,
      render() {
        return `
        <section class="screen"><div class="wrap">
          <p class="eyebrow">Etapa 2 · Seus desafios</p>
          <h2 class="h1">Sua empresa enfrenta <em>algum destes desafios?</em></h2>
          <p class="lead">Os desafios mudam de empresa para empresa. Os sintomas, quase sempre, se repetem. Toque em todos que fazem parte da sua realidade.</p>
          ${PROP && PROP.desafios.length ? `<p class="prefill-note">${ico("check")} Já marcamos os pontos da nossa conversa. Confirme, ajuste ou acrescente.</p>` : ""}
          <div class="counter-badge" id="desCount"></div>
          <div class="grid-select">
            ${C.desafios.map((d, k) => `
              <button type="button" class="choice" data-des="${esc(d.id)}" aria-pressed="${state.desafios.has(d.id)}" style="animation-delay:${0.03 * k}s">
                <span class="ico">${ico(d.icone)}</span>
                <span><h3>${esc(d.titulo)}</h3><p>${esc(d.texto)}</p></span>
                <span class="choice__check">${ico("check")}</span>
              </button>`).join("")}
          </div>
        </div></section>`;
      },
      mount(el) {
        const upd = () => {
          const n = state.desafios.size;
          const b = $("#desCount", el);
          b.innerHTML = n ? `${ico("check")} ${n} ${n === 1 ? "desafio selecionado" : "desafios selecionados"}` : `${ico("sparkle")} Selecione um ou mais`;
          b.classList.remove("bump"); void b.offsetWidth; if (n) b.classList.add("bump");
        };
        $$("[data-des]", el).forEach((btn) => btn.addEventListener("click", () => {
          const id = btn.dataset.des;
          state.desafios.has(id) ? state.desafios.delete(id) : state.desafios.add(id);
          btn.setAttribute("aria-pressed", state.desafios.has(id));
          btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
          upd(); updateNav();
        }));
        upd();
      },
      hint: () => state.desafios.size ? { t: "Ótimo! Vamos mostrar como podemos ajudar.", ok: true } : "Selecione ao menos um desafio — ou avance",
    },
    /* 3 — Soluções */
    {
      step: 2,
      render() {
        const forced = PROP ? PROP.solucoes : [];
        const rec = [...new Set([...forced, ...recomendadas()])];
        const recSet = new Set(forced.length ? forced : rec.slice(0, 4));
        const tag = forced.length ? `Recomendada para ${PROP.empresa || "você"}` : "Ligada aos seus desafios";
        const ordered = [...C.solucoes].sort((a, b) => (recSet.has(b.id) ? 1 : 0) - (recSet.has(a.id) ? 1 : 0) || rec.indexOf(a.id) - rec.indexOf(b.id));
        return `
        <section class="screen"><div class="wrap">
          <p class="eyebrow">Etapa 3 · Como podemos ajudar</p>
          <h2 class="h1">Um portfólio para <em>cada momento da empresa</em></h2>
          <p class="lead">${forced.length ? "Destacamos primeiro o que recomendamos para o seu momento." : recSet.size ? "Destacamos primeiro as soluções ligadas aos desafios que você marcou." : "Conheça as soluções da Segantini."} Toque em uma solução para ver o que ela resolve e marque as que fizerem sentido.</p>
          <div class="sol-grid">
            ${ordered.map((s, k) => `
              <article class="sol ${recSet.has(s.id) ? "is-rec is-open" : !recSet.size && k === 0 ? "is-open" : ""}" data-sol="${esc(s.id)}" style="animation-delay:${0.04 * k}s">
                <button type="button" class="sol__head" aria-expanded="${recSet.has(s.id) || (!recSet.size && k === 0)}">
                  <span class="ico">${ico(s.icone)}</span>
                  <span>${recSet.has(s.id) ? `<span class="sol__tag">${esc(tag)}</span>` : ""}<h3>${esc(s.nome)}</h3><p>${esc(s.descricao)}</p></span>
                  <span class="chev">${ico("chevron")}</span>
                </button>
                <div class="sol__body"><div><div class="sol__rows">
                  ${s.problema ? `<div class="sol__row sol__row--prob"><b>Ajuda a resolver</b>${esc(s.problema)}</div>` : ""}
                  ${s.resultado ? `<div class="sol__row sol__row--res"><b>O que muda</b>${esc(s.resultado)}</div>` : ""}
                  <button type="button" class="sol__like" data-like="${esc(s.id)}" aria-pressed="${state.interesse.has(s.id)}">${ico("heart")} <span>${state.interesse.has(s.id) ? "Tenho interesse" : "Marcar interesse"}</span></button>
                </div></div></div>
              </article>`).join("")}
          </div>
          <div class="ecosystem"><img src="/assets/simbolo-segantini-laranja.png" alt="" /><span>${esc(C.ecossistema)}</span></div>
        </div></section>`;
      },
      mount(el) {
        $$(".sol__head", el).forEach((h) => h.addEventListener("click", () => {
          const card = h.closest(".sol");
          const open = !card.classList.contains("is-open");
          card.classList.toggle("is-open", open);
          h.setAttribute("aria-expanded", open);
        }));
        $$("[data-like]", el).forEach((b) => b.addEventListener("click", () => {
          const id = b.dataset.like;
          state.interesse.has(id) ? state.interesse.delete(id) : state.interesse.add(id);
          const on = state.interesse.has(id);
          b.setAttribute("aria-pressed", on);
          b.querySelector("span").textContent = on ? "Tenho interesse" : "Marcar interesse";
          if (on) toast(`“${solById[id].nome}” marcada como interesse`);
          updateNav();
        }));
      },
      hint: () => state.interesse.size ? { t: `${state.interesse.size} ${state.interesse.size === 1 ? "solução marcada" : "soluções marcadas"}`, ok: true } : "Toque nas soluções para ver detalhes",
    },
    /* 4 — Prova social */
    {
      step: 3, dark: true,
      render() {
        const dest = C.depoimentos.filter((d) => d.destaque);
        const loop = [...C.clientes, ...C.clientes];
        return `
        <section class="screen screen--dark"><div class="wrap">
          <p class="eyebrow">Etapa 4 · O que nossos clientes dizem</p>
          <h2 class="h1">Medimos a relação, <em>não só a entrega</em></h2>
          <div class="stats">
            ${C.indicadores.map((s) => `<div class="stat"><strong>${esc(s.valor)}</strong><span>${esc(s.rotulo)}</span></div>`).join("")}
          </div>
          <p class="stat-note">${ico("award")} ${esc(C.indicadorExtra)}</p>
          <div class="carousel">
            <div class="carousel__track" id="track">
              ${dest.map(quoteCard).join("")}
            </div>
            <div class="carousel__nav">
              <button type="button" id="prevQ" aria-label="Depoimento anterior">${ico("left")}</button>
              <div class="dots" id="dots">${dest.map((_, k) => `<i class="${k ? "" : "on"}"></i>`).join("")}</div>
              <button type="button" id="nextQ" aria-label="Próximo depoimento">${ico("right")}</button>
            </div>
          </div>
          <div class="cases">
            ${C.cases.map((c) => `<div class="case"><h4>${esc(c.empresa)}</h4><small>${esc(c.servico)}</small><p><b>Desafio:</b> ${esc(c.desafio)}</p><dl>${c.numeros.map(([v, l]) => `<div><dt>${esc(v)}</dt><dd>${esc(l)}</dd></div>`).join("")}</dl></div>`).join("")}
          </div>
          <div class="clients">
            <h3>Empresas que já trabalham com a gente</h3>
            <div class="marquee"><div class="marquee__inner">${loop.map((n) => `<span>${esc(n)}</span>`).join("")}</div></div>
          </div>
          <div class="more-row"><button type="button" class="btn btn--outline-light" id="allQ">Ver todas as avaliações (${C.depoimentos.length})</button></div>
        </div></section>`;
      },
      mount(el) {
        const track = $("#track", el);
        const dots = $$("#dots i", el);
        const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 14;
        $("#prevQ", el).onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
        $("#nextQ", el).onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });
        track.addEventListener("scroll", () => {
          const k = Math.round(track.scrollLeft / step());
          dots.forEach((d, j) => d.classList.toggle("on", j === Math.min(k, dots.length - 1)));
        }, { passive: true });
        $("#allQ", el).onclick = () => openModal(`
          <p class="eyebrow">Avaliações e depoimentos</p>
          <h2>Tudo o que nossos clientes disseram</h2>
          <p class="muted">Transcrições fiéis das avaliações públicas no Google e dos depoimentos da apresentação institucional. Trechos entre [colchetes] foram ajustados apenas para leitura.</p>
          <div class="modal-list">${C.depoimentos.map((d) => quoteCard(d, true)).join("")}</div>`);
      },
      hint: () => (PROP && !PROP.temSolucao ? "Próximo: vamos começar" : "Próximo: a sua solução"),
    },
  ];

  /* ---------------- Telas finais (link padrão e proposta) ----------------
     5 · A solução para {empresa}: na proposta, preenchida no /gerador; no link padrão,
         montada a partir dos desafios e soluções que o lead marcou.
     6 · Investimento e condições: só na proposta (quando há valor/condições).
     7 · Vamos começar?: no link padrão, contato opcional que vai para a planilha. */
  const empresaNome = () => (PROP && PROP.empresa) || state.empresa.trim();
  const recIds = () => [...new Set([...(PROP ? PROP.solucoes : []), ...state.interesse, ...recomendadas()])].filter((id) => solById[id]);
  const finals = [];

  if (!PROP || PROP.temSolucao) finals.push({
    key: "solucao",
    render() {
      const P2 = PROP || {};
      const known = P2.servico && C.solucoes.find((x) => x.nome.toLowerCase() === P2.servico.toLowerCase());
      const momento = [P2.contexto, P2.dor, P2.objetivo].filter(Boolean);
      const marcados = [...state.desafios].map((id) => desById[id]?.titulo).filter(Boolean);
      const como = [["Prazo", P2.prazo], ["Cadência", P2.cadencia], ["Responsável Segantini", P2.responsavel]].filter((x) => x[1]);
      const recs = recIds().slice(0, 3);
      const right = P2.servico || (P2.entregaveis || []).length
        ? `<p class="eyebrow">Solução recomendada</p>
           ${P2.servico ? `<h3 class="prop__name">${esc(P2.servico)}</h3>` : ""}
           ${known ? `<p class="prop__desc">${esc(known.resultado)}</p>` : ""}
           <div class="prop__cols">
             ${P2.entregaveis.length ? `<div><p class="prop__label">Entregáveis</p><ul class="prop__list">${P2.entregaveis.map((e) => `<li>${ico("check")}<span>${esc(e)}</span></li>`).join("")}</ul></div>` : ""}
             ${como.length ? `<div><p class="prop__label">Como acontece</p><dl class="prop__how">${como.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>` : ""}
           </div>`
        : `<p class="eyebrow">${recs.length ? "Soluções recomendadas" : "Solução recomendada"}</p>
           ${recs.length ? `<div class="prop__recs">${recs.map((id) => `<div class="prop__rec"><span class="ico">${ico(solById[id].icone)}</span><div><h4>${esc(solById[id].nome)}</h4><p>${esc(solById[id].resultado || solById[id].descricao)}</p></div></div>`).join("")}</div>`
             : `<p class="prop__desc">Volte à etapa 2 e marque os desafios da sua empresa para ver a recomendação.</p>`}
           <div class="prop__note">${ico("sparkle")}<span>Cada empresa tem uma realidade: entregáveis, prazo e investimento são definidos junto com você, na proposta personalizada.</span></div>`;
      return `
      <section class="screen"><div class="wrap">
        <p class="eyebrow">${PROP ? "Proposta personalizada" : "Etapa 5 · Sua solução"}</p>
        <h2 class="h1">A solução para <em>${esc(empresaNome() || "sua empresa")}</em></h2>
        <div class="prop">
          <div class="prop__moment">
            <p class="eyebrow">O seu momento</p>
            ${momento.length ? `<ul>${momento.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>` : ""}
            ${marcados.length ? `<p class="prop__sub">${momento.length ? "Desafios que você marcou" : "Os desafios que você marcou"}</p><div class="prop__chips">${marcados.map((t) => `<span>${esc(t)}</span>`).join("")}</div>`
              : momento.length ? "" : `<p class="prop__empty">Você ainda não marcou desafios.</p>`}
          </div>
          <div class="prop__sol">${right}</div>
        </div>
      </div></section>`;
    },
    hint: () => (PROP && PROP.temInvest ? "Próximo: investimento e condições" : "Próximo: vamos começar"),
  });

  if (PROP && PROP.temInvest) finals.push({
    key: "invest", dark: true,
    render() {
      const conds = [["calendar", "Forma de pagamento", PROP.pagamento], ["clipboard", "Início", PROP.inicio], ["shield", "Validade", PROP.validade]].filter((x) => x[2]);
      return `
      <section class="screen screen--dark"><div class="wrap">
        <p class="eyebrow">Investimento</p>
        <h2 class="h1">Investimento e <em>condições</em></h2>
        <div class="invest">
          <div class="invest__price">
            <p class="eyebrow">${esc(PROP.plano || PROP.servico || "Investimento")}</p>
            ${PROP.valor ? `<p class="invest__val">${esc(PROP.valor)}</p>` : ""}
            ${PROP.periodo ? `<p class="invest__per">${esc(PROP.periodo)}</p>` : ""}
            ${PROP.taxa || PROP.outras ? `<hr />${PROP.taxa ? `<p>${esc(PROP.taxa)}</p>` : ""}${PROP.outras ? `<p>${esc(PROP.outras)}</p>` : ""}` : ""}
          </div>
          ${conds.length ? `<div class="invest__conds"><p class="eyebrow">Condições</p>${conds.map(([i, t, v]) => `<div class="invest__row"><span class="ico">${ico(i)}</span><div><strong>${esc(t)}</strong><span>${esc(v)}</span></div></div>`).join("")}</div>` : ""}
        </div>
      </div></section>`;
    },
    hint: () => "Próximo: vamos começar",
  });

  finals.push({
    key: "start", dark: true, final: true,
    render() {
      const nome = (PROP && PROP.nome) || "";
      const emp = empresaNome();
      const steps = `<ol class="steps">${C.proximosPassos.map((p) => `<li><div><strong>${esc(p.titulo)}</strong><span>${esc(p.texto)}</span></div></li>`).join("")}</ol>`;
      const links = `<a class="plain" href="mailto:${esc(C.contato.email)}">${ico("mail")} ${esc(C.contato.email)}</a>
          <a class="plain" href="${esc(C.contato.site)}" target="_blank" rel="noopener">${ico("globe")} ${esc(C.contato.siteExibicao)}</a>
          <img class="final__logo" src="/assets/logo-segantini-branca.png" alt="Segantini Psicologia Empresarial" />`;
      const card = PROP
        ? `<p class="eyebrow" style="margin:0">Fale com a gente</p>
           <p class="contact-card__txt">Ficou alguma dúvida ou quer seguir? Responda direto para o nosso time comercial.</p>
           <a class="btn btn--wa btn--lg" href="${wa(`Olá! Sou ${nome || "gestor(a)"}${emp ? `, da ${emp}` : ""}. Vi a proposta da Segantini${PROP.id ? ` (${PROP.id})` : ""}${PROP.servico || PROP.plano ? ` de ${PROP.servico || PROP.plano}` : ""} e quero avançar.`)}" target="_blank" rel="noopener">${WA_SVG} Quero avançar</a>
           <a class="btn btn--outline-light" href="${wa(`Olá! Sou ${nome || "gestor(a)"}${emp ? `, da ${emp}` : ""}. Tenho uma dúvida sobre a proposta${PROP.id ? ` ${PROP.id}` : ""}.`)}" target="_blank" rel="noopener">Tenho uma dúvida</a>`
        : `<p class="eyebrow" style="margin:0">Fale com a gente</p>
           <p class="contact-card__txt">Deixe seus dados para o nosso time já chegar preparado — ou fale direto no WhatsApp.</p>
           <form class="form form--dark" id="leadForm" novalidate>
             <div class="field"><label for="f-nome">Seu nome</label><input id="f-nome" autocomplete="name" maxlength="80" value="${esc(state.nome)}" /></div>
             <div class="field"><label for="f-empresa">Empresa</label><input id="f-empresa" autocomplete="organization" maxlength="100" value="${esc(state.empresa)}" /></div>
             <div class="field"><label for="f-contato">WhatsApp ou e-mail <span>(opcional)</span></label><input id="f-contato" maxlength="100" value="${esc(state.contato)}" /></div>
             <div class="hp" aria-hidden="true"><label>Website<input id="f-web" tabindex="-1" autocomplete="off" /></label></div>
             <label class="consent"><input type="checkbox" id="f-consent" ${state.consent ? "checked" : ""} /> <span>Autorizo a Segantini a usar estas informações para entrar em contato comigo.</span></label>
           </form>
           <a class="btn btn--wa btn--lg" id="waStart" href="#" target="_blank" rel="noopener">${WA_SVG} Quero conversar</a>
           <p class="contact-card__status" id="sendStatus" role="status"></p>`;
      return `
      <section class="screen screen--dark"><div class="wrap final">
        <div>
          <p class="eyebrow">Próximos passos</p>
          <h2 class="h1">Vamos <em>começar?</em></h2>
          <p class="lead">${nome ? `${esc(firstName(nome))}, cada` : "Cada"} empresa tem uma realidade${emp ? ` — e esta proposta foi construída para a de ${esc(emp)}` : " — por isso construímos a solução junto com você"}.</p>
          ${steps}
        </div>
        <aside class="contact-card">${card}${links}</aside>
      </div></section>`;
    },
    mount(el) {
      if (PROP) return;
      const waBtn = $("#waStart", el);
      const refresh = () => {
        const nomes = recIds().slice(0, 3).map((id) => solById[id].nome);
        const n = state.nome.trim(), e = state.empresa.trim();
        const msg = n
          ? `Olá! Sou ${n}${e ? `, da ${e}` : ""}. Vi a apresentação da Segantini${nomes.length ? ` e tenho interesse em ${nomes.join(", ")}` : ""}.`
          : `Olá! Vi a apresentação da Segantini${nomes.length ? ` e tenho interesse em ${nomes.join(", ")}` : ""} e gostaria de conversar.`;
        waBtn.href = wa(msg);
      };
      [["#f-nome", "nome"], ["#f-empresa", "empresa"], ["#f-contato", "contato"]].forEach(([id, k]) => $(id, el).addEventListener("input", (ev) => { state[k] = ev.target.value; refresh(); }));
      $("#f-web", el).addEventListener("input", (ev) => (state.hp = ev.target.value));
      $("#f-consent", el).addEventListener("change", (ev) => (state.consent = ev.target.checked));
      refresh();
      // O WhatsApp abre na hora; o registro na planilha acontece em paralelo (se houver nome, empresa e autorização)
      waBtn.addEventListener("click", async () => {
        const st = $("#sendStatus", el);
        if (state.sendStatus === "ok") return;
        if (state.nome.trim().length < 2 || state.empresa.trim().length < 2 || !state.consent) {
          st.textContent = "";
          return;
        }
        st.textContent = "Registrando seus dados…";
        const payload = buildPayload();
        let ok = await post(payload);
        if (!ok) ok = await post(payload);
        state.sendStatus = ok ? "ok" : "fail";
        if (!ok) { try { localStorage.setItem("seg_pending", JSON.stringify(payload)); } catch {} }
        st.textContent = ok ? "✓ Recebemos seus dados. Nosso time entrará em contato." : "Não conseguimos registrar agora — siga pelo WhatsApp.";
      });
    },
    hint: () => "",
  });

  STEPS = ["Conheça", "Desafios", "Soluções", "Clientes"];
  finals.forEach((sc) => {
    STEPS.push({ solucao: "Sua solução", invest: "Investimento", start: "Vamos começar" }[sc.key]);
    sc.step = STEPS.length - 1;
  });
  screens.push(...finals);

  /* ---------------- Componentes ---------------- */
  function quoteCard(d, showSource) {
    const ini = d.nome.trim().charAt(0).toUpperCase();
    return `<figure class="quote" style="margin:0">
      ${d.estrelas ? `<span class="stars" aria-label="${d.estrelas} estrelas">${"★".repeat(d.estrelas)}</span>` : ""}
      <p class="quote__hl">${esc(d.frase)}</p>
      <blockquote class="quote__txt" style="margin:0">${esc(d.texto)}</blockquote>
      <figcaption class="quote__who"><span class="avatar">${esc(ini)}</span><span><strong>${esc(d.nome)}</strong><span>${esc(d.cargo || "Cliente")}${d.fonte ? ` · ${esc(d.fonte === "Google" ? "Avaliação no Google" : d.fonte)}` : ""}</span></span></figcaption>
    </figure>`;
  }
  /* ---------------- WhatsApp ---------------- */
  const wa = (msg) => `https://wa.me/${C.contato.whatsapp}?text=${encodeURIComponent(msg)}`;

  /* ---------------- Envio das respostas ---------------- */
  function buildPayload() {
    return {
      nome: state.nome.trim(),
      empresa: state.empresa.trim(),
      contato: state.contato.trim(),
      porte: "",
      rh: "",
      desafios: [...state.desafios].map((id) => desById[id]?.titulo || id),
      solucoes: [...state.interesse].map((id) => solById[id]?.nome || id),
      recomendadas: recIds().slice(0, 3).map((id) => solById[id].nome),
      melhoria: "",
      consentimento: state.consent,
      vendedor: state.vendedor,
      origem: state.origem,
      duracao_seg: Math.round((Date.now() - state.t0) / 1000),
      dispositivo: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "Celular" : "Computador",
      website: state.hp, // honeypot
    };
  }
  async function post(payload) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    try {
      const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: ctrl.signal });
      return r.ok;
    } catch { return false; } finally { clearTimeout(t); }
  }
  // Reenvia respostas que falharam em uma visita anterior
  (async () => {
    let p = null;
    try { p = JSON.parse(localStorage.getItem("seg_pending") || "null"); } catch {}
    if (p && (await post({ ...p, reenvio: true }))) { try { localStorage.removeItem("seg_pending"); } catch {} }
  })();

  /* ---------------- Navegação ---------------- */
  const app = $("#app");
  function render(dir = 1) {
    const s = screens[state.i];
    s.enter && s.enter();
    app.innerHTML = s.render();
    const el = app.firstElementChild;
    if (dir < 0) el.classList.add("screen--back");
    $$("[data-next]", el).forEach((b) => b.addEventListener("click", next));
    s.mount && s.mount(el);
    document.body.classList.toggle("is-dark", !!s.dark);
    document.body.classList.toggle("is-hero", !!s.hero);
    window.scrollTo(0, 0);
    updateProgress(); updateNav();
    const h = el.querySelector("h1, h2");
    if (h && state.i > 0) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  function updateProgress() {
    const s = screens[state.i];
    $("#progressSteps").innerHTML = STEPS.map((t, k) => `<li class="${k < s.step ? "is-done" : k === s.step ? "is-current" : ""}"><b>${k < s.step ? "✓" : k + 1}</b><span>${t}</span></li>`).join("");
    $("#progressFill").style.width = `${Math.round((state.i / (screens.length - 1)) * 100)}%`;
  }
  function updateNav() {
    const s = screens[state.i];
    const nav = $("#navbar");
    nav.classList.toggle("is-hidden", !!s.hideNav);
    $("#btnBack").classList.toggle("is-invisible", state.i === 0 || s.final);
    const nb = $("#btnNext");
    nb.style.display = s.final ? "none" : "";
    nb.disabled = s.canNext ? !s.canNext() && !s.beforeNext : false;
    if (s.beforeNext) nb.disabled = false; // validação acontece ao clicar
    $("#btnNextLabel").textContent = s.nextLabel || "Avançar";
    const h = s.hint ? s.hint() : "";
    const hint = $("#navHint");
    hint.textContent = typeof h === "object" ? h.t : h;
    hint.classList.toggle("is-ok", typeof h === "object" && h.ok);
    if (s.final) { hint.innerHTML = `<a class="btn--link" href="#" id="restart">${PROP ? "Rever a proposta" : "Rever a apresentação"}</a>`; $("#restart").onclick = (e) => { e.preventDefault(); go(0); }; }
  }
  let busy = false;
  async function next() {
    if (busy) return;
    const s = screens[state.i];
    if (s.canNext && !s.canNext() && !s.beforeNext) return;
    if (s.beforeNext) { busy = true; const ok = await s.beforeNext(app.firstElementChild); busy = false; if (!ok) { updateNav(); return; } }
    go(state.i + 1);
  }
  function go(i, fromPop) {
    if (i < 0 || i >= screens.length || i === state.i) return;
    const dir = i > state.i ? 1 : -1;
    state.i = i;
    if (!fromPop) history.pushState({ i }, "");
    const cur = app.firstElementChild;
    if (cur) { cur.classList.add("is-leaving"); setTimeout(() => render(dir), 180); } else render(dir);
  }
  window.addEventListener("popstate", (e) => {
    const i = e.state?.i ?? 0;
    go(i, true);
  });

  $("#btnNext").addEventListener("click", next);
  $("#btnBack").addEventListener("click", () => history.back());
  $$("[data-goto]").forEach((b) => b.addEventListener("click", () => go(+b.dataset.goto)));
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea") || $("#modal").open) return;
    if (e.key === "ArrowRight" && !screens[state.i].final) next();
    if (e.key === "ArrowLeft" && state.i > 0 && !screens[state.i].final) history.back();
  });

  /* ---------------- Modal & toast ---------------- */
  const modal = $("#modal");
  function openModal(html) { $("#modalBody").innerHTML = html; modal.showModal ? modal.showModal() : modal.setAttribute("open", ""); }
  $("#modalClose").onclick = () => modal.close();
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
  let tt;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2200); }

  history.replaceState({ i: 0 }, "");
  render();
})();
