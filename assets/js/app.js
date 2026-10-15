/* CyberVaras 2026 · lógica del sitio (sin dependencias) */
(function () {
  "use strict";
  const C = window.CV_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const T = {
    regOpen: Date.parse(C.regOpen), regClose: Date.parse(C.regClose),
    start: Date.parse(C.ctfStart), end: Date.parse(C.ctfEnd)
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = n => String(n).padStart(2, "0");
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

  /* ---------------- router por hash ---------------- */
  const VIEWS = ["inicio", "inscripcion", "scoreboard", "recursos", "bases", "contacto"];
  function route() {
    let v = (location.hash || "#inicio").slice(1);
    if (!VIEWS.includes(v)) v = "inicio";
    $$(".view").forEach(el => { el.hidden = el.dataset.view !== v; });
    $$(".nav-links a").forEach(a => {
      if (a.getAttribute("href") === "#" + v) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = v === "inicio" ? "CyberVaras 2026" : "CyberVaras 2026 · " + ({ inscripcion: "Inscripción", scoreboard: "Scoreboard", recursos: "Recursos", bases: "Bases", contacto: "Contacto" }[v]);
    window.scrollTo(0, 0);
    if (v === "scoreboard") SB.start(); else SB.stop();
    if (v === "inscripcion") REG.onEnter();
    NET.toggle(v === "inicio");
  }
  window.addEventListener("hashchange", route);

  /* ---------------- fases del evento ---------------- */
  function phase(now = Date.now()) {
    if (now < T.regOpen) return "soon";
    if (now <= T.regClose) return "reg";
    if (now < T.start) return "wait";
    if (now < T.end) return "live";
    return "done";
  }
  function splitMs(ms) {
    ms = Math.max(0, ms);
    const s = Math.floor(ms / 1000);
    return { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
  }
  function tickCountdown() {
    const now = Date.now(), p = phase(now);
    const pill = $("#hero-status");
    const map = {
      soon: ["INSCRIPCIONES PRONTO", "open"], reg: ["INSCRIPCIONES ABIERTAS", "open"],
      wait: ["INSCRIPCIONES CERRADAS", "wait"], live: ["EN VIVO", "live"], done: ["FINALIZADO", "done"]
    };
    pill.textContent = map[p][0];
    pill.className = "status-pill " + map[p][1];
    const target = p === "live" ? T.end : T.start;
    $("#count-label").textContent = p === "live" ? "// T-MINUS · cierre del campeonato" :
      p === "done" ? "// GAME_OVER · gracias por jugar" : "// T-MINUS · inicio del campeonato";
    const t = splitMs(p === "done" ? 0 : target - now);
    $$("#countdown b").forEach(b => { const u = b.dataset.u; b.textContent = u === "d" ? t.d : pad(t[u]); });
    REG.tick(now);
  }

  /* ---------------- terminal de arranque ---------------- */
  const BOOT = [
    ["p", "root@cybervaras:~/2026$ ", "", "./init_campeonato.sh --lvl 6"],
    ["c", "", "[*] cargando sede ............ ", "Antonio Varas"],
    ["c", "", "[*] modalidad ................ ", "online · 24h"],
    ["c", "", "[*] categorías ............... ", "7 · +40 retos"],
    ["c", "", "[*] equipos .................. ", "1–3 jugadores @duocuc.cl"],
    ["c", "", "[*] plataforma ............... ", "CTFd · ONLINE"],
    ["w", "", "[!] flag_format .............. ", "CITT{...}"],
    ["p", "", "> mission_loaded", ""]
  ];
  function boot() {
    const el = $("#boot");
    const html = BOOT.map(([k, pre, lab, val]) =>
      (pre ? `<span class="p">${esc(pre)}</span>${esc(val)}` :
       k === "p" ? `<span class="p">${esc(lab)}</span>` :
       `<span class="c">${esc(lab)}</span><span class="${k === "w" ? "w" : "a"}">${esc(val)}</span>`));
    if (reduceMotion) { el.innerHTML = html.join("\n") + '<span class="cursor">&nbsp;</span>'; return; }
    // escritura línea a línea (el texto completo queda visible al final)
    const plain = BOOT.map(([k, pre, lab, val]) => pre + lab + val);
    let li = 0, ci = 0;
    el.innerHTML = '<span class="cursor">&nbsp;</span>';
    (function step() {
      if (li >= plain.length) { el.innerHTML = html.join("\n") + '<span class="cursor">&nbsp;</span>'; return; }
      const done = html.slice(0, li).join("\n");
      const partial = esc(plain[li].slice(0, ci));
      el.innerHTML = (done ? done + "\n" : "") + partial + '<span class="cursor">&nbsp;</span>';
      if (li === 0 && ci < plain[0].length) { ci++; setTimeout(step, ci < 25 ? 18 : 38); }
      else { li++; ci = li < plain.length ? plain[li].length : 0; setTimeout(step, li === 1 ? 260 : 120); }
    })();
  }

  /* ---------------- red animada del hero ---------------- */
  const NET = (function () {
    const cv = $("#net"); const ctx = cv.getContext("2d");
    let nodes = [], pulses = [], raf = null, w = 0, h = 0, on = true;
    function color(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#36c5f4"; }
    function size() {
      const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, Math.max(24, w * h / 16000)));
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }));
    }
    function draw() {
      const acc = color("--accent"), ok = color("--ok");
      ctx.clearRect(0, 0, w, h);
      const D = 140;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < D) {
            ctx.globalAlpha = (1 - d / D) * .35; ctx.strokeStyle = acc; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (!reduceMotion && Math.random() < .0009 && pulses.length < 8) pulses.push({ a, b, t: 0 });
          }
        }
        ctx.globalAlpha = .7; ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(a.x, a.y, 1.6, 0, 7); ctx.fill();
      }
      pulses = pulses.filter(p => p.t <= 1);
      pulses.forEach(p => {
        p.t += .02;
        const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.globalAlpha = 1; ctx.fillStyle = ok; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (on && !reduceMotion) raf = requestAnimationFrame(draw);
    }
    size(); window.addEventListener("resize", () => { size(); if (reduceMotion) draw(); });
    return {
      toggle(v) {
        on = v; cancelAnimationFrame(raf);
        if (v) { size(); draw(); }
      }
    };
  })();

  /* ---------------- envío al backend (Google Apps Script) ---------------- */
  async function postJSON(obj) {
    // text/plain evita la consulta previa CORS; Apps Script responde JSON tras una redirección
    const r = await fetch(C.endpoint, { method: "POST", body: JSON.stringify(obj), redirect: "follow" });
    let j = {};
    try { j = await r.json(); } catch (e) { throw new Error("respuesta inválida"); }
    return j;
  }

  /* ---------------- estado de inscripciones (aviso + bloqueo) ---------------- */
  const REG = (function () {
    const DIAS_L = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const MESES_L = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const fmtDay = ms => { const d = new Date(ms); return `${DIAS_L[d.getDay()]} ${d.getDate()} de ${MESES_L[d.getMonth()]}`; };
    // prueba interna: https://2026.cybervaras.xyz/?prueba#inscripcion habilita el formulario
    const testing = new URLSearchParams(location.search).has("prueba");
    const dlg = $("#reg-dialog");
    let shownOnce = false, last = null;
    function state(now = Date.now()) {
      if (testing && C.endpoint) return "open";
      if (now > T.regClose) return "closed";
      if (now < T.regOpen || !C.endpoint) return "soon";
      return "open";
    }
    function texts(st) {
      if (st === "closed") return {
        pill: "CERRADAS", eyebrow: "// REGISTRATION_CLOSED", title: "Las inscripciones están cerradas",
        body: `El plazo terminó el ${fmtDay(T.regClose)}. Te esperamos en el marcador y en la próxima edición.`,
        inline: `Las inscripciones cerraron el ${fmtDay(T.regClose)}.`
      };
      const future = Date.now() < T.regOpen;
      return {
        pill: "PRÓXIMAMENTE", eyebrow: "// ACCESS_DENIED", title: "Las inscripciones aún no abren",
        body: future
          ? `Se abren el ${fmtDay(T.regOpen)} y estarán disponibles hasta el ${fmtDay(T.regClose)}. Mientras tanto, arma tu equipo y revisa los recursos.`
          : "Se abrirán en breve. Mientras tanto, arma tu equipo y revisa los recursos.",
        inline: future ? `Las inscripciones se abren el ${fmtDay(T.regOpen)}.` : "Las inscripciones se abrirán en breve."
      };
    }
    function apply(now = Date.now()) {
      const st = state(now), f = $("#reg"), locked = st !== "open";
      if (st === last) return st;
      last = st;
      f.classList.toggle("locked", locked);
      $$("fieldset", f).forEach(fs => { fs.disabled = locked; });
      $("#f-submit").disabled = locked;
      const box = $("#reg-state");
      box.hidden = !locked;
      if (locked) {
        const t = texts(st);
        box.classList.toggle("closed", st === "closed");
        $("#reg-state-pill").textContent = t.pill;
        $("#reg-state-pill").className = "status-pill " + (st === "closed" ? "done" : "wait");
        $("#reg-state-text").textContent = t.inline;
      } else if (dlg.open) dlg.close();
      return st;
    }
    function countdown(now) {
      const box = $("#reg-dialog-count");
      if (state(now) !== "soon" || now >= T.regOpen) { box.innerHTML = ""; return; }
      const t = splitMs(T.regOpen - now);
      box.innerHTML = [["d", "días"], ["h", "horas"], ["m", "min"], ["s", "seg"]]
        .map(([u, l]) => `<div><b>${u === "d" ? t.d : pad(t[u])}</b><small>${l}</small></div>`).join("");
    }
    function show() {
      const st = state();
      if (st === "open") return;
      const t = texts(st);
      $("#reg-dialog-eyebrow").textContent = t.eyebrow;
      $("#reg-dialog-title").textContent = t.title;
      $("#reg-dialog-text").textContent = t.body;
      countdown(Date.now());
      if (!dlg.open) { try { dlg.showModal(); } catch (e) { dlg.setAttribute("open", ""); } }
    }
    $("#reg-dialog-ok").addEventListener("click", () => dlg.close());
    $("#reg-dialog-res").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
    $("#reg").addEventListener("click", () => { if (state() !== "open") show(); });
    return {
      testing,
      state,
      show,
      tick(now) { apply(now); if (dlg.open) countdown(now); },
      onEnter() { apply(); if (state() !== "open" && !shownOnce) { shownOnce = true; setTimeout(show, 250); } }
    };
  })();

  /* ---------------- formulario de inscripción ---------------- */
  function setupForm() {
    const f = $("#reg"), out = $("#f-out");
    const domRe = new RegExp("^[A-Za-z0-9._%+-]+@" + C.emailDomain.replace(/\./g, "\\.") + "$", "i");
    const setErr = (key, msg, input) => {
      const e = $(`.err[data-for="${key}"]`); if (e) e.textContent = msg || "";
      if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
    };
    function validate() {
      let ok = true; const first = [];
      const need = (id, msg) => { const i = $("#" + id); const bad = !i.value.trim(); setErr(id, bad ? msg : "", i); if (bad) { ok = false; first.push(i); } };
      need("f-team", "Escribe el nombre del equipo.");
      need("f-c-name", "Escribe el nombre del integrante 1.");
      need("f-c-career", "Indica la carrera.");
      const camp = $("#f-c-campus"); const cb = !camp.value; setErr("f-c-campus", cb ? "Selecciona una sede." : "", camp); if (cb) { ok = false; first.push(camp); }
      const mails = [];
      [["f-c-mail", true], ["f-m2-mail", false], ["f-m3-mail", false]].forEach(([id, req]) => {
        const i = $("#" + id), v = i.value.trim();
        let msg = "";
        if (!v && req) msg = "El correo del integrante 1 es obligatorio.";
        else if (v && !domRe.test(v)) msg = `Usa tu correo institucional @${C.emailDomain}.`;
        else if (v && mails.includes(v.toLowerCase())) msg = "Este correo ya está en el equipo.";
        if (v) mails.push(v.toLowerCase());
        setErr(id, msg, i); if (msg) { ok = false; first.push(i); }
      });
      [2, 3].forEach(n => {
        const ids = ["name", "mail", "career", "campus"].map(k => `f-m${n}-${k}`);
        const els = ids.map(id => $("#" + id));
        if (!els.some(e => e.value.trim())) return;
        const msgs = { name: "Escribe el nombre de este integrante.", mail: "Agrega el correo de este integrante.", career: "Indica la carrera.", campus: "Selecciona una sede." };
        ["name", "mail", "career", "campus"].forEach((k, i) => {
          const e = els[i];
          if (!e.value.trim() && !(k === "mail" && $(`.err[data-for="${ids[i]}"]`).textContent)) { setErr(ids[i], msgs[k], e); ok = false; first.push(e); }
        });
      });
      ["level"].forEach(name => {
        const bad = !f.querySelector(`input[name="${name}"]:checked`);
        setErr(name, bad ? "Elige una opción." : ""); if (bad) { ok = false; first.push(f.querySelector(`input[name="${name}"]`)); }
      });
      const r = $("#f-rules"); setErr("f-rules", r.checked ? "" : "Debes aceptar las bases para inscribirte.", r); if (!r.checked) { ok = false; first.push(r); }
      if (first[0]) first[0].focus();
      return ok;
    }
    f.addEventListener("submit", async ev => {
      ev.preventDefault();
      if (REG.state() !== "open") { REG.show(); return; }
      if (!validate()) return;
      const data = new FormData(f);
      const g = k => (data.get(k) || "").toString().trim();
      const member = p => ({ nombre: g(p + "_name"), correo: g(p + "_mail").toLowerCase(), carrera: g(p + "_career"), sede: g(p + "_campus") });
      const payload = {
        tipo: "inscripcion", token: C.token, prueba: REG.testing,
        equipo: g("team"),
        integrantes: [member("c"), member("m2"), member("m3")].filter(m => m.nombre || m.correo),
        experiencia: g("level"),
        bases: $("#f-rules").checked,
        fotos: $("#f-photo").checked
      };
      const team = payload.equipo, mail = payload.integrantes[0].correo;
      const btn = $("#f-submit"); btn.disabled = true;
      out.hidden = false;
      out.innerHTML = `<span class="c">$ ./enviar_inscripcion --team "${esc(team)}"</span>\n<span class="c">[*] enviando…</span>`;
      try {
        const res = await postJSON(payload);
        if (!res.ok) {
          out.innerHTML = `<span class="c">$ ./enviar_inscripcion --team "${esc(team)}"</span>\n<span class="x">[x] ${esc(res.mensaje || "No pudimos registrar la inscripción.")}</span>`;
          if (res.campo === "equipo") { setErr("f-team", res.mensaje, $("#f-team")); $("#f-team").focus(); }
          return;
        }
        out.innerHTML =
          `<span class="c">$ ./enviar_inscripcion --team "${esc(team)}"</span>\n` +
          (`<span class="p">[+] inscripción registrada</span>\n[i] equipo: ${esc(team)}\n[i] te avisaremos en ${esc(mail)}\n<span class="p">&gt; see_you_on_the_scoreboard_</span>`);
        f.reset(); $$("[aria-invalid]", f).forEach(i => i.setAttribute("aria-invalid", "false"));
      } catch (e) {
        out.innerHTML = `<span class="x">[x] no pudimos enviar la inscripción.</span>\nRevisa tu conexión e inténtalo otra vez. Si el problema sigue, escríbenos desde el formulario de contacto.`;
      } finally { btn.disabled = REG.state() !== "open"; }
    });
    $$("input, select", f).forEach(i => i.addEventListener("input", () => {
      if (i.getAttribute("aria-invalid") === "true") { i.setAttribute("aria-invalid", "false"); setErr(i.id, ""); }
      if (i.type === "radio") setErr(i.name, "");
    }));
  }

  /* ---------------- formulario de contacto ---------------- */
  function setupContact() {
    const f = $("#contact"), out = $("#k-out");
    const ready = !!C.endpoint;
    $("#contact-state").hidden = ready;
    f.classList.toggle("locked", !ready);
    $$("fieldset", f).forEach(fs => { fs.disabled = !ready; });
    $("#k-submit").disabled = !ready;
    const mailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const setErr = (id, msg) => {
      const e = $(`.err[data-for="${id}"]`); if (e) e.textContent = msg || "";
      const i = $("#" + id); if (i) i.setAttribute("aria-invalid", msg ? "true" : "false");
    };
    function validate() {
      const checks = [
        ["k-name", v => v ? "" : "Escribe tu nombre."],
        ["k-mail", v => !v ? "Escribe un correo para responderte." : mailRe.test(v) ? "" : "Revisa el formato del correo."],
        ["k-topic", v => v ? "" : "Elige un tema."],
        ["k-msg", v => v.length >= 10 ? "" : "Cuéntanos un poco más (mínimo 10 caracteres)."]
      ];
      let first = null;
      checks.forEach(([id, fn]) => { const msg = fn($("#" + id).value.trim()); setErr(id, msg); if (msg && !first) first = $("#" + id); });
      if (first) first.focus();
      return !first;
    }
    f.addEventListener("submit", async ev => {
      ev.preventDefault();
      if (!ready) return;
      if (!validate()) return;
      const vals = { name: $("#k-name").value.trim(), mail: $("#k-mail").value.trim(), team: $("#k-team").value.trim(), topic: $("#k-topic").value, msg: $("#k-msg").value.trim() };
      const btn = $("#k-submit"); btn.disabled = true; out.hidden = false;
      out.innerHTML = `<span class="c">$ ./enviar_mensaje --tema "${esc(vals.topic)}"</span>\n<span class="c">[*] enviando…</span>`;
      try {
        const res = await postJSON({ tipo: "contacto", token: C.token, nombre: vals.name, correo: vals.mail, equipo: vals.team, tema: vals.topic, mensaje: vals.msg });
        if (!res.ok) throw new Error(res.mensaje || "error");
        out.innerHTML = `<span class="c">$ ./enviar_mensaje --tema "${esc(vals.topic)}"</span>\n` + `<span class="p">[+] mensaje enviado</span>\n[i] te responderemos en ${esc(vals.mail)}`;
        f.reset();
      } catch (e) {
        out.innerHTML = `<span class="x">[x] no pudimos enviar el mensaje.</span>\nRevisa tu conexión e inténtalo otra vez.`;
      } finally { btn.disabled = false; }
    });
    $$("input, select, textarea", f).forEach(i => i.addEventListener("input", () => { if (i.getAttribute("aria-invalid") === "true") setErr(i.id, ""); }));
  }

  /* ---------------- scoreboard ---------------- */
  const SB = (function () {
    let timer = null, prevPos = {}, demoClock = null, lastData = null;
    const demo = C.scoreboardMode !== "live";

    /* datos de ejemplo deterministas */
    function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
    const DEMO_TEAMS = ["Kernel_Panic", "0xVaras", "NullPointers", "Los Paquetes Perdidos", "SQLazos", "Byte Bandits", "Root_Access", "Flag Hunters", "Huemules Binarios", "Shell Shock", "Stack Overflow Club", "Los Pingüinos de Kali", "Bit Flippers"];
    const DEMO_CH = [
      ["Bienvenida", 100], ["Fuente de la verdad", 100], ["Base64 everywhere", 100],
      ["El Buscador Olvidado", 150], ["Galleta de la Fortuna", 200], ["Perfil Ajeno", 250], ["El Traductor", 350], ["Token sin firma", 450],
      ["César en vacaciones", 150], ["XOR de una letra", 250], ["RSA pequeñito", 450], ["Hash olvidado", 200],
      ["Foto con historia", 150], ["Capas", 250], ["Disco roto", 400], ["Log del incidente", 300],
      ["Telnet en claro", 150], ["Exfil DNS", 350], ["FTP indiscreto", 200],
      ["¿Dónde está la sede?", 200], ["Perfil fantasma", 300], ["Paso a paso", 250],
      ["strings y más", 150], ["Crackme 1", 350], ["Ofuscado", 500]
    ];
    let demoSolves = null;
    function buildDemo() {
      const r = rng(2026); const out = [];
      DEMO_TEAMS.forEach((name, ti) => {
        const skill = 1 - ti / (DEMO_TEAMS.length + 2);
        DEMO_CH.forEach(([ch, val], ci) => {
          const diff = val / 520;
          if (r() < skill * 1.15 - diff * .55) {
            const hour = Math.min(23.8, (diff * 14 + r() * 10) * (1.25 - skill * .6) + (ti % 3) * .3);
            out.push({ team: name, ch, value: val, t: T.start + hour * 3600e3 });
          }
        });
      });
      return out.sort((a, b) => a.t - b.t);
    }
    function demoData() {
      if (!demoSolves) demoSolves = buildDemo();
      if (demoClock === null) demoClock = T.start + 14 * 3600e3;
      const now = demoClock;
      const solves = demoSolves.filter(s => s.t <= now);
      const teams = DEMO_TEAMS.map(n => ({ name: n, score: 0, last: 0, n: 0 }));
      const byName = Object.fromEntries(teams.map(t => [t.name, t]));
      solves.forEach(s => { const t = byName[s.team]; t.score += s.value; t.last = s.t; t.n++; });
      return { now, teams, solves, demo: true };
    }
    function advanceDemo() {
      demoClock += 9 * 60e3;
      if (demoClock > T.end) demoClock = T.start + 2 * 3600e3;
    }

    async function liveData() {
      const base = C.ctfdUrl.replace(/\/$/, "");
      const [sb, top] = await Promise.all([
        fetch(base + "/api/v1/scoreboard", { credentials: "omit" }).then(r => r.json()),
        fetch(base + "/api/v1/scoreboard/top/10", { credentials: "omit" }).then(r => r.json())
      ]);
      const teams = (sb.data || []).map(t => ({ name: t.name, score: t.score, last: 0, n: 0 }));
      const byName = Object.fromEntries(teams.map(t => [t.name, t]));
      const solves = [];
      Object.values(top.data || {}).forEach(t => {
        (t.solves || []).forEach(s => {
          const ts = Date.parse(s.date);
          solves.push({ team: t.name, ch: null, value: s.value, t: ts });
          if (byName[t.name]) { byName[t.name].last = Math.max(byName[t.name].last, ts); byName[t.name].n++; }
        });
      });
      solves.sort((a, b) => a.t - b.t);
      return { now: Date.now(), teams, solves, demo: false };
    }

    function rankTeams(teams) {
      return teams.slice().sort((a, b) => b.score - a.score || (a.last || Infinity) - (b.last || Infinity) || a.name.localeCompare(b.name));
    }
    function fmtClock(ms) { const d = new Date(ms); return pad(d.getHours()) + ":" + pad(d.getMinutes()); }
    function fmtLeft(ms) { const t = splitMs(ms); return t.d ? `${t.d}d ${pad(t.h)}h` : `${pad(t.h)}:${pad(t.m)}:${pad(t.s)}`; }

    function render(D) {
      lastData = D;
      const ranked = rankTeams(D.teams);
      const p = D.demo ? "live" : phase(D.now);
      const max = Math.max(1, ...ranked.map(t => t.score));

      // banner
      const ban = $("#sb-banner");
      if (D.demo) {
        ban.innerHTML = `<span><span class="status-pill wait">DATOS DE EJEMPLO</span>&nbsp; simulación del marcador a las <b>${Math.floor((D.now - T.start) / 3600e3)} h</b> de juego</span><span>Se activa en vivo el vie 23 oct 18:00</span>`;
      } else if (p === "live") {
        ban.innerHTML = `<span><span class="status-pill live">EN VIVO</span>&nbsp; se actualiza cada ${C.refreshSeconds} s</span><span>cierre en <b>${fmtLeft(T.end - Date.now())}</b></span>`;
      } else if (p === "done") {
        ban.innerHTML = `<span><span class="status-pill done">MARCADOR FINAL</span></span><span>Gracias por jugar · premiación por anunciar</span>`;
      } else {
        ban.innerHTML = `<span><span class="status-pill wait">EN ESPERA</span>&nbsp; el marcador se activa al inicio</span><span>comienza en <b>${fmtLeft(T.start - Date.now())}</b></span>`;
      }
      $("#sb-meta").textContent = D.demo ? "vista previa del marcador" : C.ctfdUrl.replace(/^https?:\/\//, "");

      // KPIs
      $("#k-teams").textContent = ranked.length;
      $("#k-solves").textContent = D.solves.length;
      $("#k-solves").previousElementSibling.textContent = D.demo ? "Flags capturadas" : "Flags · top 10";
      $("#k-top").textContent = ranked[0] ? ranked[0].score.toLocaleString("es-CL") : "–";
      $("#k-left").textContent = p === "done" ? "00:00:00" : fmtLeft((p === "live" ? T.end : T.start) - D.now);

      // podio
      const pod = ranked.slice(0, 3);
      $("#podium").innerHTML = pod.length && pod[0].score > 0 ? pod.map((t, i) =>
        `<div class="pod p${i + 1}"><span class="place">${["1ST", "2ND", "3RD"][i]} · ${["oro", "plata", "bronce"][i]}</span><span class="tname">${esc(t.name)}</span><span class="tscore">${t.score.toLocaleString("es-CL")} pts</span><span class="tsub">${t.n} flags${t.last ? " · última " + fmtClock(t.last) : ""}</span></div>`
      ).join("") : "";

      // tabla
      const newPos = {};
      $("#rank-body").innerHTML = ranked.length ? ranked.map((t, i) => {
        newPos[t.name] = i;
        const was = prevPos[t.name];
        const cls = was === undefined ? "" : was > i ? "up flash" : was < i ? "down" : "";
        return `<tr class="${cls}"><td class="pos">${pad(i + 1)}</td><td class="team">${esc(t.name)}<small>${t.n ? t.n + " flags" : "sin flags aún"}</small></td><td class="pts">${t.score.toLocaleString("es-CL")}</td><td class="barcell"><div class="bar"><i style="width:${(t.score / max * 100).toFixed(1)}%"></i></div></td></tr>`;
      }).join("") : `<tr><td colspan="4"><div class="empty">Aún no hay equipos en el marcador.</div></td></tr>`;
      prevPos = newPos;
      $("#sb-updated").textContent = "act. " + fmtClock(Date.now());

      renderChart(D, ranked.slice(0, 5));
      renderFeed(D);
    }

    function renderChart(D, top) {
      const box = $("#chart"), leg = $("#legend");
      if (!top.length || !D.solves.length) { box.innerHTML = '<div class="empty">El gráfico aparece con la primera flag.</div>'; leg.innerHTML = ""; return; }
      const W = 560, H = 260, L = 44, R = 14, Tp = 12, B = 30;
      const now = Math.min(D.now, T.end);
      const span = Math.max(3600e3, now - T.start);
      const hours = span / 3600e3;
      const step = hours > 16 ? 4 : hours > 8 ? 2 : 1;
      const maxScore = Math.max(...top.map(t => t.score), 100);
      const mag = Math.pow(10, Math.floor(Math.log10(maxScore)));
      const yStep = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => maxScore / s <= 5) || mag * 10;
      const yMax = Math.ceil(maxScore / yStep) * yStep;
      const X = t => L + (t - T.start) / span * (W - L - R);
      const Y = v => Tp + (1 - v / yMax) * (H - Tp - B);
      let g = "";
      for (let v = 0; v <= yMax; v += yStep) {
        g += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--grid)"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="12.5" fill="var(--muted)" font-family="var(--f-mono)">${v.toLocaleString("es-CL")}</text>`;
      }
      for (let hh = 0; hh <= hours + 1e-9; hh += step) {
        const x = X(T.start + hh * 3600e3);
        g += `<text x="${x}" y="${H - 8}" text-anchor="middle" font-size="12.5" fill="var(--muted)" font-family="var(--f-mono)">${hh}h</text>`;
      }
      const lines = top.map((t, i) => {
        let s = 0, d = `M${X(T.start).toFixed(1)} ${Y(0).toFixed(1)}`;
        D.solves.filter(x => x.team === t.name).forEach(x => {
          d += ` H${X(x.t).toFixed(1)}`; s += x.value; d += ` V${Y(s).toFixed(1)}`;
        });
        d += ` H${X(now).toFixed(1)}`;
        const col = `var(--c${i + 1})`;
        return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${i === 0 ? 2.5 : 1.75}" stroke-linejoin="round"/><circle cx="${X(now).toFixed(1)}" cy="${Y(s).toFixed(1)}" r="3.5" fill="${col}"/>`;
      }).reverse().join("");
      box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Puntaje acumulado de los cinco primeros equipos por hora de juego">${g}<line x1="${L}" x2="${W - R}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--line-2)"/>${lines}</svg>`;
      leg.innerHTML = top.map((t, i) => `<span><i style="background:var(--c${i + 1})"></i>${esc(t.name)}</span>`).join("");
    }

    function renderFeed(D) {
      const seen = new Set(), firsts = new Set();
      D.solves.forEach((s, i) => { const k = s.ch; if (k && !seen.has(k)) { seen.add(k); firsts.add(i); } });
      const items = D.solves.map((s, i) => ({ s, i })).slice(-14).reverse();
      $("#feed").innerHTML = items.length ? items.map(({ s, i }) =>
        `<li><time>${fmtClock(s.t)}</time><span class="who"><b>${esc(s.team)}</b> ${s.ch ? "· " + esc(s.ch) : "capturó una flag"}${firsts.has(i) ? '<span class="first">FIRST BLOOD</span>' : ""}</span><span class="val">+${s.value}</span></li>`
      ).join("") : '<li><span></span><span class="who" style="color:var(--muted)">Aún no hay flags capturadas.</span><span></span></li>';
    }

    async function refresh() {
      try {
        if (demo) { render(demoData()); advanceDemo(); }
        else if (Date.now() < T.start) { render({ now: Date.now(), teams: [], solves: [], demo: false }); }
        else { render(await liveData()); }
      } catch (e) {
        if (lastData) render(lastData);
        $("#sb-meta").textContent = "sin conexión con la plataforma · mostrando el último dato";
      }
    }
    return {
      start() { if (timer) return; refresh(); timer = setInterval(refresh, (demo ? 6 : C.refreshSeconds) * 1000); },
      stop() { clearInterval(timer); timer = null; }
    };
  })();

  /* ---------------- modo proyector y pantalla completa ---------------- */
  function setupTools() {
    const root = document.documentElement, btn = $("#sb-theme");
    const apply = light => {
      if (light) root.setAttribute("data-theme", "light"); else root.removeAttribute("data-theme");
      btn.textContent = light ? "Modo oscuro" : "Modo proyector";
    };
    apply(store.get("cv-theme") === "light");
    btn.addEventListener("click", () => {
      const light = root.getAttribute("data-theme") !== "light";
      apply(light); store.set("cv-theme", light ? "light" : "dark");
    });
    const fs = $("#sb-fs"), view = $("#v-scoreboard");
    const setFs = on => { document.body.classList.toggle("is-fs", on); view.classList.toggle("fs", on); fs.textContent = on ? "Salir de pantalla completa" : "Pantalla completa"; };
    fs.addEventListener("click", async () => {
      const on = !document.body.classList.contains("is-fs");
      setFs(on);
      try {
        if (on && document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
        else if (!on && document.fullscreenElement) await document.exitFullscreen();
      } catch (e) { /* el modo compacto queda activo aunque el navegador no permita fullscreen */ }
    });
    document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement) setFs(false); });
  }

  /* ---------------- arranque ---------------- */
  setupForm();
  setupContact();
  setupTools();
  tickCountdown(); setInterval(tickCountdown, 1000);
  boot();
  route();
})();
