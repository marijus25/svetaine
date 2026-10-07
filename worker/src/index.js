/* ==========================================================================
   AIDAS — RINKOS KAINŲ WORKER (Cloudflare)
   Autorius: Marijus Tamulynas, 2026

   Du keliai:
     POST /kaina  — priima vieną kainą: prašomą (iš patikrinto skelbimo) arba
                    pardavimo (už kiek daiktas iš tikrųjų nupirktas/parduotas).
     GET  /rinka  — atiduoda išvalytas kainas ir kiekvienos kategorijos
                    nuolaidą (pardavimo kaina / prašoma kaina), kai jai
                    apskaičiuoti jau yra pakankamai porų.

   Pats vertinimas vyksta naršyklėje (svetaine.js). Čia tik duomenys ir jų
   švara: ribojimas, dublikatai ir kraštutinės kainos.
   ========================================================================== */

const KATEGORIJOS = new Set(["automobilis", "elektronika", "buitine_technika", "dviratis"]);
const BUKLES = new Set(["ideali", "naudota", "pazeista", "lauzas"]);

const RIBA_PER_DIENA = 30;      /* vienas siuntėjas per parą */
const MIN_NUOLAIDAI = 8;        /* tiek porų reikia, kad nuolaida pakeistų prielaidą */
const SAUGOMA_DIENU = 540;      /* senesnės kainos nebeatiduodamos */
const ATIDUODAMA_DAUGIAUSIA = 3000;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const kilme = req.headers.get("Origin");
    const cors = corsAntrastes(kilme, env);

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    try {
      if (url.pathname === "/rinka" && req.method === "GET") return await rinka(url, env, cors);
      if (url.pathname === "/kaina" && req.method === "POST") {
        if (!leidziama(kilme, env)) return json({ klaida: "neleidžiama" }, 403, cors);
        return await priimtiKaina(req, env, cors);
      }
      if (url.pathname === "/") return json({ veikia: true }, 200, cors);
      return json({ klaida: "nerasta" }, 404, cors);
    } catch (e) {
      console.error(e);
      return json({ klaida: "serverio klaida" }, 500, cors);
    }
  }
};

/* --- Kainos priėmimas ------------------------------------------------------ */
async function priimtiKaina(req, env, cors) {
  let b;
  try { b = await req.json(); } catch (e) { b = null; }
  if (!b || typeof b !== "object") return json({ klaida: "blogi duomenys" }, 400, cors);

  const tipas = b.tipas === "pardavimo" || b.tipas === "prasoma" ? b.tipas : null;
  const pavadinimas = tekstas(b.pavadinimas, 120);
  const raktas = normalizuoti(pavadinimas);
  const kaina = skaicius(b.kaina, 1, 2000000);
  if (!tipas || raktas.length < 2 || kaina === null) {
    return json({ klaida: "trūksta tipo, pavadinimo arba kainos" }, 400, cors);
  }

  const dabar = new Date();
  const kategorija = KATEGORIJOS.has(b.kategorija) ? b.kategorija : null;
  const metai = sveikas(b.metai, 1950, dabar.getUTCFullYear() + 1);
  const rida = sveikas(b.rida, 0, 2000000);
  const kuras = tekstas(b.kuras, 40) || null;
  const kebulas = tekstas(b.kebulas, 40) || null;
  const bukle = BUKLES.has(b.bukle) ? b.bukle : null;
  const prasyta = tipas === "pardavimo" ? skaicius(b.prasyta, 1, 2000000) : null;

  /* Siuntėjas — tik tos dienos maišos kodas. IP nesaugomas. */
  const ip = req.headers.get("CF-Connecting-IP") || "";
  const siuntejas = await maisa(ip + "|" + dabar.toISOString().slice(0, 10) + "|" + (env.DRUSKA || "aidas"));

  const kiek = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM kainos WHERE siuntejas = ?"
  ).bind(siuntejas).first();
  if (kiek && kiek.n >= RIBA_PER_DIENA) return json({ klaida: "per daug siuntimų" }, 429, cors);

  const toks = await env.DB.prepare(
    "SELECT id FROM kainos WHERE siuntejas = ? AND raktas = ? AND tipas = ? AND kaina = ? LIMIT 1"
  ).bind(siuntejas, raktas, tipas, kaina).first();
  if (toks) return json({ ok: true }, 200, cors);

  /* Kraštutinumai lieka bazėje, bet į vertinimą nepatenka. */
  let patvirtinta = 1;
  const { results: kitos } = await env.DB.prepare(
    "SELECT kaina FROM kainos WHERE raktas = ? AND patvirtinta = 1 ORDER BY id DESC LIMIT 60"
  ).bind(raktas).all();
  if (kitos.length >= 5) {
    const med = mediana(kitos.map(x => x.kaina));
    if (kaina > med * 3 || kaina < med / 3) patvirtinta = 0;
  }
  if (prasyta) {
    const santykis = kaina / prasyta;
    if (santykis < 0.3 || santykis > 1.2) patvirtinta = 0;
  }

  await env.DB.prepare(
    "INSERT INTO kainos (tipas, pavadinimas, raktas, kategorija, metai, rida, kuras, kebulas, " +
    "bukle, kaina, prasyta, siuntejas, patvirtinta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(tipas, pavadinimas, raktas, kategorija, metai, rida, kuras, kebulas,
         bukle, kaina, prasyta, siuntejas, patvirtinta).run();

  return json({ ok: true }, 200, cors);
}

