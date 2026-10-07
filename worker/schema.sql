-- Aidas — rinkos kainų duomenų bazė (Cloudflare D1)
-- Autorius: Marijus Tamulynas, 2026
--
-- Vienoje lentelėje dviejų rūšių kainos:
--   tipas = 'prasoma'    — kaina iš patikrinto skelbimo (pardavėjo noras)
--   tipas = 'pardavimo'  — kaina, už kurią daiktas iš tikrųjų nupirktas ar parduotas
-- Pardavimo kainos yra vertingiausios: iš jų poros su prašoma kaina
-- apskaičiuojama, kiek realiai nusiderama kiekvienoje kategorijoje.
--
-- Asmens duomenų nėra: vietoj IP saugomas tos dienos maišos kodas, kuris
-- reikalingas tik siuntimų ribojimui ir dublikatams atmesti.

CREATE TABLE IF NOT EXISTS kainos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  tipas        TEXT    NOT NULL CHECK (tipas IN ('prasoma', 'pardavimo')),
  pavadinimas  TEXT    NOT NULL,
  raktas       TEXT    NOT NULL,
  kategorija   TEXT,
  metai        INTEGER,
  rida         INTEGER,
  kuras        TEXT,
  kebulas      TEXT,
  deze         TEXT,      -- 'automatine' | 'mechanine'
  pavara       TEXT,      -- '4x4' | 'priekiniai' | 'galiniai'
  galia        INTEGER,   -- kW
  bukle        TEXT,
  kaina        REAL    NOT NULL,
  prasyta      REAL,
  siuntejas    TEXT    NOT NULL,
  patvirtinta  INTEGER NOT NULL DEFAULT 1,
  sukurta      TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS kainos_kategorija ON kainos (kategorija, patvirtinta, id);
CREATE INDEX IF NOT EXISTS kainos_raktas     ON kainos (raktas, patvirtinta);
CREATE INDEX IF NOT EXISTS kainos_siuntejas  ON kainos (siuntejas, sukurta);

-- 2026-10-07: jau sukurtai bazei pridėti stulpeliai (vykdyta vieną kartą):
--   ALTER TABLE kainos ADD COLUMN deze TEXT;
--   ALTER TABLE kainos ADD COLUMN pavara TEXT;
--   ALTER TABLE kainos ADD COLUMN galia INTEGER;
