import { zipSync } from "fflate"

const VALID_AREAS = ["netherlands"]
const VALID_LANGS = ["nl", "en", "fr", "de"]

const AREA_LABEL = {
  netherlands: {
    nl: "Nederland",
    en: "Netherlands",
    fr: "Pays-Bas",
    de: "Niederlande",
  },
}

const LANG_LABEL = {
  nl: "NL",
  en: "EN",
  fr: "FR",
  de: "DE",
}

const EMAIL_T = {
  nl: {
    code_subject: "Jouw MareSafe downloadcode",
    code_body: (code, tokens) =>
      `<p>Bedankt voor je aankoop.</p>
       <p>Jouw downloadcode is:</p>
       <p style="font-family:monospace;font-size:32px;font-weight:700;letter-spacing:4px">${code}</p>
       <p>${tokens === "unlimited" ? "Deze code geeft je <strong>onbeperkte downloads</strong>." : `Deze code geeft je <strong>${tokens} tokens</strong> (1 per taal per download).`}</p>
       <p>Open <a href="https://www.maresafe.eu">maresafe.eu</a>, voer je code in en download je noodkaart.</p>
       <p>— MareSafe</p>`,
    receipt_subject: (v) => `MareSafe — downloadbevestiging voor ${v}`,
    receipt_body: (count, langList, vessel, remaining) =>
      `<p>Je hebt ${count} kaart${count > 1 ? "en" : ""} (${langList}) gedownload voor <strong>${vessel}</strong>.</p>
       <p>${remaining === "unlimited" ? "Mastercode — onbeperkt gebruik." : remaining > 0 ? `<strong>${remaining} token${remaining > 1 ? "s" : ""} resterend</strong> op je code.` : "Je code is volledig gebruikt."}</p>
       <p>Bijgevoegd vind je een JSON-backup van je kaartgegevens. Open <a href="https://www.maresafe.eu">maresafe.eu</a> om hem te importeren.</p>
       <p>— MareSafe</p>`,
  },
  en: {
    code_subject: "Your MareSafe download code",
    code_body: (code, tokens) =>
      `<p>Thank you for your purchase.</p>
       <p>Your download code is:</p>
       <p style="font-family:monospace;font-size:32px;font-weight:700;letter-spacing:4px">${code}</p>
       <p>${tokens === "unlimited" ? "This code gives you <strong>unlimited downloads</strong>." : `This code gives you <strong>${tokens} tokens</strong> (1 per language per download).`}</p>
       <p>Open <a href="https://www.maresafe.eu">maresafe.eu</a>, enter your code, and download your emergency card.</p>
       <p>— MareSafe</p>`,
    receipt_subject: (v) => `MareSafe — download receipt for ${v}`,
    receipt_body: (count, langList, vessel, remaining) =>
      `<p>You downloaded ${count} card${count > 1 ? "s" : ""} (${langList}) for <strong>${vessel}</strong>.</p>
       <p>${remaining === "unlimited" ? "Master code — unlimited use." : remaining > 0 ? `<strong>${remaining} token${remaining > 1 ? "s" : ""} remaining</strong> on your code.` : "Your code has been fully used."}</p>
       <p>Attached is a JSON backup of your card data. Open <a href="https://www.maresafe.eu">maresafe.eu</a> to import it.</p>
       <p>— MareSafe</p>`,
  },
  fr: {
    code_subject: "Votre code de téléchargement MareSafe",
    code_body: (code, tokens) =>
      `<p>Merci pour votre achat.</p>
       <p>Votre code de téléchargement est :</p>
       <p style="font-family:monospace;font-size:32px;font-weight:700;letter-spacing:4px">${code}</p>
       <p>${tokens === "unlimited" ? "Ce code vous donne <strong>téléchargements illimités</strong>." : `Ce code vous donne <strong>${tokens} tokens</strong> (1 par langue par téléchargement).`}</p>
       <p>Ouvrez <a href="https://www.maresafe.eu">maresafe.eu</a>, entrez votre code et téléchargez votre carte d'urgence.</p>
       <p>— MareSafe</p>`,
    receipt_subject: (v) => `MareSafe — reçu de téléchargement pour ${v}`,
    receipt_body: (count, langList, vessel, remaining) =>
      `<p>Vous avez téléchargé ${count} carte${count > 1 ? "s" : ""} (${langList}) pour <strong>${vessel}</strong>.</p>
       <p>${remaining === "unlimited" ? "Code maître — utilisation illimitée." : remaining > 0 ? `<strong>${remaining} token${remaining > 1 ? "s" : ""} restant${remaining > 1 ? "s" : ""}</strong> sur votre code.` : "Votre code est entièrement utilisé."}</p>
       <p>Ci-joint une sauvegarde JSON de vos données. Ouvrez <a href="https://www.maresafe.eu">maresafe.eu</a> pour l'importer.</p>
       <p>— MareSafe</p>`,
  },
  de: {
    code_subject: "Ihr MareSafe Download-Code",
    code_body: (code, tokens) =>
      `<p>Vielen Dank für Ihren Kauf.</p>
       <p>Ihr Download-Code lautet:</p>
       <p style="font-family:monospace;font-size:32px;font-weight:700;letter-spacing:4px">${code}</p>
       <p>${tokens === "unlimited" ? "Dieser Code gibt Ihnen <strong>unbegrenzte Downloads</strong>." : `Dieser Code gibt Ihnen <strong>${tokens} Tokens</strong> (1 pro Sprache pro Download).`}</p>
       <p>Öffnen Sie <a href="https://www.maresafe.eu">maresafe.eu</a>, geben Sie Ihren Code ein und laden Sie Ihre Notfallkarte herunter.</p>
       <p>— MareSafe</p>`,
    receipt_subject: (v) => `MareSafe — Download-Beleg für ${v}`,
    receipt_body: (count, langList, vessel, remaining) =>
      `<p>Sie haben ${count} Karte${count > 1 ? "n" : ""} (${langList}) für <strong>${vessel}</strong> heruntergeladen.</p>
       <p>${remaining === "unlimited" ? "Mastercode — unbegrenzte Nutzung." : remaining > 0 ? `<strong>${remaining} Token${remaining > 1 ? "s" : ""} verbleibend</strong> auf Ihrem Code.` : "Ihr Code wurde vollständig verbraucht."}</p>
       <p>Anbei eine JSON-Sicherung Ihrer Kartendaten. Öffnen Sie <a href="https://www.maresafe.eu">maresafe.eu</a>, um sie zu importieren.</p>
       <p>— MareSafe</p>`,
  },
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (request.method === "OPTIONS") {
      if (ADMIN_ROUTES.has(url.pathname)) {
        return new Response(null, { status: 204 })
      }
      return corsResponse(null, 204, env, request)
    }

    if (
      request.method === "POST" &&
      ADMIN_ROUTES.has(url.pathname) &&
      !isSameOriginRequest(request)
    ) {
      return adminResponse({ error: "Forbidden" }, 403)
    }

    if (request.method === "GET" && url.pathname === "/admin") {
      return adminPage()
    }

    if (request.method === "POST" && url.pathname === "/check-code") {
      return handleCheckCode(request, env)
    }

    if (request.method === "POST" && url.pathname === "/create-code") {
      return handleCreateCode(request, env)
    }

    if (request.method === "POST" && url.pathname === "/generate-pdf") {
      return handleGeneratePdf(request, env)
    }

    if (request.method === "POST" && url.pathname === "/admin/codes") {
      return handleListCodes(request, env)
    }

    if (request.method === "POST" && url.pathname === "/stripe-webhook") {
      return handleStripeWebhook(request, env)
    }

    if (request.method === "POST" && url.pathname === "/revoke-code") {
      return handleRevokeCode(request, env)
    }

    if (request.method === "POST" && url.pathname === "/admin/emails") {
      return handleListEmails(request, env)
    }

    if (request.method === "POST" && url.pathname === "/admin/export-emails") {
      return handleExportEmails(request, env)
    }

    return corsResponse({ error: "Not found" }, 404, env, request)
  },
}

