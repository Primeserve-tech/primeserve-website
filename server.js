import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const distDir = resolve(__dirname, "dist");
const runtimeDir = resolve(process.env.PRIMESERVE_RUNTIME_DIR || join(__dirname, ".runtime"));
const keyFile = join(runtimeDir, "gstin-key.json");
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

function readRequestBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 64) {
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

  if (requestUrl.pathname === "/api/gstin-validator.php" || requestUrl.pathname === "/api/gstin-search.php") {
    await handleGstinLookup(requestUrl, response);
    return;
  }

  if (requestUrl.pathname === "/api/gstin-key.php") {
    await handleGstinKeyUpdate(request, response);
    return;
  }

  serveStatic(requestUrl, response);
}).listen(port, "0.0.0.0", () => {
  console.log(`PrimeServe server running on port ${port}`);
});
