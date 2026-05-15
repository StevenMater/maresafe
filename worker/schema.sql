CREATE TABLE IF NOT EXISTS download_codes (
  code              TEXT PRIMARY KEY,
  email             TEXT,
  source            TEXT NOT NULL DEFAULT 'payment',
  status            TEXT NOT NULL DEFAULT 'active',
  tokens_total      INTEGER NOT NULL DEFAULT 3,
  tokens_remaining  INTEGER NOT NULL DEFAULT 3,
  unlimited         INTEGER NOT NULL DEFAULT 0,
  email_failed      INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key          TEXT PRIMARY KEY,
  count        INTEGER NOT NULL DEFAULT 1,
  window_start TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS download_uses (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  code     TEXT NOT NULL REFERENCES download_codes(code),
  used_at  TEXT NOT NULL,
  lang     TEXT NOT NULL
);
