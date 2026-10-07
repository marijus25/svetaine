/* ==========================================================================
   TIKRA VERTĖ — KAINŲ KATALOGAS
   KATALOGO-FORMATAS: 3

   Redaguojamas ranka. Nauja prekė — viena eilutė KATALOGAS sąraše.
   Nauja kategorija — įrašas DETALES ir KLASES bei patikra-<raktas>.html
   (nukopijuok patikra-kita.html ir pakeisk data-kategorija, data-pav).

   Sugeneruota: 2026-09-27 13:52 UTC
   Prekių: 6

   verte       — bazinė vertė eurais, IDEALIOS būklės
   n           — iš kiek skelbimų apskaičiuota
   atnaujinta  — kada skaičiuota
   pavyzdys    — true reiškia, kad reikšmė laikina ir nepatikrinta
   pardavimo   — true, jei vertė iš tikrų sandorių; kitaip ji laikoma
                 skelbimų (prašoma) kaina ir sumažinama pagal NUOLAIDOS
   ========================================================================== */

const KATALOGAS = {
  "3d spausdinta vaza": { verte: 15, kiti_vardai: ["3 d spausdinta vaza"], pavyzdys: false },
  "bmw 120 2 0 l hecbekas 2008 05": { verte: 4929, kiti_vardai: [], pavyzdys: false, n: 1, atnaujinta: "2026-09-27", kategorija: "automobilis", atskaita: {"metai": 2008, "rida": 265000} },
  "masina": { verte: 1500, kiti_vardai: ["automobilis"], pavyzdys: false, kategorija: "automobilis" },
  "opel astra 2008": { verte: 2000, kiti_vardai: ["astra 2008", "opel astra"], pavyzdys: false, kategorija: "automobilis" },
  "playstation 5": { verte: 579, kiti_vardai: ["ps5", "playstation5", "play station 5"], pavyzdys: false, n: 6, atnaujinta: "2026-09-27" },
  "vaza": { verte: 10, kiti_vardai: [], pavyzdys: false },
};

const BUKLES = [
  { raktas: "ideali", pav: "Ideali", koef: 1.00, apibudinimas: "Nauja arba neatidaryta, be jokių trūkumų" },
  { raktas: "naudota", pav: "Naudota", koef: 0.70, apibudinimas: "Normalus nusidėvėjimas, viskas veikia" },
  { raktas: "pazeista", pav: "Pažeista", koef: 0.35, apibudinimas: "Reikia remonto arba veikia iš dalies" },
  { raktas: "lauzas", pav: "Laužas", koef: 0.10, apibudinimas: "Nebepataisoma, vertingos tik dalys" }
];

/* Prašoma kaina nėra sandorio kaina: pardavėjas prašo daugiau, nei galiausiai
   gauna. Koeficientas = tikėtina pardavimo kaina / prašoma kaina. Tai
   pradinės prielaidos — kai svetainė surenka pakankamai tikrų pardavimo
   kainų (forma „Nupirkai ar pardavei?“), jas pakeičia apskaičiuotos. */
const NUOLAIDOS = {
  automobilis: 0.92,
  elektronika: 0.88,
  buitine_technika: 0.85,
  dviratis: 0.87,
  kita: 0.88
};

/* Sugadintos detalės pagal kategoriją. Šaltinis — detales.json.
   Kainos yra REŽIAI ir apytikslės: servisų įkainiai skiriasi. */
