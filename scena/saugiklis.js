/* ==========================================================================
   TIKRA VERTĖ — SAUGIKLIS
   Autorius: Marijus Tamulynas, 2026

   Įkeliamas PIRMAS kiekviename puslapyje, prieš katalogas.js ir svetaine.js.
   Todėl pagauna ir jų klaidas — net tas, dėl kurių tie failai visai nepaleidžia.

   Daro keturis dalykus:
     1. Parodo tikrą klaidos tekstą raudona juosta viršuje, o ne tylą.
     2. Duoda mygtuką „Kopijuoti" — tekstą gali iškart atsiųsti.
     3. Jei veikia serveris (window.TV_VARIKLIS), persiunčia klaidą jam.
     4. Neleidžia patikros formai persikrauti puslapio, jei svetaine.js
        nustotų veikti — kitaip mygtukas tiesiog mestų atgal į tą patį puslapį.

   Šis failas beveik niekada nesikeis. Jo darbas — išlikti, kai kitiems blogai.
   ========================================================================== */

(function () {
  "use strict";

  var SAUGIKLIO_VERSIJA = "2026-10-03.1";
  var praneštos = {};          /* ta pati klaida rodoma tik kartą */

  function juosta(antraste, tekstas) {
    var d = document.getElementById("saugiklioJuosta");
    if (!d) {
      d = document.createElement("div");
      d.id = "saugiklioJuosta";
      d.style.cssText =
        "position:fixed;left:0;right:0;top:0;z-index:99999;background:#7E1C12;" +
        "color:#F7EFE2;padding:10px 16px;font:13px/1.5 ui-monospace,Consolas,monospace;" +
        "display:flex;align-items:flex-start;gap:14px;box-shadow:0 2px 12px rgba(0,0,0,.35);";
      var t = document.createElement("div");
      t.id = "saugiklioTekstas";
      t.style.cssText = "flex:1;white-space:pre-wrap;word-break:break-word;";
      var k = document.createElement("button");
      k.type = "button";
      k.textContent = "Kopijuoti";
      k.style.cssText =
        "flex-shrink:0;background:transparent;color:#F7EFE2;border:1px solid #F7EFE2;" +
        "padding:5px 12px;font:12px/1 inherit;cursor:pointer;";
      k.onclick = function () {
        var s = document.getElementById("saugiklioTekstas").textContent;
        try {
          navigator.clipboard.writeText(s);
          k.textContent = "Nukopijuota";
        } catch (e) {
          window.prompt("Nukopijuok šį tekstą:", s);
        }
      };
      d.appendChild(t);
      d.appendChild(k);
      (document.body || document.documentElement).insertBefore(
        d, (document.body || document.documentElement).firstChild);
    }
    /* Rodome PIRMĄ klaidą, ne paskutinę. Pirmoji yra priežastis, visos kitos —
       jos pasekmės („BUKLES is not defined" atsiranda todėl, kad prieš tai
       sulūžo katalogas.js). Vėlesnes tik suskaičiuojam. */
    var t = document.getElementById("saugiklioTekstas");
    if (t.dataset.uzimta) {
      var n = (parseInt(t.dataset.daugiau || "0", 10) + 1);
      t.dataset.daugiau = String(n);
      t.textContent = t.textContent.replace(/\n\(dar .*\)$/, "") +
                      "\n(dar " + n + " klaid" + (n === 1 ? "a" : "os") + " po šios)";
      return;
    }
    t.dataset.uzimta = "1";
    t.textContent = antraste + "\n" + tekstas;
  }

  /* Serveriui, jei jis yra. Be jo klaida lieka juostoje. */
  function pranestiVarikliui(duomenys) {
    if (window.TV_VARIKLIS !== true) return;
    try {
      fetch("/api/klaida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duomenys)
      }).catch(function () {});
    } catch (e) {}
  }

  function registruoti(zinute, failas, eilute, stulpelis) {
    var raktas = zinute + "|" + failas + "|" + eilute;
    if (praneštos[raktas]) return;
    praneštos[raktas] = true;

    var vieta = failas
      ? failas.split("/").pop() + ":" + eilute + (stulpelis ? ":" + stulpelis : "")
      : "nežinoma vieta";

    juosta("Svetainės kodo klaida — nukopijuok šį tekstą ir atsiųsk:",
           zinute + "\n" + vieta + "\nPuslapis: " +
           (document.body ? document.body.dataset.puslapis || "?" : "?") +
           " · saugiklis " + SAUGIKLIO_VERSIJA);

    pranestiVarikliui({
      zinute: zinute, failas: vieta,
      puslapis: document.body ? document.body.dataset.puslapis || "?" : "?"
    });
  }

  window.addEventListener("error", function (e) {
    registruoti(e.message || String(e.error || "nežinoma klaida"),
                e.filename, e.lineno, e.colno);
  });

  window.addEventListener("unhandledrejection", function (e) {
    var p = e.reason;
    registruoti("Neapdorotas pažadas: " + (p && p.message ? p.message : String(p)), "", 0, 0);
  });

  /* Formos apsauga. Registruojama gaudymo fazėje, todėl suveikia pirmiau už
     svetaine.js tvarkyklę ir nepriklauso nuo to, ar ji apskritai prisikabino. */
  document.addEventListener("DOMContentLoaded", function () {
    var f = document.getElementById("patikrosForma");
    if (f) f.addEventListener("submit", function (ev) { ev.preventDefault(); }, true);
  });

  /* --- Savarankiška diagnozė -------------------------------------------------
     Atidarius puslapį dvigubu paspaudimu (file://), naršyklė klaidos teksto
     neatiduoda — vietoj jo rašo tik „Script error." be failo ir eilutės. Tada
     pranešimas nieko nepasako. Todėl nesiremiam vien juo: patikrinam, kurie
     failai iš tiesų pasileido, ir pasakom failo vardą patys.                 */

  /* Dėmesio: `const KATALOGAS` NEATSIRANDA kaip window.KATALOGAS — top-level
     const ir let gyvena atskiroje globalioje srityje, ne ant window. Todėl
     tikrinam per `typeof` su tikru vardu, o ne per window[...]. */
  function yraKatalogas() {
    try { return typeof KATALOGAS !== "undefined" && typeof BUKLES !== "undefined"; }
    catch (e) { return false; }
  }
  function yraSvetaine() {
    try { return window.TV_IKELTAS === true; } catch (e) { return false; }
  }

  function diagnoze() {
    var eil = [];
    var katalogas = yraKatalogas();
    var svetaine  = yraSvetaine();

    if (!katalogas) {
      eil.push("katalogas.js nepasileido — failo nėra arba jis sugadintas.");
      eil.push("Pataisymas: įkelk katalogas.js į svetainės aplanką iš naujo.");
    } else if (!svetaine) {
      eil.push("svetaine.js nutrūko viduryje — failas senas arba neperrašytas.");
      eil.push("Pataisymas: įkelk svetaine.js į svetainės aplanką iš naujo.");
    }
    return eil.join("\n");
  }

  window.addEventListener("load", function () {
    var kliuva = !yraKatalogas() || !yraSvetaine();
    var formaTuscia = document.getElementById("patikrosForma") &&
                      !document.getElementById("preke");

    if (!kliuva && !formaTuscia) return;   /* viskas vietoje */

    var t = document.getElementById("saugiklioTekstas");
    var buvo = t ? t.textContent : "";
    if (t) { delete t.dataset.uzimta; delete t.dataset.daugiau; }

    juosta("Svetainė nepasileido iki galo — nukopijuok šį tekstą ir atsiųsk:",
           diagnoze() +
           "\n\nPuslapis: " + (document.body.dataset.puslapis || "?") +
           " · saugiklis " + SAUGIKLIO_VERSIJA +
           "\nkatalogas.js: " + (yraKatalogas() ? "gerai" : "NEPASILEIDO") +
           " · svetaine.js: " + (yraSvetaine() ? "gerai" : "NEPASILEIDO") +
           (buvo ? "\n\nNaršyklės pranešimas:\n" + buvo.split("\n").slice(1).join("\n") : ""));

    pranestiVarikliui({
      zinute: "Nepasileido: katalogas.js=" + (yraKatalogas() ? "ok" : "NE") +
              " svetaine.js=" + (yraSvetaine() ? "ok" : "NE"),
      failas: location.protocol,
      puslapis: document.body.dataset.puslapis || "?"
    });
  });
})();