// ── /check-code ────────────────────────────────────────────────────
async function handleCheckCode(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown"
  if (!(await checkRateLimit(env, ip, "check-code", 15))) {
    return corsResponse({ valid: false, error: "Too many requests" }, 429, env, request)
  }

  const { code } = await request.json().catch(() => ({}))
  if (!code || typeof code !== "string" || code.length > 32) {
    return corsResponse({ valid: false }, 200, env, request)
  }

  if (await timingSafeEqual(code, env.MASTER_CODE)) {
    return corsResponse({ valid: true, tokens: "unlimited" }, 200, env, request)
  }

  const row = await env.DB.prepare(
    "SELECT tokens_remaining, unlimited, status FROM download_codes WHERE code = ?",
  )
    .bind(code)
    .first()

  if (!row || row.status !== "active") {
    return corsResponse({ valid: false }, 200, env, request)
  }
  return corsResponse(
    { valid: true, tokens: row.unlimited ? "unlimited" : row.tokens_remaining },
    200,
    env,
    request,
  )
}

// ── /create-code ───────────────────────────────────────────────────
async function handleCreateCode(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown"
  if (!(await checkRateLimit(env, ip, "admin", 10))) {
    return adminResponse({ error: "Too many requests" }, 429)
  }

  const { masterCode, uses, email, unlimited, lang } = await request
    .json()
    .catch(() => ({}))

  if (!(await timingSafeEqual(masterCode, env.MASTER_CODE))) {
    return adminResponse({ error: "Forbidden" }, 403)
  }

  const hasEmail =
    email &&
    typeof email === "string" &&
    email.length <= 254 &&
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
  const storedEmail = hasEmail ? email : env.ADMIN_EMAIL

  const isUnlimited = !!unlimited
  const total = isUnlimited ? 0 : uses || 3
  const code = generateCode()
  await env.DB.prepare(
    `INSERT INTO download_codes (code, email, source, status, tokens_total, tokens_remaining, unlimited, email_failed, created_at)
     VALUES (?, ?, 'manual', 'active', ?, ?, ?, 0, ?)`,
  )
    .bind(
      code,
      storedEmail,
      total,
      total,
      isUnlimited ? 1 : 0,
      new Date().toISOString(),
    )
    .run()

  if (hasEmail) {
    const emailLang = VALID_LANGS.includes(lang) ? lang : "en"
    await sendCodeEmail(email, code, emailLang, env, isUnlimited ? "unlimited" : total)
  }
  return adminResponse({ code, emailSent: hasEmail }, 200)
}

