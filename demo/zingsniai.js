/* ==========================================================================
   aidas · Tikra vertė — „Kaip naudotis" kortelės įrankių puslapiuose
   Autorius: Marijus Tamulynas, 2026

   Po puslapio antrašte rodomi 3–4 žingsniai su judančiais paveikslėliais
   (SVG + CSS, be GIF ir vaizdo įrašų — lengva ir telefone).
   Žingsniai keičiami žemiau, ZINGSNIAI objekte. Raktas = body data-puslapis.
   Paveikslėlio vardas = vienas iš PIESINIAI raktų.
   Lankytojas gali sutraukti kortelę — tai įsimenama šioje naršyklėje.
   ========================================================================== */

const ZINGSNIAI = {
  skelbimas: [
    { pav: "Atsidaryk skelbimą", txt: "Autoplius, Skelbiu.lt ar kitoje svetainėje.", piesinys: "narsykle" },
    { pav: "Pažymėk viską", txt: "Kompiuteryje Ctrl+A, telefone ilgai spausk tekstą → „Pažymėti viską“.", piesinys: "pazymeti" },
    { pav: "Nukopijuok", txt: "Ctrl+C arba dešiniu pelės mygtuku → „Kopijuoti“, tada grįžk čia.", piesinys: "kopijuoti" },
    { pav: "Įklijuok čia", txt: "Ctrl+V į laukelį žemiau — atsakymas pasirodys pats.", piesinys: "iklijuoti" }
  ],
  palyginimas: [
    { pav: "Atsidaryk skelbimą", txt: "Autoplius, Skelbiu.lt ar kitoje svetainėje.", piesinys: "narsykle" },
    { pav: "Pažymėk viską", txt: "Kompiuteryje Ctrl+A, telefone ilgai spausk tekstą → „Pažymėti viską“.", piesinys: "pazymeti" },
    { pav: "Nukopijuok", txt: "Ctrl+C arba dešiniu pelės mygtuku → „Kopijuoti“, tada grįžk čia.", piesinys: "kopijuoti" },
    { pav: "Įklijuok ir spausk „Pridėti“", txt: "Pakartok su kitais skelbimais — geriausias pirkinys pažymimas pats.", piesinys: "iklijuoti" }
  ],
  patikra: [
    { pav: "Įrašyk daiktą ir kainą", txt: "Arba spausk „Užpildyti iš skelbimo teksto“ ir įklijuok skelbimą.", piesinys: "pildyti" },
    { pav: "Pasirink, kas tinka", txt: "Būklę ir tai, ką matai pats.", piesinys: "pasirinkti" },
    { pav: "Stebėk vertę", txt: "Ji keičiasi iškart, kai pildai.", piesinys: "verte" },
    { pav: "Spausk „Gauti atsakymą“", txt: "Gausi vertę, kuri nepriklauso nuo pardavėjo.", piesinys: "atsakymas" }
  ],
  sertifikatas: [
    { pav: "Atlik patikrą", txt: "Pilną vertinimą arba skelbimo patikrą.", piesinys: "pildyti" },
    { pav: "Pasirink ją sąraše", txt: "Laukelyje „Kuri patikra“.", piesinys: "pasirinkti" },
    { pav: "Išsaugok PDF", txt: "Spausk „Spausdinti arba PDF“.", piesinys: "spausdinti" },
    { pav: "Pridėk prie skelbimo", txt: "Pirkėjas matys nepriklausomą vertę.", piesinys: "prideti" }
  ]
};

/* Paveikslėliai: 200×120 SVG. Spalvos ir judesys — style.css, skyrius
   „KAIP NAUDOTIS". Klasės: z-remas (rėmas), z-linija (teksto eilutė),
   z-akc (akcentas), z-zyd (žydra), z-raktas (klavišas). */
