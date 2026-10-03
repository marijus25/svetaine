/* ==========================================================================
   TIKRA VERTĖ — SVETAINĖS LOGIKA
   Autorius: Marijus Tamulynas, 2026

   Vienas failas visai naršyklės pusei. Trys dalys:

     1. ŠABLONAS     — antraštė, meniu, trupiniai, poraštė (visiems puslapiams)
     2. NUOTRAUKOS   — įkėlimas, miniatiūros, nuotraukų išmatavimas
     3. PATIKRA      — vertinimo logika, ryšys su varikliu, rezultato piešimas

   Kraunamas po katalogas.js, nes naudoja KATALOGAS ir BUKLES.
   Klasikinis skriptas, ne modulis — todėl veikia ir atidarius failą iš
   aplanko, kur naršyklė modulius blokuoja.
   ========================================================================== */

/* Versija. Keičiasi su kiekvienu svetainės atnaujinimu. */
const TV_VERSIJA = "2026-10-03.1";
try { window.TV_VERSIJA = TV_VERSIJA; } catch (e) {}

/* ==========================================================================
   1 DALIS — ŠABLONAS
   ========================================================================== */

/* --------------------------------------------------------------------------
   ĮRANKIŲ SĄRAŠAS — VIENAS ŠALTINIS

   Iš čia gimsta trys dalykai: kortelės pagrindiniame puslapyje, iškrentantis
   meniu antraštėje ir poraštės stulpelis. Naujas įrankis — viena eilutė čia,
   ir jis atsiranda visur. Nė vieno kito failo liesti nereikia.

   Taisyklė, kuri nusprendžia, kas čia patenka: pagrindinis puslapis pasako,
   KĄ siūlome, o įrankio puslapis leidžia TAI padaryti. Niekada atvirkščiai.

     pav       — vardas meniu ir kortelėje
     url       — savas puslapis, visada atskiras
     zyme      — „Per sekundę", „Su apžiūra" ir pan.
     santrauka — vienas sakinys kortelėje
     punktai   — trys konkretūs dalykai, ką gauni
     kada      — kada šito reikia (kortelės apačia)
     trumpai   — vienas sakinys plytelei pradžios puslapyje
     ikona     — raktas iš IKONOS
     busena    — "veikia" arba "ruosiama"
   -------------------------------------------------------------------------- */

const IRANKIAI = [
  {
    raktas: "skelbimas", pav: "Patikrink skelbimą", url: "skelbimas.html",
    trumpai: "Įklijuok nuorodą ar tekstą — vertę pasakome iškart, be nuotraukų.",
    zodziai: "skelbimas skelbimo nuoroda kaina brangu pigu brangus autoplius skelbiu tikrinti ar verta",
    ikona: "zaibas", busena: "veikia", zyme: "Per sekundę",
    santrauka: "Radai skelbimą internete ir nori žinoti, ar kaina normali. " +
               "Įklijuoji nuorodą arba tekstą — vertę pasakome iškart.",
    punktai: ["Nuotraukų nereikia",
              "Metai, rida, techninė — perskaitoma pati",
              "Atsakymas per sekundę"],
    kada: "Renkantis iš skelbimų"
  },
  {
    raktas: "vertinimas", pav: "Pilnas vertinimas", url: "paslauga.html",
    trumpai: "Nuotraukos, būklė ir sugadintos detalės — su remonto kainomis.",
    zodziai: "vertinimas įvertinti nuotraukos būklė sugadinta remontas detalės kiek vertas",
    ikona: "didinamasis", busena: "veikia", zyme: "Su apžiūra",
    santrauka: "Daiktas jau tavo rankose. Nufotografuoji, pažymi, kas sugadinta — " +
               "ir matai, kiek kainuotų tai sutvarkyti.",
    punktai: ["Būklė nustatoma iš nuotraukų",
              "Sugadintos detalės ir remonto kaina",
              "Automobilis, elektronika, technika, dviratis"],
    kada: "Prieš perkant arba parduodant"
  },
  {
    raktas: "palyginimas", pav: "Kainų palyginimas", url: "palyginimas.html",
    trumpai: "Keli skelbimai šalia — matai, kuris iš tikrųjų vertas pinigų.",
    zodziai: "palyginti palyginimas kuris geresnis variantai keli",
    ikona: "svarstykles", busena: "veikia", zyme: "Kai renkiesi",
    santrauka: "Trys skelbimai, trys kainos — ir neaišku, kuris geresnis. " +
               "Sudedame šalia ir parodome, kuris iš tikrųjų vertas pinigų.",
    punktai: ["Iki šešių skelbimų vienoje lentelėje",
              "Lyginamas ne pigumas, o skirtumas nuo vertės",
              "Veikia ir su ranka įvestomis kainomis"],
    kada: "Kai turi kelis variantus"
  },
  {
    raktas: "sertifikatas", pav: "Pažyma pardavėjams", url: "sertifikatas.html",
    trumpai: "Tavo patikra — dokumentu, kurį pridedi prie skelbimo.",
    zodziai: "parduodu parduoti pažyma sertifikatas pardavėjas dokumentas",
    ikona: "antspaudas", busena: "veikia", zyme: "Pardavėjui",
    santrauka: "Tavo patikra virsta tvarkingu dokumentu: vertė, būklė ir kas " +
               "sutvarkyta. Atspausdink arba pridėk PDF prie skelbimo.",
    punktai: ["Sudaromas iš tavo patikros", "Spausdinimui ir PDF",
              "Rodo būklę ir vertę, ne tavo kainą"],
    kada: "Kai parduodi"
  }
];

const SVETAINE = {

  pavadinimas: "Tikra vertė",

  /* Meniu. Įrankiai eina iš IRANKIAI, čia lieka tik tai, kas ne įrankis. */
  meniu: [
    { pav: "Pradžia",  url: "index.html" },
    { pav: "Įrankiai", irankiai: true },
    { pav: "Kainos",    url: "kainos.html" },
    { pav: "Įmonėms",   url: "imonems.html" },
    { pav: "Kontaktai", url: "kontaktai.html" }
  ],

  /* Mygtukas antraštės dešinėje (puslapis gali jį persirašyti) */
  mygtukas: { pav: "Mano patikros", url: "mano-patikros.html" },

  /* Poraštės stulpeliai */
  porastes_stulpeliai: [
    { antraste: "Įrankiai", nuorodos: IRANKIAI.map(i => ({ pav: i.pav, url: i.url })) },
    { antraste: "Apie", nuorodos: [
      { pav: "Kaip vertiname", url: "#" },
      { pav: "Kainos", url: "kainos.html" },
      { pav: "Kontaktai", url: "kontaktai.html" }
    ]},
    { antraste: "Teisinė informacija", nuorodos: [
      { pav: "Privatumo politika", url: "#" },
      { pav: "Slapukai", url: "#" },
      { pav: "Naudojimo sąlygos", url: "#" }
    ]}
  ],

  porastes_aprasas: "Nepriklausomi vertinimai ir dirbtinio intelekto įrankiai kasdieniams sprendimams.",
  autorius: "&copy; Marijus Tamulynas, 2026. Visos teisės saugomos.",
  vieta: "Alytus, Lietuva",

  /* Kiekvieno puslapio ypatumai. Raktas = body data-puslapis reikšmė. */
  puslapiai: {
    index:        { aktyvus: "Pradžia" },
    skelbimas:    { aktyvus: "Patikrink skelbimą",
                    trupiniai: [["Pradžia","index.html"], ["Patikrink skelbimą"]] },
    palyginimas:  { aktyvus: "Kainų palyginimas",
                    trupiniai: [["Pradžia","index.html"], ["Kainų palyginimas"]] },
    patikros:     { aktyvus: null,
                    mygtukas: { pav: "Patikrinti skelbimą", url: "skelbimas.html" },
                    trupiniai: [["Pradžia","index.html"], ["Mano patikros"]] },
    paslauga:     { aktyvus: "Pilnas vertinimas",
                    trupiniai: [["Pradžia","index.html"], ["Pilnas vertinimas"]] },
    /* patikra-*.html — po vieną kiekvienai kategorijai (kopija iš patikra-kita.html).
       Trupinių paskutinė dalis įrašoma iš data-pav, tad naujai kategorijai
       čia nieko keisti nereikia. */
    patikra:      { aktyvus: "Pilnas vertinimas",
                    trupiniai: [["Pradžia","index.html"], ["Pilnas vertinimas","paslauga.html"], ["Patikra"]] },
    kainos:       { aktyvus: "Kainos",
                    trupiniai: [["Pradžia","index.html"], ["Kainos"]] },
    imonems:      { aktyvus: "Įmonėms",
                    trupiniai: [["Pradžia","index.html"], ["Įmonėms"]] },
    kontaktai:    { aktyvus: "Kontaktai",
                    trupiniai: [["Pradžia","index.html"], ["Kontaktai"]] },
    rezultatas:   { aktyvus: "Pilnas vertinimas",
                    mygtukas: { pav: "Nauja patikra", url: "paslauga.html" },
                    trupiniai: [["Pradžia","index.html"], ["Pilnas vertinimas","paslauga.html"], ["Rezultatas"]],
                    trupiniu_desine: "&nbsp;" },
    sertifikatas: { aktyvus: "Pažyma pardavėjams",
                    trupiniai: [["Pradžia","index.html"], ["Vertinimo pažyma"]] }
  }
};

/* --------------------------------------------------------------------------
   Nuo čia — surinkimas. Paprastai keisti nereikia.
   -------------------------------------------------------------------------- */

const ZENKLAS_SVG =
  '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">' +
  '<circle cx="16" cy="16" r="14.5" stroke="#7A5A2E" stroke-width="1.4"/>' +
  '<circle cx="16" cy="16" r="11" stroke="#7A5A2E" stroke-width="0.8" opacity="0.45"/>' +
  '<path d="M10.5 16.5l4 4 7.5-8" stroke="#7A5A2E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg>';

/* Lietuviškas skaičiaus ir daiktavardžio derinimas:
   1, 21, 31 … → vienaskaita; 10–20, 30, 40 … → kilmininkas; kiti → daugiskaita.
   skaicius(13, ["detalė", "detalės", "detalių"]) → "13 detalių" */
function skaicius(n, formos) {
  const d = n % 10, s = n % 100;
  const f = (d === 1 && s !== 11) ? formos[0] : (d === 0 || (s >= 10 && s <= 20)) ? formos[2] : formos[1];
  return n + " " + f;
}

function zenklas() {
  return '<a class="zenklas" href="index.html">' + ZENKLAS_SVG +
         '<span>' + SVETAINE.pavadinimas + '</span></a>';
}

/* Antraštės ženklas: kairiajame viršutiniame kampe — aidas, šalia —
   svetainės vardas. Vienas vietoje, tad kai keisis išvaizda, keisis tik čia. */
function antrastesZenklas() {
  return '<a class="virsaus-zenklas" href="index.html" aria-label="aidas · ' + SVETAINE.pavadinimas + ' — pradžia">' +
         '<img src="aidas.png" alt="aidas" width="147" height="32">' +
         '<span class="virsaus-skirtukas" aria-hidden="true"></span>' +
         '<span class="virsaus-vardas">' + SVETAINE.pavadinimas + '</span></a>';
}

function antraste(cfg) {
  const mygt = cfg.mygtukas || SVETAINE.mygtukas;
  const nuorodos = SVETAINE.meniu.map(function (p) {
    /* Įrankių punktas — iškrentantis sąrašas. Kai įrankių bus dešimt, jie
       neišstums meniu, o antraštė liks tokia pati. */
    if (p.irankiai) {
      const aktyvus = IRANKIAI.some(function (i) { return i.pav === cfg.aktyvus; });
      const eilutes = IRANKIAI.map(function (i) {
        return '<a href="' + i.url + '"' + (i.pav === cfg.aktyvus ? ' class="aktyvus"' : '') +
               '><b>' + i.pav + '</b><span>' + i.kada + '</span></a>';
      }).join('');
      return '<span class="meniu-grupe">' +
             '<button type="button" class="meniu-jungiklis' + (aktyvus ? ' aktyvus' : '') +
             '" aria-expanded="false">' + p.pav + '<span class="meniu-rodykle">&#9662;</span></button>' +
             '<span class="meniu-sarasas">' + eilutes + '</span></span>';
    }
    const klase = (p.pav === cfg.aktyvus) ? ' class="aktyvus"' : '';
    return '<a href="' + p.url + '"' + klase + '>' + p.pav + '</a>';
  }).join('\n        ');

  return '' +
    '<header class="virsus">\n' +
    '  <div class="wrap">\n' +
    '    ' + antrastesZenklas() + '\n' +
    '    <button type="button" class="meniu-mobilus" aria-expanded="false" aria-controls="pagrindinisMeniu">' +
    '<span class="meniu-bruksniai" aria-hidden="true"></span><span class="meniu-zodis">Meniu</span></button>\n' +
    '    <nav class="meniu" id="pagrindinisMeniu">\n        ' + nuorodos + '\n' +
    '        <a class="mygtukas mygtukas-sm m-pagrindinis" href="' + mygt.url + '">' + mygt.pav + '</a>\n' +
    '    </nav>\n' +
    '  </div>\n' +
    '</header>';
}

function trupiniai(cfg) {
  if (!cfg.trupiniai) return '';
  const dalys = cfg.trupiniai.map(function (d, i) {
    const skyriklis = i ? '<span class="skyriklis">/</span>' : '';
    const vidus = (i === cfg.trupiniai.length - 1)
      ? '<span class="dabartinis">' + d[0] + '</span>'
      : '<a href="' + d[1] + '">' + d[0] + '</a>';
    return skyriklis + vidus;
  }).join('');

  const desine = cfg.trupiniu_desine
    ? '<span style="margin-left:auto;">' + cfg.trupiniu_desine + '</span>' : '';

  /* „Atgal": grįžta ten, iš kur atėjai. Jei atėjai iš kitur (nuoroda, žymė),
     veda vienu laipteliu aukščiau pagal trupinius — niekada iš svetainės. */
  const tevas = cfg.trupiniai.length > 1 ? (cfg.trupiniai[cfg.trupiniai.length - 2][1] || 'index.html') : 'index.html';
  const atgal = '<a class="atgal" href="' + tevas + '" data-atgal="1">' +
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>Atgal</a>';

  return '<div class="trupiniai"><div class="wrap">' + atgal + '<span class="trupiniu-kelias">' + dalys + '</span>' + desine + '</div></div>';
}

function porastes_stulpelis(s) {
  const nuorodos = s.nuorodos.map(function (n) {
    return '<a href="' + n.url + '">' + n.pav + '</a>';
  }).join('\n          ');
  return '<div class="stulpelis tarpas-12">\n' +
         '          <div class="etikete">' + s.antraste + '</div>\n          ' + nuorodos + '\n        </div>';
}

/* aidas — dirbtinis intelektas už svetainės. Logotipas baltas ant tamsos,
   todėl šviesiose vietose jis visada guli ant tamsios plokštelės. */
function aidasPlokste(uzrasas) {
  return '<span class="aidas-plokste"><span class="aidas-uzrasas">' + uzrasas + '</span>' +
         '<img src="aidas.png" alt="aidas" width="138" height="30" decoding="async"></span>';
}

function poraste() {
  const stulpeliai = SVETAINE.porastes_stulpeliai.map(porastes_stulpelis).join('\n        ');
  return '' +
    '<footer class="apacia">\n' +
    '  <div class="wrap">\n' +
    '    <div class="apacia-tinklelis">\n' +
    '      <div class="stulpelis tarpas-12">\n        ' +
    '<a class="porastes-zenklas" href="index.html"><img src="aidas.png" alt="aidas" width="138" height="30">' +
    '<span>' + SVETAINE.pavadinimas + '</span></a>\n' +
    '        <p class="tekstas" style="max-width: 280px;">' + SVETAINE.porastes_aprasas + '</p>\n' +
    '      </div>\n        ' + stulpeliai + '\n' +
    '    </div>\n' +
    '    <div class="apacia-eile">\n' +
    '      <span class="smulkus">' + SVETAINE.autorius + '</span>\n' +
    '      <span class="smulkus">' + SVETAINE.vieta + '</span>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</footer>';
}

(function surinkti() {
  const vardas = document.body.dataset.puslapis || 'index';
  const cfg = Object.assign({}, SVETAINE.puslapiai[vardas] || {});

  /* Kategorijos puslapyje paskutinis trupinys — pačios kategorijos vardas. */
  if (vardas === 'patikra' && document.body.dataset.pav) {
    cfg.trupiniai = cfg.trupiniai.slice(0, -1).concat([[document.body.dataset.pav]]);
  }

  const v = document.getElementById('virsus');
  if (v) v.outerHTML = antraste(cfg) + trupiniai(cfg);

  const a = document.getElementById('apacia');
  if (a) a.outerHTML = poraste();

  /* Mygtukas „Atgal". Istorija naudojama tik tada, kai ankstesnis puslapis
     yra šios pačios svetainės — kitaip žmogus išskristų į paiešką. */
  document.querySelectorAll('[data-atgal]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      let savas = false;
      try { savas = document.referrer && new URL(document.referrer).origin === location.origin; } catch (x) {}
      if (savas && history.length > 1) { e.preventDefault(); history.back(); }
    });
  });

  /* „Į viršų" — ilgiems puslapiams (forma, rezultatas). Atsiranda nuslinkus. */
  const virsun = document.createElement('button');
  virsun.type = 'button';
  virsun.className = 'i-virsu';
  virsun.setAttribute('aria-label', 'Į puslapio viršų');
  virsun.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 15l7-7 7 7"/></svg>';
  virsun.addEventListener('click', function () {
    const ramiai = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: ramiai ? 'auto' : 'smooth' });
  });
  document.body.appendChild(virsun);
  const rodytiVirsun = function () { virsun.classList.toggle('matomas', window.scrollY > 900); };
  window.addEventListener('scroll', rodytiVirsun, { passive: true });
  rodytiVirsun();

  /* Siauras ekranas: meniu sulenda po vienu mygtuku. */
  const mob = document.querySelector('.meniu-mobilus');
  if (mob) {
    const virsus = mob.closest('.virsus');
    mob.addEventListener('click', function () {
      const atv = !virsus.classList.contains('meniu-atviras');
      virsus.classList.toggle('meniu-atviras', atv);
      mob.setAttribute('aria-expanded', atv ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { virsus.classList.remove('meniu-atviras'); mob.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* Iškrentantis įrankių sąrašas. Atsidaro paspaudus, užsidaro paspaudus šalia
     arba Esc — klaviatūra turi veikti taip pat kaip pelė. */
  const jungiklis = document.querySelector('.meniu-jungiklis');
  if (jungiklis) {
    const grupe = jungiklis.closest('.meniu-grupe');
    const perjungti = function (atidaryti) {
      grupe.classList.toggle('atidaryta', atidaryti);
      jungiklis.setAttribute('aria-expanded', atidaryti ? 'true' : 'false');
    };
    jungiklis.addEventListener('click', function (e) {
      e.preventDefault();
      perjungti(!grupe.classList.contains('atidaryta'));
    });
    document.addEventListener('click', function (e) {
      if (!grupe.contains(e.target)) perjungti(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') perjungti(false);
    });
  }
})();


/* ==========================================================================
   2 DALIS — NUOTRAUKOS
   ========================================================================== */

const NUOTRAUKOS = {

  sarasas: [],
  MAKS: 8,

  /* Ryškumo matavimas: Laplaso operatoriaus dispersija.
     Aštri nuotrauka turi daug staigių perėjimų — didelė dispersija.
     Ribos apytikslės, sukalibruotos 320 px pločio vaizdui. */
  RIBA_NERYSKI: 45,
  RIBA_VIDUTINE: 120,

  RIBA_TAMSU: 60,
  RIBA_SVIESU: 205,
  MIN_KRASTAS: 600,   /* mažiau — skelbimui per maža */

  /* --- Vienos nuotraukos išmatavimas ------------------------------------- */
  analizuoti(failas) {
    return new Promise(resolve => {
      const url = URL.createObjectURL(failas);
      const img = new Image();

      img.onerror = () => resolve({ url, klaida: "Nepavyko atidaryti failo" });

      img.onload = () => {
        const W = img.naturalWidth, H = img.naturalHeight;

        /* Sumažiname skaičiavimui — 320 px pakanka ir greita */
        const mastelis = Math.min(1, 320 / Math.max(W, H));
        const w = Math.max(8, Math.round(W * mastelis));
        const h = Math.max(8, Math.round(H * mastelis));

        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, w, h);

        let pix;
        try {
          pix = ctx.getImageData(0, 0, w, h).data;
        } catch (e) {
          /* Jei naršyklė neleidžia nuskaityti pikselių — parodome nuotrauką,
             bet be matavimų. Geriau be duomenų, nei su išgalvotais. */
          return resolve({ url, plotis: W, aukstis: H, neismatuota: true });
        }

        /* Pilkas kanalas ir vidutinis šviesumas */
        const g = new Float32Array(w * h);
        let suma = 0;
        for (let i = 0, j = 0; i < pix.length; i += 4, j++) {
          const v = 0.299 * pix[i] + 0.587 * pix[i + 1] + 0.114 * pix[i + 2];
          g[j] = v; suma += v;
        }
        const sviesumas = suma / (w * h);

        /* Laplasas ir jo dispersija */
        let lSuma = 0, lSuma2 = 0, n = 0;
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const i = y * w + x;
            const L = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - w] - g[i + w];
            lSuma += L; lSuma2 += L * L; n++;
          }
        }
        const vid = lSuma / n;
        const ryskumas = (lSuma2 / n) - vid * vid;

        resolve({
          url, plotis: W, aukstis: H,
          sviesumas: Math.round(sviesumas),
          ryskumas: Math.round(ryskumas),
          vardas: failas.name,
          dydis: failas.size
        });
      };

      img.src = url;
    });
  },

  /* --- Vienos nuotraukos verdiktas --------------------------------------- */
  ivertinti(d) {
    if (d.klaida)      return { busena: "bloga", tekstas: d.klaida };
    if (d.neismatuota) return { busena: "nezinoma", tekstas: "Matavimai neprieinami" };

    const problemos = [];
    if (Math.min(d.plotis, d.aukstis) < this.MIN_KRASTAS) problemos.push("per maža");
    if (d.ryskumas < this.RIBA_NERYSKI) problemos.push("neryški");
    if (d.sviesumas < this.RIBA_TAMSU) problemos.push("per tamsi");
    if (d.sviesumas > this.RIBA_SVIESU) problemos.push("peršviesta");

    if (problemos.length) return { busena: "bloga", tekstas: problemos.join(", ") };
    if (d.ryskumas < this.RIBA_VIDUTINE) return { busena: "vidutine", tekstas: "priimtina" };
    return { busena: "gera", tekstas: "aiški" };
  },

  /* --- Bendra suvestinė, kuri eina į rezultatą --------------------------- */
  suvestine() {
    const kiek = this.sarasas.length;
    if (!kiek) {
      return { kiek: 0, geros: 0, pasitikejimas: "zemas",
               tekstas: "Nuotraukų nepridėta — vertinimas remiasi tik tavo nurodyta būkle." };
    }

    const verdiktai = this.sarasas.map(n => this.ivertinti(n.diag));
    const geros = verdiktai.filter(v => v.busena === "gera").length;
    const priimtinos = verdiktai.filter(v => v.busena === "vidutine").length;
    const blogos = verdiktai.filter(v => v.busena === "bloga").length;
    const naudingos = geros + priimtinos;

    let pasitikejimas, tekstas;
    if (naudingos >= 4 && blogos === 0) {
      pasitikejimas = "aukstas";
      tekstas = skaicius(naudingos, ["tinkama nuotrauka", "tinkamos nuotraukos", "tinkamų nuotraukų"]) + " — būklę galima tikrinti iš jų.";
    } else if (naudingos >= 2) {
      pasitikejimas = "vidutinis";
      tekstas = skaicius(naudingos, ["tinkama nuotrauka", "tinkamos nuotraukos", "tinkamų nuotraukų"]) +
                (blogos ? ", " + blogos + " netinka (neryškios, tamsios ar per mažos)" : "") +
                ". Daugiau kampų duotų tikslesnį atsakymą.";
    } else {
      pasitikejimas = "zemas";
      tekstas = "Tinkamų nuotraukų per mažai" +
                (blogos ? " — " + blogos + " netinka" : "") +
                ". Vertinimas remiasi daugiausia tavo nurodyta būkle.";
    }
    return { kiek, geros, priimtinos, blogos, pasitikejimas, tekstas };
  },

  /* --- Miniatiūrų piešimas ----------------------------------------------- */
  perpiesti() {
    const deze = document.getElementById("nuotraukuSarasas");
    if (!deze) return;

    const SPALVOS = { gera: "var(--gerai)", vidutine: "var(--zenklas)",
                      bloga: "var(--pavojus)", nezinoma: "var(--prislopintas)" };

    deze.innerHTML = this.sarasas.map((n, i) => {
      const v = this.ivertinti(n.diag);
      return '' +
        '<figure class="miniatiura-langelis">' +
        '  <img src="' + n.diag.url + '" alt="">' +
        '  <button type="button" class="miniatiura-x" data-imesti="' + i + '" title="Išmesti">&times;</button>' +
        '  <figcaption style="color:' + SPALVOS[v.busena] + '">' + v.tekstas + '</figcaption>' +
        '</figure>';
    }).join("") +
    (this.sarasas.length < this.MAKS
      ? '<label class="miniatiura miniatiura-tuscia" for="nuotraukos" ' +
        'style="cursor:pointer;flex-direction:column;gap:2px;height:100%;min-height:84px;">' +
        '<span style="font-size:20px;color:var(--zenklas);line-height:1;">+</span>' +
        '<span class="smulkus" style="font-size:11px;">Pridėti</span></label>'
      : "");

    const sant = document.getElementById("nuotraukuSuvestine");
    if (sant) {
      const s = this.suvestine();
      sant.textContent = s.tekstas;
    }

    /* Nuotraukos yra didžiausias tikslumo svoris, tad reikia perskaičiuoti
       rodiklį. Bet DUOMENYS čia kviesti NEGALIMA: jis paskelbtas žemiau su
       `const`, o `typeof` ant dar neinicializuoto `const` meta klaidą, ne
       „undefined" — ir tai nutrauktų visą failą. Todėl pranešam įvykiu,
       o kas jo klauso, tas ir reaguoja. */
    document.dispatchEvent(new CustomEvent("nuotraukos-pakito"));
  },

  async pridetiFailus(failai) {
    for (const f of failai) {
      if (this.sarasas.length >= this.MAKS) break;
      if (!f.type.startsWith("image/")) continue;
      const diag = await this.analizuoti(f);
      this.sarasas.push({ failas: f, diag });
      this.perpiesti();
    }
  },

  /* --- Paruošimas agentui -------------------------------------------------
     Sumažina iki 1024 px ir paverčia base64 JPEG. Originalūs telefono kadrai
     būna po 5 MB — llava jų nepanaudoja, o užklausa užsikerta. */
  paruostiAgentui(kiek = 3, maksKrastas = 1024) {
    const geros = this.sarasas
      .map(n => ({ n, v: this.ivertinti(n.diag) }))
      .filter(x => x.v.busena !== "bloga")
      .slice(0, kiek);
    const naudosim = (geros.length ? geros.map(x => x.n) : this.sarasas.slice(0, kiek));

    return Promise.all(naudosim.map(n => new Promise(resolve => {
      const img = new Image();
      img.onerror = () => resolve(null);
      img.onload = () => {
        const m = Math.min(1, maksKrastas / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * m);
        c.height = Math.round(img.naturalHeight * m);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        try {
          resolve(c.toDataURL("image/jpeg", 0.85).split(",")[1]);
        } catch (e) { resolve(null); }
      };
      img.src = n.diag.url;
    }))).then(r => r.filter(Boolean));
  },

  imesti(i) {
    const n = this.sarasas[i];
    if (n && n.diag.url) URL.revokeObjectURL(n.diag.url);
    this.sarasas.splice(i, 1);
    this.perpiesti();
  }
};


