import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { Buffer } from "node:buffer";
import { handleCmsApi } from "./server/cmsDatabase.js";
import { handleHrmsApi } from "./server/hrmsDatabase.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const distDir = resolve(__dirname, "dist");
const runtimeDir = resolve(process.env.PRIMESERVE_RUNTIME_DIR || join(__dirname, ".runtime"));
const keyFile = join(runtimeDir, "gstin-key.json");
const superAdminFile = join(runtimeDir, "super-admin.json");
const port = Number(process.env.PORT || 3000);
const defaultApiUrl = "https://api.primeserve.in/commonapi/v1.1/search";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

async function handleSuperAdminRecovery(request, response) {
  if (request.method !== "POST") return sendJson(response, 405, { message: "Method not allowed." });
  try {
    const body = JSON.parse(await readRequestBody(request) || "{}");
    const requestedEmail = String(body.email || "").trim().toLowerCase();
    const credentials = getSuperAdminCredentials();
    const superAdminEmail = credentials.email;
    const superAdminPassword = credentials.password;
    const token = String(process.env.MAIL_SEND_TOKEN || process.env.SMTP_PASSWORD || "");
    if (requestedEmail !== superAdminEmail) return sendJson(response, 403, { message: "Credential recovery is available only for Super Admin." });
    if (!token || !superAdminPassword) return sendJson(response, 503, { message: "Recovery email is not configured on this server." });
    const authorization = token.startsWith("Zoho-enczapikey ") ? token : `Zoho-enczapikey ${token}`;
    const mailResponse = await fetch(process.env.MAIL_API_URL || "https://api.zeptomail.in/v1.1/email", {
      method: "POST",
      headers: { authorization, "content-type": "application/json" },
      body: JSON.stringify({
        from: { address: process.env.MAIL_FROM_ADDRESS || "info@primeserve.in", name: process.env.MAIL_FROM_NAME || "Primeserve" },
        to: [{ email_address: { address: superAdminEmail, name: "Primeserve Super Admin" } }],
        subject: "Primeserve CMS Super Admin credentials",
        htmlbody: `<div style="font-family:Arial,sans-serif"><h2>Primeserve CMS credentials</h2><p>User ID: <strong>${escapeHtml(superAdminEmail)}</strong></p><p>Password: <strong>${escapeHtml(superAdminPassword)}</strong></p><p>For security, sign in and update the password if this message was unexpected.</p></div>`,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!mailResponse.ok) throw new Error("Mail delivery failed.");
    return sendJson(response, 200, { success: true, message: "Super Admin credentials were sent to the registered email." });
  } catch {
    return sendJson(response, 502, { message: "Unable to send the recovery email. Please check the mail configuration." });
  }
}

async function handleSubmissionNotification(request, response) {
  if (request.method !== "POST") return sendJson(response, 405, { message: "Method not allowed." });
  try {
    const body = JSON.parse(await readRequestBody(request, 8 * 1024 * 1024) || "{}");
    const token = String(process.env.MAIL_SEND_TOKEN || process.env.SMTP_PASSWORD || "");
    if (!token) return sendJson(response, 503, { message: "Email notification is not configured on this server." });
    const kind = String(body.kind || "Website submission").slice(0, 120);
    const details = body.details && typeof body.details === "object" ? body.details : {};
    const attachment = body.attachment && typeof body.attachment === "object" ? body.attachment : null;
    const rows = Object.entries(details)
      .filter(([, value]) => value !== undefined && value !== null && String(value).trim())
      .map(([key, value]) => `<tr><td style="padding:7px 12px;border:1px solid #dbe4ef;font-weight:700">${escapeHtml(key.replace(/([A-Z])/g, " $1"))}</td><td style="padding:7px 12px;border:1px solid #dbe4ef">${escapeHtml(String(value))}</td></tr>`)
      .join("");
    const authorization = token.startsWith("Zoho-enczapikey ") ? token : `Zoho-enczapikey ${token}`;
    const recipient = String(process.env.PRIMESERVE_NOTIFICATION_EMAIL || "primeserve45@gmail.com").trim();
    const mailResponse = await fetch(process.env.MAIL_API_URL || "https://api.zeptomail.in/v1.1/email", {
      method: "POST",
      headers: { authorization, "content-type": "application/json" },
      body: JSON.stringify({
        from: { address: process.env.MAIL_FROM_ADDRESS || "info@primeserve.in", name: process.env.MAIL_FROM_NAME || "Primeserve" },
        to: [{ email_address: { address: recipient, name: "Primeserve Admin" } }],
        subject: `New Primeserve ${kind}`,
        htmlbody: `<div style="font-family:Arial,sans-serif;color:#082f65"><h2>New ${escapeHtml(kind)}</h2><p>This submission has also been saved in the Primeserve Admin portal.</p><table style="border-collapse:collapse;width:100%;max-width:760px">${rows}</table></div>`,
        ...(attachment?.data && attachment?.name ? {
          attachments: [{
            content: String(attachment.data).replace(/^data:[^;]+;base64,/, ""),
            mime_type: String(attachment.data).match(/^data:([^;]+);base64,/)?.[1] || "application/octet-stream",
            name: String(attachment.name).replace(/[^\w.\- ()]/g, "_").slice(0, 180),
          }],
        } : {}),
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!mailResponse.ok) throw new Error("Mail delivery failed.");
    return sendJson(response, 200, { success: true });
  } catch {
    return sendJson(response, 502, { message: "Submission was saved, but the notification email could not be delivered." });
  }
}

function getSuperAdminCredentials() {
  if (existsSync(superAdminFile)) {
    try {
      const parsed = JSON.parse(readFileSync(superAdminFile, "utf8"));
      return {
        email: String(parsed.email || "").trim().toLowerCase(),
        password: String(parsed.password || ""),
      };
    } catch {
      // Fall back to environment configuration.
    }
  }
  return {
    email: String(process.env.PRIMESERVE_SUPER_ADMIN_EMAIL || "primeserve45@gmail.com").trim().toLowerCase(),
    password: String(process.env.PRIMESERVE_SUPER_ADMIN_PASSWORD || ""),
  };
}

async function handleSuperAdminPasswordUpdate(request, response) {
  if (request.method !== "POST") return sendJson(response, 405, { message: "Method not allowed." });
  try {
    const body = JSON.parse(await readRequestBody(request) || "{}");
    const credentials = getSuperAdminCredentials();
    const email = String(body.email || "").trim().toLowerCase();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    if (email !== credentials.email || currentPassword !== credentials.password) {
      return sendJson(response, 403, { message: "Current Super Admin credentials are invalid." });
    }
    if (newPassword.length < 8) {
      return sendJson(response, 400, { message: "Password must contain at least 8 characters." });
    }
    mkdirSync(runtimeDir, { recursive: true });
    writeFileSync(superAdminFile, JSON.stringify({ email: credentials.email, password: newPassword, updatedAt: new Date().toISOString() }, null, 2));
    return sendJson(response, 200, { success: true, message: "Super Admin password updated." });
  } catch {
    return sendJson(response, 400, { message: "Unable to update the Super Admin password." });
  }
}

function readRequestBody(request, maxBytes = 1024 * 64) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxBytes) {
        request.destroy();
        rejectBody(new Error("Request body too large."));
      }
    });
    request.on("end", () => resolveBody(body));
    request.on("error", rejectBody);
  });
}

