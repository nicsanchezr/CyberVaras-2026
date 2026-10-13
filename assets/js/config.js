/* ============================================================
   CONFIGURACIÓN · CyberVaras 2026
   Edita solo este archivo para fechas, CTFd y el backend de formularios.
   ============================================================ */
window.CV_CONFIG = {
  /* Fechas (hora de Chile continental en octubre = UTC-03:00) */
  regOpen:  "2026-10-14T00:00:00-03:00",
  regClose: "2026-10-22T23:59:59-03:00",
  ctfStart: "2026-10-23T18:00:00-03:00",
  ctfEnd:   "2026-10-24T18:00:00-03:00",

  /* Plataforma CTFd (VPS). URL base, sin barra final. */
  ctfdUrl: "https://ctf.cybervaras.xyz",

  /* Scoreboard:
     "demo" → datos de ejemplo (para revisar el diseño)
     "live" → lee la API pública de CTFd (/api/v1/scoreboard) cada refreshSeconds */
  scoreboardMode: "demo",
  refreshSeconds: 30,

  /* Backend de formularios (Google Apps Script → Google Sheets).
     endpoint: URL de la aplicación web, termina en /exec. Vacío = formularios bloqueados.
     token: debe ser el mismo valor que TOKEN en Codigo.gs. */
  endpoint: "https://script.google.com/macros/s/AKfycby2BrjqchD61seiUHPT-PvPvwpz9uZyXQCt5rRbg6ERkBf-RtikCuhUYHYheQ9Y1mj8/exec",
  token: "cybervaras2026",

  /* Dominio permitido en los correos */
  emailDomain: "duocuc.cl"
};