/* --- Prijungimas prie formos ---------------------------------------------
   Nebe IIFE: formą sudeda svetaine.js pati, tad prijungti galima tik po to,
   kai laukai jau egzistuoja. Kviečiama iš formaPaslaugoje. */
NUOTRAUKOS.prijungti = function () {
  const ivestis = document.getElementById("nuotraukos");
  const zona = document.getElementById("nuotraukuZona");
  if (!ivestis) return;

  ivestis.addEventListener("change", e => {
    NUOTRAUKOS.pridetiFailus(Array.from(e.target.files || []));
    e.target.value = "";   /* kad tą patį failą būtų galima pasirinkti vėl */
  });

  const sarasas = document.getElementById("nuotraukuSarasas");
  if (sarasas) {
    sarasas.addEventListener("click", e => {
      const m = e.target.closest("[data-imesti]");
      if (m) { e.preventDefault(); NUOTRAUKOS.imesti(parseInt(m.dataset.imesti, 10)); }
    });
  }

  /* Užvilkimas */
  if (zona) {
    ["dragenter", "dragover"].forEach(t => zona.addEventListener(t, e => {
      e.preventDefault(); zona.classList.add("zona-aktyvi");
    }));
    ["dragleave", "drop"].forEach(t => zona.addEventListener(t, e => {
      e.preventDefault(); zona.classList.remove("zona-aktyvi");
    }));
    zona.addEventListener("drop", e => {
      const f = e.dataTransfer && e.dataTransfer.files;
      if (f && f.length) NUOTRAUKOS.pridetiFailus(Array.from(f));
    });
  }

  NUOTRAUKOS.perpiesti();
};


/* ==========================================================================
   3 DALIS — PATIKRA
   ========================================================================== */

const PATIKRA = {

  /* Verdikto ribos. 1.3 = brangiau nei 30 % virš vertės jau yra pervertinimas. */
  RIBA_BRANGU: 1.30,
  RIBA_PIGU:   0.90,

  /* --- Teksto normalizavimas ---------------------------------------------
     „PlayStation 5!" ir „playstation5" turi rasti tą patį įrašą.
     Lietuviškos raidės nuimamos, kad „Vazą" rastų „vaza".                  */
  normalizuoti(tekstas) {
    return (tekstas || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  },

  /* --- Paieška kataloge ---------------------------------------------------
     Trys pakopos, nuo tiksliausios iki laisviausios. Grąžina ir tai, KAIP
     rastas įrašas, kad galėtume sąžiningai parodyti tikslumą.              */
  rasti(pavadinimas) {
    const q = this.normalizuoti(pavadinimas);
    if (!q) return null;

    const irasai = Object.keys(KATALOGAS).map(raktas => ({
      raktas,
      duomenys: KATALOGAS[raktas],
      visiVardai: [raktas].concat(KATALOGAS[raktas].kiti_vardai || []).map(v => this.normalizuoti(v))
    }));

    /* 1. Tikslus sutapimas */
    for (const i of irasai) {
      if (i.visiVardai.includes(q)) {
        return { raktas: i.raktas, duomenys: i.duomenys, tikslumas: "tikslus" };
      }
    }

    /* 2. Užklausoje yra katalogo pavadinimas (arba atvirkščiai) */
    let geriausias = null;
    for (const i of irasai) {
      for (const v of i.visiVardai) {
        if (v.length >= 3 && (q.includes(v) || v.includes(q))) {
          const ilgis = v.length;
          if (!geriausias || ilgis > geriausias.ilgis) {
            geriausias = { raktas: i.raktas, duomenys: i.duomenys, tikslumas: "apytikslis", ilgis };
          }
        }
      }
    }
    if (geriausias) return geriausias;

    /* 3. Bendri žodžiai — bent du sutampantys žodžiai */
    const qZodziai = q.split(" ").filter(z => z.length > 2);
    let geriausiasZ = null;
    for (const i of irasai) {
      for (const v of i.visiVardai) {
        const vZodziai = v.split(" ").filter(z => z.length > 2);
        const bendri = qZodziai.filter(z => vZodziai.includes(z)).length;
        if (bendri >= 2 && (!geriausiasZ || bendri > geriausiasZ.bendri)) {
          geriausiasZ = { raktas: i.raktas, duomenys: i.duomenys, tikslumas: "apytikslis", bendri };
        }
      }
    }
    return geriausiasZ;
  },


  /* ==========================================================================
     VERTINIMO PAKOPOS

     Įrankis, kuris sako „duomenų nėra", nėra paslauga. Vertę pasakome visada —
     tik sąžiningai pasakome, kiek tuo galima remtis. Todėl trys pakopos:

       1. KATALOGAS  — tikslus įrašas, apskaičiuotas iš stebėtų kainų.
                       Pasitikėjimas aukštas.
       2. PANAŠŪS    — tikslaus įrašo nėra, bet yra stebėtų panašių skelbimų:
                       ta pati klasė, artimi metai ir rida. Imamas jų svertinis
                       vidurkis. Pasitikėjimas vidutinis.
       3. KREIVĖ     — nežinome nieko konkretaus, bet žinome klasę. Nuvertėjimo
                       kreivės forma segmente vienoda, tad iš naujos kainos,
                       amžiaus ir ridos gaunamas įvertis. Pasitikėjimas žemas,
                       rėžis platus — bet tai ATSAKYMAS.

     Kiekviena pakopa grąžina tą patį dalyką: bazinę IDEALIOS būklės vertę.
     Toliau viskas vyksta vienodai — būklė, pataisos, sugadinimai.
     ========================================================================== */

  klase(pavadinimas, kategorija, poz) {
    if (typeof KLASES === "undefined" || !KLASES[kategorija]) return null;
    const k = KLASES[kategorija];
    const q = " " + this.normalizuoti(pavadinimas) + " ";

    /* Automobiliui klasę tiksliausiai pasako kėbulo tipas iš skelbimo. */
    if (poz && poz.kebulas && k.kebulai) {
      const kb = this.normalizuoti(poz.kebulas);
      for (const raktas of Object.keys(k.kebulai)) {
        if (kb.indexOf(this.normalizuoti(raktas)) >= 0) {
          const rasta = k.kebulai[raktas];
          /* Prestižinė markė nustelbia kėbulą: BMW hečbekas nėra „kompaktinis"
             ta pačia kaina kaip to paties dydžio masinis modelis. */
          if ((k.premium_markes || []).some(m => q.indexOf(" " + m + " ") >= 0)) return "premium";
          return rasta;
        }
      }
    }
    if ((k.premium_markes || []).some(m => q.indexOf(" " + m + " ") >= 0)) return "premium";

    for (const z of Object.keys(k.zodziu_klases || {})) {
      if (q.indexOf(" " + this.normalizuoti(z) + " ") >= 0) return k.zodziu_klases[z];
    }
    return k.numatyta_klase || null;
  },

  /* 3 pakopa. Grąžina { verte, klase, pav } arba null. */
  pagalKreive(pavadinimas, kategorija, poz) {
    if (typeof KLASES === "undefined" || !kategorija || !KLASES[kategorija]) return null;
    const cfg = KLASES[kategorija];
    const klase = this.klase(pavadinimas, kategorija, poz);
    const kl = klase && cfg.klases ? cfg.klases[klase] : null;
    if (!kl) return null;

    const metai = poz && poz.metai ? poz.metai : null;
    if (!metai) return null;
    const amzius = Math.max(0, new Date().getFullYear() - metai);

    let dalis = Math.pow(cfg.metinis, amzius);
    if (dalis < cfg.riba) dalis = cfg.riba;

    /* Rida lyginama su tuo, kiek jos turėtų būti pagal amžių. Mašina su
       120 000 km po dešimties metų verta daugiau nei su 300 000. */
    if (poz && poz.rida && cfg.rida_per_metus) {
      const tiketina = cfg.rida_per_metus * Math.max(1, amzius);
      const skirtumas = (poz.rida - tiketina) / cfg.rida_zingsnis;
      let p = skirtumas * cfg.rida_uz_zingsni;
      p = Math.max(cfg.rida_riba[0], Math.min(cfg.rida_riba[1], p));
      dalis = dalis * (1 + p);
    }

    return { verte: Math.round(kl.nauja * dalis), klase: klase, pav: kl.pav };
  },

  /* 2 pakopa. Panašūs stebėti skelbimai. Panašumas skaičiuojamas, o ne
     spėjamas: kiekvienas nesutapimas atima svorio, per mažo svorio įrašai
     atmetami visai. */
  panasus(pavadinimas, kategorija, poz) {
    if (typeof STEBEJIMAI === "undefined" || !STEBEJIMAI.length) return null;
    if (!poz || !poz.metai) return null;

    const q = this.normalizuoti(pavadinimas);
    const qZodziai = q.split(" ").filter(z => z.length > 2);
    const kandidatai = [];

    for (const st of STEBEJIMAI) {
      if (kategorija && st.kategorija && st.kategorija !== kategorija) continue;
      if (!st.metai || !st.kaina) continue;

      let svoris = 1;

      const metuSkirtumas = Math.abs(st.metai - poz.metai);
      if (metuSkirtumas > 5) continue;
      svoris *= 1 - metuSkirtumas * 0.12;

      if (poz.rida && st.rida) {
        const rs = Math.abs(st.rida - poz.rida) / 100000;
        if (rs > 2) continue;
        svoris *= 1 - Math.min(0.5, rs * 0.25);
      } else {
        svoris *= 0.85;
      }

      if (poz.kuras && st.kuras &&
          this.normalizuoti(poz.kuras) !== this.normalizuoti(st.kuras)) svoris *= 0.7;

      /* Sutampantys žodžiai pavadinime — stipriausias panašumo ženklas. */
      const stZodziai = this.normalizuoti(st.pavadinimas || "").split(" ").filter(z => z.length > 2);
      const bendri = qZodziai.filter(z => stZodziai.includes(z)).length;
      svoris *= 1 + Math.min(1.5, bendri * 0.5);

      if (svoris < 0.25) continue;
      kandidatai.push({ kaina: st.kaina, svoris: svoris });
    }

    if (kandidatai.length < 3) return null;

    kandidatai.sort((a, b) => a.kaina - b.kaina);
    const visoSvorio = kandidatai.reduce((s, x) => s + x.svoris, 0);
    let sukaupta = 0, mediana = kandidatai[0].kaina;
    for (const k of kandidatai) {
      sukaupta += k.svoris;
      if (sukaupta >= visoSvorio / 2) { mediana = k.kaina; break; }
    }

    /* Stebėtos kainos yra PRAŠOMOS, o ne sandorio — jos pripūstos maždaug
       vienodai. Dalijam iš to paties koeficiento kaip ir variklis. */
    const b = BUKLES.find(x => x.raktas === "naudota");
    return { verte: Math.round(mediana / (b ? b.koef : 0.7)), n: kandidatai.length };
  },

  /* --- Nerastos užklausos --------------------------------------------------
     Kai prekės kataloge nėra, įrašome ją vietiniame sąraše. Tai tiesioginis
     nurodymas, ką į katalogą dėti toliau: žmonės patys pasako, ko ieško.   */
  irasytiUzklausa(pavadinimas) {
    try {
      const raktas = "tv_nerastos_uzklausos";
      const senos = JSON.parse(localStorage.getItem(raktas) || "[]");
      senos.push({ tekstas: pavadinimas, kada: new Date().toISOString() });
      localStorage.setItem(raktas, JSON.stringify(senos.slice(-500)));
    } catch (e) { /* jei naršyklė neleidžia — ne bėda, skaičiavimas nepriklauso */ }
  },

  /* --- Pagrindinis skaičiavimas -------------------------------------------
     bazinė vertė x būklės koeficientas x (1 + papildomų duomenų korekcijos) */
  skaiciuoti({ pavadinimas, kaina, bukle, pataisos, sugadinimai, lauzoVerte,
               tyliai, kategorija, pozymiai }) {
    const b = BUKLES.find(x => x.raktas === bukle) || BUKLES[1]; /* numatyta: naudota */
    const poz = pozymiai || null;

    /* --- Trys pakopos. Atsakymas gaunamas visada, skiriasi tik pagrįstumas. */
    let bazine = null, saltinis = null, pasitikejimas = null, rastas = null;
    let klasesPav = null, panasiuN = null, placiau = 0;

    let atskaitos = false;
    rastas = this.rasti(pavadinimas);
    if (rastas) {
      bazine = rastas.duomenys.verte;
      saltinis = "katalogas";
      pasitikejimas = rastas.duomenys.n ? "aukstas" : "vidutinis";

      /* Jei įrašas gimė iš konkrečių metų ir ridos skelbimų, jo vertė galioja
         BŪTENT tokiam daiktui. Tada amžius ir rida skaičiuojami ne nuo nulio, o
         nuo to atskaitos taško — kitaip tą patį nusidėvėjimą atimtume du kartus. */
      const a = rastas.duomenys.atskaita;
      if (a && poz && typeof KLASES !== "undefined" && kategorija && KLASES[kategorija]) {
        const cfg = KLASES[kategorija];
        atskaitos = true;
        if (a.metai && poz.metai) {
          bazine = bazine * Math.pow(cfg.metinis, a.metai - poz.metai);
        }
        if (a.rida && poz.rida && cfg.rida_zingsnis) {
          let pr = ((poz.rida - a.rida) / cfg.rida_zingsnis) * cfg.rida_uz_zingsni;
          pr = Math.max(cfg.rida_riba[0], Math.min(cfg.rida_riba[1], pr));
          bazine = bazine * (1 + pr);
        }
        bazine = Math.round(bazine);
      }
    }

    if (bazine === null) {
      const pan = this.panasus(pavadinimas, kategorija, poz);
      if (pan) {
        bazine = pan.verte;
        panasiuN = pan.n;
        saltinis = "panasus";
        pasitikejimas = "vidutinis";
        placiau = 0.12;
      }
    }

    if (bazine === null) {
      const kr = this.pagalKreive(pavadinimas, kategorija, poz);
      if (kr) {
        bazine = kr.verte;
        klasesPav = kr.pav;
        saltinis = "kreive";
        pasitikejimas = "zemas";
        placiau = 0.22;
      }
    }

    if (bazine === null) {
      /* Liko vienintelis atvejis: nežinome nė metų. Tada ir kreivė neturi iš ko
         skaičiuoti — prašome to vieno trūkstamo dalyko, o ne sakome „nėra". */
      if (!tyliai) this.irasytiUzklausa(pavadinimas);
      const kreive = typeof KLASES !== "undefined" && kategorija && KLASES[kategorija];
      return { busena: "nerasta", pavadinimas: pavadinimas,
               truksta: (poz && poz.metai) || !kreive ? "kategorijos" : "pagaminimo metų" };
    }

    /* Kreivė ir panašūs jau turi savyje amžių bei ridą — jei tas pačias
       pataisas pritaikytume dar kartą, vertė nukristų dvigubai. Todėl jas
       išimam ir sumą perskaičiuojam. */
    let p = pataisos || { sarasas: [], suma: 0 };
    if (saltinis !== "katalogas" || atskaitos) {
      const liko = (p.sarasas || []).filter(x => x.saltinis !== "amzius" && x.saltinis !== "rida");
      p = { sarasas: liko, suma: liko.reduce((sk, x) => sk + x.poveikis, 0) };
    }

    const poBukles = Math.round(bazine * b.koef);

    /* Korekcijos iš papildomų duomenų. Suma apribojama, kad pažymėjus viską
       vertė nenuskristų — atskiros prielaidos gali dubliuotis. */
    const riba = (typeof PATAISOS !== "undefined") ? PATAISOS : { riba_zemyn: -0.45, riba_aukstyn: 0.20 };
    const suma = Math.max(riba.riba_zemyn, Math.min(riba.riba_aukstyn, p.suma || 0));
    const apribota = Math.abs((p.suma || 0) - suma) > 0.001;

    /* Švari rinkos vertė. Pardavėjo prašomos kainos čia NĖRA ir negali būti:
       ji beveik visada pripūsta, o įtraukta į skaičiavimą pati save patvirtintų. */
    const verte = Math.round(poBukles * (1 + suma));

    /* Sugadinimai. Kosmetika mažina procentais, remontas — eurais, o jei kas
       nors nebetaisoma, visas daiktas vertinamas laužo verte. */
    const g = sugadinimai || { nuo: 0, iki: 0, procentas: 0, lauzas: false, eilutes: [] };
    const lauzas = lauzoVerte || { nuo: 0, iki: 0 };

    let verteNuo, verteIki;
    if (g.lauzas) {
      verteNuo = Math.round(lauzas.nuo);
      verteIki = Math.round(lauzas.iki);
    } else {
      const poProcento = verte * (1 + (g.procentas || 0));
      verteNuo = Math.round(poProcento * (1 - placiau) - (g.iki || 0));
      verteIki = Math.round(poProcento * (1 + placiau) - (g.nuo || 0));
      /* Žemiau likutinės vertės nekrentame: net sugadintas daiktas turi dalis. */
      verteNuo = Math.max(verteNuo, Math.round(lauzas.nuo));
      verteIki = Math.max(verteIki, Math.round(lauzas.nuo));
      if (verteIki < verteNuo) verteIki = verteNuo;
    }

    const turiSugadinimu = !!(g.eilutes && g.eilutes.length);

    /* Verdiktas lyginamas su rėžiu: per brangu tik tada, kai kaina viršija net
       palankiausią rėžio galą, o gera kaina — kai nesiekia nė griežčiausio. */
    let verdiktas, skirtumas = null;
    if (kaina > verteIki * this.RIBA_BRANGU) {
      verdiktas = "per-brangu";
      skirtumas = Math.round(kaina - verteIki);
    } else if (kaina < verteNuo * this.RIBA_PIGU) {
      verdiktas = "gera-kaina";
      skirtumas = Math.round(verteNuo - kaina);
    } else {
      verdiktas = "rinkos-kaina";
    }

    return {
      busena: "ok",
      pavadinimas: pavadinimas,
      katalogoIrasas: rastas ? rastas.raktas : null,
      tikslumas: rastas ? rastas.tikslumas : null,
      saltinis: saltinis,
      pasitikejimas: pasitikejimas,
      klasesPav: klasesPav,
      panasiuN: panasiuN,
      pavyzdine: rastas ? !!rastas.duomenys.pavyzdys : false,
      n: rastas ? (rastas.duomenys.n || null) : null,
      atnaujinta: rastas ? (rastas.duomenys.atnaujinta || null) : null,
      bazineVerte: bazine,
      bukle: b,
      poBukles: poBukles,
      pataisos: p.sarasas || [],
      pataisuSuma: suma,
      pataisosApribotos: apribota,
      verte: verte,
      verteNuo: verteNuo,
      verteIki: verteIki,
      sugadinimai: g.eilutes || [],
      remontoNuo: g.nuo || 0,
      remontoIki: g.iki || 0,
      sugadinimuProcentas: g.procentas || 0,
      lauzoBusena: !!g.lauzas,
      lauzoVerte: lauzas,
      turiSugadinimu: turiSugadinimu,
      kaina: Math.round(kaina),
      verdiktas: verdiktas,
      skirtumas: skirtumas,
      kada: new Date().toISOString()
    };
  },

  /* --- Tekstai verdiktui --------------------------------------------------- */
  antraste(r) {
    if (r.verdiktas === "per-brangu")  return "Ši kaina " + r.skirtumas + " &euro; per didelė";
    if (r.verdiktas === "gera-kaina")  return "Ši kaina " + r.skirtumas + " &euro; žemiau vertės";
    return "Ši kaina atitinka rinką";
  },
  zyme(r) {
    if (r.verdiktas === "per-brangu")  return "Pervertinta";
    if (r.verdiktas === "gera-kaina")  return "Gera kaina";
    return "Rinkos kaina";
  },

  /* --- Variklis (nebūtinas) -------------------------------------------------
     Visas vertinimas vyksta naršyklėje, todėl svetainė veikia ir atidaryta iš
     aplanko, ir bet kuriame statiniame talpinime. Serveris reikalingas tik
     papildomoms galimybėms (būklė iš nuotraukų, skelbimas pagal nuorodą).
     Jos įsijungia tik tada, kai serveris pats nustato window.TV_VARIKLIS = true;
     kitaip į /api/* niekas nesikreipia. */
  agentasGalimas() {
    return window.TV_VARIKLIS === true;
  },

  async klaustiAgento(pavadinimas, aprasymas, nuotraukos, kategorija) {
    if (!this.agentasGalimas()) return null;
    try {
      const a = await fetch("/api/analizuoti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pavadinimas, aprasymas, nuotraukos, kategorija })
      });
      if (!a.ok) return null;
      return await a.json();
    } catch (e) {
      return null;   /* agentas nepaleistas — ne klaida, tik nėra */
    }
  },


  /* Patikrintas skelbimas keliauja varikliui kaip duomenų taškas. Tai
     vienintelis būdas užpildyti katalogą nerenkant svetimų duomenų: prekės,
     kurias žmonės tikrina, ir yra tos, kurių vertes reikia žinoti. */
  async irasytiStebejima(d, kategorija) {
    if (!this.agentasGalimas()) return;
    if (!d || !d.pavadinimas || !d.kaina) return;
    try {
      await fetch("/api/stebejimas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pavadinimas: d.pavadinimas, kaina: d.kaina,
          pozymiai: { metai: d.metai, rida: d.rida, kuras: d.kuras,
                      kebulas: d.kebulas, kategorija: kategorija }
        })
      });
    } catch (e) { /* serveris neatsakė — ne bėda */ }
  },

  /* --- Perdavimas tarp puslapių -------------------------------------------- */
  issaugoti(r) {
    try { sessionStorage.setItem("tv_rezultatas", JSON.stringify(r)); } catch (e) {}
  },
  paimti() {
    try { return JSON.parse(sessionStorage.getItem("tv_rezultatas") || "null"); }
    catch (e) { return null; }
  }
};