const PIESINIAI = {
  narsykle:
    '<rect class="z-remas" x="12" y="10" width="176" height="100" rx="9"/>' +
    '<circle class="z-taskas" cx="24" cy="21" r="2.6"/><circle class="z-taskas" cx="32" cy="21" r="2.6"/><circle class="z-taskas" cx="40" cy="21" r="2.6"/>' +
    '<rect class="z-adresas" x="52" y="15" width="124" height="12" rx="6"/>' +
    '<text class="z-tekstas z-svet z-svet-1" x="114" y="24.2">autoplius.lt</text>' +
    '<text class="z-tekstas z-svet z-svet-2" x="114" y="24.2">skelbiu.lt</text>' +
    '<rect class="z-foto" x="24" y="38" width="58" height="44" rx="5"/>' +
    '<path class="z-foto-kalnas" d="M28 78l14-16 10 10 8-7 18 13z"/>' +
    '<rect class="z-linija" x="92" y="40" width="80" height="6" rx="3"/>' +
    '<rect class="z-linija" x="92" y="52" width="60" height="6" rx="3"/>' +
    '<rect class="z-linija" x="92" y="64" width="70" height="6" rx="3"/>' +
    '<rect class="z-akc" x="92" y="76" width="36" height="8" rx="4"/>' +
    '<rect class="z-linija" x="24" y="92" width="148" height="6" rx="3"/>' +
    '<path class="z-pele z-pele-narsykle" d="M0 0v15l4-4 3 7 3-1.4-3-6.6h6z"/>',

  pazymeti:
    '<rect class="z-remas" x="12" y="10" width="176" height="100" rx="9"/>' +
    '<rect class="z-zymejimas" x="22" y="20" width="156" height="66" rx="4"/>' +
    '<rect class="z-linija" x="28" y="26" width="120" height="6" rx="3"/>' +
    '<rect class="z-linija" x="28" y="38" width="144" height="6" rx="3"/>' +
    '<rect class="z-linija" x="28" y="50" width="100" height="6" rx="3"/>' +
    '<rect class="z-linija" x="28" y="62" width="132" height="6" rx="3"/>' +
    '<rect class="z-linija" x="28" y="74" width="80" height="6" rx="3"/>' +
    '<g class="z-raktas z-raktas-a"><rect x="62" y="92" width="76" height="14" rx="4"/><text class="z-tekstas" x="100" y="102.2">Ctrl + A</text></g>',

  kopijuoti:
    '<g class="z-lapas"><rect class="z-remas" x="22" y="20" width="56" height="70" rx="6"/>' +
      '<rect class="z-linija" x="30" y="32" width="40" height="5" rx="2.5"/>' +
      '<rect class="z-linija" x="30" y="43" width="32" height="5" rx="2.5"/>' +
      '<rect class="z-linija" x="30" y="54" width="38" height="5" rx="2.5"/>' +
      '<rect class="z-akc" x="30" y="67" width="22" height="7" rx="3.5"/></g>' +
    '<g class="z-kopija"><rect class="z-remas z-remas-zyd" x="22" y="20" width="56" height="70" rx="6"/>' +
      '<rect class="z-linija" x="30" y="32" width="40" height="5" rx="2.5"/>' +
      '<rect class="z-linija" x="30" y="43" width="32" height="5" rx="2.5"/>' +
      '<rect class="z-linija" x="30" y="54" width="38" height="5" rx="2.5"/>' +
      '<rect class="z-akc" x="30" y="67" width="22" height="7" rx="3.5"/></g>' +
    '<rect class="z-remas" x="124" y="24" width="56" height="70" rx="6"/>' +
    '<rect class="z-segtukas" x="140" y="18" width="24" height="12" rx="4"/>' +
    '<g class="z-raktas z-raktas-c"><rect x="62" y="98" width="76" height="14" rx="4"/><text class="z-tekstas" x="100" y="108.2">Ctrl + C</text></g>',

  iklijuoti:
    '<rect class="z-remas z-remas-zyd" x="14" y="14" width="172" height="74" rx="7"/>' +
    '<rect class="z-linija z-ateina z-ateina-1" x="24" y="24" width="120" height="6" rx="3"/>' +
    '<rect class="z-linija z-ateina z-ateina-2" x="24" y="36" width="148" height="6" rx="3"/>' +
    '<rect class="z-linija z-ateina z-ateina-3" x="24" y="48" width="96" height="6" rx="3"/>' +
    '<rect class="z-akc z-ateina z-ateina-4" x="24" y="62" width="40" height="8" rx="4"/>' +
    '<rect class="z-zymeklis" x="24" y="24" width="2" height="12"/>' +
    '<g class="z-varnele"><circle cx="166" cy="70" r="11"/><path d="M160.5 70.5l4 4 7-8"/></g>' +
    '<g class="z-raktas z-raktas-v"><rect x="62" y="98" width="76" height="14" rx="4"/><text class="z-tekstas" x="100" y="108.2">Ctrl + V</text></g>',

  sarasas:
    '<g class="z-eilute z-eilute-1"><rect class="z-remas" x="22" y="14" width="156" height="26" rx="6"/>' +
      '<rect class="z-linija" x="32" y="24" width="70" height="6" rx="3"/><rect class="z-linija" x="140" y="24" width="28" height="6" rx="3"/></g>' +
    '<g class="z-eilute z-eilute-2"><rect class="z-remas z-geriausias" x="22" y="47" width="156" height="26" rx="6"/>' +
      '<rect class="z-linija" x="32" y="57" width="80" height="6" rx="3"/><rect class="z-akc" x="134" y="56" width="34" height="8" rx="4"/></g>' +
    '<g class="z-eilute z-eilute-3"><rect class="z-remas" x="22" y="80" width="156" height="26" rx="6"/>' +
      '<rect class="z-linija" x="32" y="90" width="60" height="6" rx="3"/><rect class="z-linija" x="140" y="90" width="28" height="6" rx="3"/></g>' +
    '<path class="z-zvaigzde" d="M14 53l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8z"/>',

  pildyti:
    '<rect class="z-remas" x="14" y="12" width="172" height="96" rx="8"/>' +
    '<rect class="z-etiketes" x="26" y="22" width="40" height="4" rx="2"/>' +
    '<rect class="z-laukas" x="26" y="30" width="148" height="18" rx="5"/>' +
    '<text class="z-tekstas z-rasomas z-rasomas-1" x="32" y="42.5">Opel Astra</text>' +
    '<rect class="z-etiketes" x="26" y="58" width="30" height="4" rx="2"/>' +
    '<rect class="z-etiketes" x="104" y="58" width="30" height="4" rx="2"/>' +
    '<rect class="z-laukas" x="26" y="66" width="70" height="18" rx="5"/>' +
    '<rect class="z-laukas" x="104" y="66" width="70" height="18" rx="5"/>' +
    '<text class="z-tekstas z-rasomas z-rasomas-2" x="32" y="78.5">2015</text>' +
    '<text class="z-tekstas z-rasomas z-rasomas-3" x="110" y="78.5">6500 €</text>' +
    '<rect class="z-akc" x="26" y="92" width="60" height="8" rx="4"/>',

  pasirinkti:
    '<rect class="z-remas" x="14" y="12" width="172" height="96" rx="8"/>' +
    '<rect class="z-etiketes" x="26" y="24" width="40" height="4" rx="2"/>' +
    '<rect class="z-mygt" x="26" y="34" width="40" height="18" rx="9"/>' +
    '<rect class="z-mygt z-mygt-pasirinktas" x="72" y="34" width="48" height="18" rx="9"/>' +
    '<rect class="z-mygt" x="126" y="34" width="44" height="18" rx="9"/>' +
    '<rect class="z-etiketes" x="26" y="64" width="50" height="4" rx="2"/>' +
    '<rect class="z-mygt z-mygt-pasirinktas-2" x="26" y="74" width="62" height="18" rx="9"/>' +
    '<rect class="z-mygt" x="94" y="74" width="40" height="18" rx="9"/>' +
    '<path class="z-pele z-pele-pasirinkti" d="M0 0v15l4-4 3 7 3-1.4-3-6.6h6z"/>',

  verte:
    '<rect class="z-remas z-remas-zyd" x="14" y="12" width="172" height="96" rx="8"/>' +
    '<rect class="z-etiketes" x="28" y="26" width="60" height="4" rx="2"/>' +
    '<text class="z-tekstas z-didelis z-skaicius z-skaicius-1" x="28" y="62">5 900 €</text>' +
    '<text class="z-tekstas z-didelis z-skaicius z-skaicius-2" x="28" y="62">5 400 €</text>' +
    '<text class="z-tekstas z-didelis z-skaicius z-skaicius-3" x="28" y="62">5 650 €</text>' +
    '<rect class="z-skale" x="28" y="80" width="144" height="8" rx="4"/>' +
    '<rect class="z-skale-pilna" x="28" y="80" width="144" height="8" rx="4"/>' +
    '<circle class="z-rodykle" cx="28" cy="84" r="6"/>',

  atsakymas:
    '<rect class="z-mygtukas" x="40" y="16" width="120" height="22" rx="11"/>' +
    '<text class="z-tekstas z-mygtuko-tekstas" x="100" y="30.5">Gauti atsakymą</text>' +
    '<path class="z-pele z-pele-atsakymas" d="M0 0v15l4-4 3 7 3-1.4-3-6.6h6z"/>' +
    '<g class="z-isvada"><rect class="z-remas z-remas-zyd" x="24" y="50" width="152" height="58" rx="8"/>' +
      '<rect class="z-etiketes" x="36" y="62" width="50" height="4" rx="2"/>' +
      '<text class="z-tekstas z-didelis" x="36" y="88">5 650 €</text>' +
      '<g class="z-varnele z-varnele-mato"><circle cx="156" cy="80" r="11"/><path d="M150.5 80.5l4 4 7-8"/></g></g>',

  spausdinti:
    '<g class="z-popierius"><rect class="z-lapas-baltas" x="62" y="72" width="76" height="40" rx="3"/>' +
      '<rect class="z-linija-tamsi" x="70" y="80" width="40" height="4" rx="2"/>' +
      '<rect class="z-linija-tamsi" x="70" y="89" width="56" height="4" rx="2"/>' +
      '<rect class="z-akc" x="70" y="98" width="28" height="6" rx="3"/></g>' +
    '<rect class="z-remas" x="40" y="40" width="120" height="40" rx="8"/>' +
    '<rect class="z-plysys" x="56" y="70" width="88" height="4" rx="2"/>' +
    '<circle class="z-akc-ap" cx="146" cy="52" r="3"/>' +
    '<rect class="z-remas" x="56" y="14" width="88" height="26" rx="4"/>' +
    '<text class="z-tekstas z-pdf" x="100" y="31">PDF</text>',

  prideti:
    '<rect class="z-remas" x="86" y="12" width="102" height="96" rx="8"/>' +
    '<rect class="z-foto" x="96" y="22" width="82" height="34" rx="4"/>' +
    '<rect class="z-linija" x="96" y="64" width="60" height="6" rx="3"/>' +
    '<rect class="z-linija" x="96" y="76" width="44" height="6" rx="3"/>' +
    '<rect class="z-pdf-vieta" x="96" y="88" width="82" height="12" rx="3"/>' +
    '<g class="z-pdf-lapas"><rect class="z-lapas-baltas" x="14" y="34" width="44" height="54" rx="3"/>' +
      '<text class="z-tekstas z-pdf-mazas" x="36" y="66">PDF</text></g>'
};