function getStoredApiKey() {
  if (existsSync(keyFile)) {
    try {
      const parsed = JSON.parse(readFileSync(keyFile, "utf8"));
      const storedKey = String(parsed.apiKey || "").trim();
      if (storedKey) return storedKey;
    } catch {
      // Fall back to the environment variable below.
    }
  }
  return String(process.env.PRIMESERVE_GSTIN_API_KEY || "").trim();
}

function saveStoredApiKey(apiKey) {
  mkdirSync(runtimeDir, { recursive: true });
  writeFileSync(keyFile, JSON.stringify({ apiKey, updatedAt: new Date().toISOString() }, null, 2));
}

function tryParseJson(value) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function looksLikeBase64(value) {
  const text = String(value || "").trim();
  return text.length > 20 && /^[A-Za-z0-9+/=\r\n]+$/.test(text) && text.length % 4 === 0;
}

function decodeMaybeBase64(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!looksLikeBase64(trimmed)) return tryParseJson(trimmed);

  try {
    const decoded = Buffer.from(trimmed, "base64").toString("utf8").trim();
    return tryParseJson(decoded);
  } catch {
    return tryParseJson(trimmed);
  }
}

function unwrapPayload(payload, depth = 0) {
  if (depth > 8) return payload;

  const decoded = decodeMaybeBase64(payload);
  if (decoded !== payload) return unwrapPayload(decoded, depth + 1);

  if (!decoded || typeof decoded !== "object") return decoded;

  const wrapperKeys = [
    "data",
    "result",
    "response",
    "payload",
    "taxpayerInfo",
    "gstinDetails",
    "Data",
    "Response",
  ];

  for (const key of wrapperKeys) {
    if (Object.prototype.hasOwnProperty.call(decoded, key) && decoded[key]) {
      const unwrapped = unwrapPayload(decoded[key], depth + 1);
      if (unwrapped && typeof unwrapped === "object") return unwrapped;
    }
  }

  return decoded;
}