/* ==========================================================================
   PAPILDOMI DUOMENYS
   Kiekvienas pažymėtas langelis realiai keičia vertę — poveikiai surašyti
   PATAISOS (katalogas.js), o rezultate parodoma kiekviena pritaikyta
   korekcija atskirai. Jokių laukų „dėl grožio" čia nėra.
   ========================================================================== */

/* --------------------------------------------------------------------------
   PATAISOS — kiek papildomi duomenys pakeičia vertę.

   Gyvena ČIA, o ne variklyje, nes variklis jų nenaudoja: jis grąžina tik
   būklę iš nuotraukos. Laikyti jas Python'e reiškė, kad vieno procento
   pakeitimui reikia dviejų failų ir perskaičiavimo. Dabar — vieno.

   Tai prielaidos, ne išmatuoti dydžiai. Kalibruok, kai turėsi tikrų sandorių.
   Rezultate kiekviena pritaikyta korekcija parodoma atskira eilute.

   Norint naujo lauko: prirašai eilutę čia — chip'as atsiranda pats.
   -------------------------------------------------------------------------- */

const PATAISOS = {
  komplektacija: [
    { raktas: "deze",       pav: "Originali dėžė",       poveikis: +0.04 },
    { raktas: "priedai",    pav: "Visi priedai",         poveikis: +0.06 },
    { raktas: "dokumentai", pav: "Kvitas ar dokumentai", poveikis: +0.03 },
    { raktas: "kabeliai",   pav: "Pakrovėjas, kabeliai", poveikis: +0.03 }
  ],
  garantija: [
    { raktas: "yra",     pav: "Garantija dar galioja", poveikis: +0.08 },
    { raktas: "nera",    pav: "Garantijos nebėra",     poveikis:  0.00 },
    { raktas: "nezinau", pav: "Nežinau",               poveikis:  0.00 }
  ],
  defektai: [
    { raktas: "nera",       pav: "Defektų nėra",               poveikis:  0.00 },
    { raktas: "ibrezimai",  pav: "Įbrėžimai, nutrinta",        poveikis: -0.05 },
    { raktas: "funkcijos",  pav: "Neveikia dalis funkcijų",    poveikis: -0.15 },
    { raktas: "keista",     pav: "Keista baterija ar detalė",  poveikis: -0.08 },
    { raktas: "remontuota", pav: "Buvo remontuota",            poveikis: -0.10 }
  ],
  amzius_uz_metus: -0.03,
  amzius_riba:     -0.30,
  /* Ribos apsaugo nuo sudėties, kuri išeina iš rėžių: „pažeista" būklė ir
     „neveikia dalis funkcijų" iš dalies sako tą patį, tad dubliuojasi. */
  riba_zemyn:      -0.45,
  riba_aukstyn:    +0.20
};


const DUOMENYS = {

  komplektacija: new Set(),
  garantija: null,
  defektai: new Set(),
  amzius: null,

  grupe(vardas) {
    return (typeof PATAISOS !== "undefined" && PATAISOS[vardas]) || [];
  },

  /* --- Chip'ų piešimas --------------------------------------------------- */
  piesti() {
    const deze = document.getElementById("papildomiDuomenys");
    if (!deze) return;

    const chip = (g, x, pazymeta) => {
      /* Procentų čia nerodome. Koeficientai yra pats vertinimo metodas, o ne
         informacija pirkėjui — ką jis su tuo darytų, išskyrus atkartojimą.
         Žmogui svarbu, KĄ įskaitome, o ne kiek kuris svelia. */
      return '<button type="button" class="tema' + (pazymeta ? " pasirinkta" : "") +
             '" data-grupe="' + g + '" data-raktas="' + x.raktas + '">' + x.pav + "</button>";
    };

    deze.innerHTML = `
      <div class="stulpelis tarpas-8">
        <span class="etikete">Kas atiduodama su daiktu</span>
        <div class="temos">${this.grupe("komplektacija")
          .map(x => chip("komplektacija", x, this.komplektacija.has(x.raktas))).join("")}</div>
      </div>

      <div class="stulpelis tarpas-8">
        <span class="etikete">Garantija</span>
        <div class="temos">${this.grupe("garantija")
          .map(x => chip("garantija", x, this.garantija === x.raktas)).join("")}</div>
      </div>

      <div class="stulpelis tarpas-8">
        <span class="etikete">Žinomi defektai</span>
        <div class="temos">${this.grupe("defektai")
          .map(x => chip("defektai", x, this.defektai.has(x.raktas))).join("")}</div>
      </div>

      <div class="laukas" style="max-width:220px;">
        <label class="etikete" for="amzius">Kiek metų daiktui</label>
        <input type="number" id="amzius" min="0" max="40" step="1" placeholder="pvz. 3"
               value="${this.amzius === null ? "" : this.amzius}">
      </div>
    `;
  },

  /* --- Paspaudimai -------------------------------------------------------- */
  prijungti() {
    const deze = document.getElementById("papildomiDuomenys");
    if (!deze) return;

    deze.addEventListener("click", e => {
      const m = e.target.closest("[data-grupe]");
      if (!m) return;
      e.preventDefault();
      const g = m.dataset.grupe, r = m.dataset.raktas;

      if (g === "garantija") {
        this.garantija = (this.garantija === r) ? null : r;
      } else if (g === "defektai") {
        /* „Defektų nėra" negali stovėti kartu su defektais. */
        if (r === "nera") {
          this.defektai = this.defektai.has("nera") ? new Set() : new Set(["nera"]);
        } else {
          this.defektai.delete("nera");
          this.defektai.has(r) ? this.defektai.delete(r) : this.defektai.add(r);
        }
      } else {
        this.komplektacija.has(r) ? this.komplektacija.delete(r) : this.komplektacija.add(r);
      }
      this.piesti();
      this.atnaujintiTiksluma();
    });

    deze.addEventListener("input", e => {
      if (e.target.id !== "amzius") return;
      const v = parseInt(e.target.value, 10);
      this.amzius = isNaN(v) ? null : Math.max(0, Math.min(40, v));
      this.atnaujintiTiksluma();
    });

    /* Nuotraukų modulis apie pasikeitimus praneša įvykiu — taip jis nepriklauso
       nuo to, kuris modulis faile paskelbtas pirmiau. */
    document.addEventListener("nuotraukos-pakito", () => this.atnaujintiTiksluma());

    this.piesti();
    this.atnaujintiTiksluma();
  },

  /* --- Korekcijų sąrašas -------------------------------------------------- */
  pataisos() {
    const sarasas = [];
    const imti = (vardas, raktas) => this.grupe(vardas).find(x => x.raktas === raktas);

    this.komplektacija.forEach(r => {
      const x = imti("komplektacija", r);
      if (x && x.poveikis) sarasas.push({ pav: x.pav, poveikis: x.poveikis });
    });

    if (this.garantija) {
      const x = imti("garantija", this.garantija);
      if (x && x.poveikis) sarasas.push({ pav: x.pav, poveikis: x.poveikis });
    }

    this.defektai.forEach(r => {
      const x = imti("defektai", r);
      if (x && x.poveikis) sarasas.push({ pav: x.pav, poveikis: x.poveikis });
    });

    if (this.amzius && typeof PATAISOS !== "undefined") {
      const nuo = Math.max(PATAISOS.amzius_riba, PATAISOS.amzius_uz_metus * this.amzius);
      if (nuo) sarasas.push({ pav: this.amzius + " m. amžius", poveikis: nuo, saltinis: "amzius" });
    }

    return { sarasas, suma: sarasas.reduce((s, x) => s + x.poveikis, 0) };
  },

  /* Trumpas aprašymas modeliui — kad jis žinotų, ko ieškoti nuotraukoje.
     Tai kontekstas, ne sprendimas: būklę modelis vis tiek nustato pats. */
  aprasymas() {
    const dalys = [];
    const pav = (g, r) => (this.grupe(g).find(x => x.raktas === r) || {}).pav;

    if (this.komplektacija.size) {
      dalys.push("pateikiama: " + [...this.komplektacija].map(r => pav("komplektacija", r)).join(", "));
    }
    const defektai = [...this.defektai].filter(r => r !== "nera");
    if (defektai.length) {
      dalys.push("žinomi defektai: " + defektai.map(r => pav("defektai", r)).join(", "));
    } else if (this.defektai.has("nera")) {
      dalys.push("pardavėjas teigia, kad defektų nėra");
    }
    if (this.amzius !== null) dalys.push("amžius: " + this.amzius + " m.");
    if (this.garantija === "yra") dalys.push("garantija dar galioja");

    return dalys.join("; ");
  },

  /* --- Tikslumas ---------------------------------------------------------
     Ne dekoratyvinis rodiklis: kiekvienas punktas atitinka duomenis, kurie
     tikrai dalyvauja skaičiavime. */
  tikslumas() {
    const punktai = [];
    const preke = document.getElementById("preke");
    const rasta = preke && preke.value.trim() && PATIKRA.rasti(preke.value.trim());
    const metaiPav = !!(preke && /\b(19[5-9]\d|20\d\d)\b/.test(preke.value));
    punktai.push({ ok: !!rasta || metaiPav, sv: 25, ko: "modelis su pagaminimo metais" });

    const nuotrauku = (typeof NUOTRAUKOS !== "undefined")
      ? NUOTRAUKOS.suvestine() : { kiek: 0, pasitikejimas: "zemas" };
    const gerosNuotraukos = nuotrauku.pasitikejimas !== "zemas";
    punktai.push({ ok: gerosNuotraukos, sv: 30, ko: "bent dvi aiškios nuotraukos" });

    punktai.push({ ok: this.komplektacija.size > 0, sv: 15, ko: "kas atiduodama su daiktu" });
    punktai.push({ ok: this.defektai.size > 0,      sv: 15, ko: "atsakymas apie defektus" });
    punktai.push({ ok: !!this.garantija,            sv: 5,  ko: "garantija" });
    punktai.push({ ok: this.amzius !== null || metaiPav, sv: 10, ko: "amžius" });

    /* Kategorijos kriterijai. Automobiliui rida svarbesnė už dėžutę, tad jie
       turi savo svorį — kitaip rodiklis meluotų. */
    if (typeof SUGADINIMAI !== "undefined" && SUGADINIMAI.kriterijuSarasas().length) {
      const visi = SUGADINIMAI.kriterijuSarasas();
      const uzpildyti = visi.filter(k => {
        const v = SUGADINIMAI.kriterijai.get(k.raktas);
        return v instanceof Set ? v.size > 0 : (v !== undefined && v !== null && v !== "");
      }).length;
      punktai.push({ ok: uzpildyti >= Math.ceil(visi.length / 2), sv: 20,
                     ko: "kategorijos duomenys (rida, apžiūra, istorija)" });
    }

    const proc = punktai.filter(p => p.ok).reduce((s, p) => s + p.sv, 0);
    const trukstA = punktai.filter(p => !p.ok).sort((a, b) => b.sv - a.sv).map(p => p.ko);
    const lygis = proc >= 75 ? "aukstas" : (proc >= 45 ? "vidutinis" : "zemas");
    return { proc, lygis, trukstA };
  },

  atnaujintiTiksluma() {
    const deze = document.getElementById("tikslumas");
    if (!deze) return;
    const t = this.tikslumas();
    const spalva = { aukstas: "var(--gerai)", vidutinis: "var(--zenklas)", zemas: "var(--pavojus)" }[t.lygis];
    const zodis  = { aukstas: "aukštas", vidutinis: "vidutinis", zemas: "žemas" }[t.lygis];

    deze.innerHTML = `
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;">
        <span class="etikete">Atsakymo tikslumas</span>
        <span style="font-family:var(--serif);font-weight:600;color:${spalva};">${zodis} &middot; ${t.proc}%</span>
      </div>
      <div style="height:6px;background:var(--linija-2);border:1px solid var(--linija);margin:8px 0 6px;">
        <div style="height:100%;width:${t.proc}%;background:${spalva};transition:width .25s;"></div>
      </div>
      <span class="smulkus">${t.trukstA.length
        ? "Tiksliau atsakysime, jei pridėsi: " + t.trukstA.slice(0, 2).join(", ") + "."
        : "Duomenų pakanka tiksliausiam atsakymui."}</span>
    `;
  }
};




/* ==========================================================================
   SUGADINTOS DETALĖS

   Esmė: rinkos vertė laikoma ŠVARIA — pardavėjo prašoma kaina į ją neįeina,
   nes ji beveik visada pripūsta. Sugadinimai tą švarią vertę mažina tiek,
   kiek realiai kainuotų sutvarkyti.

   Kainos yra REŽIAI, ne skaičiai. Jono servisas ims pigiau nei Petro, ir
   vienas skaičius tai nuslėptų. Šaltinis — DETALES iš katalogas.js.

   Trys mažinimo būdai, priklausomai nuo detalės:
     nuo/iki      — remonto kaina eurais, atimama nuo vertės
     procentas    — kosmetinis defektas, mažina procentais
     lauzas       — nebetaisoma, vertinamas visas daiktas laužo verte
   ========================================================================== */