/* Gyva demonstracija puslapiams, kur skelbimas perkeliamas iš kitos svetainės:
   pelė atidaro skelbimą, pažymi, nukopijuoja, pereina į mūsų svetainę ir
   įklijuoja. Žingsnių sąrašas šalia paryškinamas kartu su scena (po 4 s). */
const DEMO = {
  skelbimas:   { antraste: "PATIKRINK SKELBIMĄ", adresas: "skelbimas", mygtukas: "PATIKRINTI", rezultatas: "Kaina per didelė", rezPav: "Vertė apie 29 500 €", blogai: true },
  palyginimas: { antraste: "KAINŲ PALYGINIMAS",  adresas: "palyginimas", mygtukas: "PRIDĖTI", rezultatas: "Pridėta į palyginimą", rezPav: "Įklijuok kitą skelbimą", blogai: false }
};

function demoScena(d) {
  return '' +
  '<svg class="demo-scena" viewBox="0 0 480 300" aria-hidden="true">' +
    '<rect class="d-remas" x="6" y="6" width="468" height="288" rx="14"/>' +
    /* skirtukai */
    '<g class="d-skirt d-skirt-1"><rect x="18" y="14" width="140" height="26" rx="8"/>' +
      '<circle class="d-ikona-a" cx="34" cy="27" r="5"/><text class="d-t d-t-skirt" x="46" y="31">autoplius.lt</text></g>' +
    '<g class="d-skirt d-skirt-2"><rect x="164" y="14" width="150" height="26" rx="8"/>' +
      '<circle class="d-ikona-m" cx="180" cy="27" r="5"/><text class="d-t d-t-skirt" x="192" y="31">aidas · Tikra vertė</text></g>' +
    /* adresas */
    '<rect class="d-adresas" x="18" y="46" width="444" height="20" rx="10"/>' +
    '<text class="d-t d-t-adr d-adr-1" x="32" y="60">autoplius.lt/skelbimai/jeep-grand-cherokee</text>' +
    '<text class="d-t d-t-adr d-adr-2" x="32" y="60">marijus25.github.io/svetaine/' + d.adresas + '</text>' +
    /* 1 puslapis: svetimas skelbimas */
    '<g class="d-p1">' +
      '<rect class="d-foto" x="26" y="80" width="160" height="104" rx="8"/>' +
      '<path class="d-auto" d="M46 160h120l-8-22-22-10h-50l-26 14z"/>' +
      '<circle class="d-ratas" cx="70" cy="162" r="9"/><circle class="d-ratas" cx="142" cy="162" r="9"/>' +
      '<text class="d-t d-t-ant" x="202" y="96">Jeep Grand Cherokee, 2018</text>' +
      '<text class="d-t" x="202" y="116">156 000 km · Dyzelinas</text>' +
      '<text class="d-t" x="202" y="134">Automatinė · Vilnius</text>' +
      '<text class="d-t d-t-kaina" x="202" y="164">33 000 €</text>' +
      '<rect class="d-eil" x="26" y="198" width="420" height="7" rx="3.5"/>' +
      '<rect class="d-eil" x="26" y="214" width="380" height="7" rx="3.5"/>' +
      '<rect class="d-eil" x="26" y="230" width="400" height="7" rx="3.5"/>' +
      '<rect class="d-eil" x="26" y="246" width="300" height="7" rx="3.5"/>' +
      '<rect class="d-zym" x="22" y="78" width="432" height="182" rx="4"/>' +
      '<g class="d-meniu"><rect x="330" y="160" width="120" height="74" rx="8"/>' +
        '<rect class="d-meniu-zym" x="334" y="166" width="112" height="20" rx="5"/>' +
        '<text class="d-t" x="344" y="180">Kopijuoti</text>' +
        '<text class="d-t d-t-blyskus" x="344" y="202">Pažymėti viską</text>' +
        '<text class="d-t d-t-blyskus" x="344" y="222">Spausdinti</text></g>' +
      '<g class="d-pranesimas"><rect x="170" y="262" width="140" height="24" rx="12"/>' +
        '<text class="d-t d-t-centras" x="240" y="278">✓ Nukopijuota</text></g>' +
    '</g>' +
    /* 2 puslapis: mūsų svetainė */
    '<g class="d-p2">' +
      '<text class="d-t d-t-h" x="26" y="96">' + d.antraste + '</text>' +
      '<text class="d-t d-t-et" x="26" y="118">SKELBIMO TEKSTAS</text>' +
      '<rect class="d-laukas" x="26" y="126" width="428" height="80" rx="8"/>' +
      '<g class="d-iklijuota">' +
        '<text class="d-t" x="38" y="146">Jeep Grand Cherokee, 2018</text>' +
        '<text class="d-t" x="38" y="164">156 000 km · Dyzelinas · Automatinė</text>' +
        '<text class="d-t d-t-kaina-m" x="38" y="186">33 000 €</text></g>' +
      '<rect class="d-zymeklis" x="38" y="134" width="2" height="16"/>' +
      '<g class="d-mygtukas"><rect x="26" y="220" width="112" height="30" rx="15"/>' +
        '<text class="d-t d-t-mygt" x="82" y="239.5">' + d.mygtukas + '</text></g>' +
      '<g class="d-rez' + (d.blogai ? ' d-rez-blogai' : '') + '"><rect x="152" y="216" width="302" height="62" rx="10"/>' +
        '<circle cx="176" cy="247" r="11"/>' +
        '<text class="d-t d-t-rez" x="196" y="243">' + d.rezultatas + '</text>' +
        '<text class="d-t d-t-mazas" x="196" y="262">' + d.rezPav + '</text></g>' +
    '</g>' +
    /* klavišai */
    '<g class="d-raktas d-raktas-a"><rect x="388" y="264" width="70" height="22" rx="6"/><text class="d-t d-t-raktas" x="423" y="279">Ctrl + A</text></g>' +
    '<g class="d-raktas d-raktas-v"><rect x="388" y="84" width="70" height="22" rx="6"/><text class="d-t d-t-raktas" x="423" y="99">Ctrl + V</text></g>' +
    /* pelė */
    '<g class="d-pele"><path d="M0 0v22l6-6 4.5 10 4.5-2-4.5-9.6h8.5z"/><circle class="d-spust" cx="0" cy="0" r="10"/></g>' +
  '</svg>';
}

