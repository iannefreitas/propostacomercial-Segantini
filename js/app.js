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
    porte: "",
    rh: "",
    diagDesafios: null, // inicializado a partir da etapa 2
    diagSolucoes: null, // inicializado a partir da etapa 3
    melhoria: "",
    nome: "", empresa: "", contato: "", consent: false, hp: "",
    sendStatus: null, // "ok" | "fail" | null
    t0: Date.now(),
    vendedor: (params.get("v") || params.get("vendedor") || "").slice(0, 60),
    origem: (params.get("utm_source") || params.get("origem") || "").slice(0, 60),
  };

  const STEPS = ["Conheça", "Desafios", "Soluções", "Clientes", "Sua empresa", "Próximo passo"];
  const solById = Object.fromEntries(C.solucoes.map((s) => [s.id, s]));
  const desById = Object.fromEntries(C.desafios.map((d) => [d.id, d]));

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
            <h1 class="hero__title">${esc(a.titulo)}<em>${esc(a.tituloDestaque)}</em></h1>
            <p class="hero__sub">${esc(a.subtitulo)}</p>
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
        const rec = recomendadas();
        const recSet = new Set(rec.slice(0, 4));
        const ordered = [...C.solucoes].sort((a, b) => (recSet.has(b.id) ? 1 : 0) - (recSet.has(a.id) ? 1 : 0) || rec.indexOf(a.id) - rec.indexOf(b.id));
        return `
        <section class="screen"><div class="wrap">
          <p class="eyebrow">Etapa 3 · Como podemos ajudar</p>
          <h2 class="h1">Um portfólio para <em>cada momento da empresa</em></h2>
          <p class="lead">${recSet.size ? "Destacamos primeiro as soluções ligadas aos desafios que você marcou." : "Conheça as soluções da Segantini."} Toque em uma solução para ver o que ela resolve e marque as que fizerem sentido.</p>
          <div class="sol-grid">
            ${ordered.map((s, k) => `
              <article class="sol ${recSet.has(s.id) ? "is-rec" : ""} ${k === 0 ? "is-open" : ""}" data-sol="${esc(s.id)}" style="animation-delay:${0.04 * k}s">
                <button type="button" class="sol__head" aria-expanded="${k === 0}">
                  <span class="ico">${ico(s.icone)}</span>
                  <span>${recSet.has(s.id) ? '<span class="sol__tag">Ligada aos seus desafios</span>' : ""}<h3>${esc(s.nome)}</h3><p>${esc(s.descricao)}</p></span>
                  <span class="chev">${ico("chevron")}</span>
                </button>
                <div class="sol__body"><div><div class="sol__rows">
                  <div class="sol__row sol__row--prob"><b>Ajuda a resolver</b>${esc(s.problema)}</div>
                  <div class="sol__row sol__row--res"><b>O que muda</b>${esc(s.resultado)}</div>
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
      hint: () => "Próximo: sua empresa",
    },
    /* 5 — Porte */
    {
      step: 4, auto: true,
      render() {
        const q = C.perguntas.porte;
        return questionShell(1, q.titulo, "Escolha uma opção.", `
          <div class="options options--grid">${q.opcoes.map((o, k) => optBtn("porte", o, state.porte === o, false, k)).join("")}</div>`);
      },
      mount(el) { bindSingle(el, "porte"); },
      canNext: () => !!state.porte,
      hint: () => state.porte ? { t: "Registrado ✓", ok: true } : "Selecione uma opção",
    },
    /* 6 — RH */
    {
      step: 4, auto: true,
      render() {
        const q = C.perguntas.rh;
        return questionShell(2, q.titulo, "Escolha uma opção.", `
          <div class="options">${q.opcoes.map((o, k) => optBtn("rh", o, state.rh === o, false, k)).join("")}</div>`);
      },
      mount(el) { bindSingle(el, "rh"); },
      canNext: () => !!state.rh,
      hint: () => state.rh ? { t: "Registrado ✓", ok: true } : "Selecione uma opção",
    },
    /* 7 — Desafios (confirmação) */
    {
      step: 4,
      enter() { if (!state.diagDesafios) state.diagDesafios = new Set(state.desafios); },
      render() {
        const pre = state.desafios.size > 0;
        return questionShell(3, C.perguntas.desafios.titulo, "Marque quantos quiser.", `
          ${pre ? `<p class="prefill-note">${ico("check")} Já trouxemos o que você marcou antes. Confirme ou ajuste.</p>` : ""}
          <div class="options options--grid">${C.desafios.map((d, k) => optBtn("dd", d.titulo, state.diagDesafios.has(d.id), true, k, d.id)).join("")}</div>`);
      },
      mount(el) { bindMulti(el, "dd", state.diagDesafios); },
      canNext: () => state.diagDesafios && state.diagDesafios.size > 0,
      hint: () => state.diagDesafios?.size ? { t: `${state.diagDesafios.size} selecionado(s)`, ok: true } : "Selecione ao menos um",
    },
    /* 8 — Soluções de interesse */
    {
      step: 4,
      enter() {
        if (!state.diagSolucoes) {
          state.diagSolucoes = new Set(state.interesse);
        }
      },
      render() {
        const rec = new Set(recomendadas(state.diagDesafios || state.desafios).slice(0, 3));
        return questionShell(4, C.perguntas.solucoes.titulo, "Marque quantas quiser.", `
          ${state.interesse.size ? `<p class="prefill-note">${ico("heart")} Trouxemos as soluções que você marcou. Confirme ou ajuste.</p>` : ""}
          <div class="options options--grid">${C.solucoes.map((s, k) => optBtn("ds", s.nome + (rec.has(s.id) ? '<small>Sugerida pelos seus desafios</small>' : ""), state.diagSolucoes.has(s.id), true, k, s.id, true)).join("")}
          ${optBtn("ds", "Ainda não sei — quero orientação", state.diagSolucoes.has("orientacao"), true, C.solucoes.length, "orientacao")}</div>`);
      },
      mount(el) { bindMulti(el, "ds", state.diagSolucoes); },
      canNext: () => state.diagSolucoes && state.diagSolucoes.size > 0,
      hint: () => state.diagSolucoes?.size ? { t: `${state.diagSolucoes.size} selecionada(s)`, ok: true } : "Selecione ao menos uma",
    },
    /* 9 — Melhoria + contato */
    {
      step: 4, nextLabel: "Enviar e concluir",
      render() {
        const q = C.perguntas.melhoria;
        const chips = [state.porte && `${state.porte} colaboradores`, state.rh, ...[...(state.diagDesafios || [])].slice(0, 3).map((id) => desById[id]?.titulo)].filter(Boolean);
        return questionShell(5, q.titulo, "", `
          <div class="summary-chips">${chips.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
          <form class="form" id="leadForm" novalidate>
            <div class="field">
              <label for="f-melhoria">Sua percepção <span>(opcional)</span></label>
              <textarea id="f-melhoria" maxlength="600" placeholder="${esc(q.placeholder)}">${esc(state.melhoria)}</textarea>
              <div class="char"><span id="cc">${state.melhoria.length}</span>/600</div>
            </div>
            <p class="eyebrow" style="margin:8px 0 0">Para quem enviamos o retorno?</p>
            <div class="form__row">
              <div class="field" id="fw-nome"><label for="f-nome">Seu nome</label><input id="f-nome" autocomplete="name" maxlength="80" value="${esc(state.nome)}" /><div class="field__err">Informe seu nome</div></div>
              <div class="field" id="fw-empresa"><label for="f-empresa">Empresa</label><input id="f-empresa" autocomplete="organization" maxlength="100" value="${esc(state.empresa)}" /><div class="field__err">Informe o nome da empresa</div></div>
            </div>
            <div class="field"><label for="f-contato">WhatsApp ou e-mail <span>(opcional)</span></label><input id="f-contato" inputmode="email" autocomplete="tel" maxlength="100" value="${esc(state.contato)}" placeholder="(84) 9 9999-9999 ou nome@empresa.com" /></div>
            <div class="hp" aria-hidden="true"><label>Website<input id="f-web" tabindex="-1" autocomplete="off" /></label></div>
            <label class="consent" id="fw-consent"><input type="checkbox" id="f-consent" ${state.consent ? "checked" : ""} /> <span>Autorizo a Segantini a usar estas respostas para entrar em contato e preparar uma proposta para minha empresa. Os dados não são compartilhados com terceiros.</span></label>
          </form>`);
      },
      mount(el) {
        const bind = (id, key) => $(id, el).addEventListener("input", (e) => { state[key] = e.target.value; $(id, el).closest(".field")?.classList.remove("has-error"); updateNav(); });
        bind("#f-melhoria", "melhoria"); bind("#f-nome", "nome"); bind("#f-empresa", "empresa"); bind("#f-contato", "contato");
        $("#f-melhoria", el).addEventListener("input", () => ($("#cc", el).textContent = state.melhoria.length));
        $("#f-web", el).addEventListener("input", (e) => (state.hp = e.target.value));
        $("#f-consent", el).addEventListener("change", (e) => { state.consent = e.target.checked; updateNav(); });
        $("#leadForm", el).addEventListener("submit", (e) => { e.preventDefault(); next(); });
      },
      canNext: () => state.nome.trim().length > 1 && state.empresa.trim().length > 1 && state.consent,
      hint() {
        if (this.canNext()) return { t: "Tudo pronto para enviar", ok: true };
        return state.nome.trim() && state.empresa.trim() ? "Marque a autorização para enviar" : "Nome e empresa são obrigatórios";
      },
      async beforeNext(el) {
        if (!this.canNext()) {
          if (state.nome.trim().length < 2) $("#fw-nome", el).classList.add("has-error");
          if (state.empresa.trim().length < 2) $("#fw-empresa", el).classList.add("has-error");
          return false;
        }
        await submit();
        return true;
      },
    },
    /* 10 — Próximo passo */
    {
      step: 5, dark: true, final: true,
      render() {
        const first = esc(state.nome.trim().split(/\s+/)[0] || "");
        const recIds = [...new Set([...(state.diagSolucoes || [])].filter((id) => solById[id]).concat(recomendadas(state.diagDesafios || state.desafios)))].slice(0, 3);
        const badge = state.sendStatus === "ok"
          ? `<span class="success-badge">${ico("check")} Respostas recebidas pelo nosso time</span>`
          : `<span class="success-badge is-warn">${ico("message")} Não conseguimos registrar automaticamente — envie pelo WhatsApp abaixo</span>`;
        return `
        <section class="screen screen--dark"><div class="wrap final">
          <div>
            ${badge}
            <p class="eyebrow">Etapa 6 · Próximo passo</p>
            <h2 class="h1">Obrigado${first ? `, ${first}` : ""}! <em>Cada empresa tem uma realidade.</em></h2>
            <p class="lead">Por isso não trabalhamos com pacote pronto. Com o que você nos contou, vamos construir junto com você um caminho adequado ao momento da ${esc(state.empresa) || "sua empresa"}.</p>
            ${recIds.length ? `<p class="eyebrow" style="margin-top:6px">Um bom ponto de partida</p>
            <div class="rec-list">${recIds.map((id, k) => `<div class="rec" style="animation-delay:${0.1 * k}s"><span class="ico">${ico(solById[id].icone)}</span><div><h4>${esc(solById[id].nome)}</h4><p>${esc(solById[id].resultado)}</p></div></div>`).join("")}</div>` : ""}
            <ol class="steps">${C.proximosPassos.map((p) => `<li><div><strong>${esc(p.titulo)}</strong><span>${esc(p.texto)}</span></div></li>`).join("")}</ol>
          </div>
          <aside class="contact-card">
            <p class="eyebrow" style="margin:0">Vamos conversar?</p>
            <p style="margin:0;color:rgba(255,255,255,.85);font-size:15px">Fale agora com o nosso time comercial e dê o primeiro passo.</p>
            <a class="btn btn--wa btn--lg" href="${waLink(recIds)}" target="_blank" rel="noopener">${WA_SVG} Conversar no WhatsApp</a>
            <a class="plain" href="mailto:${esc(C.contato.email)}">${ico("mail")} ${esc(C.contato.email)}</a>
            <a class="plain" href="${esc(C.contato.site)}" target="_blank" rel="noopener">${ico("globe")} ${esc(C.contato.siteExibicao)}</a>
            <img class="final__logo" src="/assets/logo-segantini-branca.png" alt="Segantini Psicologia Empresarial" />
          </aside>
        </div></section>`;
      },
      hint: () => "",
    },
  ];

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
  function questionShell(n, title, sub, body) {
    return `<section class="screen"><div class="wrap wrap--narrow">
      <p class="eyebrow">Etapa 5 · Queremos entender sua empresa</p>
      <div class="q-count">Pergunta <b>${n}</b> de 5</div>
      <h2 class="h1" style="font-size:clamp(24px,3.6vw,34px)">${esc(title)}</h2>
      ${sub ? `<p class="lead" style="margin-bottom:22px">${esc(sub)}</p>` : '<div style="height:12px"></div>'}
      ${body}
    </div></section>`;
  }
  function optBtn(group, label, on, multi, k, value, rawLabel) {
    return `<button type="button" class="opt ${multi ? "opt--multi" : ""}" data-g="${group}" data-v="${esc(value ?? label)}" aria-pressed="${on}" style="animation-delay:${0.035 * k}s"><span class="opt__dot"></span><span>${rawLabel ? label : esc(label)}</span></button>`;
  }
  function bindSingle(el, key) {
    $$(`[data-g="${key}"]`, el).forEach((b) => b.addEventListener("click", () => {
      state[key] = b.dataset.v;
      $$(`[data-g="${key}"]`, el).forEach((x) => x.setAttribute("aria-pressed", x === b));
      updateNav();
      clearTimeout(bindSingle.t);
      bindSingle.t = setTimeout(() => { if (screens[state.i].auto) next(); }, 420);
    }));
  }
  function bindMulti(el, g, set) {
    $$(`[data-g="${g}"]`, el).forEach((b) => b.addEventListener("click", () => {
      const v = b.dataset.v;
      set.has(v) ? set.delete(v) : set.add(v);
      b.setAttribute("aria-pressed", set.has(v));
      updateNav();
    }));
  }

  /* ---------------- WhatsApp ---------------- */
  function waLink(recIds = []) {
    let msg = "Olá! Vi a apresentação da Segantini e gostaria de conversar com o time comercial.";
    if (state.nome.trim()) {
      msg = `Olá! Sou ${state.nome.trim()}${state.empresa.trim() ? `, da ${state.empresa.trim()}` : ""}. Acabei de ver a apresentação da Segantini`;
      const nomes = recIds.map((id) => solById[id]?.nome).filter(Boolean);
      msg += nomes.length ? ` e tenho interesse em conversar sobre ${nomes.join(", ")}.` : " e gostaria de conversar com o time comercial.";
    }
    return `https://wa.me/${C.contato.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  /* ---------------- Envio das respostas ---------------- */
  function buildPayload() {
    const dd = [...(state.diagDesafios || state.desafios)];
    const ds = [...(state.diagSolucoes || state.interesse)];
    return {
      nome: state.nome.trim(),
      empresa: state.empresa.trim(),
      contato: state.contato.trim(),
      porte: state.porte,
      rh: state.rh,
      desafios: dd.map((id) => desById[id]?.titulo || id),
      solucoes: ds.map((id) => solById[id]?.nome || (id === "orientacao" ? "Ainda não sei — quero orientação" : id)),
      recomendadas: recomendadas(new Set(dd)).slice(0, 3).map((id) => solById[id].nome),
      melhoria: state.melhoria.trim(),
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
  async function submit() {
    const btn = $("#btnNext");
    btn.disabled = true;
    $("#btnNextLabel").innerHTML = '<span class="spinner"></span>';
    const payload = buildPayload();
    let ok = await post(payload);
    if (!ok) ok = await post(payload); // 1 nova tentativa
    state.sendStatus = ok ? "ok" : "fail";
    if (!ok) { try { localStorage.setItem("seg_pending", JSON.stringify(payload)); } catch {} }
    btn.disabled = false;
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
    if (s.final) { hint.innerHTML = `<a class="btn--link" href="#" id="restart">Rever a apresentação</a>`; $("#restart").onclick = (e) => { e.preventDefault(); state.sendStatus = null; go(0); }; }
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
    if (!fromPop) history.pushState({ i }, "", location.search ? location.search : location.pathname);
    const cur = app.firstElementChild;
    if (cur) { cur.classList.add("is-leaving"); setTimeout(() => render(dir), 180); } else render(dir);
  }
  window.addEventListener("popstate", (e) => {
    const i = e.state?.i ?? 0;
    // Depois do envio, o "voltar" do celular não reabre o formulário (evita registro duplicado)
    if (state.sendStatus && i >= 5 && i <= 9) { history.pushState({ i: state.i }, ""); return; }
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