const SUGADINIMAI = {

  kategorija: null,      /* { raktas, cfg } */
  rankinis: false,       /* žmogus pasirinko pats — spėjimas nebeperrašo */
  pasirinkti: new Map(), /* detalė -> taisymo raktas */
  kriterijai: new Map(), /* kriterijaus raktas -> reikšmė (tekstas, Set arba skaičius) */
  praleistiFoto: false,

  yra() {
    return typeof DETALES !== "undefined" && DETALES && Object.keys(DETALES).length > 0;
  },

  /* --- Kategorijos nustatymas ---------------------------------------------
     Pirmenybė — kataloge įrašyta kategorija. Jos nesant, ieškome pagal žodį
     pavadinime: „Opel Astra 2008" atpažįstamas kaip automobilis ir tada, kai
     kataloge tokio įrašo dar nėra. */
  /* Puslapio kategorija. Kiekvienas patikra-*.html ją skelbia pats, tad
     spėlioti iš pavadinimo nebereikia — ir agentui tai stabiliau. */
  isPuslapio() {
    const k = document.body.dataset.kategorija;
    if (k && this.yra() && DETALES[k]) {
      this.nustatytiRaktu(k, true);
      return true;
    }
    if (document.body.dataset.puslapis === "patikra") {
      this.rankinis = true;   /* „Kita" puslapis — kategorijos nėra sąmoningai */
      return true;
    }
    return false;
  },

  nustatyti(pavadinimas) {
    if (!this.yra()) { this.kategorija = null; return null; }
    if (this.rankinis) return this.kategorija;   /* žmogaus pasirinkimas viršesnis */

    const rastas = PATIKRA.rasti(pavadinimas);
    if (rastas && rastas.duomenys && rastas.duomenys.kategorija) {
      const k = rastas.duomenys.kategorija;
      if (DETALES[k]) return this.nustatytiRaktu(k);
    }

    const q = " " + PATIKRA.normalizuoti(pavadinimas) + " ";
    for (const k of Object.keys(DETALES)) {
      for (const z of DETALES[k].zodziai || []) {
        if (q.indexOf(" " + PATIKRA.normalizuoti(z) + " ") >= 0) {
          return this.nustatytiRaktu(k);
        }
      }
    }
    return this.nustatytiRaktu(null);
  },

  nustatytiRaktu(k, rankinis) {
    if (rankinis) this.rankinis = true;
    const senas = this.kategorija ? this.kategorija.raktas : null;
    if (senas === k) return this.kategorija;
    this.pasirinkti.clear();
    this.kriterijai.clear();
    this.praleistiFoto = false;
    this.kategorija = k ? { raktas: k, cfg: DETALES[k] } : null;
    return this.kategorija;
  },

  /* --- Kriterijai ----------------------------------------------------------
     Tai, kas keičia kainą ir yra būdinga TIK šiai kategorijai: automobiliui
     rida ir techninė, elektronikai baterija ir paklausa. Bendri dalykai —
     dėžė, garantija, amžius — lieka PATAISOS, kad nesidubliuotų.

     Kiekvienas kriterijus turi realų poveikį skaičiavimui. Laukų „dėl grožio"
     čia nėra, o rezultate kiekvienas pritaikytas kriterijus parodomas atskirai. */
  kriterijuSarasas() {
    return (this.kategorija && this.kategorija.cfg.kriterijai) || [];
  },

  kriterijuPataisos() {
    const sarasas = [];
    for (const k of this.kriterijuSarasas()) {
      const v = this.kriterijai.get(k.raktas);
      if (v === undefined || v === null || v === "") continue;

      if (k.tipas === "skaicius") {
        const sk = parseFloat(v);
        if (isNaN(sk)) continue;
        const zingsniai = (sk - k.bazine) / k.zingsnis;
        let poveikis = zingsniai * k.uz_zingsni;
        poveikis = Math.max(k.riba_zemyn, Math.min(k.riba_aukstyn, poveikis));
        if (Math.abs(poveikis) < 0.005) continue;
        sarasas.push({ pav: k.pav + " " + Math.round(sk).toLocaleString("lt-LT") +
                            " " + (k.vienetas || ""), poveikis: poveikis,
                       saltinis: k.raktas === "rida" ? "rida" : null });
      } else if (k.tipas === "keli") {
        (v instanceof Set ? [...v] : []).forEach(r => {
          const o = (k.variantai || []).find(x => x.raktas === r);
          if (o && o.poveikis) sarasas.push({ pav: o.pav, poveikis: o.poveikis });
        });
      } else {
        const o = (k.variantai || []).find(x => x.raktas === v);
        if (o && o.poveikis) sarasas.push({ pav: k.pav + ": " + o.pav, poveikis: o.poveikis });
      }
    }
    return { sarasas, suma: sarasas.reduce((s, x) => s + x.poveikis, 0) };
  },

  piestiKriterijus() {
    const deze = document.getElementById("kriterijuSkiltis");
    if (!deze) return;

    const sar = this.kriterijuSarasas();
    if (!sar.length) { deze.innerHTML = ""; deze.style.display = "none"; return; }
    deze.style.display = "";

    const chip = (kr, o, pazymeta) =>
      '<button type="button" class="tema' + (pazymeta ? " pasirinkta" : "") +
      '" data-kriterijus="' + kr.raktas + '" data-reiksme="' + o.raktas + '">' +
      o.pav + "</button>";

    const blokai = sar.map(k => {
      if (k.tipas === "skaicius") {
        const v = this.kriterijai.get(k.raktas);
        return '<div class="laukas" style="max-width:260px;">' +
          '<label class="etikete" for="kr_' + k.raktas + '">' + k.pav +
          (k.vienetas ? ", " + k.vienetas : "") + "</label>" +
          '<input type="number" id="kr_' + k.raktas + '" data-kriterijus-laukas="' + k.raktas +
          '" min="0" step="1000" placeholder="' + (k.uzuomina || "") + '" value="' +
          (v === undefined ? "" : v) + '">' +
          (k.paaiskinimas ? '<span class="smulkus">' + k.paaiskinimas + "</span>" : "") +
          "</div>";
      }
      const v = this.kriterijai.get(k.raktas);
      const chips = (k.variantai || []).map(o => chip(k, o,
        k.tipas === "keli" ? (v instanceof Set && v.has(o.raktas)) : v === o.raktas)).join("");
      return '<div class="stulpelis tarpas-8"><span class="etikete">' + k.pav + "</span>" +
             '<div class="temos">' + chips + "</div></div>";
    }).join("");

    deze.innerHTML = `
      <header class="zingsnio-antraste">
        <h3>Kas svarbu šiai kategorijai</h3>
        <span class="smulkus">${this.kategorija.cfg.pav} &middot; būtent tai keičia kainą labiausiai</span>
      </header>
      <div class="stulpelis tarpas-18">${blokai}</div>
    `;
  },

  prijungtiKriterijus() {
    const deze = document.getElementById("kriterijuSkiltis");
    if (!deze) return;

    deze.addEventListener("click", e => {
      const m = e.target.closest("[data-kriterijus]");
      if (!m) return;
      e.preventDefault();
      const kr = this.kriterijuSarasas().find(x => x.raktas === m.dataset.kriterijus);
      if (!kr) return;
      const r = m.dataset.reiksme;

      if (kr.tipas === "keli") {
        const s = this.kriterijai.get(kr.raktas) instanceof Set
          ? this.kriterijai.get(kr.raktas) : new Set();
        s.has(r) ? s.delete(r) : s.add(r);
        this.kriterijai.set(kr.raktas, s);
      } else {
        this.kriterijai.set(kr.raktas, this.kriterijai.get(kr.raktas) === r ? null : r);
      }
      this.piestiKriterijus();
      if (typeof DUOMENYS !== "undefined") DUOMENYS.atnaujintiTiksluma();
    });

    deze.addEventListener("input", e => {
      const laukas = e.target.dataset ? e.target.dataset.kriterijusLaukas : null;
      if (!laukas) return;
      this.kriterijai.set(laukas, e.target.value);
      if (typeof DUOMENYS !== "undefined") DUOMENYS.atnaujintiTiksluma();
    });
  },

  /* --- Kategorijos pasirinkimas -------------------------------------------- */
  piestiPasirinkima() {
    const deze = document.getElementById("kategorijosPasirinkimas");
    if (!deze || !this.yra()) return;

    /* Kategorijos puslapyje rinktis nebereikia — vietoj mygtukų nuoroda atgal. */
    if (document.body.dataset.puslapis === "patikra") {
      deze.innerHTML =
        '<div class="kategorijos-juosta">' +
        '<span class="etikete">Vertinama kategorija</span>' +
        '<b>' + (this.kategorija ? this.kategorija.cfg.pav : "Kita") + "</b>" +
        '<a href="paslauga.html">Keisti</a></div>';

      /* Pavyzdys laukelyje turi atitikti kategoriją — „PlayStation 5"
         automobilio puslapyje suklaidina. */
      const pav = { automobilis: "pvz. Opel Astra 2008", elektronika: "pvz. iPhone 13",
                    buitine_technika: "pvz. Bosch skalbimo mašina",
                    dviratis: "pvz. Trek Marlin 5" };
      const laukas = document.getElementById("preke");
      if (laukas) laukas.placeholder =
        pav[this.kategorija ? this.kategorija.raktas : ""] || "pvz. IKEA sofa";
      return;
    }

    const dabartine = this.kategorija ? this.kategorija.raktas : "";
    const mygtukai = Object.keys(DETALES).map(k =>
      '<button type="button" class="tema' + (dabartine === k ? " pasirinkta" : "") +
      '" data-kategorija="' + k + '">' + DETALES[k].pav + "</button>").join("") +
      '<button type="button" class="tema' + (!dabartine ? " pasirinkta" : "") +
      '" data-kategorija="">Kita</button>';

    deze.innerHTML =
      '<span class="etikete">Kas tai per daiktas</span>' +
      '<div class="temos">' + mygtukai + "</div>" +
      '<span class="smulkus">' +
      (this.rankinis ? "Pasirinkta ranka." : "Spėjame pagal pavadinimą — gali pataisyti.") +
      " Nuo to priklauso, kokių detalių ir duomenų klausiame.</span>";
  },

  prijungtiPasirinkima() {
    const deze = document.getElementById("kategorijosPasirinkimas");
    if (!deze) return;
    deze.addEventListener("click", e => {
      const m = e.target.closest("[data-kategorija]");
      if (!m) return;
      e.preventDefault();
      this.nustatytiRaktu(m.dataset.kategorija || null, true);
      this.piesti();
      if (typeof DUOMENYS !== "undefined") DUOMENYS.atnaujintiTiksluma();
    });
  },

  /* --- Kiek nuotraukų privaloma ------------------------------------------- */
  reikiaNuotrauku() {
    return (this.kategorija && this.kategorija.cfg.min_nuotrauku) || 0;
  },

  nuotrauku() {
    return (typeof NUOTRAUKOS !== "undefined") ? NUOTRAUKOS.sarasas.length : 0;
  },

  fotoTrukumas() {
    const reikia = this.reikiaNuotrauku();
    if (!reikia || this.praleistiFoto) return 0;
    return Math.max(0, reikia - this.nuotrauku());
  },

  /* --- Skaičiavimas --------------------------------------------------------
     Grąžina: { nuo, iki, procentas, lauzas, eilutes[] }
     nuo/iki — remonto kaina eurais; procentas — kosmetinė nuolaida. */
  kaina() {
    const r = { nuo: 0, iki: 0, procentas: 0, lauzas: false, eilutes: [] };
    if (!this.kategorija) return r;

    const detales = this.kategorija.cfg.detales || {};
    this.pasirinkti.forEach((taisymoRaktas, detalesRaktas) => {
      const d = detales[detalesRaktas];
      if (!d) return;
      const t = (d.taisymai || []).find(x => x.raktas === taisymoRaktas);
      if (!t) return;

      const e = { detale: d.pav, taisymas: t.pav };
      if (t.lauzas) {
        r.lauzas = true;
        e.lauzas = true;
      } else if (t.procentas) {
        r.procentas += t.procentas;
        e.procentas = t.procentas;
      } else {
        r.nuo += t.nuo || 0;
        r.iki += t.iki || 0;
        e.nuo = t.nuo || 0;
        e.iki = t.iki || 0;
      }
      r.eilutes.push(e);
    });
    return r;
  },

  lauzoVerte() {
    const l = this.kategorija && this.kategorija.cfg.lauzo_verte;
    return l ? { nuo: l.nuo, iki: l.iki, paaiskinimas: l.paaiskinimas } : { nuo: 0, iki: 0 };
  },

  /* --- Piešimas ------------------------------------------------------------ */
  piesti() {
    const deze = document.getElementById("sugadinimuSkiltis");
    if (!deze) return;

    this.piestiPasirinkima();

    if (!this.kategorija) {
      deze.innerHTML = "";
      deze.style.display = "none";
      this.piestiKriterijus();
      this.piestiFoto();
      return;
    }
    deze.style.display = "";

    const cfg = this.kategorija.cfg;
    const detales = cfg.detales || {};

    const blokai = Object.keys(detales).map(raktas => {
      const d = detales[raktas];
      const pasirinktas = this.pasirinkti.get(raktas);
      const aktyvi = pasirinktas !== undefined;

      const mygtukai = (d.taisymai || []).map(t => {
        /* Remonto kaina eurais LIEKA — tai serviso rinkos kaina, ne mūsų
           koeficientas, ir būtent dėl jos žmogus čia ateina. O kosmetinių
           defektų procentas yra mūsų svoris, tad jo nerodome. */
        const zymus = t.lauzas
          ? "nebetaisoma"
          : (t.procentas ? "mažina vertę" : t.nuo + "&ndash;" + t.iki + " &euro;");
        return '<button type="button" class="tema' + (pasirinktas === t.raktas ? " pasirinkta" : "") +
               '" data-detale="' + raktas + '" data-taisymas="' + t.raktas + '">' +
               t.pav + '<span class="tema-kaina">' + zymus + "</span></button>";
      }).join("");

      return '' +
        '<div class="sugadinimas' + (aktyvi ? " aktyvi" : "") + '">' +
        '  <button type="button" class="sugadinimo-antraste" data-jungiklis="' + raktas + '">' +
        '    <span class="sugadinimo-zyme">' + (aktyvi ? "&times;" : "+") + '</span>' +
        '    <span>' + d.pav + '</span>' +
        '  </button>' +
        (aktyvi ? '<div class="temos" style="margin-top:10px;">' + mygtukai + "</div>" : "") +
        '</div>';
    }).join("");

    deze.innerHTML = `
      <header class="zingsnio-antraste">
        <h3>Kas sugadinta</h3>
        <span class="smulkus">Pažymi tik tai, ką matai — parodysime, kiek kainuotų sutvarkyti</span>
      </header>
      <div class="sugadinimu-tinklas">${blokai}</div>
      <div class="patarimas" id="sugadinimuSuma"></div>
    `;
    this.piestiSuma();
    this.piestiKriterijus();
    this.piestiFoto();
  },

  piestiSuma() {
    const deze = document.getElementById("sugadinimuSuma");
    if (!deze) return;
    const k = this.kaina();

    if (!k.eilutes.length) {
      deze.innerHTML = '<b>Kol kas nieko nepažymėta</b>' +
        '<span>Jei daiktas tvarkingas — palik tuščią. Tada vertinsime tik pagal būklę.</span>';
      return;
    }

    if (k.lauzas) {
      const l = this.lauzoVerte();
      deze.innerHTML = '<b>Nebetaisoma</b>' +
        '<span>Pažymėjai gedimą, po kurio taisyti neapsimoka. Tokiu atveju vertė ' +
        'skaičiuojama ne nuo rinkos kainos, o kaip <b>' + l.nuo + "–" + l.iki +
        ' &euro;</b> — ' + (l.paaiskinimas || "likutinė vertė") + ".</span>";
      return;
    }

    const dalys = k.eilutes.map(e => e.detale + ": " + e.taisymas +
      (e.procentas ? "" : " (" + e.nuo + "–" + e.iki + " €)"));
    deze.innerHTML = '<b>Sutvarkymas apytiksliai ' + k.nuo + "–" + k.iki + ' &euro;</b>' +
      "<span>" + dalys.join(" &middot; ") + "</span>" +
      '<span style="color:var(--pavojus);">Skaičiai apytiksliai — servisų įkainiai skiriasi. ' +
      "Realią kainą pasako tik konkretus meistras.</span>";
  },

  piestiFoto() {
    const deze = document.getElementById("fotoReikalavimas");
    if (!deze) return;

    const reikia = this.reikiaNuotrauku();
    if (!reikia) { deze.innerHTML = ""; deze.style.display = "none"; return; }
    deze.style.display = "";

    const turi = this.nuotrauku();
    const truksta = Math.max(0, reikia - turi);
    const kampai = (this.kategorija.cfg.kampai || []).join(" &middot; ");

    if (truksta === 0) {
      deze.innerHTML = '<b style="color:var(--gerai);">Nuotraukų pakanka</b>' +
        "<span>" + turi + " iš reikalingų " + reikia + ".</span>";
      return;
    }

    deze.innerHTML = '<b>Šiai kategorijai reikia bent ' + reikia + ' nuotraukų</b>' +
      "<span>Turi " + turi + ". Trūksta " + truksta + ".</span>" +
      "<span>Ko reikia: " + kampai + "</span>" +
      '<span class="smulkus">Be jų sugadinimų nematyti, o vertė lieka spėjimu.</span>' +
      (this.praleistiFoto ? "" :
        '<button type="button" class="tema" id="praleistiFoto" style="margin-top:8px;align-self:flex-start;">' +
        "Neturiu daugiau nuotraukų — vertink taip</button>");
  },

  prijungti() {
    this.prijungtiPasirinkima();
    this.prijungtiKriterijus();

    const deze = document.getElementById("sugadinimuSkiltis");
    if (!deze) return;

    deze.addEventListener("click", e => {
      const jungiklis = e.target.closest("[data-jungiklis]");
      if (jungiklis) {
        e.preventDefault();
        const r = jungiklis.dataset.jungiklis;
        if (this.pasirinkti.has(r)) {
          this.pasirinkti.delete(r);
        } else {
          /* Numatytasis — vidurinis variantas, ne pigiausias ir ne brangiausias. */
          const t = ((this.kategorija.cfg.detales[r] || {}).taisymai) || [];
          const vidurys = t[Math.floor((t.length - 1) / 2)];
          this.pasirinkti.set(r, vidurys ? vidurys.raktas : null);
        }
        this.piesti();
        if (typeof DUOMENYS !== "undefined") DUOMENYS.atnaujintiTiksluma();
        return;
      }

      const m = e.target.closest("[data-taisymas]");
      if (m) {
        e.preventDefault();
        this.pasirinkti.set(m.dataset.detale, m.dataset.taisymas);
        this.piesti();
        if (typeof DUOMENYS !== "undefined") DUOMENYS.atnaujintiTiksluma();
      }
    });

    const foto = document.getElementById("fotoReikalavimas");
    if (foto) {
      foto.addEventListener("click", e => {
        if (!e.target.closest("#praleistiFoto")) return;
        e.preventDefault();
        this.praleistiFoto = true;
        this.piestiFoto();
        if (typeof DUOMENYS !== "undefined") DUOMENYS.atnaujintiTiksluma();
      });
    }

    document.addEventListener("nuotraukos-pakito", () => this.piestiFoto());
  },

  /* Trumpas aprašymas modeliui — ką tikrinti nuotraukose. */
  aprasymas() {
    if (!this.kategorija || !this.pasirinkti.size) return "";
    const d = this.kategorija.cfg.detales || {};
    return "nurodyti sugadinimai: " +
      [...this.pasirinkti.keys()].map(r => (d[r] || {}).pav).filter(Boolean).join(", ");
  }
};










/* ==========================================================================
   VERTĖS KREIVĖ — vienintelis judantis elementas

   Kodėl judantis: linija, kuri nusipiešia prieš akis, per porą sekundžių
   paaiškina tai, ko trys pastraipos teksto nepaaiškina — kad daiktas nuvertėja
   pagal dėsnį, o ne pagal pardavėjo nuotaiką. Ir kad šitas konkretus skelbimas
   stovi virš tos linijos arba po ja.

   Judesys neša informaciją. Jokių blizgučių: nieko nesisuka ir nemirksi.
   Kas nepakenčia judesio, tam naršyklė pasako prefers-reduced-motion, ir
   linija tiesiog atsiranda.

   Serveriui tai kainuoja nulį — visa tai piešia naršyklė.
   ========================================================================== */

const VERTES_KREIVE = {

  piesti(elementoId, d) {
    const deze = document.getElementById(elementoId);
    if (!deze) return;
    if (typeof KLASES === "undefined" || !d.kategorija || !KLASES[d.kategorija]) {
      deze.innerHTML = ""; return;
    }

    const cfg = KLASES[d.kategorija];
    const klase = PATIKRA.klase(d.pavadinimas, d.kategorija, d.pozymiai);
    const kl = klase && cfg.klases ? cfg.klases[klase] : null;
    if (!kl || !d.metai) { deze.innerHTML = ""; return; }

    const dabar = new Date().getFullYear();
    const amzius = Math.max(0, dabar - d.metai);
    const verte = Math.round((d.verteNuo + d.verteIki) / 2);

    /* Rodome ne visą kreivę nuo naujos kainos, o jos ATKARPĄ apie šį daiktą.
       Priežastis paprasta: 2008-ųjų mašina prie 60 000 € naujos kainos yra
       taškas ant grindų — nei jos, nei prašomos kainos atskirti neįmanoma.
       Priartinus matyti tai, kas svarbu: kaip kinta vertė šiais metais ir kur
       toje linijoje stovi prašoma kaina. */
    const nuoMetu = Math.max(0, amzius - 7);
    const ikiMetu = amzius + 5;

    const plotis = 720, aukstis = 300;
    const KAIRE = 16, DESINE = 16, VIRSUS = 26, APACIA = 52;
    const x = (m) => KAIRE + ((m - nuoMetu) / (ikiMetu - nuoMetu)) * (plotis - KAIRE - DESINE);
    const y = (v) => VIRSUS + (1 - Math.min(1, v / maksY)) * (aukstis - VIRSUS - APACIA);

    const kreiveTaske = (m) => {
      let dalis = Math.pow(cfg.metinis, m);
      if (dalis < cfg.riba) dalis = cfg.riba;
      return kl.nauja * dalis;
    };

    /* Viršutinė riba parenkama taip, kad tilptų ir kreivė, ir abu taškai —
       kitaip kreivė nusikerta ir virsta tiesia linija palubėje. */
    const maksY = Math.max(d.kaina, verte, kreiveTaske(nuoMetu)) * 1.12;

    const taskai = [];
    for (let m = nuoMetu; m <= ikiMetu + 0.01; m += 0.25) {
      taskai.push([x(m), y(kreiveTaske(m))]);
    }
    const kelias = taskai.map((t, i) => (i ? "L" : "M") +
      t[0].toFixed(1) + " " + t[1].toFixed(1)).join(" ");

    const vx = x(amzius);
    const vy = y(verte);
    const ky = y(d.kaina);
    const perBrangu = d.kaina > verte;

    /* Užrašai eina į kairę, jei taškas per arti dešinio krašto. */
    const kaire = vx > plotis * 0.62;
    const ux = kaire ? vx - 14 : vx + 14;
    const lygiuoti = kaire ? "end" : "start";

    const zymos = [];
    for (let m = Math.ceil(nuoMetu); m <= ikiMetu; m += 2) {
      zymos.push('<text x="' + x(m).toFixed(1) + '" y="' + (aukstis - 22) +
                 '" class="kreives-zyme" text-anchor="middle">' + m + " m.</text>");
    }

    deze.innerHTML =
      '<div class="kreives-deze">' +
      '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;">' +
      '<span class="etikete">Kaip nuvertėja &middot; ' + kl.pav + "</span>" +
      '<span class="smulkus">' + amzius + " m. senumo</span></div>" +

      '<svg viewBox="0 0 ' + plotis + " " + aukstis + '" class="kreive" ' +
      'role="img" aria-label="Vertės kreivė ir šio skelbimo vieta joje">' +

      '<line x1="' + KAIRE + '" y1="' + (aukstis - APACIA + 8) + '" x2="' + (plotis - DESINE) +
      '" y2="' + (aukstis - APACIA + 8) + '" class="kreives-asis"/>' +

      /* Pati kreivė — ji ir nusipiešia */
      '<path d="' + kelias + '" class="kreives-linija"/>' +

      /* Vertikali linija ties šio daikto amžiumi */
      '<line x1="' + vx.toFixed(1) + '" y1="' + Math.min(vy, ky).toFixed(1) +
      '" x2="' + vx.toFixed(1) + '" y2="' + (aukstis - APACIA + 8) +
      '" class="kreives-punktyras"/>' +

      /* Prašoma kaina */
      '<circle cx="' + vx.toFixed(1) + '" cy="' + ky.toFixed(1) + '" r="6.5" class="kreives-kaina' +
      (perBrangu ? " brangu" : " pigu") + '"/>' +
      '<text x="' + ux.toFixed(1) + '" y="' + (ky - 12).toFixed(1) + '" text-anchor="' + lygiuoti +
      '" class="kreives-uzrasas' + (perBrangu ? " brangu" : " pigu") + '">Prašoma ' +
      d.kaina + " &#8364;</text>" +

      /* Reali vertė ant kreivės */
      '<circle cx="' + vx.toFixed(1) + '" cy="' + vy.toFixed(1) + '" r="6.5" class="kreives-verte"/>' +
      '<text x="' + ux.toFixed(1) + '" y="' + (vy + 22).toFixed(1) + '" text-anchor="' + lygiuoti +
      '" class="kreives-uzrasas">Vertė ' + verte + " &#8364;</text>" +

      zymos.join("") +
      "</svg>" +

      '<div class="kreives-legenda">' +
      '<span><i class="zyme-linija"></i>Klasės vidurkis pagal metus</span>' +
      '<span><i class="zyme-taskas verte"></i>Šis daiktas — su rida ir būkle</span>' +
      '<span><i class="zyme-taskas ' + (perBrangu ? "brangu" : "pigu") +
      '"></i>Prašoma kaina</span></div>' +
      '<span class="smulkus">Linija — kiek paprastai vertas tokios klasės daiktas tiek metų. ' +
      "Šis konkretus stovi žemiau arba aukščiau dėl ridos ir būklės. " +
      "Prašoma kaina virš jo reiškia, kad prašoma daugiau, nei daiktas vertas.</span>" +
      "</div>";
  }
};


/* ==========================================================================
   ISTORIJA — asmeninė zona be serverio

   Kiekviena patikra išsaugoma naršyklėje. Serverio nereikia, paskyros
   nereikia, duomenys niekur neiškeliauja — jie lieka tame kompiuteryje, kuriuo
   tikrinai. Tai visa asmeninės zonos dalis, kurią įmanoma padaryti be serverio,
   ir ji padaroma šiandien.

   Ką tai duoda: grįžti po savaitės ir matai, ką tikrinai; palyginimas
   nebedingsta uždarius puslapį; visi įrankiai dalijasi tais pačiais įrašais.

   Ko tai neduoda: kito kompiuterio, telefono, atsarginės kopijos. Tam reikia
   paskyros, o paskyrai — serverio. Tai pasakyta ir puslapyje, ne tik čia.
   ========================================================================== */

const ISTORIJA = {

  RAKTAS: "tv_istorija",
  MAKS: 60,

  visi() {
    try { return JSON.parse(localStorage.getItem(this.RAKTAS) || "[]"); }
    catch (e) { return []; }
  },

  irasyti(sarasas) {
    try { localStorage.setItem(this.RAKTAS, JSON.stringify(sarasas.slice(0, this.MAKS))); }
    catch (e) { /* privatus langas arba pilna atmintis — ne bėda */ }
  },

  /* Tas pats daiktas ta pačia kaina nesikartoja: antra patikra tik atnaujina. */
  prideti(r) {
    if (!r || r.busena !== "ok") return;
    const irasas = {
      id: (r.pavadinimas || "") + "|" + r.kaina,
      pavadinimas: r.pavadinimas,
      kaina: r.kaina,
      verteNuo: r.verteNuo,
      verteIki: r.verteIki,
      verdiktas: r.verdiktas,
      pasitikejimas: r.pasitikejimas,
      kategorija: r.kategorija || null,
      kategorijosRaktas: r.kategorijosRaktas || null,
      nuoroda: r.nuoroda || null,
      isSkelbimo: !!r.isSkelbimo,
      bukle: r.bukle ? r.bukle.pav : null,
      bukleIsNuotrauku: !!r.bukleIsNuotrauku,
      metai: r.pozymiai && r.pozymiai.metai ? r.pozymiai.metai : (r.metai || null),
      rida: r.pozymiai && r.pozymiai.rida ? r.pozymiai.rida : (r.rida || null),
      sugadinimai: (r.sugadinimai || []).map(e => ({ detale: e.detale, taisymas: e.taisymas })),
      remontoNuo: r.remontoNuo || 0,
      remontoIki: r.remontoIki || 0,
      lauzoBusena: !!r.lauzoBusena,
      kada: r.kada || new Date().toISOString()
    };
    const sarasas = this.visi().filter(x => x.id !== irasas.id);
    sarasas.unshift(irasas);
    this.irasyti(sarasas);
  },

  imesti(id) {
    this.irasyti(this.visi().filter(x => x.id !== id));
  },

  isvalyti() { this.irasyti([]); },

  /* Skirtumas tarp vertės ir prašomos kainos — pagal jį rikiuojamas
     palyginimas. Teigiamas skirtumas reiškia, kad prašoma mažiau nei verta. */
  skirtumas(x) {
    return Math.round((x.verteNuo + x.verteIki) / 2) - x.kaina;
  }
};


/* ==========================================================================
   PALYGINIMO LENTELĖ

   Naudoja ISTORIJA, todėl ta pati lentelė veikia ir skelbimo patikros
   puslapyje, ir atskirame palyginimo įrankyje — ir išlieka uždarius langą.
   ========================================================================== */

