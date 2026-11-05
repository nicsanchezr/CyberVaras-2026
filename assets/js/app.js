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

  const RANK = [[1, "LosNoNames", 9060, 48], [2, "sudo rm -rf /*", 9060, 48], [3, "ARKA", 9060, 48], [4, "HireUsPls", 9060, 48], [5, "eskibidisigmas", 9060, 48], [6, "L1m1nal-N3tw0rk", 9060, 48], [7, "Kernel Panic", 9060, 48], [8, "SudoMamis", 9060, 48], [9, "Los Son of krippy", 9060, 48], [10, "auth", 9060, 48], [11, "hoxtxnDev", 9060, 48], [12, "00x", 9060, 48], [13, "Sekhmet", 9059, 48], [14, "3DMENTIONAL", 9050, 48], [15, "losAntiPala", 9040, 48], [16, "los sudo rm -rf", 9035, 48], [17, "sudo_win", 8974, 48], [18, "0x400804838f", 8934, 47], [19, "hanSolo", 8910, 47], [20, "Ghost Hook", 8909, 47], [21, "Stein", 8899, 47], [22, "Pinky promise", 8785, 46], [23, "paarthurnax", 8535, 45], [24, "MotoSploit", 7760, 48], [25, "BitBandits", 6485, 34], [26, "M1sh", 6259, 38], [27, "Cybeer", 6009, 45], [28, "HeXen", 4875, 31], [29, "kosmo", 4810, 27], [30, "Operacion Dora", 3860, 48], [31, "las_ellas", 3235, 23], [32, "bmo", 3135, 22], [33, "She_Wins", 3135, 22], [34, "NFIG", 0, 0], [35, "Black", 0, 0], [36, "FireStarter", 0, 0], [37, "Black and White", 0, 0], [38, "&> /dev/null", 0, 0], [39, "KernelPanic", 0, 0], [40, "Fondo_de_Bikini", 0, 0], [41, "CrazyPP", 0, 0], [42, "Ositos_Recargado", 0, 0]]; // [pos, equipo, puntos, retos resueltos] · puntaje final tras revisión
  const MAXPTS = 9060;
  const SEDE = {"LosNoNames": "San Carlos de Apoquindo", "sudo rm -rf /*": "Alameda", "ARKA": "Viña del Mar", "HireUsPls": "Maipú", "eskibidisigmas": "Antonio Varas", "L1m1nal-N3tw0rk": "Viña del Mar", "Kernel Panic": "Viña del Mar", "SudoMamis": "San Carlos de Apoquindo", "Los Son of krippy": "Concepción", "auth": "Concepción", "hoxtxnDev": "Concepción", "00x": "Concepción", "Sekhmet": "Otra", "3DMENTIONAL": "Concepción", "losAntiPala": "Puente Alto", "los sudo rm -rf": "Maipú", "sudo_win": "San Carlos de Apoquindo", "0x400804838f": "Viña del Mar", "hanSolo": "Concepción", "Ghost Hook": "San Carlos de Apoquindo", "Stein": "Concepción", "Pinky promise": "Viña del Mar", "paarthurnax": "Antonio Varas", "MotoSploit": "San Joaquín", "BitBandits": "Viña del Mar", "M1sh": "San Bernardo", "Cybeer": "Maipú", "HeXen": "Nacimiento", "kosmo": "Alameda", "Operacion Dora": "Antonio Varas", "las_ellas": "Alameda", "bmo": "Antonio Varas", "She_Wins": "Valparaíso", "NFIG": "Antonio Varas", "Black": "Antonio Varas", "FireStarter": "Concepción", "Black and White": "Concepción", "&> /dev/null": "Viña del Mar", "KernelPanic": "Antonio Varas", "Fondo_de_Bikini": "San Carlos de Apoquindo", "CrazyPP": "Maipú", "Ositos_Recargado": "Maipú"};
  const sedeOf = n => SEDE[n] && SEDE[n] !== "Otra" ? SEDE[n] : "Otra sede";
  const fmt = n => n.toLocaleString("es-CL");

  /* ---------------- router por hash ---------------- */
  const VIEWS = ["inicio", "resultados", "diplomas", "recursos", "bases", "contacto"];
  const TITLES = { resultados: "Resultados", diplomas: "Mi diploma", recursos: "Recursos", bases: "Bases", contacto: "Contacto" };
  function route() {
    let v = (location.hash || "#inicio").slice(1);
    if (!VIEWS.includes(v)) v = "inicio";
    $$(".view").forEach(el => { el.hidden = el.dataset.view !== v; });
    $$(".nav-links a").forEach(a => {
      if (a.getAttribute("href") === "#" + v) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = v === "inicio" ? "CyberVaras 2026" : "CyberVaras 2026 · " + TITLES[v];
    window.scrollTo(0, 0);
    NET.toggle(v === "inicio");
  }
  window.addEventListener("hashchange", route);

  /* ---------------- terminal de arranque ---------------- */
  const BOOT = [
    ["p", "root@cybervaras:~/2026$ ", "", "./resultados.sh --lvl 6"],
    ["c", "", "[*] sede ..................... ", "Antonio Varas"],
    ["c", "", "[*] modalidad ................ ", "online · 24h"],
    ["c", "", "[*] retos ..................... ", "48 · 7 categorías"],
    ["c", "", "[*] equipos inscritos ......... ", "42"],
    ["c", "", "[*] equipos con puntaje ....... ", "33"],
    ["w", "", "[!] status .................... ", "FINISHED"],
    ["p", "", "> mission_complete", ""]
  ];
  function boot() {
    const el = $("#boot");
    const html = BOOT.map(([k, pre, lab, val]) =>
      (pre ? `<span class="p">${esc(pre)}</span>${esc(val)}` :
       k === "p" ? `<span class="p">${esc(lab)}</span>` :
       `<span class="c">${esc(lab)}</span><span class="${k === "w" ? "w" : "a"}">${esc(val)}</span>`));
    if (reduceMotion) { el.innerHTML = html.join("\n") + '<span class="cursor">&nbsp;</span>'; return; }
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

  /* ---------------- resultados (datos estáticos) ---------------- */
  function renderResults() {
    const pod = RANK.slice(0, 3);
    const podHTML = pod.map((t, i) =>
      `<div class="pod p${i + 1}"><span class="place">${["1ST", "2ND", "3RD"][i]} · ${["oro", "plata", "bronce"][i]}</span><span class="tname">${esc(t[1])}</span><span class="tscore">${fmt(t[2])} pts</span><span class="tsub">${esc(sedeOf(t[1]))} · ${t[3]}/48 retos</span></div>`).join("");
    $("#podium").innerHTML = podHTML;
    $("#home-podium").innerHTML = podHTML;
    $("#rank-body").innerHTML = RANK.map(t =>
      `<tr><td class="pos">${pad(t[0])}</td><td class="team">${esc(t[1])}<small>${esc(sedeOf(t[1]))} · ${t[3] ? t[3] + " retos resueltos" : "sin retos resueltos"}</small></td><td class="pts">${fmt(t[2])}</td><td class="barcell"><div class="bar"><i style="width:${(t[2] / MAXPTS * 100).toFixed(1)}%"></i></div></td></tr>`).join("");
  }

  /* ---------------- tema claro (modo proyector) ---------------- */
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

  /* ---------------- arranque ---------------- */
  renderResults();
  setupContact();
  setupTools();
  boot();
  route();
})();