function normalizeGstinRecord(payload, searchedGstin) {
  const data = unwrapPayload(payload);
  if (!data || typeof data !== "object") return data;

  const address = data.pradr?.addr || data.principalAddress?.addr || data.principalPlaceOfBusiness || {};
  const normalizedAddress = typeof address === "string" ? { bnm: address } : address;

  return {
    ...data,
    gstin: data.gstin || data.gstinNo || data.gstIn || data.gstin_uin || searchedGstin,
    lgnm: data.lgnm || data.legalName || data.legal_name || data.legalNameOfBusiness || data.name,
    tradeNam: data.tradeNam || data.tradeName || data.trade_name || data.businessName,
    rgdt: data.rgdt || data.registrationDate || data.effectiveDateOfRegistration || data.regDate,
    ctb: data.ctb || data.constitutionOfBusiness || data.constitution,
    sts: data.sts || data.status || data.gstinStatus || data.gstin_uin_status,
    dty: data.dty || data.taxpayerType || data.taxpayer_type,
    stj: data.stj || data.administrativeOffice || data.stateJurisdiction,
    stjCd: data.stjCd || data.stateJurisdictionCode,
    ctj: data.ctj || data.otherOffice || data.centerJurisdiction,
    ctjCd: data.ctjCd || data.centerJurisdictionCode,
    pradr: data.pradr || { addr: normalizedAddress },
    adhrVFlag: data.adhrVFlag || data.aadhaarAuthenticated || data.aadhaarVerified,
    ekycVFlag: data.ekycVFlag || data.ekycVerified,
    nba: data.nba || data.natureOfBusinessActivities || data.businessActivities,
    ntcrbs: data.ntcrbs || data.natureOfCoreBusinessActivity,
  };
}

function getApiUrl() {
  return process.env.PRIMESERVE_GSTIN_API_URL || defaultApiUrl;
}

async function handleGstinLookup(requestUrl, response) {
  const gstin = String(requestUrl.searchParams.get("gstin") || "").trim().toUpperCase();
  if (!/^[0-9A-Z]{15}$/.test(gstin)) {
    sendJson(response, 400, { error: "Please enter a valid 15-character GSTIN." });
    return;
  }

  const apiKey = getStoredApiKey();
  if (!apiKey) {
    sendJson(response, 500, { error: "GSTIN API key is not configured on the server." });
    return;
  }

  const upstreamUrl = new URL(getApiUrl());
  upstreamUrl.searchParams.set("gstin", gstin);
  upstreamUrl.searchParams.set("action", "TP");

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        Apikey: apiKey,
        Accept: "application/json,text/plain,*/*",
      },
    });
    const rawText = await upstreamResponse.text();
    const decoded = unwrapPayload(rawText);

    if (!upstreamResponse.ok) {
      sendJson(response, upstreamResponse.status, {
        error: typeof decoded === "object" ? decoded?.message || decoded?.error || "GSTIN validation failed." : String(decoded || "GSTIN validation failed."),
      });
      return;
    }

    sendJson(response, 200, normalizeGstinRecord(decoded, gstin));
  } catch {
    sendJson(response, 502, { error: "Unable to reach the GSTIN validation service right now." });
  }
}

async function handleGstinKeyUpdate(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed." });
    return;
  }

  try {
    const body = tryParseJson(await readRequestBody(request));
    const apiKey = String(body?.apiKey || "").trim();
    const adminSecret = String(body?.adminSecret || "").trim();
    const configuredSecret = String(process.env.PRIMESERVE_ADMIN_API_SECRET || "").trim();

    if (!apiKey || apiKey.length < 20) {
      sendJson(response, 400, { error: "Please enter a valid GSTIN API key." });
      return;
    }

    if (configuredSecret && adminSecret !== configuredSecret) {
      sendJson(response, 403, { error: "Server update secret is incorrect." });
      return;
    }

    saveStoredApiKey(apiKey);
    sendJson(response, 200, { ok: true, message: "GSTIN API key updated." });
  } catch {
    sendJson(response, 400, { error: "Unable to update GSTIN API key." });
  }
}

function serveStatic(requestUrl, response) {
  const pathname = decodeURIComponent(requestUrl.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = normalize(join(distDir, requestedPath));
  const resolvedFilePath = resolve(filePath);
  const indexPath = join(distDir, "index.html");

  let finalPath = resolvedFilePath.startsWith(distDir) && existsSync(resolvedFilePath)
    ? resolvedFilePath
    : indexPath;

  if (existsSync(finalPath) && !extname(finalPath)) finalPath = indexPath;
  const extension = extname(finalPath);
  const contentType = mimeTypes[extension] || "application/octet-stream";

  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
  });
  response.end(readFileSync(finalPath));
}

createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (requestUrl.pathname.startsWith("/api/cms")) {
    await handleCmsApi(request, response, requestUrl.pathname);
    return;
  }

  if (requestUrl.pathname.startsWith("/api/hrms")) {
    await handleHrmsApi(request, response, requestUrl.pathname);
    return;
  }

  if (requestUrl.pathname === "/api/gstin-validator.php" || requestUrl.pathname === "/api/gstin-search.php") {
    await handleGstinLookup(requestUrl, response);
    return;
  }

  if (requestUrl.pathname === "/api/gstin-key.php") {
    await handleGstinKeyUpdate(request, response);
    return;
  }

  if (requestUrl.pathname === "/api/admin/forgot-password") {
    await handleSuperAdminRecovery(request, response);
    return;
  }
  if (requestUrl.pathname === "/api/admin/submission-notification") {
    await handleSubmissionNotification(request, response);
    return;
  }
  if (requestUrl.pathname === "/api/admin/super-password") {
    await handleSuperAdminPasswordUpdate(request, response);
    return;
  }

  serveStatic(requestUrl, response);
}).listen(port, "0.0.0.0", () => {
  console.log(`Primeserve server running on port ${port}`);
});