const PALYGINIMAS = {

  piesti(dezesId, pasirinkti) {
    const deze = document.getElementById(dezesId);
    if (!deze) return;

    const visi = ISTORIJA.visi();
    const sarasas = pasirinkti ? visi.filter(x => pasirinkti.includes(x.id)) : visi;

    if (sarasas.length < 2) {
      deze.innerHTML = sarasas.length === 1
        ? '<div class="patarimas"><b>Renkiesi iš kelių?</b><span>Patikrink dar vieną — ' +
          "abu atsiras lentelėje ir pamatysi, kuris iš tikrųjų geresnis.</span></div>"
        : "";
      return;
    }

    const su = sarasas.map(x => ({ x, skirtumas: ISTORIJA.skirtumas(x) }));
    const geriausias = su.reduce((a, b) => (b.skirtumas > a.skirtumas ? b : a));

    const korteles = su.map(k => {
      const x = k.x;
      const spalva = k.skirtumas >= 0 ? "--gerai" : "--pavojus";
      const zenklas = k.skirtumas >= 0 ? "+" : "";
      const verte = x.verteNuo === x.verteIki
        ? x.verteNuo + " &euro;" : x.verteNuo + "&ndash;" + x.verteIki + " &euro;";
      return '<div class="palyginimo-kortele' + (k === geriausias ? " geriausia" : "") + '">' +
        (k === geriausias ? '<span class="palyginimo-zyme">Geriausias pirkinys</span>' : "") +
        '<button type="button" class="palyginimo-x" data-imesti="' +
        x.id.replace(/"/g, "&quot;") + '" title="Išmesti">&times;</button>' +
        "<h3>" + x.pavadinimas + "</h3>" +
        '<div class="palyginimo-eile"><span class="smulkus">Prašoma</span>' +
        '<b class="skaicius">' + x.kaina + " &euro;</b></div>" +
        '<div class="palyginimo-eile"><span class="smulkus">Reali vertė</span>' +
        '<b class="skaicius">' + verte + "</b></div>" +
        '<hr class="linija-h">' +
        '<div class="palyginimo-eile"><span class="smulkus">Skirtumas</span>' +
        '<b class="skaicius" style="color:var(' + spalva + ');font-size:24px;">' +
        zenklas + k.skirtumas + " &euro;</b></div>" +
        '<span class="smulkus">' + (x.pasitikejimas === "zemas"
          ? "Įvertis pagal klasę" : "Pagrįsta duomenimis") + "</span></div>";
    }).join("");

    deze.innerHTML =
      '<div class="palyginimo-tinklas">' + korteles + "</div>" +
      '<div class="patarimas" style="margin-top:18px;">' +
      "<b>Lyginamas ne pigumas, o skirtumas</b>" +
      "<span>Geresnis tas skelbimas, kuriame prašoma kaina labiau atsilieka nuo realios " +
      "vertės. Pigesnis daiktas gali būti blogesnis pirkinys.</span></div>";

    deze.querySelectorAll("[data-imesti]").forEach(m => {
      m.addEventListener("click", e => {
        e.preventDefault();
        ISTORIJA.imesti(m.dataset.imesti);
        this.piesti(dezesId, pasirinkti);
      });
    });
  }
};


/* ==========================================================================
   SKELBIMO PATIKRA — skelbimas.html

   Atskira sistema, ne ta pati forma. Skirtumas esminis:

     Ši       — tikrini SVETIMĄ skelbimą, kurį matai internete. Nuotraukų
                neturi ir neprivalai turėti: jos yra portale, ne tavo rankose.
                Duomenys ateina iš skelbimo teksto, atsakymas — per sekundę.

     Pilna    — daiktas tavo rankose. Fotografuoji, žymi sugadinimus,
                (patikra-*.html)  nuotraukos privalomos, atsakymas pagrįstas.

   Todėl čia nėra nei nuotraukų reikalavimo, nei detalių sąrašo. Užtat
   rezultate aiškiai pasakoma, kad remtasi pardavėjo žodžiais — jie
   nepatikrinti, ir daiktą vis tiek reikės apžiūrėti.
   ========================================================================== */

const SKELBIMO_PATIKRA = {

  duomenys: null,

  /* Kategorija pagal tai, kas skelbime apskritai yra. Automobilį išduoda
     rida ir kuro tipas — jokia elektronika tų laukų neturi. */
  kategorija(d, tekstas) {
    if (typeof DETALES === "undefined") return null;
    if (d.rida || d.kuras || d.kebulas || d.deze) return "automobilis";
    const q = " " + PATIKRA.normalizuoti(tekstas) + " ";
    for (const k of Object.keys(DETALES)) {
      for (const z of DETALES[k].zodziai || []) {
        if (q.indexOf(" " + PATIKRA.normalizuoti(z) + " ") >= 0) return k;
      }
    }
    return null;
  },

  /* Iš skelbimo laukų — į vertinimo pataisas. Kiekviena eilutė turi šaltinį
     skelbime, nė viena neprasimanyta. */
  pataisos(d, kat) {
    const sarasas = [];
    const cfg = (kat && typeof DETALES !== "undefined") ? DETALES[kat] : null;
    const kriterijai = (cfg && cfg.kriterijai) || [];

    const rasti = (raktas) => kriterijai.find(k => k.raktas === raktas);

    if (d.rida) {
      const k = rasti("rida");
      if (k) {
        let p = ((d.rida - k.bazine) / k.zingsnis) * k.uz_zingsni;
        p = Math.max(k.riba_zemyn, Math.min(k.riba_aukstyn, p));
        if (Math.abs(p) >= 0.005) {
          sarasas.push({ pav: "Rida " + d.rida.toLocaleString("lt-LT") + " km", poveikis: p, saltinis: "rida" });
        }
      }
    }

    const ta = SKELBIMAS.taBusena(d.ta);
    if (ta) {
      const k = rasti("ta");
      const o = k && (k.variantai || []).find(x => x.raktas === ta);
      if (o && o.poveikis) sarasas.push({ pav: "Techninė apžiūra: " + o.pav, poveikis: o.poveikis });
    }

    if (d.metai && typeof PATAISOS !== "undefined") {
      const amzius = new Date().getFullYear() - d.metai;
      const p = Math.max(PATAISOS.amzius_riba, PATAISOS.amzius_uz_metus * amzius);
      if (p) sarasas.push({ pav: amzius + " m. amžius", poveikis: p });
    }

    const def = SKELBIMAS.defektuBusena(d.defektai);
    if (def && typeof PATAISOS !== "undefined") {
      const o = (PATAISOS.defektai || []).find(x => x.raktas === def);
      if (o && o.poveikis) sarasas.push({ pav: "Skelbime nurodyta: " + o.pav, poveikis: o.poveikis });
    }

    return { sarasas, suma: sarasas.reduce((s, x) => s + x.poveikis, 0) };
  },

  /* Būklė iš pardavėjo žodžių. Be nuotraukų kitaip jos nenustatysi, tad
     imama atsargiai: „daužtas" reiškia pažeistą, visa kita — naudotą. */
  bukle(d) {
    const def = SKELBIMAS.defektuBusena(d.defektai);
    return def === "funkcijos" ? "pazeista" : "naudota";
  },

  vertinti(tekstas, meta) {
    const d = SKELBIMAS.skaityti(tekstas, meta);

    /* Kaina imama iš laukelio, ne iš teksto. Tekste skaičių su eurais būna
       keli, o nuo šito vieno priklauso visas verdiktas — tad paskutinis žodis
       priklauso žmogui, ne atpažintuvui. Atpažintas skaičius tik pasiūlomas. */
    const laukas = document.getElementById("gKaina");
    if (laukas) {
      /* Ranka įrašyta kaina lieka, kol neįklijuojamas kitas skelbimas; tada
         imama to skelbimo kaina, o ne ankstesniojo. */
      if (!(laukas.dataset.ranka && laukas.value)) laukas.value = d.kaina || "";
      delete laukas.dataset.pries;
      const iranka = parseFloat(laukas.value);
      if (!isNaN(iranka) && iranka > 0) d.kaina = iranka;
      else d.kaina = null;
    }

    this.duomenys = d;

    if (!d.pavadinimas || !d.kaina) {
      const truksta = [];
      if (!d.pavadinimas) truksta.push("prekės pavadinimo");
      if (!d.kaina) truksta.push("prašomos kainos");
      return { klaida: "Trūksta " + truksta.join(" ir ") + ".", dalinis: d };
    }

    return this.vertintiSuDuomenimis(d, tekstas);
  },

  vertintiSuDuomenimis(d, tekstas) {
    this.duomenys = d;
    const kat = this.kategorija(d, tekstas || "");
    const bukle = this.bukle(d);
    const r = PATIKRA.skaiciuoti({
      pavadinimas: d.pavadinimas, kaina: d.kaina, bukle: bukle,
      pataisos: this.pataisos(d, kat),
      sugadinimai: null,
      lauzoVerte: (kat && DETALES[kat]) ? DETALES[kat].lauzo_verte : null,
      kategorija: kat,
      pozymiai: { metai: d.metai, rida: d.rida, kuras: d.kuras, kebulas: d.kebulas }
    });
    PATIKRA.irasytiStebejima(d, kat);
    r.kategorija = (kat && DETALES[kat]) ? DETALES[kat].pav : null;
    r.kategorijosRaktas = kat;
    r.skelbimas = d;
    r.isSkelbimo = true;
    return { rezultatas: r };
  },

  /* --- Piešimas ------------------------------------------------------------ */
  piestiDuomenis(d) {
    const eil = [
      ["Prekė", d.pavadinimas],
      ["Kaina", d.kaina ? d.kaina + " €" : null],
      ["Metai", d.metai],
      ["Rida", d.rida ? d.rida.toLocaleString("lt-LT") + " km" : null],
      ["Variklis", d.variklis],
      ["Kuras", d.kuras],
      ["Pavarų dėžė", d.deze],
      ["Kėbulas", d.kebulas],
      ["Techninė iki", d.ta],
      ["Defektai", d.defektai],
    ].filter(x => x[1]);

    return '<div class="skelbimo-laukai">' + eil.map(x =>
      '<div class="skelbimo-laukas"><span class="etikete">' + x[0] + "</span>" +
      "<b>" + x[1] + "</b></div>").join("") + "</div>";
  },

  piesti(a, tekstas) {
    const deze = document.getElementById("skelbimoRezultatas");
    if (!deze) return;

    if (a.klaida) {
      /* Ne aklavietė ir ne tyla. Parodome, KĄ perskaitėme ir ko trūksta, plius
         pirmas gauto teksto eilutes — iš jų iškart matyti, ar nukopijuota tai,
         ko reikia, ar portalo meniu. Trūkstamą įrašai ranka ir eini toliau. */
      const d = a.dalinis || {};
      const eil = (tekstas || "").split("\n").slice(0, 12).join("\n");
      deze.innerHTML =
        '<div class="kortele stulpelis tarpas-14" style="border-left:3px solid var(--pavojus);">' +
        "<b>" + a.klaida + "</b>" +
        '<span class="tekstas">Portalai skelbimą surašo skirtingai. Įrašyk trūkstamą ranka — ' +
        "visa kita jau perskaityta.</span>" +
        (Object.keys(d).filter(k => d[k]).length ? this.piestiDuomenis(d) : "") +
        '<div class="laukas" style="margin-top:6px;">' +
        '<label class="etikete" for="rPavadinimas">Kas tai per daiktas</label>' +
        '<input type="text" id="rPavadinimas" placeholder="pvz. BMW 120 2008" value="' +
        (d.pavadinimas || "").replace(/"/g, "&quot;") + '"></div>' +
        '<div class="laukas">' +
        '<label class="etikete" for="rKaina">Prašoma kaina</label>' +
        '<input type="number" id="rKaina" placeholder="3450" value="' +
        (d.kaina || "") + '"></div>' +
        '<button type="button" class="mygtukas m-pagrindinis" id="rMygtukas" ' +
        'style="align-self:flex-start;">Vertinti</button>' +
        '<details style="margin-top:6px;"><summary class="smulkus" style="cursor:pointer;">' +
        "Ką perskaitėme iš teksto</summary>" +
        '<pre style="white-space:pre-wrap;font-family:var(--mono);font-size:13px;' +
        'background:var(--pavirsius-3);padding:12px;margin-top:8px;max-height:220px;' +
        'overflow:auto;">' + eil.replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c])) +
        "</pre></details></div>";

      const m = document.getElementById("rMygtukas");
      if (m) {
        m.addEventListener("click", e => {
          e.preventDefault();
          const pav = (document.getElementById("rPavadinimas").value || "").trim();
          const kn = parseFloat(document.getElementById("rKaina").value);
          if (!pav || isNaN(kn) || kn <= 0) return;
          const g = document.getElementById("gKaina");
          if (g) { g.value = kn; g.dataset.ranka = "1"; }
          const papildytas = Object.assign({}, this.duomenys, { pavadinimas: pav, kaina: kn });
          this.duomenys = papildytas;
          this.piesti(this.vertintiSuDuomenimis(papildytas, tekstas), tekstas);
        });
      }
      return;
    }

    const r = a.rezultatas;
    if (r.busena === "nerasta") {
      deze.innerHTML =
        '<div class="kortele stulpelis tarpas-12" style="border-left:3px solid var(--silpnas);">' +
        "<b>Šio daikto kataloge dar nėra: „" + r.pavadinimas + "“</b>" +
        '<span class="tekstas">Be lyginamų kainų tikros vertės pasakyti negalime. ' +
        "Skelbimo duomenys perskaityti — jie žemiau.</span>" +
        this.piestiDuomenis(this.duomenys) + "</div>";
      return;
    }

    const rezis = r.verteNuo !== r.verteIki;
    const verte = rezis ? r.verteNuo + "&ndash;" + r.verteIki + " &euro;" : r.verteNuo + " &euro;";
    const skirt = r.verdiktas === "per-brangu"
      ? "Prašoma <b>" + r.skirtumas + " &euro;</b> daugiau, nei daiktas vertas."
      : (r.verdiktas === "gera-kaina"
          ? "Prašoma <b>" + r.skirtumas + " &euro;</b> mažiau už vertę."
          : "Kaina atitinka rinką.");

    deze.innerHTML =
      '<div class="verdiktas ' + r.verdiktas + '" style="padding:44px 36px 32px;">' +
      '  <span class="etikete">' + PATIKRA.zyme(r) + "</span>" +
      '  <h2 style="font-size:34px;">' + PATIKRA.antraste(r) + "</h2>" +
      '  <p style="font-size:16.5px;line-height:1.55;color:var(--rasalas-2);">' + skirt + "</p>" +
      "</div>" +

      '<div class="rodikliai" style="margin-top:26px;">' +
      '  <div class="stulpelis tarpas-8"><span class="etikete">Prašoma kaina</span>' +
      '    <span class="skaicius">' + r.kaina + " &euro;</span></div>" +
      '  <div class="stulpelis tarpas-8"><span class="etikete">Reali vertė</span>' +
      '    <span class="skaicius" style="color:var(--zenklas);">' + verte + "</span></div>" +
      '  <div class="stulpelis tarpas-8"><span class="etikete">Vertinta kaip</span>' +
      '    <span class="skaicius">' + r.bukle.pav + "</span></div>" +
      "</div>" +

      '<div class="patarimas" style="margin-top:26px;">' +
      "<b>Remtasi tik pardavėjo žodžiais</b>" +
      "<span>Skelbimo tekstas nėra apžiūra. Daužtas kėbulas, rūdys, dūmijantis variklis " +
      "ar nudėvėta sankaba tekste nematyti — o jie keičia vertę labiausiai. " +
      "Prieš pirkdamas apžiūrėk daiktą ir tada paleisk pilną vertinimą.</span></div>" +

      '<div id="vertesKreive" style="margin-top:26px;"></div>' +

      '<div style="margin-top:26px;">' +
      '<div class="antraste-maza" style="margin-bottom:12px;">Ką perskaitėme skelbime</div>' +
      this.piestiDuomenis(this.duomenys) + "</div>" +

      '<a class="mygtukas mygtukas-lg m-pagrindinis" style="margin-top:26px;" href="' +
      (r.kategorijosRaktas ? "patikra-" + r.kategorijosRaktas + ".html" : "patikra-kita.html") +
      '?is=skelbimo">Pilnas vertinimas su nuotraukomis</a>';

    const d = this.duomenys;
    VERTES_KREIVE.piesti("vertesKreive", {
      pavadinimas: r.pavadinimas, kategorija: r.kategorijosRaktas,
      metai: d.metai, verteNuo: r.verteNuo, verteIki: r.verteIki, kaina: r.kaina,
      pozymiai: { metai: d.metai, rida: d.rida, kuras: d.kuras, kebulas: d.kebulas }
    });

    try {
      sessionStorage.setItem("tv_skelbimas", JSON.stringify(Object.assign({ tekstas: tekstas }, this.duomenys)));
    } catch (e) {}

    /* Į istoriją — iš ten dirba ir palyginimas, ir „Mano patikros". */
    r.isSkelbimo = true;
    r.pozymiai = { metai: d.metai || null, rida: d.rida || null };
    ISTORIJA.prideti(r);
    PALYGINIMAS.piesti("palyginimas");
  },

  prijungti() {
    const deze = document.getElementById("skelbimoRezultatas");
    if (!deze) return;

    const nuoroda = document.getElementById("gNuoroda");
    const tekstas = document.getElementById("gTekstas");
    const mygtukas = document.getElementById("gMygtukas");
    const busena = document.getElementById("gBusena");
    const kaina = document.getElementById("gKaina");
    if (kaina) {
      /* Įrašyta prieš įklijuojant — skirta ateinančiam skelbimui; įrašyta
         matant atsakymą — pataiso rodomą skelbimą. */
      const ranka = () => {
        kaina.dataset.ranka = "1";
        if (!deze.innerHTML.trim()) kaina.dataset.pries = "1";
      };
      if (kaina.value) ranka();
      kaina.addEventListener("input", ranka);
    }

    const vertinti = (t, meta) => {
      if (!t || !t.trim()) {
        busena.innerHTML = '<span style="color:var(--pavojus);">Įklijuok skelbimo tekstą arba įdėk nuorodą.</span>';
        return;
      }
      busena.textContent = "";
      this.piesti(this.vertinti(t, meta), t);
      deze.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const isNuorodos = async () => {
      const u = nuoroda.value.trim();
      /* Be serverio nuorodos neperskaitysi: jei šiai nuorodai tekstas jau įklijuotas, vertinam jį. */
      if (!u || (!PATIKRA.agentasGalimas() && tekstas.value.trim() && nuoroda.dataset.tekstui === u)) {
        return vertinti(tekstas.value);
      }
      busena.textContent = "Skaitomas skelbimas...";
      mygtukas.disabled = true;
      const a = await SKELBIMAS.isNuorodos(u);
      mygtukas.disabled = false;
      if (!a || a.klaida) {
        busena.innerHTML = '<span style="color:var(' + (a && a.patarimas ? "--zenklas" : "--pavojus") + ');">' +
          ((a && a.klaida) || "Nepavyko. Įklijuok tekstą.") + "</span>";
        const kitaip = document.querySelector(".pildymas-kitaip");
        if (kitaip) kitaip.open = true;
        tekstas.focus();
        if (a && a.patarimas) tekstas.select();   /* naujas skelbimas pakeis seną */
        return;
      }
      tekstas.value = a.tekstas || "";
      vertinti(tekstas.value, { antraste: a.antraste, kaina: a.kaina });
    };

    mygtukas.addEventListener("click", e => { e.preventDefault(); isNuorodos(); });
    nuoroda.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); isNuorodos(); }
    });
    tekstas.addEventListener("paste", e => {
      const t = (e.clipboardData || window.clipboardData).getData("text");
      if (!t) return;
      /* Naujas skelbimas: ankstesniam skirta ranka įrašyta kaina nebegalioja. */
      if (kaina && !kaina.dataset.pries) delete kaina.dataset.ranka;
      nuoroda.dataset.tekstui = nuoroda.value.trim();
      setTimeout(() => vertinti(t), 0);
    });
  }
};

(function skelbimoPuslapis() {
  if (!document.getElementById("skelbimoRezultatas")) return;
  SKELBIMO_PATIKRA.prijungti();

  /* Palyginimo lentelė piešiama iš karto: joje jau gali būti tai, ką tikrinai
     vakar. Būtent dėl to ji gyvena istorijoje, o ne puslapio atmintyje. */
  PALYGINIMAS.piesti("palyginimas");

  const valyti = document.getElementById("valytiIstorija");
  if (valyti) valyti.addEventListener("click", e => {
    e.preventDefault();
    ISTORIJA.isvalyti();
    PALYGINIMAS.piesti("palyginimas");
  });
})();


/* ==========================================================================
   KATEGORIJŲ PASIRINKIMAS — paslauga.html

   Puslapis nebeturi formos. Jame renkiesi, ką vertini, ir kortelė nuveda į
   savo puslapį, kur klausiama tik to, kas tai kategorijai svarbu.

   Korteles piešia JS iš DETALES, todėl nauja kategorija detales.json iškart
   atsiranda ir čia. HTML rankomis liesti nereikia.
   ========================================================================== */

const IKONOS = {
  automobilis:
    '<path d="M5 30h34M9 30v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4M30 30v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4"/>' +
    '<path d="M7 30l2-9a3 3 0 0 1 3-2h20a3 3 0 0 1 3 2l2 9"/>' +
    '<path d="M12 19l1.5-5a2 2 0 0 1 2-1.5h13a2 2 0 0 1 2 1.5L32 19"/>' +
    '<circle cx="13" cy="25" r="1.6"/><circle cx="31" cy="25" r="1.6"/>',
  elektronika:
    '<rect x="13" y="6" width="18" height="32" rx="2"/>' +
    '<path d="M13 11h18M13 33h18"/><circle cx="22" cy="35.5" r="1.2"/>',
  buitine_technika:
    '<rect x="9" y="6" width="26" height="32" rx="2"/>' +
    '<path d="M9 14h26"/><circle cx="22" cy="26" r="7"/><circle cx="22" cy="26" r="3"/>' +
    '<circle cx="14" cy="10" r="1.2"/><circle cx="19" cy="10" r="1.2"/>',
  dviratis:
    '<circle cx="12" cy="28" r="7"/><circle cx="32" cy="28" r="7"/>' +
    '<path d="M12 28l7-12h8M19 16l6 12M32 28l-5-12h4M17 16h5"/>',
  kita:
    '<path d="M22 6l14 8v16l-14 8-14-8V14z"/><path d="M22 22l14-8M22 22v16M22 22L8 14"/>',

  /* Įrankių ženklai */
  zaibas:       '<path d="M24 5L11 26h11l-2 14 14-21H23z"/>',
  didinamasis:  '<circle cx="19" cy="19" r="11"/><path d="M27 27l10 10"/>',
  svarstykles:  '<path d="M22 8v28M12 36h20"/><path d="M8 16h28M8 16l-5 10h10zM36 16l5 10H31z"/>' +
                '<path d="M22 12a2 2 0 1 0 0-.1"/>',
  antspaudas:   '<circle cx="22" cy="22" r="15"/><circle cx="22" cy="22" r="11" ' +
                'stroke-dasharray="2 3"/><path d="M15 22.5l5 5 9-10"/>',
};

function ikona(raktas) {
  return '<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" ' +
         'stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
         (IKONOS[raktas] || IKONOS.kita) + "</svg>";
}



/* Paslaugų sąrašas pagrindiniame puslapyje. Piešiamas iš IRANKIAI, todėl
   naujas įrankis atsiranda čia pats. */
/* Pradžios puslapio kairysis langas „Pasiūlymai". Įrankiai iš IRANKIAI,
   vertinimas pagal daiktą — iš DETALES (katalogas.js). Naujas įrankis ar nauja
   kategorija čia atsiranda pati. Paieška — žmogaus žodžiais, be serverio. */