/* --- Rinkos duomenys ------------------------------------------------------- */
async function rinka(url, env, cors) {
  const kat = url.searchParams.get("kategorija");
  const salyga = KATEGORIJOS.has(kat) ? " AND kategorija = ?" : "";
  const parametrai = KATEGORIJOS.has(kat) ? [kat] : [];

  const { results } = await env.DB.prepare(
    "SELECT pavadinimas, kategorija, metai, rida, kuras, kebulas, bukle, kaina, tipas, " +
    "substr(sukurta, 1, 10) AS data FROM kainos " +
    "WHERE patvirtinta = 1 AND sukurta > datetime('now', '-" + SAUGOMA_DIENU + " days')" + salyga +
    " ORDER BY id DESC LIMIT " + ATIDUODAMA_DAUGIAUSIA
  ).bind(...parametrai).all();

  const { results: poros } = await env.DB.prepare(
    "SELECT kategorija, kaina, prasyta FROM kainos WHERE tipas = 'pardavimo' AND patvirtinta = 1 " +
    "AND prasyta > 0 AND sukurta > datetime('now', '-" + SAUGOMA_DIENU + " days')"
  ).all();

  const grupes = {};
  for (const p of poros) {
    const k = p.kategorija || "kita";
    (grupes[k] = grupes[k] || []).push(p.kaina / p.prasyta);
  }
  const nuolaidos = {};
  for (const k of Object.keys(grupes)) {
    if (grupes[k].length >= MIN_NUOLAIDAI) {
      nuolaidos[k] = { koef: Math.round(mediana(grupes[k]) * 1000) / 1000, n: grupes[k].length };
    }
  }

  return json({ stebejimai: results, nuolaidos, atnaujinta: new Date().toISOString() }, 200,
    Object.assign({ "Cache-Control": "public, max-age=600" }, cors));
}

/* --- Pagalbinės ------------------------------------------------------------ */
function leidziama(kilme, env) {
  if (!kilme) return false;
  if (kilme === "null") return true;   /* svetainė atidaryta iš aplanko */
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(kilme)) return true;
  return String(env.LEIDZIAMI || "").split(",").map(s => s.trim()).filter(Boolean).includes(kilme);
}

function corsAntrastes(kilme, env) {
  return {
    "Access-Control-Allow-Origin": leidziama(kilme, env) ? kilme : "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(duomenys, statusas, antrastes) {
  return new Response(JSON.stringify(duomenys), {
    status: statusas,
    headers: Object.assign({ "Content-Type": "application/json; charset=utf-8" }, antrastes)
  });
}

/* Ta pati taisyklė kaip svetaine.js PATIKRA.normalizuoti */
function normalizuoti(t) {
  return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tekstas(t, ilgis) {
  return typeof t === "string" ? t.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, ilgis) : "";
}

function skaicius(x, nuo, iki) {
  const n = Number(x);
  return Number.isFinite(n) && n >= nuo && n <= iki ? Math.round(n * 100) / 100 : null;
}

function sveikas(x, nuo, iki) {
  const n = skaicius(x, nuo, iki);
  return n === null ? null : Math.round(n);
}

function mediana(sk) {
  const s = sk.slice().sort((a, b) => a - b);
  const v = Math.floor(s.length / 2);
  return s.length % 2 ? s[v] : (s[v - 1] + s[v]) / 2;
}

async function maisa(t) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return Array.from(new Uint8Array(b)).slice(0, 16).map(x => x.toString(16).padStart(2, "0")).join("");
}
