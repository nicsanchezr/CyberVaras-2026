// CyberVaras 2026 — scoreboard en vivo desde CTFd
// Requisitos: en CTFd, Account Visibility = Public y Score Visibility = Public.
// Pinta el top N dentro del elemento #scoreboard-live (agrega <div id="scoreboard-live"></div> en la seccion #scoreboard).
(function () {
  var API = "https://ctf.cybervaras.xyz/api/v1/scoreboard";
  var TARGET = "#scoreboard-live";
  var TOP = 10;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function load() {
    var el = document.querySelector(TARGET);
    if (!el) return;
    fetch(API, { headers: { Accept: "application/json" } })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var rows = (j && j.data ? j.data : []).slice(0, TOP);
        if (!rows.length) {
          el.innerHTML = '<p style="color:#8098BC;font-family:monospace">El scoreboard se activa al comenzar el campeonato.</p>';
          return;
        }
        var body = rows.map(function (t, i) {
          var pos = t.pos != null ? t.pos : i + 1;
          var posColor = i < 3 ? "#3DDC97" : "#8098BC";
          return '<tr style="border-bottom:1px solid #16263f">' +
            '<td style="padding:10px 8px;color:' + posColor + ';font-weight:700">' + pos + '</td>' +
            '<td style="padding:10px 8px">' + esc(t.name) + '</td>' +
            '<td style="padding:10px 8px;text-align:right;color:#36C5F4;font-weight:700">' + esc(t.score) + '</td>' +
            '</tr>';
        }).join("");
        el.innerHTML =
          '<table style="width:100%;border-collapse:collapse;font-family:\'IBM Plex Mono\',ui-monospace,monospace;color:#DBE6F5;font-size:16px">' +
          '<thead><tr style="color:#36C5F4;text-align:left;border-bottom:1px solid #22406a">' +
          '<th style="padding:10px 8px">#</th><th style="padding:10px 8px">Equipo</th>' +
          '<th style="padding:10px 8px;text-align:right">Puntos</th></tr></thead>' +
          '<tbody>' + body + '</tbody></table>';
      })
      .catch(function () {
        el.innerHTML = '<p style="color:#8098BC;font-family:monospace">No se pudo cargar el scoreboard (aun no esta publico o sin conexion).</p>';
      });
  }

  load();
  setInterval(load, 60000); // refresca cada 60 s
})();
