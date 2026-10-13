/* ============================================================
   CONFIGURACIÓN · CyberVaras 2026
   Edita solo este archivo para fechas, CTFd y Google Form.
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

  /* Google Form. Deja formAction vacío mientras no esté conectado (modo vista previa).
     formAction = https://docs.google.com/forms/d/e/<ID_DEL_FORM>/formResponse
     Cada campo apunta a su entry.NNNNNN. */
  formAction: "",
  formEntries: {
    team:      "entry.1000000001",
    c_name:    "entry.1000000002",
    c_mail:    "entry.1000000003",
    c_career:  "entry.1000000004",
    c_campus:  "entry.1000000005",
    m2_name:   "entry.1000000006",
    m2_mail:   "entry.1000000007",
    m3_name:   "entry.1000000008",
    m3_mail:   "entry.1000000009",
    level:     "entry.1000000010",
    rules:     "entry.1000000011",
    photo:     "entry.1000000012"
  },

  /* Google Form de contacto (otro Form, independiente del de inscripción).
     Vacío = vista previa. */
  contactAction: "",
  contactEntries: {
    name:  "entry.2000000001",
    mail:  "entry.2000000002",
    team:  "entry.2000000003",
    topic: "entry.2000000004",
    msg:   "entry.2000000005"
  },

  /* Dominio permitido en los correos */
  emailDomain: "duocuc.cl"
};