(function kaipNaudotis() {
  const vardas = document.body.dataset.puslapis;
  const zingsniai = ZINGSNIAI[vardas];
  const antraste = document.querySelector("main .puslapio-antraste");
  if (!zingsniai || !antraste) return;

  const RAKTAS = "aidas-kaip-naudotis-" + vardas;
  let sutraukta = false;
  try { sutraukta = localStorage.getItem(RAKTAS) === "0"; } catch (e) {}

  /* Plotis kaip formos, kuri eina po kortelėmis. */
  const kitas = antraste.nextElementSibling;
  const plotis = kitas && kitas.style.maxWidth ? kitas.style.maxWidth : "";

  const demo = DEMO[vardas];
  const korteles = zingsniai.map((z, i) =>
    '<li class="kaip-zingsnis" style="--i:' + i + '">' +
      (demo ? '' :
      '<div class="kaip-piesinys" aria-hidden="true">' +
        '<svg viewBox="0 0 200 120" class="z-' + z.piesinys + '">' + PIESINIAI[z.piesinys] + '</svg>' +
      '</div>') +
      '<div class="kaip-tekstas">' +
        '<span class="kaip-nr">' + String(i + 1).padStart(2, "0") + '</span>' +
        '<h3>' + z.pav + '</h3>' +
        '<p>' + z.txt + '</p>' +
      '</div>' +
    '</li>'
  ).join("");

  const sarasas = '<ol class="kaip-sarasas" style="--n:' + zingsniai.length + '">' + korteles + '</ol>';
  const turinys = demo
    ? '<div class="kaip-demo"><div class="demo-langas">' + demoScena(demo) + '</div>' + sarasas + '</div>'
    : sarasas;

  const sekcija = document.createElement("section");
  sekcija.className = "wrap kaip-naudotis";
  if (plotis) sekcija.style.maxWidth = plotis;
  sekcija.innerHTML =
    '<details' + (sutraukta ? '' : ' open') + '>' +
      '<summary><span>Kaip naudotis</span></summary>' +
      turinys +
    '</details>';
  antraste.after(sekcija);

  sekcija.querySelector("details").addEventListener("toggle", function () {
    try { localStorage.setItem(RAKTAS, this.open ? "1" : "0"); } catch (e) {}
  });
})();