const DETALES = {
  "automobilis": {
    "pav": "Automobilis",
    "antraste": "Kiek iš tikrųjų vertas automobilis",
    "ivadas": "Rida, techninė, serviso istorija ir tai, kas sugadinta — kiekvienas dalykas keičia kainą. Įrašyk, ką matai, ir gauk vertę, kuri nepriklauso nuo pardavėjo.",
    "min_nuotrauku": 6,
    "be_bendru": [
      "komplektacija",
      "garantija"
    ],
    "kampai": [
      "priekis",
      "galas",
      "kairė pusė",
      "dešinė pusė",
      "salonas",
      "prietaisų skydelis su rida",
      "variklio skyrius",
      "dokumentai"
    ],
    "lauzo_verte": {
      "nuo": 200,
      "iki": 450,
      "paaiskinimas": "metalo laužo kaina pagal svorį"
    },
    "zodziai": [
      "automobilis",
      "masina",
      "auto",
      "opel",
      "audi",
      "bmw",
      "volkswagen",
      "vw",
      "toyota",
      "honda",
      "ford",
      "renault",
      "peugeot",
      "citroen",
      "skoda",
      "seat",
      "volvo",
      "mazda",
      "nissan",
      "hyundai",
      "kia",
      "mercedes",
      "fiat",
      "mitsubishi",
      "subaru",
      "lexus",
      "astra",
      "passat",
      "golf",
      "octavia"
    ],
    "kriterijai": [
      {
        "raktas": "rida",
        "pav": "Rida",
        "tipas": "skaicius",
        "vienetas": "km",
        "uzuomina": "pvz. 280000",
        "bazine": 150000,
        "zingsnis": 10000,
        "uz_zingsni": -0.012,
        "riba_zemyn": -0.25,
        "riba_aukstyn": 0.15,
        "paaiskinimas": "Nuo 150 000 km skaičiuojama į abi puses"
      },
      {
        "raktas": "ta",
        "pav": "Techninė apžiūra",
        "tipas": "pasirinkimas",
        "variantai": [
          {
            "raktas": "ilga",
            "pav": "Galioja ilgiau nei pusmetį",
            "poveikis": 0.04
          },
          {
            "raktas": "trumpa",
            "pav": "Galioja trumpiau nei pusmetį",
            "poveikis": 0.0
          },
          {
            "raktas": "nera",
            "pav": "Nebegalioja",
            "poveikis": -0.08
          }
        ]
      },
      {
        "raktas": "istorija",
        "pav": "Serviso istorija",
        "tipas": "pasirinkimas",
        "variantai": [
          {
            "raktas": "yra",
            "pav": "Yra dokumentai",
            "poveikis": 0.05
          },
          {
            "raktas": "daline",
            "pav": "Dalinė",
            "poveikis": 0.02
          },
          {
            "raktas": "nera",
            "pav": "Nėra",
            "poveikis": 0.0
          }
        ]
      },
      {
        "raktas": "darbai",
        "pav": "Neseniai atlikti darbai",
        "tipas": "keli",
        "variantai": [
          {
            "raktas": "sankaba",
            "pav": "Pakeista sankaba",
            "poveikis": 0.04
          },
          {
            "raktas": "grandine",
            "pav": "Pakeista grandinė ar dirželis",
            "poveikis": 0.04
          },
          {
            "raktas": "vaziuokle",
            "pav": "Suremontuota važiuoklė",
            "poveikis": 0.03
          },
          {
            "raktas": "padangos",
            "pav": "Naujos padangos",
            "poveikis": 0.02
          },
          {
            "raktas": "dpf",
            "pav": "Tvarkingas DPF ar katalizatorius",
            "poveikis": 0.03
          }
        ]
      }
    ],
    "detales": {
      "dureles": {
        "pav": "Durelės",
        "taisymai": [
          {
            "raktas": "lyginimas",
            "pav": "Lyginimas be dažymo",
            "nuo": 50,
            "iki": 150
          },
          {
            "raktas": "remontas",
            "pav": "Ištiesinimas ir dažymas",
            "nuo": 150,
            "iki": 350
          },
          {
            "raktas": "nauja",
            "pav": "Kitos durelės su dažymu",
            "nuo": 350,
            "iki": 900
          }
        ]
      },
      "bamperis": {
        "pav": "Bamperis",
        "taisymai": [
          {
            "raktas": "poliravimas",
            "pav": "Poliravimas, smulkūs įbrėžimai",
            "nuo": 30,
            "iki": 80
          },
          {
            "raktas": "dazymas",
            "pav": "Dažymas",
            "nuo": 120,
            "iki": 250
          },
          {
            "raktas": "nauja",
            "pav": "Naujas bamperis su dažymu",
            "nuo": 250,
            "iki": 700
          }
        ]
      },
      "sparnas": {
        "pav": "Sparnas",
        "taisymai": [
          {
            "raktas": "lyginimas",
            "pav": "Lyginimas be dažymo",
            "nuo": 50,
            "iki": 150
          },
          {
            "raktas": "remontas",
            "pav": "Ištiesinimas ir dažymas",
            "nuo": 140,
            "iki": 320
          },
          {
            "raktas": "nauja",
            "pav": "Kitas sparnas su dažymu",
            "nuo": 250,
            "iki": 650
          }
        ]
      },
      "kapotas": {
        "pav": "Kapotas",
        "taisymai": [
          {
            "raktas": "remontas",
            "pav": "Ištiesinimas ir dažymas",
            "nuo": 180,
            "iki": 400
          },
          {
            "raktas": "nauja",
            "pav": "Kitas kapotas su dažymu",
            "nuo": 350,
            "iki": 800
          }
        ]
      },
      "priekinis_stiklas": {
        "pav": "Priekinis stiklas",
        "taisymai": [
          {
            "raktas": "skelimas",
            "pav": "Skeltuko užpildymas",
            "nuo": 25,
            "iki": 60
          },
          {
            "raktas": "keitimas",
            "pav": "Keitimas su darbu",
            "nuo": 150,
            "iki": 450
          }
        ]
      },
      "zibintas": {
        "pav": "Žibintas",
        "taisymai": [
          {
            "raktas": "poliravimas",
            "pav": "Poliravimas",
            "nuo": 20,
            "iki": 50
          },
          {
            "raktas": "keitimas",
            "pav": "Keitimas",
            "nuo": 80,
            "iki": 500
          }
        ]
      },
      "variklis": {
        "pav": "Variklis",
        "taisymai": [
          {
            "raktas": "smulkus",
            "pav": "Smulkus remontas, tarpinės",
            "nuo": 300,
            "iki": 900
          },
          {
            "raktas": "kapitalinis",
            "pav": "Kapitalinis remontas",
            "nuo": 900,
            "iki": 2500
          },
          {
            "raktas": "keitimas",
            "pav": "Kito variklio įdėjimas",
            "nuo": 800,
            "iki": 3000
          },
          {
            "raktas": "nebetaisomas",
            "pav": "Nebetaisomas",
            "nuo": 0,
            "iki": 0,
            "lauzas": true
          }
        ]
      },
      "sankaba": {
        "pav": "Sankaba",
        "taisymai": [
          {
            "raktas": "keitimas",
            "pav": "Keitimas su dvimasiu smagračiu",
            "nuo": 600,
            "iki": 1200
          },
          {
            "raktas": "paprasta",
            "pav": "Keitimas be dvimasio smagračio",
            "nuo": 300,
            "iki": 700
          }
        ]
      },
      "deze": {
        "pav": "Pavarų dėžė",
        "taisymai": [
          {
            "raktas": "remontas",
            "pav": "Remontas",
            "nuo": 400,
            "iki": 1500
          },
          {
            "raktas": "keitimas",
            "pav": "Kitos dėžės įdėjimas",
            "nuo": 500,
            "iki": 1800
          }
        ]
      },
      "vaziuokle": {
        "pav": "Važiuoklė",
        "taisymai": [
          {
            "raktas": "smulkus",
            "pav": "Amortizatoriai, svirtys, guolis",
            "nuo": 150,
            "iki": 600
          },
          {
            "raktas": "didelis",
            "pav": "Didelis važiuoklės remontas",
            "nuo": 600,
            "iki": 1500
          }
        ]
      },
      "katalizatorius": {
        "pav": "Katalizatorius arba DPF",
        "taisymai": [
          {
            "raktas": "valymas",
            "pav": "Valymas",
            "nuo": 80,
            "iki": 250
          },
          {
            "raktas": "keitimas",
            "pav": "Keitimas",
            "nuo": 250,
            "iki": 1200
          }
        ]
      },
      "korozija": {
        "pav": "Rūdys ant kėbulo",
        "taisymai": [
          {
            "raktas": "vietinis",
            "pav": "Vietinis šalinimas ir dažymas",
            "nuo": 100,
            "iki": 400
          },
          {
            "raktas": "didelis",
            "pav": "Kelios vietos, suvirinimas",
            "nuo": 400,
            "iki": 1500
          }
        ]
      },
      "salonas": {
        "pav": "Salonas",
        "taisymai": [
          {
            "raktas": "valymas",
            "pav": "Cheminis valymas",
            "nuo": 60,
            "iki": 150
          },
          {
            "raktas": "remontas",
            "pav": "Sėdynių ar apdailos remontas",
            "nuo": 150,
            "iki": 600
          }
        ]
      }
    }
  },
  "elektronika": {
    "pav": "Elektronika",
    "antraste": "Telefono, konsolės ar kompiuterio vertė",
    "ivadas": "Ekranas, baterija, komplektacija ir modelio paklausa. Elektronika pinga greitai, tad metai čia sveria daugiau nei kur kitur.",
    "min_nuotrauku": 4,
    "kampai": [
      "bendras vaizdas",
      "įjungtas ekranas",
      "jungtys",
      "įbrėžimai ir defektai",
      "serijos numeris"
    ],
    "lauzo_verte": {
      "nuo": 0,
      "iki": 0,
      "paaiskinimas": "vertingos tik dalys"
    },
    "zodziai": [
      "telefonas",
      "iphone",
      "samsung",
      "xiaomi",
      "planset",
      "ipad",
      "nesiojamas",
      "laptop",
      "kompiuteris",
      "monitorius",
      "televizorius",
      "playstation",
      "xbox",
      "nintendo",
      "konsole",
      "ausines",
      "fotoaparatas",
      "dronas"
    ],
    "kriterijai": [
      {
        "raktas": "baterija",
        "pav": "Baterijos būklė",
        "tipas": "pasirinkimas",
        "variantai": [
          {
            "raktas": "gera",
            "pav": "Laiko kaip nauja",
            "poveikis": 0.04
          },
          {
            "raktas": "vidutine",
            "pav": "Pastebimai nusidėvėjusi",
            "poveikis": -0.05
          },
          {
            "raktas": "prasta",
            "pav": "Reikia keisti",
            "poveikis": -0.1
          },
          {
            "raktas": "nera",
            "pav": "Baterijos nėra",
            "poveikis": 0.0
          }
        ]
      },
      {
        "raktas": "paklausa",
        "pav": "Modelio paklausa",
        "tipas": "pasirinkimas",
        "variantai": [
          {
            "raktas": "ieskomas",
            "pav": "Paklausus modelis",
            "poveikis": 0.08
          },
          {
            "raktas": "iprastas",
            "pav": "Įprastas",
            "poveikis": 0.0
          },
          {
            "raktas": "senas",
            "pav": "Nebemadingas",
            "poveikis": -0.08
          }
        ]
      }
    ],
    "detales": {
      "ekranas": {
        "pav": "Ekranas",
        "taisymai": [
          {
            "raktas": "ibrezimai",
            "pav": "Įbrėžimai, bet veikia",
            "nuo": 0,
            "iki": 0,
            "procentas": -0.08
          },
          {
            "raktas": "keitimas",
            "pav": "Skilęs — reikia keisti",
            "nuo": 60,
            "iki": 350
          }
        ]
      },
      "baterija": {
        "pav": "Baterija",
        "taisymai": [
          {
            "raktas": "keitimas",
            "pav": "Keitimas",
            "nuo": 30,
            "iki": 120
          }
        ]
      },
      "jungtis": {
        "pav": "Krovimo jungtis",
        "taisymai": [
          {
            "raktas": "keitimas",
            "pav": "Keitimas",
            "nuo": 25,
            "iki": 90
          }
        ]
      },
      "korpusas": {
        "pav": "Korpusas",
        "taisymai": [
          {
            "raktas": "ibrezimai",
            "pav": "Įbrėžimai, įlenkimai",
            "nuo": 0,
            "iki": 0,
            "procentas": -0.06
          },
          {
            "raktas": "keitimas",
            "pav": "Keitimas",
            "nuo": 40,
            "iki": 150
          }
        ]
      },
      "neveikia": {
        "pav": "Neįsijungia",
        "taisymai": [
          {
            "raktas": "diagnostika",
            "pav": "Remontas su diagnostika",
            "nuo": 50,
            "iki": 250
          },
          {
            "raktas": "nebetaisomas",
            "pav": "Nebetaisomas",
            "nuo": 0,
            "iki": 0,
            "lauzas": true
          }
        ]
      }
    }
  },
  "buitine_technika": {
    "pav": "Buitinė technika",
    "antraste": "Buitinės technikos vertė",
    "ivadas": "Skalbyklė, šaldytuvas, indaplovė. Svarbiausia — ar viskas veikia ir kiek kainuotų sutvarkyti tai, kas neveikia.",
    "min_nuotrauku": 3,
    "kampai": [
      "bendras vaizdas",
      "veikimas",
      "lipdukas su modeliu"
    ],
    "lauzo_verte": {
      "nuo": 10,
      "iki": 40,
      "paaiskinimas": "metalo laužo kaina"
    },
    "zodziai": [
      "skalbimo",
      "skalbykle",
      "indaplove",
      "saldytuvas",
      "viryle",
      "orkaite",
      "dziovykle",
      "garu"
    ],
    "kriterijai": [
      {
        "raktas": "istorija",
        "pav": "Ar veikia be priekaištų",
        "tipas": "pasirinkimas",
        "variantai": [
          {
            "raktas": "veikia",
            "pav": "Veikia visos programos",
            "poveikis": 0.04
          },
          {
            "raktas": "dalinai",
            "pav": "Veikia iš dalies",
            "poveikis": -0.12
          },
          {
            "raktas": "neveikia",
            "pav": "Neveikia",
            "poveikis": -0.3
          }
        ]
      }
    ],
    "detales": {
      "guolis": {
        "pav": "Guolis arba būgnas",
        "taisymai": [
          {
            "raktas": "keitimas",
            "pav": "Keitimas su darbu",
            "nuo": 80,
            "iki": 250
          }
        ]
      },
      "tenas": {
        "pav": "Kaitinimo elementas arba kompresorius",
        "taisymai": [
          {
            "raktas": "keitimas",
            "pav": "Keitimas",
            "nuo": 50,
            "iki": 300
          }
        ]
      },
      "elektronika": {
        "pav": "Valdymo plokštė",
        "taisymai": [
          {
            "raktas": "remontas",
            "pav": "Remontas",
            "nuo": 60,
            "iki": 200
          },
          {
            "raktas": "keitimas",
            "pav": "Keitimas",
            "nuo": 120,
            "iki": 400
          }
        ]
      },
      "korpusas": {
        "pav": "Korpusas, rūdys",
        "taisymai": [
          {
            "raktas": "kosmetinis",
            "pav": "Kosmetinis defektas",
            "nuo": 0,
            "iki": 0,
            "procentas": -0.1
          }
        ]
      },
      "neveikia": {
        "pav": "Neveikia",
        "taisymai": [
          {
            "raktas": "diagnostika",
            "pav": "Remontas su diagnostika",
            "nuo": 50,
            "iki": 250
          },
          {
            "raktas": "nebetaisomas",
            "pav": "Nebetaisoma",
            "nuo": 0,
            "iki": 0,
            "lauzas": true
          }
        ]
      }
    }
  },
  "dviratis": {
    "pav": "Dviratis arba paspirtukas",
    "antraste": "Dviračio ar paspirtuko vertė",
    "ivadas": "Rėmas, pavaros, stabdžiai, baterija. Nedidelė suma, bet permokėti lengva — dalys kainuoja daugiau, nei atrodo.",
    "min_nuotrauku": 4,
    "kampai": [
      "bendras vaizdas",
      "pavaros",
      "stabdžiai",
      "rėmas iš arti"
    ],
    "lauzo_verte": {
      "nuo": 5,
      "iki": 30,
      "paaiskinimas": "metalo laužo kaina"
    },
    "zodziai": [
      "dviratis",
      "velosipedas",
      "paspirtukas",
      "scooter",
      "mtb"
    ],
    "kriterijai": [
      {
        "raktas": "nuvaziuota",
        "pav": "Kiek nuvažiuota",
        "tipas": "skaicius",
        "vienetas": "km",
        "uzuomina": "pvz. 3000",
        "bazine": 2000,
        "zingsnis": 1000,
        "uz_zingsni": -0.01,
        "riba_zemyn": -0.2,
        "riba_aukstyn": 0.1,
        "paaiskinimas": "Nuo 2 000 km skaičiuojama į abi puses"
      }
    ],
    "detales": {
      "pavaros": {
        "pav": "Pavaros",
        "taisymai": [
          {
            "raktas": "derinimas",
            "pav": "Derinimas",
            "nuo": 15,
            "iki": 40
          },
          {
            "raktas": "keitimas",
            "pav": "Keitimas",
            "nuo": 50,
            "iki": 250
          }
        ]
      },
      "stabdziai": {
        "pav": "Stabdžiai",
        "taisymai": [
          {
            "raktas": "kaladeles",
            "pav": "Kaladėlės ir derinimas",
            "nuo": 15,
            "iki": 60
          },
          {
            "raktas": "keitimas",
            "pav": "Keitimas",
            "nuo": 60,
            "iki": 200
          }
        ]
      },
      "ratai": {
        "pav": "Ratai",
        "taisymai": [
          {
            "raktas": "centravimas",
            "pav": "Centravimas",
            "nuo": 15,
            "iki": 40
          },
          {
            "raktas": "keitimas",
            "pav": "Keitimas",
            "nuo": 50,
            "iki": 300
          }
        ]
      },
      "remas": {
        "pav": "Rėmas",
        "taisymai": [
          {
            "raktas": "ibrezimai",
            "pav": "Įbrėžimai",
            "nuo": 0,
            "iki": 0,
            "procentas": -0.08
          },
          {
            "raktas": "itrukes",
            "pav": "Įtrūkęs — nebetaisomas",
            "nuo": 0,
            "iki": 0,
            "lauzas": true
          }
        ]
      },
      "baterija": {
        "pav": "Baterija (elektriniam)",
        "taisymai": [
          {
            "raktas": "keitimas",
            "pav": "Keitimas",
            "nuo": 100,
            "iki": 400
          }
        ]
      }
    }
  }
};