// ── /generate-pdf ──────────────────────────────────────────────────
async function handleGeneratePdf(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown"
  if (!(await checkRateLimit(env, ip, "generate-pdf", 6))) {
    return corsResponse({ error: "Too many requests" }, 429, env, request)
  }

  const body = await request.json().catch(() => null)
  if (!body) return corsResponse({ error: "Invalid body" }, 400, env, request)

  const { code, formData, backupData, languages, area, lang } = body

  if (
    !Array.isArray(languages) ||
    languages.length === 0 ||
    !languages.every((l) => VALID_LANGS.includes(l))
  ) {
    return corsResponse({ error: "Invalid languages" }, 400, env, request)
  }

  if (!VALID_AREAS.includes(area)) {
    return corsResponse({ error: "Invalid area" }, 400, env, request)
  }

  // ── Auth ───────────────────────────────────────────────────────
  const isMasterCode = await timingSafeEqual(code, env.MASTER_CODE)
  let codeData = null

  if (!isMasterCode) {
    const row = await env.DB.prepare(
      "SELECT * FROM download_codes WHERE code = ?",
    )
      .bind(code)
      .first()
    if (!row) return corsResponse({ error: "Invalid code" }, 403, env, request)
    if (!row.unlimited && row.tokens_remaining < languages.length) {
      return corsResponse({ error: "Not enough tokens remaining" }, 403, env, request)
    }
    codeData = row
  }

  // ── Render PDFs ────────────────────────────────────────────────
  let pdfs
  try {
    pdfs = []
    for (const l of languages) {
      pdfs.push(await renderPdf({ ...formData, lang: l }, env))
    }
  } catch (err) {
    console.error("PDF generation failed:", err?.message ?? err)
    return corsResponse({ error: "PDF generation failed" }, 503, env, request)
  }

  // ── Decrement tokens + log uses ────────────────────────────────
  const emailLang = VALID_LANGS.includes(lang) ? lang : "en"

  if (codeData) {
    const now = new Date().toISOString()
    for (const l of languages) {
      await env.DB.prepare(
        "INSERT INTO download_uses (code, used_at, lang) VALUES (?, ?, ?)",
      )
        .bind(code, now, l)
        .run()
    }
    if (codeData.unlimited) {
      if (codeData.email) {
        await sendReceiptEmail(
          codeData.email,
          backupData || formData,
          languages,
          "unlimited",
          emailLang,
          env,
        )
      }
    } else {
      const newRemaining = codeData.tokens_remaining - languages.length
      await env.DB.prepare(
        "UPDATE download_codes SET tokens_remaining = ?, status = ? WHERE code = ?",
      )
        .bind(newRemaining, newRemaining <= 0 ? "depleted" : "active", code)
        .run()
      if (codeData.email) {
        await sendReceiptEmail(
          codeData.email,
          backupData || formData,
          languages,
          newRemaining,
          emailLang,
          env,
        )
      }
    }
  } else {
    // Master code — send receipt to admin
    if (env.ADMIN_EMAIL) {
      await sendReceiptEmail(
        env.ADMIN_EMAIL,
        backupData || formData,
        languages,
        "unlimited",
        emailLang,
        env,
      )
    }
  }

  // ── ZIP ────────────────────────────────────────────────────────
  const vesselName = formData?.name || "card"
  const areaLabels = AREA_LABEL[area]

  const files = {}
  for (let i = 0; i < languages.length; i++) {
    const l = languages[i]
    const label = areaLabels[l] || areaLabels.en
    files[`MareSafe - ${vesselName} - ${label} - ${LANG_LABEL[l]}.pdf`] =
      new Uint8Array(pdfs[i])
  }
  const zipped = zipSync(files)

  const zipLabel = areaLabels[lang] || areaLabels.en
  return new Response(zipped, {
    status: 200,
    headers: {
      ...corsHeaders(env, request),
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="MareSafe - ${vesselName} - ${zipLabel}.zip"`,
    },
  })
}

// ── /stripe-webhook ────────────────────────────────────────────────
async function handleStripeWebhook(request, env) {
  const rawBody = await request.text()
  const sig = request.headers.get("Stripe-Signature")
  if (!sig) return new Response("Forbidden", { status: 403 })

  const sigParts = Object.fromEntries(sig.split(",").map((p) => p.split("=")))
  const payload = `${sigParts.t}.${rawBody}`

  async function verifySecret(secret) {
    if (!secret) return false
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    )
    const mac = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(payload),
    )
    const expected = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    return expected === sigParts.v1
  }

  const isLive = await verifySecret(env.STRIPE_WEBHOOK_SECRET_LIVE)
  const isTest = !isLive && (await verifySecret(env.STRIPE_WEBHOOK_SECRET_TEST))

  if (!isLive && !isTest) {
    return new Response("Forbidden", { status: 403 })
  }

  const event = JSON.parse(rawBody)
  if (event.type !== "checkout.session.completed") {
    return new Response("OK", { status: 200 })
  }

  const session = event.data?.object
  const sessionId = session.id
  const email = session?.customer_details?.email || null
  const lang = localeToLang(session?.locale)

  const stripeKey = isLive
    ? (env.STRIPE_SECRET_KEY_LIVE ?? env.STRIPE_SECRET_KEY)
    : (env.STRIPE_SECRET_KEY_TEST ?? env.STRIPE_SECRET_KEY)
  const itemsRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}/line_items`,
    { headers: { Authorization: `Bearer ${stripeKey}` } },
  )
  const itemsData = await itemsRes.json()
  const quantity = itemsData.data?.[0]?.quantity ?? 1
  const tokens = 3 * quantity

  const code = generateCode()

  try {
    await env.DB.prepare(
      `INSERT INTO download_codes (code, email, source, status, tokens_total, tokens_remaining, email_failed, created_at, stripe_session_id)
       VALUES (?, ?, 'payment', 'active', ?, ?, 0, ?, ?)`,
    )
      .bind(code, email, tokens, tokens, new Date().toISOString(), sessionId)
      .run()
  } catch {
    // UNIQUE constraint on stripe_session_id — duplicate webhook, already processed
    return new Response("OK", { status: 200 })
  }

  if (email) {
    try {
      await sendCodeEmail(email, code, lang, env, tokens)
    } catch {
      await env.DB.prepare(
        "UPDATE download_codes SET email_failed = 1 WHERE code = ?",
      )
        .bind(code)
        .run()
    }
  }

  return new Response("OK", { status: 200 })
}

// ── Browserless PDF render ─────────────────────────────────────────
// Card data is encoded in the URL hash so Browserless navigates to the
// real maresafe.eu origin — all assets load same-origin, no CORS needed.
async function renderPdf(cardData, env) {
  const renderUrl =
    env.CARD_URL + "#__render__=" + encodeURIComponent(JSON.stringify(cardData))

  const res = await fetch(
    `https://chrome.browserless.io/pdf?token=${env.BROWSERLESS_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: renderUrl,
        addStyleTag: [{ content: "@page { size: 210mm 297mm; margin: 0; }" }],
        options: {
          printBackground: true,
          preferCSSPageSize: true,
          pageRanges: "1",
          margin: { top: "0", right: "0", bottom: "0", left: "0" },
        },
        waitForSelector: { selector: "#render-ready", timeout: 30000 },
      }),
    },
  )

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Browserless ${res.status}: ${text}`)
  }
  return res.arrayBuffer()
}

// ── /admin/codes ───────────────────────────────────────────────────
async function handleListCodes(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown"
  if (!(await checkRateLimit(env, ip, "admin", 10))) {
    return adminResponse({ error: "Too many requests" }, 429)
  }

  const { masterCode } = await request.json().catch(() => ({}))
  if (!(await timingSafeEqual(masterCode, env.MASTER_CODE))) {
    return adminResponse({ error: "Forbidden" }, 403)
  }

  const { results } = await env.DB.prepare(
    `SELECT dc.*,
       GROUP_CONCAT(du.used_at || ':' || du.lang) as uses_raw
     FROM download_codes dc
     LEFT JOIN download_uses du ON dc.code = du.code
     GROUP BY dc.code
     ORDER BY dc.created_at DESC`,
  ).all()

  const codes = results.map((row) => ({
    ...row,
    uses_log: row.uses_raw
      ? row.uses_raw.split(",").map((e) => {
          const colonIdx = e.lastIndexOf(":")
          return { at: e.slice(0, colonIdx), lang: e.slice(colonIdx + 1) }
        })
      : [],
  }))

  return adminResponse({ codes }, 200)
}

// ── /revoke-code ───────────────────────────────────────────────────
async function handleRevokeCode(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown"
  if (!(await checkRateLimit(env, ip, "admin", 10))) {
    return adminResponse({ error: "Too many requests" }, 429)
  }

  const { masterCode, code } = await request.json().catch(() => ({}))
  if (!(await timingSafeEqual(masterCode, env.MASTER_CODE)))
    return adminResponse({ error: "Forbidden" }, 403)
  const row = await env.DB.prepare(
    "SELECT code FROM download_codes WHERE code = ?",
  )
    .bind(code)
    .first()
  if (!row) return adminResponse({ error: "Code not found" }, 404)
  await env.DB.prepare(
    "UPDATE download_codes SET status = 'revoked' WHERE code = ?",
  )
    .bind(code)
    .run()
  return adminResponse({ ok: true }, 200)
}

// ── /admin/emails ──────────────────────────────────────────────────
async function handleListEmails(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown"
  if (!(await checkRateLimit(env, ip, "admin", 10))) {
    return adminResponse({ error: "Too many requests" }, 429)
  }

  const { masterCode } = await request.json().catch(() => ({}))
  if (!(await timingSafeEqual(masterCode, env.MASTER_CODE))) {
    return adminResponse({ error: "Forbidden" }, 403)
  }

  await env.DB.prepare(
    `
    CREATE TABLE IF NOT EXISTS email_export_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      exported_at TEXT NOT NULL
    )
  `,
  )
    .run()
    .catch(() => {})

  const { results } = await env.DB.prepare(
    `
    SELECT
      dc.email,
      MIN(dc.created_at) AS first_purchase,
      COUNT(DISTINCT dc.code) AS purchase_count,
      COALESCE(el.export_count, 0) AS export_count,
      el.last_exported
    FROM download_codes dc
    LEFT JOIN (
      SELECT email, COUNT(*) AS export_count, MAX(exported_at) AS last_exported
      FROM email_export_log
      GROUP BY email
    ) el ON dc.email = el.email
    WHERE dc.email IS NOT NULL AND dc.email != ''
    GROUP BY dc.email
    ORDER BY first_purchase DESC
  `,
  ).all()

  return adminResponse({ emails: results }, 200)
}

// ── /admin/export-emails ───────────────────────────────────────────
async function handleExportEmails(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown"
  if (!(await checkRateLimit(env, ip, "admin", 10))) {
    return adminResponse({ error: "Too many requests" }, 429)
  }

  const { masterCode, emails } = await request.json().catch(() => ({}))
  if (!(await timingSafeEqual(masterCode, env.MASTER_CODE))) {
    return adminResponse({ error: "Forbidden" }, 403)
  }

  if (!Array.isArray(emails) || emails.length === 0) {
    return adminResponse({ error: "No emails provided" }, 400)
  }

  const now = new Date().toISOString()
  for (const email of emails) {
    await env.DB.prepare(
      "INSERT INTO email_export_log (email, exported_at) VALUES (?, ?)",
    )
      .bind(email, now)
      .run()
  }

  return adminResponse({ ok: true, count: emails.length }, 200)
}

// ── Email: code delivery ───────────────────────────────────────────
async function sendCodeEmail(email, code, lang, env, tokens) {
  const t = EMAIL_T[lang] || EMAIL_T.en
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "MareSafe <noreply@contact.maresafe.eu>",
      to: email,
      subject: t.code_subject,
      html: t.code_body(code, tokens),
    }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}`)
}

// ── Email: download receipt + JSON backup ─────────────────────────
async function sendReceiptEmail(
  email,
  formData,
  languages,
  tokensRemaining,
  lang,
  env,
) {
  const t = EMAIL_T[lang] || EMAIL_T.en
  const vesselName = formData?.vesselName || formData?.name || "your vessel"
  const langList = languages.map((l) => LANG_LABEL[l]).join(", ")
  const filename = `MareSafe - ${vesselName} - Backup ${new Date().toISOString().slice(0, 10)}.json`
  const jsonBytes = new TextEncoder().encode(JSON.stringify(formData, null, 2))
  const base64 = btoa(String.fromCharCode(...jsonBytes))

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "MareSafe <noreply@contact.maresafe.eu>",
      to: email,
      subject: t.receipt_subject(vesselName),
      html: t.receipt_body(
        languages.length,
        langList,
        vesselName,
        tokensRemaining,
      ),
      attachments: [{ filename, content: base64 }],
    }),
  }).catch(() => {})
}

// ── Admin page ─────────────────────────────────────────────────────
function adminPage() {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MareSafe Admin</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%231b3a5c'/%3E%3Ctext x='32' y='42' font-family='system-ui,sans-serif' font-size='24' font-weight='700' fill='white' text-anchor='middle'%3EMSA%3C/text%3E%3C/svg%3E">
  <style>
    body { font-family: system-ui, sans-serif; max-width: 960px; margin: 60px auto; padding: 0 20px; color: #111; }
    h2 { color: #1b3a5c; margin-top: 0; }
    label { display: block; font-size: 13px; margin-bottom: 4px; color: #444; }
    input[type=text], input[type=email], input[type=password], input[type=number], input[type=search] {
      display: block; width: 100%; box-sizing: border-box; margin-bottom: 12px; padding: 8px 10px;
      font-size: 14px; border: 1.5px solid #a8c4e0; border-radius: 4px;
    }
    .tabs { display: flex; gap: 8px; margin-bottom: 24px; }
    .tab { padding: 8px 18px; border: 1.5px solid #a8c4e0; border-radius: 4px; cursor: pointer; font-size: 14px; background: white; }
    .tab.active { background: #1b3a5c; color: white; border-color: #1b3a5c; }
    .panel { display: none; }
    .panel.active { display: block; }
    button.action { background: #1b3a5c; color: white; border: none; border-radius: 4px; padding: 10px 20px; font-size: 14px; cursor: pointer; }
    button.action:hover { background: #2c5282; }
    button.action.full { width: 100%; }
    button.action.sm { padding: 8px 14px; white-space: nowrap; }
    button.revoke { background: #a93226; color: white; border: none; border-radius: 4px; padding: 4px 10px; font-size: 11px; cursor: pointer; }
    button.revoke:hover { background: #7b241c; }
    #result { margin-top: 20px; font-size: 22px; font-weight: 700; color: #1e6b3c; letter-spacing: 2px; }
    #gen-error { margin-top: 12px; font-size: 13px; color: #a93226; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 700; }
    .badge-green  { background: #e8f4ee; color: #1e6b3c; }
    .badge-orange { background: #fef3cd; color: #856404; }
    .badge-red    { background: #fdecea; color: #a93226; }
    .badge-grey   { background: #f0f4f8; color: #555; }
    .toolbar { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; flex-wrap: wrap; }
    .toolbar input { margin-bottom: 0; max-width: 240px; flex: 1; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
    th { text-align: left; padding: 6px 8px; background: #f0f4f8; border-bottom: 2px solid #a8c4e0; white-space: nowrap; }
    td { padding: 6px 8px; border-bottom: 1px solid #e8eef4; vertical-align: top; }
    .log-entry { display: block; color: #555; }
    #codes-meta { font-size: 13px; color: #555; margin-top: 4px; }
    #codes-error { font-size: 13px; color: #a93226; margin-top: 8px; }
    #gate { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 100; }
    #gate-box { background: white; border-radius: 8px; padding: 32px; width: 340px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); }
    #gate-box h3 { margin: 0 0 20px; color: #1b3a5c; font-size: 18px; }
    #gate-error { font-size: 13px; color: #a93226; margin-bottom: 8px; min-height: 18px; }
    #gate-lock { font-size: 12px; color: #888; margin-top: 10px; text-align: center; }
    #app { display: none; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #444; margin-bottom: 12px; cursor: pointer; }
    .checkbox-label input { display: inline; width: auto; margin: 0; }
  </style>
</head>
<body>
  <div id="gate">
    <div id="gate-box">
      <h3>MareSafe Admin</h3>
      <label>Master code</label>
      <input id="gate-mc" type="password" autocomplete="current-password" placeholder="Enter master code" />
      <div id="gate-error"></div>
      <button class="action full" onclick="unlock()">Unlock</button>
    </div>
  </div>

  <div id="app">
    <h2>MareSafe Admin</h2>
    <div class="tabs">
      <button class="tab active" onclick="showTab('issued')">Download codes</button>
      <button class="tab" onclick="showTab('generate')">Generate code</button>
      <button class="tab" onclick="showTab('emails')">Email list</button>
    </div>

    <div id="panel-generate" class="panel active">
      <label>Email <span style="font-weight:400;color:#aaa">(optional — leave empty to skip sending)</span></label>
      <input id="email" type="email" placeholder="customer@example.com" />
      <label>Email language</label>
      <select id="email-lang" style="padding:8px 10px;font-size:14px;border:1.5px solid #a8c4e0;border-radius:4px;background:white;width:100%">
        <option value="en" selected>English</option>
        <option value="nl">Nederlands</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
      </select>
      <div id="uses-row">
        <label>Number of tokens</label>
        <input id="uses" type="number" value="3" min="1" max="1000" />
      </div>
      <label class="checkbox-label">
        <input type="checkbox" id="unlimited" onchange="toggleUnlimited()" />
        Unlimited tokens
      </label>
      <button class="action full" onclick="generate()">Generate code</button>
      <div id="result"></div>
      <div id="gen-error"></div>
    </div>

    <div id="panel-issued" class="panel">
      <div class="toolbar">
        <input type="search" id="email-search" placeholder="Filter by email…" oninput="renderTable()" />
        <select id="status-filter" onchange="renderTable()" style="padding:8px 10px;font-size:14px;border:1.5px solid #a8c4e0;border-radius:4px;background:white">
          <option value="all">All statuses</option>
          <option value="active" selected>Active</option>
          <option value="depleted">Depleted</option>
          <option value="revoked">Revoked</option>
        </select>
        <button class="action sm" onclick="loadCodes()">↻ Refresh</button>
      </div>
      <div id="codes-meta"></div>
      <table>
        <thead>
          <tr>
            <th>Code</th><th>Email</th><th>Source</th><th>Created</th>
            <th>Status</th><th>Tokens</th><th>Email</th><th>Use log</th><th></th>
          </tr>
        </thead>
        <tbody id="codes-rows"></tbody>
      </table>
      <div id="codes-error"></div>
    </div>

    <div id="panel-emails" class="panel">
      <div class="toolbar">
        <button class="action sm" onclick="selectEmails('all')">Select all</button>
        <button class="action sm" onclick="selectEmails('none')">Select none</button>
        <button class="action sm" onclick="selectEmails('new')">Not yet exported</button>
        <button class="action sm" id="export-btn" onclick="exportEmails()" disabled>Export CSV</button>
        <span id="email-selection-count" style="font-size:13px;color:#555;margin-left:4px"></span>
      </div>
      <div id="emails-meta" style="font-size:13px;color:#555;margin-bottom:4px"></div>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" id="email-check-all" onchange="toggleAllEmails(this)" /></th>
            <th>Email</th><th>First purchase</th><th>Purchases</th>
            <th>Times exported</th><th>Last exported</th>
          </tr>
        </thead>
        <tbody id="emails-rows"></tbody>
      </table>
      <div id="emails-error" style="font-size:13px;color:#a93226;margin-top:8px"></div>
    </div>
  </div>

  <script>
    let _allCodes = []
    let _allEmails = []
    let _mc = ""

    function escapeHtml(value) {
      return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      })[ch])
    }

    document.getElementById("gate-mc").addEventListener("keydown", e => {
      if (e.key === "Enter") unlock()
    })

    async function unlock() {
      const code = document.getElementById("gate-mc").value.trim()
      if (!code) return
      document.getElementById("gate-error").textContent = "Checking…"
      const res = await fetch("/admin/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterCode: code }),
      })
      const data = await res.json()
      if (!res.ok) {
        document.getElementById("gate-error").textContent = data.error || "Invalid master code."
        return
      }
      _mc = code
      document.getElementById("gate").style.display = "none"
      document.getElementById("app").style.display = "block"
      _allCodes = data.codes
      showTab("issued")
    }

    function showTab(name) {
      document.querySelectorAll(".tab").forEach((t, i) => t.classList.toggle("active", ["issued","generate","emails"][i] === name))
      document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"))
      document.getElementById("panel-" + name).classList.add("active")
      if (name === "issued") loadCodes()
      if (name === "emails") loadEmails()
    }

    function toggleUnlimited() {
      document.getElementById("uses-row").style.display =
        document.getElementById("unlimited").checked ? "none" : ""
    }

    async function generate() {
      document.getElementById("result").innerHTML = ""
      document.getElementById("gen-error").textContent = ""
      const isUnlimited = document.getElementById("unlimited").checked
      const body = {
        masterCode: _mc,
        email: document.getElementById("email").value,
        lang: document.getElementById("email-lang").value,
      }
      if (isUnlimited) body.unlimited = true
      else body.uses = parseInt(document.getElementById("uses").value) || 3
      const res = await fetch("/create-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        const note = data.emailSent ? "email sent" : "no email sent"
        const codeAttr = escapeHtml(data.code)
        document.getElementById("result").innerHTML =
          \`<div style="display:flex;align-items:center;gap:10px">
             <span>\${escapeHtml(data.code)}</span>
             <button type="button" id="copy-code-btn" data-code="\${codeAttr}" style="font-size:12px;font-weight:600;letter-spacing:0;padding:4px 10px;background:#1b3a5c;color:white;border:none;border-radius:4px;cursor:pointer">Copy</button>
           </div>
           <div style="font-size:13px;font-weight:400;color:#555;letter-spacing:0;margin-top:6px">\${escapeHtml(note)}</div>\`
        document.getElementById("copy-code-btn").addEventListener("click", (ev) => copyCode(ev.currentTarget.dataset.code, ev.currentTarget))
      } else document.getElementById("gen-error").textContent = data.error || "Something went wrong."
    }

    async function copyCode(code, btn) {
      try {
        await navigator.clipboard.writeText(code)
        const original = btn.textContent
        btn.textContent = "Copied!"
        setTimeout(() => { btn.textContent = original }, 1500)
      } catch {
        btn.textContent = "Failed"
      }
    }

    async function loadCodes() {
      document.getElementById("codes-error").textContent = ""
      const res = await fetch("/admin/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterCode: _mc }),
      })
      const data = await res.json()
      if (!res.ok) { document.getElementById("codes-error").textContent = data.error || "Failed."; return }
      _allCodes = data.codes
      renderTable()
    }

    function renderTable() {
      const q = document.getElementById("email-search").value.toLowerCase()
      const sf = document.getElementById("status-filter").value
      const filtered = _allCodes.filter(c => {
        if (q && !(c.email || "").toLowerCase().includes(q)) return false
        if (sf !== "all" && (c.status || "active") !== sf) return false
        return true
      })
      const statusBadge = (s) => {
        const map = { active: "badge-green", depleted: "badge-orange", revoked: "badge-red" }
        return \`<span class="badge \${map[s] || "badge-grey"}">\${escapeHtml(s || "active")}</span>\`
      }
      const fmt = (iso) => iso ? new Date(iso).toLocaleString("sv-SE").slice(0,16) : "—"
      document.getElementById("codes-rows").innerHTML = filtered.map(c => {
        const isUnlimited = !!c.unlimited
        const tr = c.tokens_remaining
        const tt = c.tokens_total || "?"
        const tokenClass = isUnlimited ? "badge-green" : tr === 0 ? "badge-red" : tr === 1 ? "badge-orange" : "badge-green"
        const tokenLabel = isUnlimited ? "∞" : \`\${tr} / \${tt}\`
        const srcClass = c.source === "payment" ? "badge-green" : "badge-grey"
        const st = c.status || "active"
        const emailBadge = c.email_failed
          ? \`<span class="badge badge-red">Failed</span>\`
          : \`<span class="badge badge-green">Sent</span>\`
        const useCount = (c.uses_log || []).length
        const codeAttr = escapeHtml(c.code)
        const logCell = useCount === 0
          ? "—"
          : \`<button type="button" class="revoke action-usage" style="background:#1b3a5c" data-code="\${codeAttr}">\${useCount} use\${useCount !== 1 ? "s" : ""}</button>\`
        const revokeBtn = st === "active"
          ? \`<button type="button" class="revoke action-revoke" data-code="\${codeAttr}">Revoke</button>\`
          : ""
        const emailLower = (c.email || "").toLowerCase()
        return \`<tr>
          <td style="font-family:monospace;font-weight:700">\${escapeHtml(c.code)}</td>
          <td>\${emailLower ? escapeHtml(emailLower) : "—"}</td>
          <td><span class="badge \${srcClass}">\${escapeHtml(c.source || "?")}</span></td>
          <td>\${fmt(c.created_at)}</td>
          <td>\${statusBadge(st)}</td>
          <td><span class="badge \${tokenClass}">\${tokenLabel}</span></td>
          <td>\${emailBadge}</td>
          <td>\${logCell}</td>
          <td>\${revokeBtn}</td>
        </tr>\`
      }).join("")
      document.querySelectorAll("#codes-rows .action-usage").forEach(b =>
        b.addEventListener("click", () => showUsageModal(b.dataset.code))
      )
      document.querySelectorAll("#codes-rows .action-revoke").forEach(b =>
        b.addEventListener("click", () => revokeCode(b.dataset.code))
      )
      document.getElementById("codes-meta").textContent =
        filtered.length + " of " + _allCodes.length + " code" + (_allCodes.length !== 1 ? "s" : "")
    }

    async function revokeCode(code) {
      if (!confirm(\`Revoke code \${code}? This cannot be undone.\`)) return
      const res = await fetch("/revoke-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterCode: _mc, code }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || "Failed to revoke."); return }
      await loadCodes()
    }

    function showUsageModal(code) {
      const c = _allCodes.find(x => x.code === code)
      const log = c ? c.uses_log || [] : []
      const fmt = (iso) => iso ? new Date(iso).toLocaleString("sv-SE").slice(0, 16) : "—"
      document.getElementById("usage-modal-body").innerHTML = log.length === 0
        ? "<p style='color:#999;margin:0'>No uses yet.</p>"
        : log.map(e =>
            \`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee">
              <span style="color:#555">\${fmt(e.at)}</span>
              <span style="font-weight:700">\${escapeHtml((e.lang || "?").toUpperCase())}</span>
            </div>\`
          ).join("")
      const modal = document.getElementById("usage-modal")
      modal.style.display = "flex"
    }

    function closeUsageModal() {
      document.getElementById("usage-modal").style.display = "none"
    }

    async function loadEmails() {
      document.getElementById("emails-error").textContent = ""
      const res = await fetch("/admin/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterCode: _mc }),
      })
      const data = await res.json()
      if (!res.ok) { document.getElementById("emails-error").textContent = data.error || "Failed."; return }
      _allEmails = data.emails
      renderEmailTable()
    }

    function renderEmailTable() {
      const fmtDate = (iso) => iso ? new Date(iso).toLocaleString("sv-SE").slice(0, 10) : "—"
      document.getElementById("emails-rows").innerHTML = _allEmails.map(e => {
        const exportBadge = e.export_count > 0
          ? \`<span class="badge badge-orange">\${Number(e.export_count) || 0}×</span>\`
          : \`<span class="badge badge-grey">Never</span>\`
        const emailLower = (e.email || "").toLowerCase()
        const emailAttr = escapeHtml(emailLower)
        return \`<tr>
          <td><input type="checkbox" class="email-check" value="\${emailAttr}" /></td>
          <td>\${escapeHtml(emailLower)}</td>
          <td>\${fmtDate(e.first_purchase)}</td>
          <td>\${Number(e.purchase_count) || 0}</td>
          <td>\${exportBadge}</td>
          <td>\${fmtDate(e.last_exported)}</td>
        </tr>\`
      }).join("")
      document.querySelectorAll(".email-check").forEach(c =>
        c.addEventListener("change", updateEmailSelection)
      )
      updateEmailSelection()
      document.getElementById("emails-meta").textContent =
        _allEmails.length + " customer email" + (_allEmails.length !== 1 ? "s" : "")
    }

    function updateEmailSelection() {
      const checked = document.querySelectorAll(".email-check:checked")
      const total = document.querySelectorAll(".email-check")
      document.getElementById("email-selection-count").textContent =
        checked.length + " of " + total.length + " selected"
      document.getElementById("export-btn").disabled = checked.length === 0
      const allCb = document.getElementById("email-check-all")
      if (allCb) {
        allCb.indeterminate = checked.length > 0 && checked.length < total.length
        allCb.checked = total.length > 0 && checked.length === total.length
      }
    }

    function toggleAllEmails(cb) {
      document.querySelectorAll(".email-check").forEach(c => c.checked = cb.checked)
      updateEmailSelection()
    }

    function selectEmails(mode) {
      document.querySelectorAll(".email-check").forEach(c => {
        const row = _allEmails.find(e => e.email === c.value)
        if (mode === "all") c.checked = true
        else if (mode === "none") c.checked = false
        else if (mode === "new") c.checked = !!(row && row.export_count === 0)
      })
      updateEmailSelection()
    }

    async function exportEmails() {
      const selected = [...document.querySelectorAll(".email-check:checked")].map(c => c.value)
      if (selected.length === 0) return
      const res = await fetch("/admin/export-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterCode: _mc, emails: selected }),
      })
      if (!res.ok) { alert("Failed to log export."); return }
      const csv = "Email\\n" + selected.map(e => \`"\${e.replace(/"/g, '""')}"\`).join("\\n")
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = \`maresafe-emails-\${new Date().toISOString().slice(0, 10)}.csv\`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      await loadEmails()
    }
  </script>

  <div id="usage-modal" onclick="if(event.target===this)closeUsageModal()" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:200;align-items:center;justify-content:center">
    <div style="background:white;border-radius:8px;padding:24px;min-width:280px;max-width:420px;max-height:80vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,0.2)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <strong>Usage log</strong>
        <button onclick="closeUsageModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#555;line-height:1">✕</button>
      </div>
      <div id="usage-modal-body"></div>
    </div>
  </div>
</body>
</html>`

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy":
        "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "Referrer-Policy": "no-referrer",
      "Cache-Control": "no-store",
    },
  })
}

