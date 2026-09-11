import { createHmac, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";
import process from "node:process";
import { Pool } from "pg";
import { defaultCmsData } from "../src/cmsStore.js";

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSL === "disable" ? false : { rejectUnauthorized: false } })
  : null;

const COOKIE_NAME = "primeserve_admin";
const SESSION_MAX_AGE = 8 * 60 * 60;
let developmentCmsData = defaultCmsData;

function sendJson(response, status, payload, extraHeaders = {}) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extraHeaders });
  response.end(JSON.stringify(payload));
}

function readBody(request, maxBytes = 12 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = "";
    let settled = false;
    request.on("data", (chunk) => {
      if (settled) return;
      body += chunk;
      if (body.length > maxBytes) {
        settled = true;
        reject(new Error("Request body too large"));
      }
    });
    request.on("end", () => {
      if (settled) return;
      try {
        settled = true;
        resolve(body ? JSON.parse(body) : {});
      } catch {
        settled = true;
        const error = new Error("Invalid JSON request body");
        error.statusCode = 400;
        reject(error);
      }
    });
    request.on("error", (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    });
  });
}

async function ensureStore() {
  if (!pool) {
    if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is not configured");
    return;
  }
  await pool.query(`create table if not exists cms_state (
    id integer primary key,
    data jsonb not null,
    updated_at timestamptz not null default now()
  )`);
  await pool.query(
    "insert into cms_state (id, data) values (1, $1::jsonb) on conflict (id) do nothing",
    [JSON.stringify(defaultCmsData)],
  );
}

async function readCms() {
  if (!pool) return developmentCmsData;
  await ensureStore();
  const result = await pool.query("select data from cms_state where id = 1");
  return result.rows[0]?.data || defaultCmsData;
}

function secret() {
  return String(process.env.CMS_SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "primeserve-local-development"));
}

function sign(value) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function createToken(session) {
  const payload = Buffer.from(JSON.stringify({ ...session, exp: Date.now() + SESSION_MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function sessionFromRequest(request) {
  if (!secret()) return null;
  const cookies = Object.fromEntries(String(request.headers.cookie || "").split(";").map((part) => part.trim().split("=")));
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
}

function publicData(data) {
  const safe = { ...data };
  ["adminUsers", "applications", "enquiries", "leads", "newsletterSubscribers", "hsnImportHistory"].forEach((key) => delete safe[key]);
  return safe;
}

export async function handleCmsApi(request, response, pathname) {
  try {
    if (pathname === "/api/cms/login") {
      if (request.method !== "POST") return sendJson(response, 405, { message: "Method not allowed." });
      if (!secret()) return sendJson(response, 503, { message: "CMS_SESSION_SECRET is not configured." });
      const body = await readBody(request);
      const data = await readCms();
      const user = (data.adminUsers || []).find((item) => item.status === "Active" && item.email.toLowerCase() === String(body.email || "").toLowerCase() && item.password === body.password);
      if (!user) return sendJson(response, 401, { message: "Invalid admin email or password." });
      const session = { email: user.email, name: user.name, role: user.role, letterheadAccess: user.role === "Super Admin" ? "Yes" : user.letterheadAccess || "No" };
      const cookie = `${COOKIE_NAME}=${createToken(session)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
      return sendJson(response, 200, { session, data }, { "Set-Cookie": cookie });
    }

    if (pathname === "/api/cms/logout") {
      return sendJson(response, 200, { ok: true }, { "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` });
    }

    if (pathname !== "/api/cms") return false;

    const session = sessionFromRequest(request);
    if (request.method === "GET") {
      const data = await readCms();
      return sendJson(response, 200, { data: session ? data : publicData(data), session: session || null });
    }
    if (request.method === "PUT") {
      if (!session) return sendJson(response, 401, { message: "Admin sign-in required." });
      const body = await readBody(request);
      if (!body.data || typeof body.data !== "object") return sendJson(response, 400, { message: "CMS data is required." });
      await ensureStore();
      if (pool) {
        await pool.query("update cms_state set data = $1::jsonb, updated_at = now() where id = 1", [JSON.stringify(body.data)]);
      } else {
        developmentCmsData = body.data;
      }
      return sendJson(response, 200, { ok: true, data: body.data });
    }
    return sendJson(response, 405, { message: "Method not allowed." });
  } catch (error) {
    return sendJson(response, error.statusCode || 500, { message: error.message || "CMS database request failed." });
  }
}