/* Klasės ir nuvertėjimo kreivės. Iš jų gaunama vertė tada, kai tikslaus įrašo
   kataloge nėra — kad atsakymas būtų VISADA. Šaltinis — klases.json.
   Tai prielaidos, todėl rezultate rodomas žemas pasitikėjimas. */
const KLASES = {
  "automobilis": {
    "metinis": 0.87,
    "riba": 0.06,
    "rida_per_metus": 15000,
    "rida_zingsnis": 10000,
    "rida_uz_zingsni": -0.012,
    "rida_riba": [
      -0.3,
      0.15
    ],
    "klases": {
      "miesto": {
        "pav": "Miesto automobilis",
        "nauja": 16000
      },
      "kompaktinis": {
        "pav": "Kompaktinis",
        "nauja": 25000
      },
      "vidutinis": {
        "pav": "Vidutinės klasės",
        "nauja": 34000
      },
      "visureigis": {
        "pav": "Visureigis",
        "nauja": 42000
      },
      "komercinis": {
        "pav": "Komercinis",
        "nauja": 35000
      },
      "premium": {
        "pav": "Prestižinis",
        "nauja": 62000
      }
    },
    "numatyta_klase": "kompaktinis",
    "premium_markes": [
      "bmw",
      "mercedes",
      "audi",
      "lexus",
      "volvo",
      "porsche",
      "jaguar",
      "land rover",
      "tesla"
    ],
    "kebulai": {
      "hecbekas": "kompaktinis",
      "hatchback": "kompaktinis",
      "sedanas": "vidutinis",
      "universalas": "vidutinis",
      "visureigis": "visureigis",
      "suv": "visureigis",
      "krosoveris": "visureigis",
      "vienaturis": "vidutinis",
      "kupe": "premium",
      "kabrioletas": "premium",
      "mikroautobusas": "komercinis",
      "furgonas": "komercinis"
    }
  },
  "elektronika": {
    "metinis": 0.72,
    "riba": 0.08,
    "klases": {
      "telefonas": {
        "pav": "Telefonas",
        "nauja": 700
      },
      "planset": {
        "pav": "Planšetė",
        "nauja": 500
      },
      "nesiojamas": {
        "pav": "Nešiojamas",
        "nauja": 900
      },
      "konsole": {
        "pav": "Konsolė",
        "nauja": 500
      },
      "televizorius": {
        "pav": "Televizorius",
        "nauja": 600
      },
      "smulki": {
        "pav": "Smulki technika",
        "nauja": 250
      }
    },
    "numatyta_klase": "smulki",
    "zodziu_klases": {
      "telefonas": "telefonas",
      "iphone": "telefonas",
      "samsung galaxy": "telefonas",
      "xiaomi": "telefonas",
      "planset": "planset",
      "ipad": "planset",
      "nesiojamas": "nesiojamas",
      "laptop": "nesiojamas",
      "macbook": "nesiojamas",
      "playstation": "konsole",
      "xbox": "konsole",
      "nintendo": "konsole",
      "televizorius": "televizorius",
      "tv": "televizorius"
    }
  },
  "buitine_technika": {
    "metinis": 0.85,
    "riba": 0.05,
    "klases": {
      "stambi": {
        "pav": "Stambi technika",
        "nauja": 550
      },
      "smulki": {
        "pav": "Smulki technika",
        "nauja": 180
      }
    },
    "numatyta_klase": "stambi",
    "zodziu_klases": {
      "skalbimo": "stambi",
      "skalbykle": "stambi",
      "saldytuvas": "stambi",
      "indaplove": "stambi",
      "viryle": "stambi",
      "orkaite": "stambi"
    }
  },
  "dviratis": {
    "metinis": 0.82,
    "riba": 0.08,
    "klases": {
      "dviratis": {
        "pav": "Dviratis",
        "nauja": 600
      },
      "elektrinis": {
        "pav": "Elektrinis",
        "nauja": 1100
      }
    },
    "numatyta_klase": "dviratis",
    "zodziu_klases": {
      "paspirtukas": "elektrinis",
      "elektrinis": "elektrinis"
    }
  }
};

/* Stebėti skelbimai su požymiais. Iš jų dirba antroji vertinimo pakopa:
   tikslaus įrašo nėra, bet yra panašių. Sąrašas trumpinamas — naršyklei
   nereikia visos istorijos, užtenka naujausių. */
const STEBEJIMAI = [{"pavadinimas": "BMW 120, 2.0 l., hečbekas, 2008-05", "kaina": 3450.0, "metai": 2008, "rida": 265000, "kuras": "Dyzelinas Kėbulo tipas Hečbekas", "kategorija": "automobilis", "data": "2026-09-23"}];