// ── Rate limiting (D1-backed, atomic per 60s window) ─────────────
async function checkRateLimit(env, ip, endpoint, limit) {
  const key = `${endpoint}:${ip}`
  const windowStart = new Date(
    Math.floor(Date.now() / 60000) * 60000,
  ).toISOString()
  const failClosed = endpoint === "admin"
  try {
    const row = await env.DB.prepare(
      `
      INSERT INTO rate_limits (key, count, window_start) VALUES (?, 1, ?)
      ON CONFLICT(key) DO UPDATE SET
        count = CASE WHEN window_start = excluded.window_start THEN count + 1 ELSE 1 END,
        window_start = CASE WHEN window_start = excluded.window_start THEN window_start ELSE excluded.window_start END
      RETURNING count
    `,
    )
      .bind(key, windowStart)
      .first()
    return row.count <= limit
  } catch {
    return !failClosed
  }
}

// ── Timing-safe comparison (HMAC — Web Crypto safe) ───────────────
async function timingSafeEqual(a, b) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const [macA, macB] = await Promise.all([
    crypto.subtle.sign("HMAC", key, enc.encode(String(a ?? ""))),
    crypto.subtle.sign("HMAC", key, enc.encode(String(b ?? ""))),
  ])
  const a8 = new Uint8Array(macA)
  const b8 = new Uint8Array(macB)
  let diff = 0
  for (let i = 0; i < a8.length; i++) diff |= a8[i] ^ b8[i]
  return diff === 0
}