(function pasiulymuLangas() {
  const deze = document.getElementById("pasiulymuSarasas");
  if (!deze) return;
  const laukas = document.getElementById("pasiulymuPaieska");
  const forma = document.getElementById("pasiulymuForma");
  const kiekis = document.getElementById("pasiulymuKiekis");

  const R = (k) => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ({
      zaibas: '<rect x="4" y="3" width="13" height="17" rx="1.5"/><path d="M7 8h7M7 11h7M7 14h4"/><circle cx="16.5" cy="16.5" r="3"/><path d="M18.7 18.7L21 21"/>',
      didinamasis: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l1.5-3h5L16 7"/><circle cx="12" cy="13.5" r="3.5"/>',
      svarstykles: '<path d="M12 3v18M7 21h10M4 7h16"/><path d="M7 7l-3 6h6zM17 7l-3 6h6z"/>',
      antspaudas: '<path d="M6 2h9l4 4v16H6z"/><path d="M15 2v4h4M9 11h7M9 15h7M9 19h4"/>',
      zmogus: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>'
    }[k] || '<circle cx="11" cy="11" r="7"/><path d="M16 16l5 5"/>') + "</svg>";

  const irankiai = IRANKIAI.map(i => ({
    url: i.url, pav: i.pav, apie: i.trumpai || i.santrauka, ik: R(i.ikona),
    zodziai: (i.zodziai || "") + " " + i.pav, grupe: "Įrankiai", ruosiama: i.busena !== "veikia"
  })).concat([{ url: "mano-patikros.html", pav: "Mano patikros", apie: "Visos tavo patikros vienoje vietoje.",
                ik: R("zmogus"), zodziai: "mano istorija patikros ankstesnės", grupe: "Įrankiai" }]);

  const daiktai = (typeof DETALES !== "undefined" ? Object.keys(DETALES) : []).map(r => ({
    url: "patikra-" + r + ".html", pav: DETALES[r].pav, apie: DETALES[r].antraste || "",
    ik: (typeof ikona === "function" ? ikona(r).replace('width="44" height="44"', 'width="22" height="22"') : R()),
    zodziai: [DETALES[r].pav, r.replace("_", " "), (DETALES[r].zodziai || []).join(" ")].join(" "),
    grupe: "Įvertinti pagal daiktą"
  })).concat([{ url: "patikra-kita.html", pav: "Kita", apie: "Baldai, įrankiai, instrumentai, žaislai.",
                ik: (typeof ikona === "function" ? ikona("kita").replace('width="44" height="44"', 'width="22" height="22"') : R()),
                zodziai: "kita baldai įrankiai žaislai", grupe: "Įvertinti pagal daiktą" }]);
  const visi = irankiai.concat(daiktai);

  const be = (t) => String(t || "").toLowerCase()
    .replace(/[ąčęėįšųūž]/g, c => ({ "ą":"a","č":"c","ę":"e","ė":"e","į":"i","š":"s","ų":"u","ū":"u","ž":"z" })[c]);
  function taskai(x, q) {
    const zodziai = be(q).split(/[^a-z0-9]+/).filter(z => z.length > 2);
    if (!zodziai.length) return 0;
    const kur = be(x.zodziai + " " + x.apie);
    return zodziai.reduce((s, z) => s + (kur.includes(z.slice(0, Math.max(4, z.length - 2))) ? 1 : 0), 0);
  }

  function eilute(x, pataikyta) {
    return '<a class="pasiulymas' + (x.ruosiama ? " ruos" : "") + (pataikyta ? " pataikyta" : "") + '" href="' + x.url + '">' +
      '<span class="pasiulymo-ik">' + x.ik + "</span><b>" + x.pav + "</b>" +
      '<span class="pasiulymo-rod" aria-hidden="true">&rarr;</span><span class="pasiulymo-apie">' + x.apie + "</span></a>";
  }

  function piesti() {
    const q = laukas ? laukas.value.trim() : "";
    let sarasas = visi, geriausias = null;
    if (q) {
      const su = visi.map(x => ({ x, t: taskai(x, q) })).filter(o => o.t > 0).sort((a, b) => b.t - a.t);
      sarasas = su.map(o => o.x);
      geriausias = sarasas[0] || null;
    }
    if (kiekis) kiekis.textContent = q ? (sarasas.length + " rasta") : skaicius(irankiai.length + daiktai.length, ["pasiūlymas", "pasiūlymai", "pasiūlymų"]);
    if (!sarasas.length) {
      deze.innerHTML = '<p class="pasiulymai-tuscia">Tokio įrankio dar nėra. Parašyk mums per ' +
        '<a href="kontaktai.html">kontaktus</a> — gal būtent jį ir padarysime.</p>';
      return;
    }
    const grupes = [];
    sarasas.forEach(x => { if (!grupes.includes(x.grupe)) grupes.push(x.grupe); });
    deze.innerHTML = grupes.map(g =>
      '<div class="pasiulymu-grupe"><div class="etikete">' + g + "</div>" +
      sarasas.filter(x => x.grupe === g).map(x => eilute(x, x === geriausias)).join("") + "</div>").join("");
  }

  if (laukas) laukas.addEventListener("input", piesti);
  if (forma) forma.addEventListener("submit", e => {
    e.preventDefault();
    const q = laukas.value.trim();
    if (!q) return;
    const su = visi.map(x => ({ x, t: taskai(x, q) })).filter(o => o.t > 0).sort((a, b) => b.t - a.t);
    if (su.length) location.href = su[0].x.url;
  });
  piesti();
})();

(function kategorijuKorteles() {
  const deze = document.getElementById("kategoriuKorteles");
  if (!deze) return;
  if (typeof DETALES === "undefined") return;

  const sarasas = Object.keys(DETALES).map(r => ({
    raktas: r, cfg: DETALES[r], url: "patikra-" + r + ".html"
  }));
  sarasas.push({
    raktas: "kita",
    cfg: { pav: "Kita", antraste: "Bet kuris kitas daiktas",
           ivadas: "Baldai, įrankiai, instrumentai, žaislai." },
    url: "patikra-kita.html"
  });

  deze.innerHTML = sarasas.map(x => {
    const cfg = x.cfg;
    const detaliu = cfg.detales ? Object.keys(cfg.detales).length : 0;
    const foto = cfg.min_nuotrauku || 0;

    /* Apatinė eilutė sako, kuo ta skiltis kitokia. Ne reklama — faktai. */
    const zymes = [];
    if (detaliu) zymes.push(skaicius(detaliu, ["tikrinama detalė", "tikrinamos detalės", "tikrinamų detalių"]));
    if (foto) zymes.push(skaicius(foto, ["nuotrauka", "nuotraukos", "nuotraukų"]));
    if ((cfg.kriterijai || []).length) zymes.push(skaicius((cfg.kriterijai || []).length, ["kriterijus", "kriterijai", "kriterijų"]));

    return '' +
      '<a class="paslaugos-kortele" href="' + x.url + '">' +
      '  <span class="paslaugos-ikona">' + ikona(x.raktas) + "</span>" +
      '  <span class="paslaugos-turinys">' +
      "    <h3>" + cfg.pav + "</h3>" +
      '    <span class="tekstas">' + (cfg.ivadas || "") + "</span>" +
      "  </span>" +
      '  <span class="paslaugos-apacia">' +
      '    <span class="smulkus">' + zymes.join(" &middot; ") + "</span>" +
      '    <span class="paslaugos-rodykle">&rarr;</span>' +
      "  </span>" +
      "</a>";
  }).join("");
})();




/* ==========================================================================
   SKELBIMO TEKSTAS

   Kodėl ne nuoroda. Naršyklė svetimo puslapio perskaityti negali — tai
   uždaryta saugumo taisyklėmis. Galėtų variklis, bet portalai automatinį
   skaitymą draudžia, o jų HTML keičiasi kas kelis mėnesius ir viskas lūžta.

   Todėl paprasčiau ir tvirčiau: pažymi skelbimo tekstą, kurį ir taip skaitai,
   įklijuoji čia, ir laukai užsipildo patys. Veikia su bet kuriuo portalu —
   ir su tais, kurie robotų neįsileidžia.

   Nuoroda lieka, bet dirba savo darbą: keliauja į rezultatą ir sertifikatą,
   kad vėliau matytum, kurį skelbimą tikrinai.
   ========================================================================== */

const SKELBIMAS = {

  /* Antraštė ir kaina iš portalo meta žymų, kai skelbimas atėjo pagal nuorodą.
     Jos tvarkingesnės už bet kurią teksto eilutę. */
  meta: null,

  /* Kainos ieškome pirmiausia prie žodžio „kaina", nes skelbime skaičių su
     eurais būna keli — ir mokesčiai, ir kredito įmoka per mėnesį. */
  /* Kaina. Skelbime skaičių su eurais būna keli: prekės kaina, kredito įmoka
     per mėnesį, draudimas, kitų skelbimų kainos šone. Todėl:
       1. pirma prie žodžio „kaina";
       2. paskui bet kuris, bet praleidžiant tuos, po kurių eina „mėn";
       3. iš likusių imam didžiausią — įmoka visada mažesnė už kainą.

     Jokio \b po „€": euras nėra raidė, tad po jo einanti nauja eilutė ribos
     nesudaro ir sutapimas dingsta. Būtent dėl to anksčiau „3 450 €" eilutės
     gale likdavo nerastas. */
  kaina(t) {
    const prie = t.match(/kaina[^0-9]{0,25}(\d[\d \u00a0.,]*)/i);
    if (prie) {
      const v = this.skaicius(prie[1]);
      if (v >= 1) return v;
    }

    const visi = [];
    const re = /(?:€|eur)\s*(\d[\d \u00a0.,]*)|(\d[\d \u00a0.,]*)\s*(?:€|eur)/gi;
    let m;
    while ((m = re.exec(t)) !== null) {
      const po = t.slice(m.index + m[0].length, m.index + m[0].length + 16).toLowerCase();
      if (/^\s*\/?\s*(m[ėe]n|mon|month)/.test(po)) continue;   /* kredito įmoka */
      const v = this.skaicius(m[1] || m[2]);
      if (v >= 1) visi.push(v);
    }
    return visi.length ? Math.max(...visi) : null;
  },

  metai(t) {
    const prie = t.match(/(?:metai|pagaminimo)[^0-9]{0,20}(19[5-9]\d|20[0-4]\d)/i);
    if (prie) return parseInt(prie[1], 10);
    const visi = [...t.matchAll(/\b(19[5-9]\d|20[0-4]\d)\b/g)].map(m => parseInt(m[1], 10));
    return visi.length ? Math.min(...visi) : null;
  },

  rida(t) {
    const prie = t.match(/rida[^0-9]{0,20}(\d[\d  .,]*)/i);
    if (prie) return this.skaicius(prie[1]);
    const km = t.match(/(\d[\d  .,]*)\s*km\b/i);
    return km ? this.skaicius(km[1]) : null;
  },

  /* Pavadinimas. Pirma eilutė netinka: nukopijavus portalo puslapį viršuje
     būna meniu („Skelbimai", „Prisijungti"), o ne prekė. Todėl ieškome
     eilutės, kurioje yra atpažįstamas vardas — markė ar kategorijos žodis iš
     DETALES. Jos neradus imam eilutę su raidėmis ir skaičiumi. */
  markes() {
    const zodziai = [];
    if (typeof DETALES !== "undefined") {
      for (const k of Object.keys(DETALES)) {
        for (const z of DETALES[k].zodziai || []) zodziai.push(z.toLowerCase());
      }
    }
    return zodziai;
  },

  pavadinimas(t, antraste) {
    /* Portalo antraštė (<title> arba og:title) — patikimiausias šaltinis. */
    if (antraste) {
      const v = antraste.split(/[|»·—]|\s-\s/)[0].trim();
      if (v.length >= 3) return v.slice(0, 80);
    }

    const eilutes = (t || "").split("\n").map(x => x.trim()).filter(x => x.length >= 3);
    const zodziai = this.markes();

    const kelias = /\s[>›»]\s.*\s[>›»]\s/;   /* „Skelbimai > Automobiliai > Opel" — ne pavadinimas */
    for (const e of eilutes.slice(0, 60)) {
      if (e.length > 90 || kelias.test(e)) continue;
      const maza = " " + e.toLowerCase().replace(/[,.;]/g, " ") + " ";
      if (zodziai.some(z => maza.indexOf(" " + z + " ") >= 0)) return e.slice(0, 80);
    }

    for (const e of eilutes.slice(0, 20)) {
      if (e.length >= 6 && e.length <= 80 && /[a-z]/i.test(e) && /\d/.test(e) && !kelias.test(e)) return e;
    }
    return eilutes.length ? eilutes[0].slice(0, 80) : null;
  },

  skaicius(s) {
    const v = parseFloat(String(s).replace(/[  .]/g, "").replace(",", "."));
    return isNaN(v) ? 0 : v;
  },

  /* --- Užpildymas ---------------------------------------------------------- */
  uzpildyti(tekstas) {
    const rasta = [];
    const nustatyti = (id, reiksme, pav) => {
      const el = document.getElementById(id);
      if (!el || reiksme === null || reiksme === undefined) return;
      el.value = reiksme;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      rasta.push(pav + ": " + reiksme);
    };

    const d = this.skaityti(tekstas);
    nustatyti("preke", d.pavadinimas, "prekė");
    nustatyti("kaina", d.kaina, "kaina");
    nustatyti("kr_rida", d.rida, "rida");

    const metai = d.metai;
    if (metai) {
      const dabar = new Date().getFullYear();
      nustatyti("amzius", Math.max(0, dabar - metai), "amžius");
    }
    return rasta;
  },


  /* --- Struktūrinis skaitymas -----------------------------------------------
     Skelbimų portalai rašo laukus vienodai: „Pagaminimo data: 2008-05",
     „Rida: 240 000 km", „Kuro tipas: Dyzelinas". Todėl ieškome ne HTML
     struktūros, o šitų žodžių — jie nesikeičia net portalui perdarius dizainą.

     Grąžina viską, ką pavyko atpažinti. Ko nerado — nėra, ir niekas
     neprasimanoma. */
  LAUKAI: [
    { raktas: "metai",   zodziai: ["pagaminimo data", "pagaminimo metai", "metai"],
      tipas: "metai" },
    { raktas: "rida",    zodziai: ["rida"], tipas: "skaicius" },
    { raktas: "kuras",   zodziai: ["kuro tipas", "kuras"], tipas: "tekstas" },
    { raktas: "variklis",zodziai: ["variklis", "darbinis turis"], tipas: "tekstas" },
    { raktas: "deze",    zodziai: ["pavarų dėžė", "pavaru deze"], tipas: "tekstas" },
    { raktas: "kebulas", zodziai: ["kėbulo tipas", "kebulo tipas"], tipas: "tekstas" },
    { raktas: "ta",      zodziai: ["tech. apžiūra iki", "techninė apžiūra iki",
                                   "tech apziura iki", "ta galioja iki"], tipas: "data" },
    { raktas: "defektai",zodziai: ["defektai"], tipas: "tekstas" },
    { raktas: "spalva",  zodziai: ["spalva"], tipas: "tekstas" },
    { raktas: "galia",   zodziai: ["galia"], tipas: "tekstas" },
  ],

  laukas(t, zodziai, tipas) {
    for (const z of zodziai) {
      const re = new RegExp(z.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
                            "\\s*:?\\s*([^\\n]{1,60})", "i");
      const m = t.match(re);
      if (!m) continue;
      const v = m[1].trim();
      if (tipas === "skaicius") {
        const sk = v.match(/\d[\d  .,]*/);
        if (sk) return this.skaicius(sk[0]);
      } else if (tipas === "metai") {
        const sk = v.match(/(19[5-9]\d|20[0-4]\d)/);
        if (sk) return parseInt(sk[1], 10);
      } else if (tipas === "data") {
        const d = v.match(/(19|20)\d{2}[-./](\d{1,2})/);
        if (d) return d[0];
        const met = v.match(/(19|20)\d{2}/);
        if (met) return met[0];
      } else {
        if (v.length >= 2) return v.replace(/\s{2,}/g, " ");
      }
    }
    return null;
  },

  /* Visas skelbimas vienu ypu. */
  skaityti(t, meta) {
    meta = meta || this.meta || {};
    const d = {
      pavadinimas: this.pavadinimas(t, (meta || {}).antraste),
      kaina: (meta && meta.kaina) ? this.skaicius(meta.kaina) : this.kaina(t)
    };
    if (!d.kaina) d.kaina = this.kaina(t);
    for (const l of this.LAUKAI) {
      const v = this.laukas(t, l.zodziai, l.tipas);
      if (v !== null) d[l.raktas] = v;
    }
    if (d.rida === undefined) {
      const r = this.rida(t);
      if (r) d.rida = r;
    }
    if (d.metai === undefined) {
      const m = this.metai(t);
      if (m) d.metai = m;
    }
    return d;
  },

  /* Techninė apžiūra — ne data, o trys atvejai, kuriuos supranta vertinimas. */
  taBusena(data) {
    if (!data) return null;
    const m = String(data).match(/((?:19|20)\d{2})[-./]?(\d{1,2})?/);
    if (!m) return null;
    const metai = parseInt(m[1], 10);
    const men = m[2] ? parseInt(m[2], 10) : 6;
    const iki = new Date(metai, men - 1, 28);
    const dabar = new Date();
    const menesiai = (iki - dabar) / (1000 * 60 * 60 * 24 * 30.4);
    if (menesiai < 0) return "nera";
    return menesiai >= 6 ? "ilga" : "trumpa";
  },

  /* Defektų eilutė pardavėjo žodžiais. Iš jos sprendžiame tik tai, kas
     akivaizdu — o ne spėliojame. */
  defektuBusena(tekstas) {
    if (!tekstas) return null;
    const v = tekstas.toLowerCase();
    if (/be defekt|defekt[uų] n[ėe]ra|nėra defekt/.test(v)) return "nera";
    if (/dau[žz]t|nevažiuoj|nevaziuoj|ardym|nebevažiuoj/.test(v)) return "funkcijos";
    if (/da[žz]yt|įbr[ėe][žz]|ibrez|rūdys|rudys/.test(v)) return "ibrezimai";
    return null;
  },

  /* Nuoroda. Svetimo puslapio naršyklė perskaityti negali (CORS), todėl be
     serverio lankytojas įklijuoja skelbimo tekstą. Toliau dirba tas pats
     skaitytuvas, kaip ir įklijavus ranka: vienas kelias, ne du. */
  bePaskyros() {
    return "Skelbimo pagal nuorodą perskaityti negalime. Atidaryk skelbimą, " +
           "pažymėk visą tekstą (Ctrl+A), nukopijuok ir įklijuok žemiau.";
  },

  async isNuorodos(nuoroda) {
    if (!PATIKRA.agentasGalimas()) {
      /* Perskaityti negalime, bet atidaryti — taip. Žmogus nukopijuoja tekstą,
         įklijuoja, ir toliau dirba tas pats skaitytuvas. */
      if (/^https?:\/\//i.test(nuoroda)) {
        window.open(nuoroda, "_blank", "noopener");
        return { patarimas: true, klaida: "Skelbimas atsidarė naujame lange. Pažymėk visą tekstą " +
                                         "(Ctrl+A), nukopijuok ir įklijuok žemiau." };
      }
      return { klaida: this.bePaskyros() };
    }
    try {
      const a = await fetch("/api/skelbimas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuoroda })
      });
      if (!a.ok) return { klaida: this.bePaskyros() };
      return await a.json();
    } catch (e) {
      return { klaida: this.bePaskyros() };
    }
  },

  prijungtiNuoroda() {
    const laukas = document.getElementById("nuoroda");
    const mygtukas = document.getElementById("nuorodosMygtukas");
    const atsakas = document.getElementById("nuorodosAtsakas");
    if (!laukas || !mygtukas) return;

    const pranesti = (tekstas, spalva) => {
      atsakas.innerHTML = spalva
        ? '<span style="color:var(' + spalva + ');">' + tekstas + "</span>" : tekstas;
    };

    const skaityti = async () => {
      const u = laukas.value.trim();
      if (!u) return pranesti("Įdėk nuorodą į skelbimą.", "--pavojus");

      const senas = mygtukas.textContent;
      mygtukas.disabled = true;
      mygtukas.textContent = "Skaitoma...";
      pranesti("Skaitomas skelbimas...");

      const a = await this.isNuorodos(u);

      mygtukas.disabled = false;
      mygtukas.textContent = senas;

      if (!a || a.klaida) {
        pranesti((a && a.klaida) || "Nepavyko.", a && a.patarimas ? "--zenklas" : "--pavojus");
        const kitaip = document.querySelector(".pildymas-kitaip");
        if (kitaip) kitaip.open = true;   /* iškart parodom kelią, kuris veikia */
        return;
      }

      /* Parneštą tekstą parodome — matai, ką variklis iš tikrųjų perskaitė,
         ir gali pataisyti, jei portalas pateikė ne tai. */
      this.meta = { antraste: a.antraste, kaina: a.kaina };
      const tLaukas = document.getElementById("skelbimoTekstas");
      if (tLaukas) tLaukas.value = a.tekstas || "";

      const rasta = this.uzpildyti(a.tekstas || "");
      if (rasta.length) {
        pranesti("Užpildyta — " + rasta.join(", ") + ". Pasitikrink.", "--gerai");
      } else {
        pranesti("Puslapį perskaitėme, bet duomenų neatpažinome. Įklijuok tekstą.", "--pavojus");
        const kitaip = document.querySelector(".pildymas-kitaip");
        if (kitaip) kitaip.open = true;
      }
    };

    mygtukas.addEventListener("click", e => { e.preventDefault(); skaityti(); });
    laukas.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); skaityti(); }
    });
  },

  prijungti() {
    this.prijungtiNuoroda();

    const laukas = document.getElementById("skelbimoTekstas");
    const mygtukas = document.getElementById("skelbimoMygtukas");
    const atsakas = document.getElementById("skelbimoAtsakas");
    if (!laukas || !mygtukas) return;

    const pritaikyti = (t, isNuorodos) => {
      if (!isNuorodos) this.meta = null;   /* ranka įklijuotas tekstas savo meta neturi */
      if (!t || !t.trim()) {
        atsakas.innerHTML = '<span style="color:var(--pavojus);">Įklijuok skelbimo tekstą.</span>';
        return;
      }
      const rasta = this.uzpildyti(t);
      atsakas.innerHTML = rasta.length
        ? '<span style="color:var(--gerai);">Užpildyta — ' + rasta.join(", ") +
          ". Pasitikrink ir pataisyk, jei kas ne taip.</span>"
        : '<span style="color:var(--pavojus);">Nieko atpažinti nepavyko — įrašyk ranka.</span>';
    };

    mygtukas.addEventListener("click", e => { e.preventDefault(); pritaikyti(laukas.value); });

    /* Įklijavus laukai užsipildo iškart. Mygtukas lieka tiems, kurie tekstą
       įrašė ranka arba nori pakartoti. */
    laukas.addEventListener("paste", e => {
      const t = (e.clipboardData || window.clipboardData).getData("text");
      if (!t) return;
      setTimeout(() => pritaikyti(t), 0);
    });

    /* Įklijavus bet kur puslapyje — tas pats. Skelbimą kopijuoji vienąkart ir
       nebeieškai, į kurį langelį dėti. */
    document.addEventListener("paste", e => {
      const kur = e.target;
      if (kur && (kur.tagName === "INPUT" || kur.tagName === "TEXTAREA")) return;
      const t = (e.clipboardData || window.clipboardData).getData("text") || "";
      if (t.trim().length < 40 && t.split("\n").length < 3) return;
      const kitaip = document.querySelector(".pildymas-kitaip");
      if (kitaip) kitaip.open = true;
      laukas.value = t;
      pritaikyti(t);
    });
  },

  /* Atėjus iš skelbimo patikros („?is=skelbimo") — tas pats skelbimas užpildo
     formą iškart, o pavadinimas ir kaina lieka tokie, kokius žmogus matė patikroje.
     Kviečiama, kai forma jau visa sujungta. */
  isSkelbimoPatikros() {
    if (!/[?&]is=skelbimo\b/.test(location.search)) return;
    let s = null;
    try { s = JSON.parse(sessionStorage.getItem("tv_skelbimas") || "null"); } catch (e) {}
    const laukas = document.getElementById("skelbimoTekstas");
    if (!s || !s.tekstas || !laukas) return;
    const kitaip = document.querySelector(".pildymas-kitaip");
    if (kitaip) kitaip.open = true;
    laukas.value = s.tekstas;
    this.meta = null;
    this.uzpildyti(s.tekstas);
    for (const [id, v] of [["preke", s.pavadinimas], ["kaina", s.kaina]]) {
      const el = document.getElementById(id);
      if (el && v) { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); }
    }
    const atsakas = document.getElementById("skelbimoAtsakas");
    if (atsakas) atsakas.innerHTML = '<span style="color:var(--gerai);">Užpildyta iš skelbimo. ' +
                                     "Pasitikrink ir pataisyk, jei kas ne taip.</span>";
  }
};


/* ==========================================================================
   PATIKROS FORMA

   Formą sudeda JavaScript, o ne HTML. Priežastis praktinė: forma keičiasi
   dažniausiai iš visos svetainės, o paieškos sistemoms ji nereikalinga —
   jos indeksuoja puslapių tekstą, ne įvesties laukus. Todėl naujas laukas
   dabar reiškia vieną failą (šį), ne du.

   paslauga.html liko tik <form id="patikrosForma"></form>.
   ========================================================================== */

const FORMA = {

  /* Forma sudėta ŽINGSNIAIS. Buvo viena ilga lygiavertė juosta — žmogus
     nežinojo, kur jis yra ir kiek dar liko. Dabar kiekvienas žingsnis turi
     romėnišką numerį, pavadinimą ir vieną sakinį, kam jis reikalingas.

     Numerius skaičiuoja CSS (counter), ne ranka rašytas tekstas: kai
     kategorija neturi kriterijų ar detalių, tas žingsnis paslėptas ir
     numeracija nesusigadina. */
  zingsnis(pavadinimas, uzuomina, vidus, attrs) {
    return '<section class="zingsnis"' + (attrs || "") + ">" +
      '<header class="zingsnio-antraste"><h3>' + pavadinimas + "</h3>" +
      (uzuomina ? '<span class="smulkus">' + uzuomina + "</span>" : "") +
      "</header>" + vidus + "</section>";
  },

  piesti(forma) {
    const z = (a, b, c, d) => this.zingsnis(a, b, c, d);

    forma.innerHTML =
      z("Daiktas ir kaina", "Nuo šitų dviejų priklauso visa kita", `
        <div class="greitas-pildymas">
          <div class="laukas">
            <label class="etikete" for="nuoroda">Turi skelbimą? Įdėk nuorodą</label>
            <div class="su-mygtuku">
              <input type="url" id="nuoroda" name="nuoroda" placeholder="https://...">
              <button type="button" class="mygtukas mygtukas-sm m-pagrindinis" id="nuorodosMygtukas">Užpildyti</button>
            </div>
            <span class="smulkus" id="nuorodosAtsakas">Laukai užsipildys patys. Arba įrašyk ranka žemiau.</span>
          </div>
          <details class="pildymas-kitaip">
            <summary>Nepavyko? Įklijuok skelbimo tekstą</summary>
            <div class="laukas" style="margin-top:12px;">
              <textarea id="skelbimoTekstas" rows="4" style="height:104px;"
                        placeholder="Pažymėk skelbimo tekstą, nukopijuok ir įklijuok čia"></textarea>
              <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
                <button type="button" class="mygtukas mygtukas-sm m-kontūras" id="skelbimoMygtukas">Užpildyti iš teksto</button>
                <span class="smulkus" id="skelbimoAtsakas"></span>
              </div>
            </div>
          </details>
        </div>

        <div class="tinklelis stulpeliai-2" style="gap:18px;">
          <div class="laukas">
            <label class="etikete" for="preke">Ką tikriname</label>
            <input type="text" id="preke" name="preke" placeholder="pvz. Opel Astra 2008"
                   autocomplete="off" list="katalogoSarasas" required>
            <datalist id="katalogoSarasas"></datalist>
            <span class="smulkus" id="prekesBusena" style="min-height:17px;"></span>
          </div>
          <div class="laukas">
            <label class="etikete" for="kaina">Prašoma kaina</label>
            <div class="su-valiuta">
              <input type="number" id="kaina" name="kaina" placeholder="650" min="0" step="1" required>
              <span class="valiuta">&euro;</span>
            </div>
          </div>
        </div>

        <div class="stulpelis tarpas-8" id="kategorijosPasirinkimas"></div>`) +

      z("Būklė", "Kokią ją matai savo akimis", `
        <div class="temos" id="bukles"></div>
        <span class="smulkus" id="buklesApibudinimas"></span>`) +

      z("Nuotraukos", "Iš jų tikrinama būklė ir sugadinimai", `
        <label class="nuotrauku-zona" id="nuotraukuZona" for="nuotraukos">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 16V4"/><path d="M7.5 8.5L12 4l4.5 4.5"/>
            <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15"/>
          </svg>
          <span class="stulpelis" style="gap:2px;">
            <span style="font-size:16px;font-weight:500;">Vilk nuotraukas čia arba pasirink iš kompiuterio</span>
            <span class="smulkus">JPG arba PNG, iki 8 nuotraukų</span>
          </span>
        </label>
        <input type="file" id="nuotraukos" name="nuotraukos" accept="image/*" multiple hidden>
        <div class="miniatiuros" id="nuotraukuSarasas"></div>
        <div class="patarimas" id="fotoReikalavimas" style="display:none;"></div>
        <span class="smulkus" id="nuotraukuSuvestine"></span>`) +

      z("Kas atiduodama ir kas žinoma", "Kiekvienas pažymėjimas keičia vertę", `
        <div class="stulpelis tarpas-18" id="papildomiDuomenys"></div>`) +

      '<section class="zingsnis" id="kriterijuSkiltis" style="display:none;"></section>' +

      '<section class="zingsnis" id="sugadinimuSkiltis" style="display:none;"></section>' +

      `<div id="formosKlaida" style="display:none;background:var(--pavojus-fonas);
            border-left:3px solid var(--pavojus);padding:14px 16px;font-size:16px;
            line-height:1.5;color:var(--rasalas-2);"></div>

       <button type="submit" class="mygtukas mygtukas-lg m-pagrindinis mygtukas-pilnas">Gauti atsakymą</button>`;
  }
};