// ── Helpers ────────────────────────────────────────────────────────
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const rand = (n) =>
    Array.from(crypto.getRandomValues(new Uint8Array(n)))
      .map((b) => chars[b % chars.length])
      .join("")
  return `${rand(4)}-${rand(4)}`
}

function localeToLang(locale) {
  if (!locale || locale === "auto") return "en"
  if (locale.startsWith("nl")) return "nl"
  if (locale.startsWith("fr")) return "fr"
  if (locale.startsWith("de")) return "de"
  return "en"
}

function corsHeaders(env, request) {
  const list = (env.ALLOWED_ORIGIN || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  const reqOrigin = request?.headers.get("Origin") || ""
  let allow
  if (list.includes("*")) allow = "*"
  else if (list.includes(reqOrigin)) allow = reqOrigin
  else allow = list[0] || "null"
  return {
    "Access-Control-Allow-Origin": allow,
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }
}

function corsResponse(body, status, env, request) {
  const headers = {
    ...corsHeaders(env, request),
    "Content-Type": "application/json",
  }
  return new Response(body ? JSON.stringify(body) : null, { status, headers })
}

function adminResponse(body, status) {
  return new Response(body ? JSON.stringify(body) : null, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  })
}

function isSameOriginRequest(request) {
  const origin = request.headers.get("Origin")
  if (!origin) return false
  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

const ADMIN_ROUTES = new Set([
  "/create-code",
  "/revoke-code",
  "/admin/codes",
  "/admin/emails",
  "/admin/export-emails",
])