(function formaPaslaugoje() {
  const forma = document.getElementById("patikrosForma");
  if (!forma) return;

  FORMA.piesti(forma);
  NUOTRAUKOS.prijungti();

  /* Būklės mygtukai */
  let pasirinktaBukle = "naudota";
  const bukliuDeze = document.getElementById("bukles");
  if (bukliuDeze) {
    bukliuDeze.innerHTML = BUKLES.map(b =>
      '<button type="button" class="tema' + (b.raktas === pasirinktaBukle ? ' pasirinkta' : '') +
      '" data-bukle="' + b.raktas + '" title="' + b.apibudinimas + '">' + b.pav + '</button>'
    ).join("");

    /* Pradinis paaiškinimas. Anksčiau jis buvo įrašytas HTML'e — dabar formą
       sudeda JS, tad ir tekstas turi atsirasti čia. */
    const pradinisApr = document.getElementById("buklesApibudinimas");
    const pradineB = BUKLES.find(x => x.raktas === pasirinktaBukle);
    if (pradinisApr && pradineB) pradinisApr.textContent = pradineB.apibudinimas;

    bukliuDeze.addEventListener("click", e => {
      const m = e.target.closest("[data-bukle]");
      if (!m) return;
      pasirinktaBukle = m.dataset.bukle;
      bukliuDeze.querySelectorAll(".tema").forEach(x => x.classList.remove("pasirinkta"));
      m.classList.add("pasirinkta");
      const apr = document.getElementById("buklesApibudinimas");
      const b = BUKLES.find(x => x.raktas === pasirinktaBukle);
      if (apr && b) apr.textContent = b.apibudinimas;
      perskaiciuotiGyvai();
    });
  }

  /* Papildomų duomenų skiltis ir tikslumo rodiklis */
  if (typeof DUOMENYS !== "undefined") DUOMENYS.prijungti();

  const prekesIvestis = document.getElementById("preke");

  /* Katalogo pasiūlymai. Žmogus mato, ką variklis tikrai turi — nebereikia
     spėlioti pavadinimo ir laukti atsakymo tik po mygtuko paspaudimo. */
  const sarasas = document.getElementById("katalogoSarasas");
  if (sarasas && typeof KATALOGAS !== "undefined") {
    sarasas.innerHTML = Object.keys(KATALOGAS).sort()
      .map(r => '<option value="' + r.replace(/"/g, "&quot;") + '">').join("");
  }

  /* Atsakas iškart po įvedimo. Anksčiau apie tai, kad daikto kataloge nėra,
     sužinodavai tik paspaudęs mygtuką — ir atrodydavo, kad niekas neįvyko. */
  const busena = document.getElementById("prekesBusena");
  function atnaujintiPrekesBusena() {
    if (!busena || !prekesIvestis) return;
    const q = prekesIvestis.value.trim();
    if (!q) { busena.textContent = ""; return; }
    const rasta = PATIKRA.rasti(q);
    if (!rasta) {
      const amz = document.getElementById("amzius");
      const yraMetai = /\b(19[5-9]\d|20\d\d)\b/.test(q) || (amz && amz.value);
      const kat = typeof SUGADINIMAI !== "undefined" && SUGADINIMAI.kategorija ? SUGADINIMAI.kategorija.raktas : null;
      const kreive = typeof KLASES !== "undefined" && kat && KLASES[kat];
      busena.innerHTML = !kreive
        ? '<span style="color:var(--zenklas);">Šios prekės kataloge dar nėra.</span>'
        : yraMetai
        ? '<span style="color:var(--zenklas);">Tikslaus modelio sąraše nėra — vertinsime pagal metus ir panašius daiktus.</span>'
        : '<span style="color:var(--zenklas);">Pridėk pagaminimo metus (pvz. „' + q.split(" ").slice(0, 2).join(" ") +
          ' 2008") — tada vertę pasakysime bet kokiam modeliui.</span>';
    } else if (rasta.tikslumas === "tikslus") {
      busena.innerHTML = '<span style="color:var(--gerai);">Kataloge yra: ' +
                         rasta.raktas + '</span>';
    } else {
      busena.innerHTML = '<span style="color:var(--zenklas);">Vertinsime pagal artimiausią: ' +
                         rasta.raktas + '</span>';
    }
  }

  if (typeof SKELBIMAS !== "undefined") SKELBIMAS.prijungti();

  if (typeof SUGADINIMAI !== "undefined") {
    SUGADINIMAI.prijungti();
    SUGADINIMAI.isPuslapio();
    SUGADINIMAI.piesti();
  }

  /* Kategorija nustatoma iš pavadinimo. Nuo jos priklauso, kokių detalių
     sąrašas rodomas ir kiek nuotraukų privaloma. */
  function atnaujintiKategorija() {
    if (typeof SUGADINIMAI === "undefined" || !prekesIvestis) return;
    SUGADINIMAI.nustatyti(prekesIvestis.value.trim());
    SUGADINIMAI.piesti();
  }

  if (prekesIvestis) {
    prekesIvestis.addEventListener("input", () => {
      atnaujintiKategorija();
      atnaujintiPrekesBusena();
      if (typeof DUOMENYS !== "undefined") DUOMENYS.atnaujintiTiksluma();
      perskaiciuotiGyvai();
    });
  }

  const kainosIvestis = document.getElementById("kaina");
  if (kainosIvestis) kainosIvestis.addEventListener("input", perskaiciuotiGyvai);

  /* Bet koks paspaudimas ar įrašas formoje gali pakeisti atsakymą, tad
     perskaičiuojam po viso ko. Pigu: skaičiavimas yra kelios daugybos. */
  forma.addEventListener("click", () => setTimeout(perskaiciuotiGyvai, 0));
  forma.addEventListener("input", () => setTimeout(perskaiciuotiGyvai, 0));
  document.addEventListener("nuotraukos-pakito", () => perskaiciuotiGyvai());

  if (typeof SKELBIMAS !== "undefined") SKELBIMAS.isSkelbimoPatikros();
  perskaiciuotiGyvai();

  /* --- Gyvas atsakymas ------------------------------------------------------
     Vertė rodoma iškart, dar nepaspaudus mygtuko, ir keičiasi po kiekvieno
     pažymėjimo. Taip matai, KAS ir KIEK pakeitė atsakymą — įklijavai skelbimą
     ir skaičius jau yra. Mygtukas lieka tam, kad atsakymą užfiksuotum ir
     gautum pilną ataskaitą.

     Skaičiuojama tyliai: nerastos prekės į užklausų sąrašą nerašomos, nes tai
     dar ne prašymas, o rašymas. */
  function metaiIsPavadinimo(t) {
    const dabar = new Date().getFullYear();
    const m = String(t || "").match(/\b(19[5-9]\d|20\d\d)\b/g);
    if (!m) return null;
    const tinka = m.map(Number).filter(x => x <= dabar);
    return tinka.length ? tinka[tinka.length - 1] : null;
  }

  function surinktiDuomenis(tyliai) {
    const pavadinimas = (document.getElementById("preke").value || "").trim();
    const kaina = parseFloat(document.getElementById("kaina").value);

    const bendros = (typeof DUOMENYS !== "undefined")
      ? DUOMENYS.pataisos() : { sarasas: [], suma: 0 };
    const kriterijai = (typeof SUGADINIMAI !== "undefined")
      ? SUGADINIMAI.kriterijuPataisos() : { sarasas: [], suma: 0 };

    const kat = (typeof SUGADINIMAI !== "undefined" && SUGADINIMAI.kategorija)
      ? SUGADINIMAI.kategorija.raktas : null;
    const ridosLaukas = document.getElementById("kr_rida");
    const amziausLaukas = document.getElementById("amzius");
    /* Metai: pirmiausia iš „Kiek metų daiktui", kitaip iš pavadinimo
       („Peugeot 307 2006"). Be šito kreivė neturi nuo ko skaičiuoti. */
    const metusPav = metaiIsPavadinimo(pavadinimas);
    const pozymiai = {
      metai: amziausLaukas && amziausLaukas.value
        ? new Date().getFullYear() - parseInt(amziausLaukas.value, 10) : metusPav,
      rida: ridosLaukas && ridosLaukas.value ? parseFloat(ridosLaukas.value) : null
    };

    return {
      pavadinimas, kaina, bukle: pasirinktaBukle, tyliai: !!tyliai,
      kategorija: kat, pozymiai: pozymiai,
      pataisos: {
        sarasas: bendros.sarasas.concat(kriterijai.sarasas),
        suma: bendros.suma + kriterijai.suma
      },
      sugadinimai: (typeof SUGADINIMAI !== "undefined") ? SUGADINIMAI.kaina() : null,
      lauzoVerte: (typeof SUGADINIMAI !== "undefined") ? SUGADINIMAI.lauzoVerte() : null
    };
  }

  function perskaiciuotiGyvai() {
    /* Elementą imam čia, o ne per `const` viršuje: funkcija kviečiama ir iš
       anksčiau faile esančių klausytojų, o `const` iki savo eilutės dar
       neegzistuoja ir metimas nutrauktų visą failą. */
    const gyvas = document.getElementById("gyvasRezultatas");
    if (!gyvas) return;
    const d = surinktiDuomenis(true);

    if (!d.pavadinimas || isNaN(d.kaina) || d.kaina <= 0) {
      gyvas.innerHTML =
        '<div class="gyvas gyvas-tuscias">' +
        '<span class="etikete">Preliminari vertė</span>' +
        '<span class="gyvas-vieta">— &euro;</span>' +
        '<span class="smulkus">Įrašyk daiktą ir kainą — vertė atsiras čia ir keisis pildant.</span></div>';
      return;
    }

    const r = PATIKRA.skaiciuoti(d);
    if (r.busena === "nerasta") {
      /* Ne tyla. Jei daikto kataloge nėra, tai matoma iškart, o ne po mygtuko —
         kitaip žmogus pildo visą formą veltui. */
      gyvas.innerHTML =
        '<div class="gyvas" style="border-left-color:var(--silpnas);background:var(--pavirsius-3);">' +
        '<span class="etikete">' + (r.truksta === "kategorijos" ? "Kataloge nėra" : "Trūksta vieno dalyko") + "</span>" +
        '<span class="gyvas-vieta">— &euro;</span>' +
        '<span class="smulkus" style="line-height:1.5;">' + (r.truksta === "kategorijos"
          ? "Šios prekės vertės dar nežinome. Jei tai automobilis, elektronika, buitinė technika " +
            'ar dviratis — rinkis <a href="paslauga.html">tą skiltį</a>.'
          : "Nurodyk pagaminimo metus — pavadinime (pvz. „Opel Astra 2008\") arba laukelyje „Kiek metų daiktui\".") +
        "</span></div>";
      return;
    }

    const rezis = r.verteNuo !== r.verteIki;
    const verte = rezis ? r.verteNuo + "&ndash;" + r.verteIki + " &euro;" : r.verteNuo + " &euro;";
    const spalva = { "per-brangu": "--pavojus", "gera-kaina": "--gerai",
                     "rinkos-kaina": "--zenklas" }[r.verdiktas];

    const zodis = { "per-brangu": "Per brangu", "gera-kaina": "Gera kaina",
                    "rinkos-kaina": "Rinkos kaina" }[r.verdiktas] || "";
    gyvas.innerHTML =
      '<div class="gyvas ' + r.verdiktas + '">' +
      '  <div class="gyvas-eile"><span class="etikete">Preliminari vertė</span>' +
      '    <span class="gyvas-verdiktas" style="color:var(' + spalva + ');">' + zodis + "</span></div>" +
      '  <span class="skaicius gyvas-verte" style="color:var(' + spalva + ');">' + verte + "</span>" +
      '  <div class="gyvas-eile gyvas-antrine">' +
      '    <span class="smulkus">Pardavėjas prašo</span>' +
      '    <span class="smulkus"><b>' + r.kaina + " &euro;</b></span>" +
      "  </div>" +
      '  <span class="smulkus gyvas-paaiskinimas">Skaičius keičiasi, kai pažymi daugiau. ' +
      "Mygtukas apačioje duos pilną atsakymą.</span>" +
      "</div>";
  }

  const klaida = document.getElementById("formosKlaida");
  function rodytiKlaida(tekstas, html) {
    if (!klaida) { alert(tekstas); return; }
    if (html) klaida.innerHTML = html; else klaida.textContent = tekstas;
    klaida.style.display = "block";
    /* Forma ilga. Jei žinutė lieka už ekrano ribų, žmogui atrodo, kad
       mygtukas tiesiog nieko nepadarė — todėl ją visada parodome. */
    try { klaida.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {}
  }

  const mygtukas = forma.querySelector('button[type="submit"]');

  forma.addEventListener("submit", async e => {
    e.preventDefault();
    if (klaida) klaida.style.display = "none";

    const pavadinimas = (document.getElementById("preke").value || "").trim();
    const kaina = parseFloat(document.getElementById("kaina").value);

    if (!pavadinimas) return rodytiKlaida("Įrašykite, ką tikriname.");
    if (isNaN(kaina) || kaina <= 0) return rodytiKlaida("Įrašykite prašomą kainą skaičiumi.");

    /* Nuotraukų reikalavimas. Automobilio iš dviejų kadrų įvertinti neįmanoma,
       tad geriau pasakyti tai iš karto nei duoti skaičių, kuriuo negalima remtis. */
    if (typeof SUGADINIMAI !== "undefined") {
      SUGADINIMAI.nustatyti(pavadinimas);
      const truksta = SUGADINIMAI.fotoTrukumas();
      if (truksta > 0) {
        const cfg = SUGADINIMAI.kategorija.cfg;
        return rodytiKlaida("",
          "<b>Trūksta nuotraukų:</b> dar " + truksta + " iš reikalingų " +
          SUGADINIMAI.reikiaNuotrauku() + ".<br>" +
          "Ko reikia: " + (cfg.kampai || []).join(", ") + ".<br><br>" +
          '<span class="smulkus">Jei daugiau nuotraukų neturi, paspausk ' +
          "„Neturiu daugiau nuotraukų" + "\u201c prie nuotraukų skilties — " +
          "įvertinsime, bet atsakymas bus mažiau pagrįstas.</span>");
      }
    }

    /* Būklė: pirma bandome nustatyti iš nuotraukų per vietinį agentą.
       Neatsakė arba nepaleistas — lieka tai, ką nurodė žmogus. */
    let bukle = pasirinktaBukle;
    let bukleIsNuotrauku = false;

    const turiNuotrauku = typeof NUOTRAUKOS !== "undefined" && NUOTRAUKOS.sarasas.length > 0;
    if (turiNuotrauku && PATIKRA.agentasGalimas()) {
      const senasTekstas = mygtukas ? mygtukas.textContent : null;
      if (mygtukas) { mygtukas.disabled = true; mygtukas.textContent = "Vertinama nuotrauka..."; }

      const b64 = await NUOTRAUKOS.paruostiAgentui();
      const aprasymas = [
        (typeof DUOMENYS !== "undefined") ? DUOMENYS.aprasymas() : "",
        (typeof SUGADINIMAI !== "undefined") ? SUGADINIMAI.aprasymas() : ""
      ].filter(Boolean).join("; ");
      const kat = (typeof SUGADINIMAI !== "undefined" && SUGADINIMAI.kategorija)
        ? SUGADINIMAI.kategorija.raktas : null;
      const atsakymas = await PATIKRA.klaustiAgento(pavadinimas, aprasymas, b64, kat);

      if (mygtukas) { mygtukas.disabled = false; mygtukas.textContent = senasTekstas; }

      if (atsakymas && atsakymas.bukle && BUKLES.some(x => x.raktas === atsakymas.bukle)) {
        bukle = atsakymas.bukle;
        bukleIsNuotrauku = true;
      }
    }

    const r = PATIKRA.skaiciuoti(Object.assign(surinktiDuomenis(false), { bukle }));
    const nuorodaLaukas = document.getElementById("nuoroda");
    r.nuoroda = nuorodaLaukas ? nuorodaLaukas.value.trim() : "";

    r.pozymiai = surinktiDuomenis(true).pozymiai;
    if (typeof SUGADINIMAI !== "undefined" && SUGADINIMAI.kategorija) {
      r.kategorija = SUGADINIMAI.kategorija.cfg.pav;
      r.kategorijosRaktas = SUGADINIMAI.kategorija.raktas;
      r.nuotraukuPakako = SUGADINIMAI.fotoTrukumas() === 0 && !SUGADINIMAI.praleistiFoto;
    }
    r.bukleIsNuotrauku = bukleIsNuotrauku;
    r.nurodytaBukle = pasirinktaBukle;
    /* Atskiras vardas: r.tikslumas jau reiškia katalogo atitikimo tikslumą. */
    if (typeof DUOMENYS !== "undefined") r.duomenuTikslumas = DUOMENYS.tikslumas();

    /* Nuotraukų suvestinė keliauja į rezultatą — pasako, kiek pagrįstas atsakymas. */
    if (typeof NUOTRAUKOS !== "undefined") {
      r.nuotraukos = NUOTRAUKOS.suvestine();
    }

    if (r.busena === "nerasta") {
      /* Ne aklavietė: pasakome tiksliai, ko trūksta ir kaip tai pataisyti. */
      if (r.truksta === "kategorijos") {
        return rodytiKlaida("",
          "<b>Šios prekės kataloge dar nėra.</b> Vertės pasakyti negalime — jei tai automobilis, " +
          'elektronika, buitinė technika ar dviratis, rinkis <a href="paslauga.html">tą skiltį</a>.');
      }
      return rodytiKlaida("",
        "<b>Trūksta pagaminimo metų.</b> Be jų vertės pasakyti negalime — " +
        "įrašyk juos pavadinime (pvz. „" + pavadinimas.split(" ").slice(0, 2).join(" ") +
        " 2008\") arba laukelyje „Kiek metų daiktui\".");
    }

    PATIKRA.issaugoti(r);
    if (typeof ISTORIJA !== "undefined") ISTORIJA.prideti(r);
    window.location.href = "rezultatas.html";
  });
})();




/* Šoninė juosta patikros puslapiuose. Viena vieta visiems — kitaip keturi
   puslapiai išsiskirtų per savaitę. */
(function patikrosSonas() {
  /* Šone lieka tik tai, kas padeda pildant: gyva vertė, tikslumas ir viena
     trumpa kortelė. Reklama čia netrukdo — ji ne formos vietoje. */
  const deze = document.getElementById("sonoInfo");
  if (!deze) return;
  const v = (t) => '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg><span>' + t + "</span></li>";

  deze.innerHTML =
    '<div class="kortele sono-kortele stulpelis tarpas-12">' +
    '  <div class="etikete">Nemokamai gauni</div>' +
    '  <ul class="varneles">' +
    v("Verdiktą: per brangu, rinkos kaina ar gera kaina") +
    v("Rinkos vertę eurais, su intervalu") +
    v("Sugadintų detalių sutvarkymo kainą") +
    "  </ul></div>" +
    '<div class="sono-pastaba">' +
    '  <b>Parduodi, o ne perki?</b>' +
    '  <span class="smulkus">Tas pats vertinimas tinka ir pardavėjui — žinosi, kokią kainą rašyti.</span>' +
    '  <a href="sertifikatas.html">Pažyma pardavėjams &rarr;</a></div>';
})();




/* Mano patikros — asmeninės srities sąrašas. */
(function manoPatikros() {
  const deze = document.getElementById("patikruSarasas");
  if (!deze) return;

  function piesti() {
    const visi = ISTORIJA.visi();

    if (!visi.length) {
      deze.innerHTML =
        '<div class="kortele stulpelis tarpas-14" style="padding:34px;text-align:center;">' +
        '<b style="font-size:19px;font-family:var(--serif);">Kol kas tuščia</b>' +
        '<span class="tekstas">Patikrink skelbimą arba įvertink daiktą — čia atsiras ' +
        "visi atsakymai.</span>" +
        '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:8px;">' +
        '<a class="mygtukas m-pagrindinis" href="skelbimas.html">Patikrinti skelbimą</a>' +
        '<a class="mygtukas m-kontūras" href="paslauga.html">Pilnas vertinimas</a></div></div>';
      return;
    }

    const eil = visi.map(x => {
      const sk = ISTORIJA.skirtumas(x);
      const spalva = sk >= 0 ? "--gerai" : "--pavojus";
      const verte = x.verteNuo === x.verteIki
        ? x.verteNuo + " &euro;" : x.verteNuo + "&ndash;" + x.verteIki + " &euro;";
      const data = (x.kada || "").slice(0, 10);
      return '<div class="patikros-eilute">' +
        '<div class="stulpelis" style="gap:4px;min-width:0;">' +
        "<b>" + x.pavadinimas + "</b>" +
        '<span class="smulkus">' + data +
        (x.kategorija ? " &middot; " + x.kategorija : "") +
        (x.isSkelbimo ? " &middot; iš skelbimo" : " &middot; su apžiūra") + "</span>" +
        (x.nuoroda ? '<a href="' + x.nuoroda + '" target="_blank" rel="noopener noreferrer nofollow" ' +
          'class="smulkus">Skelbimas &rarr;</a>' : "") +
        "</div>" +
        '<div class="stulpelis" style="gap:2px;text-align:right;">' +
        '<span class="smulkus">Prašoma</span>' +
        '<b class="skaicius" style="font-size:18px;">' + x.kaina + " &euro;</b></div>" +
        '<div class="stulpelis" style="gap:2px;text-align:right;">' +
        '<span class="smulkus">Vertė</span>' +
        '<b class="skaicius" style="font-size:18px;">' + verte + "</b></div>" +
        '<div class="stulpelis" style="gap:2px;text-align:right;">' +
        '<span class="smulkus">Skirtumas</span>' +
        '<b class="skaicius" style="font-size:19px;color:var(' + spalva + ');">' +
        (sk >= 0 ? "+" : "") + sk + " &euro;</b></div>" +
        '<button type="button" class="miniatiura-x" style="position:static;" ' +
        'data-imesti="' + x.id.replace(/"/g, "&quot;") + '" title="Išmesti">&times;</button>' +
        "</div>";
    }).join("");

    deze.innerHTML =
      '<div class="kortele" style="padding:0;overflow:hidden;">' + eil + "</div>" +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:18px;">' +
      '<a class="mygtukas m-pagrindinis" href="palyginimas.html">Palyginti tarpusavyje</a>' +
      '<button type="button" class="mygtukas m-kontūras" id="valytiVisus">Išvalyti sąrašą</button>' +
      "</div>";

    deze.querySelectorAll("[data-imesti]").forEach(m => {
      m.addEventListener("click", e => {
        e.preventDefault();
        ISTORIJA.imesti(m.dataset.imesti);
        piesti();
      });
    });
    const v = document.getElementById("valytiVisus");
    if (v) v.addEventListener("click", e => { e.preventDefault(); ISTORIJA.isvalyti(); piesti(); });
  }

  piesti();
})();


/* ==========================================================================
   REZULTATO PIESIMAS — rezultatas.html
   ========================================================================== */

(function rezultatoPuslapis() {
  const blokas = document.getElementById("verdiktoBlokas");
  if (!blokas) return;

  const r = PATIKRA.paimti();
  const zenklelis = document.getElementById("pavyzdinisZenklelis");

  if (!r || r.busena !== "ok") {
    /* Atėjo tiesiai į puslapį, be patikros. Jokio pavyzdžio su išgalvotais
       skaičiais — tik aiškus kelias, nuo ko pradėti. */
    const tur = document.getElementById("rezultatoTurinys");
    const tus = document.getElementById("rezultatoTuscias");
    if (tur) tur.hidden = true;
    if (tus) tus.hidden = false;
    return;
  }

  const didziaja = (t) => t ? t.charAt(0).toLocaleUpperCase("lt") + t.slice(1) : t;
  r.pavadinimas = didziaja(String(r.pavadinimas || "").trim());
  document.title = r.pavadinimas + " — rezultatas — Tikra vertė";

  /* Verdikto plokštė */
  blokas.className = "verdiktas " + r.verdiktas;
  document.getElementById("verdiktoZyme").textContent = PATIKRA.zyme(r);
  document.getElementById("verdiktoAntraste").innerHTML = PATIKRA.antraste(r);
  const paaisk = document.getElementById("verdiktoPaaiskinimas");
  paaisk.innerHTML = "<b>" + r.pavadinimas.replace(/</g, "&lt;") + "</b>" +
    (r.kategorija ? " &middot; " + r.kategorija : "") +
    "<br>Vertinta nepriklausomai nuo pardavėjo prašomos kainos.";
  if (r.nuoroda) {
    /* Nuoroda išsaugoma, kad po savaitės matytum, kurį skelbimą tikrinai.
       rel=noopener — svetimas puslapis neturi gauti jokios prieigos atgal. */
    const a = document.createElement("a");
    a.href = r.nuoroda;
    a.target = "_blank";
    a.rel = "noopener noreferrer nofollow";
    a.textContent = "Tikrintas skelbimas";
    a.style.cssText = "font-size:14.5px;display:inline-block;margin-top:10px;";
    paaisk.insertAdjacentElement("afterend", a);
  }

  /* Skaičiai. Kai yra sugadinimų, vertė yra RĖŽIS, o ne vienas skaičius —
     nes remonto kaina priklauso nuo serviso, ir vienas skaičius tai nuslėptų. */
  const rezis = (r.verteNuo !== undefined && r.verteIki !== undefined &&
                 r.verteNuo !== r.verteIki);
  document.getElementById("rodPrasoma").innerHTML = r.kaina + " &euro;";
  document.getElementById("rodVerte").innerHTML = rezis
    ? '<span style="font-size:0.78em;">' + r.verteNuo + "&ndash;" + r.verteIki + " &euro;</span>"
    : ((r.verteNuo !== undefined ? r.verteNuo : r.verte) + " &euro;");
  document.getElementById("rodBukle").textContent = r.bukle.pav;

  /* Sugadintų detalių ataskaita */
  const sugDeze = document.getElementById("sugadinimuAtaskaita");
  if (sugDeze && r.sugadinimai && r.sugadinimai.length) {
    const eil = r.sugadinimai.map(e => {
      const kaina = e.lauzas ? "nebetaisoma"
        : (e.procentas ? "mažina vertę" : e.nuo + "&ndash;" + e.iki + " &euro;");
      return '<div style="display:flex;align-items:baseline;justify-content:space-between;' +
             'gap:16px;padding:11px 0;border-bottom:1px solid var(--linija-2);">' +
             '<span style="font-size:15.5px;"><b>' + e.detale + "</b> &middot; " +
             e.taisymas + "</span>" +
             '<span class="skaicius" style="font-size:17px;white-space:nowrap;">' +
             kaina + "</span></div>";
    }).join("");

    const pabaiga = r.lauzoBusena
      ? '<div class="patarimas" style="margin-top:16px;">' +
        "<b>Vertinta kaip nebetaisoma</b>" +
        "<span>Rinkos kaina čia nebetaikoma. Likutinė vertė <b>" +
        r.lauzoVerte.nuo + "&ndash;" + r.lauzoVerte.iki + " &euro;</b>" +
        (r.lauzoVerte.paaiskinimas ? " — " + r.lauzoVerte.paaiskinimas : "") + ".</span></div>"
      : '<div style="display:flex;align-items:baseline;justify-content:space-between;' +
        'gap:16px;padding:14px 0 0;">' +
        '<span class="etikete">Sutvarkymas apytiksliai</span>' +
        '<span class="skaicius" style="font-size:22px;color:var(--pavojus);">' +
        r.remontoNuo + "&ndash;" + r.remontoIki + " &euro;</span></div>" +
        '<div class="patarimas" style="margin-top:14px;">' +
        "<b>Kainos apytikslės</b>" +
        "<span>Servisų įkainiai skiriasi kelis kartus — vieno meistro darbas " +
        "kainuos pigiau nei kito. Šis rėžis rodo tvarką, ne sąmatą. Tikslią " +
        "kainą pasako tik konkretus servisas apžiūrėjęs daiktą.</span></div>";

    sugDeze.innerHTML =
      '<div class="kortele stulpelis" style="padding:26px 28px;">' +
      '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;">' +
      '<span class="etikete">Rasti sugadinimai</span>' +
      '<span class="smulkus">' + (r.kategorija || "") + "</span></div>" +
      '<div style="margin-top:14px;">' + eil + "</div>" + pabaiga + "</div>";
  } else if (sugDeze) {
    sugDeze.innerHTML = "";
  }

  /* Kuo remiamės.

     Čia sąmoningai NĖRA skaičiavimo grandinės: nei bazinės vertės, nei būklės
     koeficiento, nei atskirų procentų. Tas skaičiavimas yra pats produktas —
     išdėliotas ekrane jis atiduodamas nemokamai ir be jokios naudos žmogui,
     kuriam svarbu atsakymas, o ne formulė.

     Kas lieka: iš kur duomenys, kas buvo įskaityta ir kiek tuo galima remtis.
     Tai viskas, ko reikia pasitikėjimui — ir nė vienas iš tų sakinių nėra
     tuščias tvirtinimas. */
  const pagrindas = document.getElementById("kuoRemiames");
  if (pagrindas) {
    const eilutes = [];

    if (r.saltinis === "katalogas" && r.n) {
      eilutes.push("Vertinta pagal <b>" + r.n + "</b> panaši" +
        (r.n % 10 === 1 && r.n !== 11 ? "o skelbimo" : "ų skelbimų") + " kainas" +
        (r.atnaujinta ? ", atnaujinta " + r.atnaujinta : "") +
        ". Kraštutinės kainos atmestos, imta rinkos vidurio reikšmė.");
    } else if (r.saltinis === "panasus") {
      eilutes.push("Tikslaus įrašo apie šį daiktą neturime, tad vertinta pagal <b>" +
        r.panasiuN + "</b> panašius stebėtus skelbimus — tos pačios klasės, artimų " +
        "metų ir ridos.");
    } else if (r.saltinis === "kreive") {
      eilutes.push("Tikslių šio modelio kainų dar nesukaupėme, tad vertinta pagal " +
        "tos pačios klasės daiktus" + (r.klasesPav ? " (<b>" + r.klasesPav + "</b>)" : "") +
        ". Įvertis realus, bet rėžis platesnis.");
    } else {
      eilutes.push("Vertinta pagal katalogo duomenis apie šį daiktą.");
    }

    if (r.pasitikejimas && r.pasitikejimas !== "aukstas") {
      eilutes.push(r.pasitikejimas === "zemas"
        ? "Pagrįstumas <b>žemas</b>: atsakymas rodo tvarką, ne tikslų skaičių. " +
          "Kuo daugiau tokių daiktų bus patikrinta, tuo siauresnis taps rėžis."
        : (r.saltinis === "panasus"
            ? "Pagrįstumas <b>vidutinis</b>: remtasi panašiais, o ne tais pačiais daiktais."
            : "Pagrįstumas <b>vidutinis</b>: šio modelio kainų surinkta dar nedaug."));
    }

    eilutes.push(r.bukleIsNuotrauku
      ? "Būklė <b>" + r.bukle.pav.toLowerCase() + "</b> nustatyta iš nuotraukų, ne iš pardavėjo aprašymo."
      : "Būklė <b>" + r.bukle.pav.toLowerCase() + "</b> — kaip nurodyta.");

    /* Kas įskaityta. Vardai be svorių: žmogus mato, kad jo duomenys tikrai
       dalyvavo, bet negauna svetimo darbo recepto. */
    if (r.pataisos && r.pataisos.length) {
      eilutes.push("Papildomai įskaityta: " +
        r.pataisos.map(p => p.pav).join(", ") + "." +
        (r.pataisosApribotos
          ? " Dalis nurodymų persidengia, tad bendras poveikis apribotas."
          : ""));
    }

    if (r.turiSugadinimu) {
      eilutes.push(r.lauzoBusena
        ? "Pažymėtas gedimas, po kurio taisyti neapsimoka — todėl vertinama ne rinkos kaina, o likutinė vertė."
        : "Nuo vertės atimta sugadintų detalių sutvarkymo kaina — ji surašyta aukščiau.");
    }

    if (r.tikslumas === "apytikslis") {
      eilutes.push("Tikslaus įrašo kataloge nebuvo — vertinta pagal artimiausią: <b>" +
        r.katalogoIrasas + "</b>.");
    }

    if (r.nuotraukos) {
      const pas = { aukstas: "aukštas", vidutinis: "vidutinis", zemas: "žemas" }[r.nuotraukos.pasitikejimas];
      eilutes.push(r.bukleIsNuotrauku
        ? "Nuotraukų pagrįstumas — <b>" + pas + "</b>."
        : "Nuotraukų pagrįstumas — <b>" + pas + "</b>. " + r.nuotraukos.tekstas);
    }

    eilutes.push("Pardavėjo prašoma kaina į skaičiavimą neįtraukta — ji palyginta tik pabaigoje. " +
      "Skelbimų kainos beveik visada pripūstos, tad įtraukta ji pati save patvirtintų.");

    const varnele = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A5A2E" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 12.5l5 5L20 6.5"/></svg>';
    pagrindas.innerHTML = eilutes.map(t =>
      '<li>' + varnele + '<span style="font-size:15.5px;line-height:1.5;">' + t + '</span></li>').join("");
  }

  /* Sąžiningas įspėjimas, jei rėmėmės laikina reikšme */
  if (zenklelis && r.saltinis === "kreive") {
    zenklelis.style.display = "flex";
    zenklelis.innerHTML = "<b>Apytikslis įvertis</b><span>Tikslių šio modelio duomenų dar " +
      "neturime — vertinta pagal panašius daiktus. Juo galima remtis derantis, " +
      "bet tai ne sandorio kaina.</span>";
  } else if (zenklelis && r.pavyzdine) {
    zenklelis.style.display = "flex";
    zenklelis.innerHTML = "<b>Preliminaru</b><span>Šios prekės bazinė vertė kataloge dar nepatikrinta " +
      "pagal realius skelbimus, tad skaičius apytikslis.</span>";
  }

  /* Vertės kreivė — tas pats vaizdas kaip skelbimo patikroje. */
  const metai = r.pozymiai && r.pozymiai.metai;
  if (typeof VERTES_KREIVE !== "undefined" && metai && r.kategorijosRaktas) {
    VERTES_KREIVE.piesti("vertesKreive", {
      pavadinimas: r.pavadinimas, kategorija: r.kategorijosRaktas, metai: metai,
      verteNuo: r.verteNuo, verteIki: r.verteIki, kaina: r.kaina, pozymiai: r.pozymiai
    });
  }

  /* Sertifikatas atsidaro būtent šiai patikrai. */
  const sert = document.getElementById("veiksmasSertifikatas");
  if (sert) sert.href = "sertifikatas.html?id=" + encodeURIComponent((r.pavadinimas || "") + "|" + r.kaina);

  /* Patikros data trupinių juostoje */
  const nr = document.querySelector(".trupiniai .wrap span[style*='margin-left']");
  if (nr) {
    const data = new Date(r.kada);
    nr.innerHTML = "Patikra &middot; " + data.toISOString().slice(0, 10);
  }
})();


/* Vertinimo pažyma. Sudaroma iš tavo patikrų istorijos — be serverio, todėl
   ji sąžiningai vadinama pažyma, o ne „patikrinamu sertifikatu": viešo
   tikrinimo nuorodos kol kas nėra ir mes to neapsimetame. */
(function sertifikatoPuslapis() {
  const doc = document.getElementById("sertifikatas");
  if (!doc) return;

  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g,
    c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const didziaja = (t) => t ? t.charAt(0).toLocaleUpperCase("lt") + t.slice(1) : t;
  const eur = (n) => Math.round(n).toLocaleString("lt-LT").replace(/ /g, " ") + " €";

  /* Trumpas numeris iš patikros duomenų: tas pats įrašas visada gauna tą patį. */
  function numeris(x) {
    let h = 2166136261;
    const t = (x.id || "") + "|" + (x.kada || "");
    for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); }
    const a = (h >>> 0).toString(36).toUpperCase().padStart(7, "0");
    return "TV-" + a.slice(0, 4) + "-" + a.slice(4, 7);
  }

  const visi = (typeof ISTORIJA !== "undefined") ? ISTORIJA.visi().filter(x => x && x.verteNuo) : [];
  const pas = $("sertPasirinkimas");
  const mygt = $("sertSpausdinti");

  if (!visi.length) {
    $("sertVandenzenklis").hidden = false;
    $("sertDaiktas").textContent = "Tavo daiktas";
    $("sertSavybes").textContent = "Čia bus metai, rida ir kategorija";
    $("sertNr").textContent = "TV-····-···";
    $("sertData").textContent = "išdavimo data";
    $("sertApacia").textContent = "Pavyzdys";
    $("sertSugadinimai").innerHTML = '<span class="smulkus">Sugadintos detalės, jei jų pažymėsi.</span>';
    if (pas) pas.closest("label").style.display = "none";
    if (mygt) { mygt.textContent = "Pirmiausia — patikra"; mygt.addEventListener("click", () => { location.href = "paslauga.html"; }); }
    const pastaba = $("sertPastaba");
    if (pastaba) pastaba.innerHTML = "<b>Pažyma daroma iš patikros</b><span>Įvertink savo daiktą " +
      '<a href="paslauga.html">pilname vertinime</a> arba <a href="skelbimas.html">patikrink savo skelbimą</a> — ' +
      "tada čia atsiras tikra pažyma su tavo duomenimis.</span>";
    return;
  }

  /* Kuri patikra: ?id=… (iš rezultato puslapio) arba naujausia. */
  const norimas = (new URLSearchParams(location.search).get("id") || "").toLowerCase();
  let pasirinktas = visi.find(x => (x.id || "").toLowerCase() === norimas) || visi[0];

  if (pas) {
    pas.innerHTML = visi.map((x, i) =>
      '<option value="' + i + '">' + esc(didziaja(x.pavadinimas)) + " — " +
      new Date(x.kada).toISOString().slice(0, 10) + "</option>").join("");
    pas.value = String(visi.indexOf(pasirinktas));
    pas.addEventListener("change", () => { pasirinktas = visi[+pas.value]; piesti(pasirinktas); });
  }
  if (mygt) mygt.addEventListener("click", () => window.print());

  function piesti(x) {
    const data = new Date(x.kada).toISOString().slice(0, 10);
    $("sertNr").textContent = numeris(x);
    $("sertData").textContent = "Išduota " + data;
    $("sertApacia").textContent = numeris(x) + " · " + data;
    $("sertDaiktas").textContent = didziaja(x.pavadinimas);

    const sav = [];
    if (x.kategorija) sav.push(x.kategorija);
    if (x.metai) sav.push(x.metai + " m.");
    if (x.rida) sav.push(Math.round(x.rida).toLocaleString("lt-LT").replace(/ /g, " ") + " km");
    $("sertSavybes").textContent = sav.join(" · ");

    $("sertVerte").textContent = x.verteNuo === x.verteIki
      ? eur(x.verteNuo) : eur(x.verteNuo).replace(" €", "") + "–" + eur(x.verteIki);
    $("sertBukle").textContent = x.bukle || "Nenurodyta";
    $("sertBukleKaip").textContent = x.bukle
      ? (x.bukleIsNuotrauku ? "Nustatyta iš nuotraukų" : "Nurodyta savininko")
      : (x.isSkelbimo ? "Vertinta pagal skelbimo aprašymą" : "");

    const sug = x.sugadinimai || [];
    $("sertSugadinimai").innerHTML = sug.length
      ? sug.map(e => '<div class="sert-eilute"><b>' + esc(e.detale) + "</b><span>" + esc(e.taisymas) + "</span></div>").join("") +
        (x.lauzoBusena ? '<div class="sert-eilute"><b>Vertinta kaip nebetaisoma</b><span>likutinė vertė</span></div>'
          : (x.remontoIki ? '<div class="sert-eilute"><span>Sutvarkymas apytiksliai</span><b>' +
             eur(x.remontoNuo).replace(" €", "") + "–" + eur(x.remontoIki) + "</b></div>" : ""))
      : '<span class="smulkus" style="font-size:16px;">Sugadinimų nepažymėta.</span>';

    document.title = "Pažyma " + numeris(x) + " — " + didziaja(x.pavadinimas);
  }

  piesti(pasirinktas);
})();


/* Paskutinė failo eilutė. Saugiklis pagal ją žino, ar svetaine.js perskaityta
   iki galo: jei kur nors viduryje įvyko klaida, šito nebus, ir saugiklis
   pasakys būtent tai — net tada, kai naršyklė klaidos teksto neatiduoda. */
try { window.TV_IKELTAS = true; } catch (e) {}
