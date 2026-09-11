import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import process from "node:process";
import { sessionFromRequest } from "./cmsDatabase.js";

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSL === "disable" ? false : { rejectUnauthorized: false } })
  : null;

const seedEmployees = [
  { id: "emp-ps0001", employeeCode: "PS0001", name: "Aarav Sharma", department: "Technology", designation: "Senior Developer", reportingManager: "Neha Kapoor", joiningDate: "2024-02-12", employmentStatus: "Active", email: "aarav.sharma@primeserve.in", workLocation: "Greater Noida", pan: "ABCDE1234F", uan: "100234567890", bankName: "Axis Bank", bankAccountMasked: "XXXXXX4821" },
  { id: "emp-ps0002", employeeCode: "PS0002", name: "Meera Iyer", department: "Finance & Tax", designation: "Payroll Manager", reportingManager: "Rajiv Mehta", joiningDate: "2023-07-03", employmentStatus: "Active", email: "meera.iyer@primeserve.in", workLocation: "Greater Noida", pan: "FGHIJ5678K", uan: "100234567891", bankName: "Axis Bank", bankAccountMasked: "XXXXXX7310", isHod: true },
  { id: "emp-ps0003", employeeCode: "PS0003", name: "Kabir Singh", department: "Sales", designation: "Sales Manager", reportingManager: "Rajiv Mehta", joiningDate: "2026-07-15", employmentStatus: "Active", email: "kabir.singh@primeserve.in", workLocation: "Remote", pan: "KLMNO9012P", uan: "100234567892", bankName: "Axis Bank", bankAccountMasked: "XXXXXX1905" },
  { id: "emp-ps0004", employeeCode: "PS0004", name: "Riya Verma", department: "Human Resources", designation: "HR Executive", reportingManager: "Neha Kapoor", joiningDate: "2025-11-18", employmentStatus: "Inactive", email: "riya.verma@primeserve.in", workLocation: "Greater Noida", pan: "PQRST3456U", uan: "100234567893", bankName: "Axis Bank", bankAccountMasked: "XXXXXX9204" },
];

function createSeedState() {
  const localTemporaryHash = pool ? "" : bcrypt.hashSync("Prime@12345", 12);
  return {
    employees: seedEmployees,
    accounts: seedEmployees.map((employee, index) => ({
      employeeId: employee.id,
      passwordHash: localTemporaryHash,
      loginEnabled: index !== 3,
      accountLocked: false,
      firstLoginPending: Boolean(pool),
      passwordResetRequired: Boolean(pool),
      failedAttempts: 0,
      lastLogin: null,
      sessionVersion: 1,
    })),
    salaryStructures: [],
    payrollRuns: [{ id: "pay-2026-07", month: "July", year: 2026, status: "Published", employees: 3, gross: 214500, deductions: 28140, netPay: 186360 }],
    salarySlips: [
      { id: "slip-1", employeeId: "emp-ps0001", month: "July", year: 2026, gross: 72500, deductions: 9140, netPay: 63360, status: "Published", publishedDate: "2026-07-31" },
      { id: "slip-2", employeeId: "emp-ps0002", month: "July", year: 2026, gross: 82000, deductions: 11500, netPay: 70500, status: "Published", publishedDate: "2026-07-31" },
    ],
    form16: [{ id: "f16-1", employeeId: "emp-ps0001", financialYear: "2025-26", assessmentYear: "2026-27", uploadedDate: "2026-06-12", publishedDate: "2026-06-15", status: "Published", downloaded: false, version: 1 }],
    payrollQueries: [],
    workflowRecords: [],
    leaveRequests: [],
    leaveBalances: seedEmployees.map((employee) => ({ employeeId: employee.id, casual: 6, sick: 6, earned: 12, compensatory: 0 })),
    auditLogs: [],
  };
}

let developmentState = createSeedState();

function sendJson(response, status, payload, headers = {}) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers });
  response.end(JSON.stringify(payload));
}

function readBody(request, maxBytes = 2 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxBytes) reject(new Error("Request body too large"));
    });
    request.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error("Invalid JSON")); }
    });
    request.on("error", reject);
  });
}

async function ensureStore() {
  if (!pool) return;
  await pool.query(`create table if not exists hrms_state (
    id integer primary key,
    data jsonb not null,
    updated_at timestamptz not null default now()
  )`);
  await pool.query("insert into hrms_state (id, data) values (1, $1::jsonb) on conflict (id) do nothing", [JSON.stringify(createSeedState())]);
}

async function readState() {
  if (!pool) return developmentState;
  await ensureStore();
  const result = await pool.query("select data from hrms_state where id = 1");
  return result.rows[0]?.data || createSeedState();
}

async function writeState(state) {
  if (!pool) { developmentState = state; return; }
  await ensureStore();
  await pool.query("update hrms_state set data = $1::jsonb, updated_at = now() where id = 1", [JSON.stringify(state)]);
}

function sanitize(state) {
  return {
    ...state,
    accounts: state.accounts.map((item) => ({
      employeeId: item.employeeId,
      loginEnabled: item.loginEnabled,
      accountLocked: item.accountLocked,
      firstLoginPending: item.firstLoginPending,
      passwordResetRequired: item.passwordResetRequired,
      failedAttempts: item.failedAttempts,
      lastLogin: item.lastLogin,
      sessionVersion: item.sessionVersion,
    })),
  };
}

function temporaryPassword() {
  return `Ps!${randomBytes(9).toString("base64url").slice(0, 12)}7`;
}

const EMPLOYEE_COOKIE = "primeserve_employee";
function employeeSecret() { return String(process.env.CMS_SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "primeserve-local-development")); }
function signEmployee(value) { return createHmac("sha256", employeeSecret()).update(value).digest("base64url"); }
function employeeToken(payload) {
  const value = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  return `${value}.${signEmployee(value)}`;
}
function employeeSession(request) {
  const cookies = Object.fromEntries(String(request.headers.cookie || "").split(";").map((part) => part.trim().split("=")));
  const token = cookies[EMPLOYEE_COOKIE];
  if (!token || !employeeSecret()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = signEmployee(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try { const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")); return session.exp > Date.now() ? session : null; } catch { return null; }
}

function audit(state, actor, action, employeeId, detail = "") {
  return [{ id: `audit-${Date.now()}`, actor: actor.email, action, employeeId, detail, createdAt: new Date().toISOString() }, ...(state.auditLogs || [])].slice(0, 500);
}

export async function handleHrmsApi(request, response, pathname) {
  try {
    const state = await readState();

    if (pathname === "/api/hrms/employee/login" && request.method === "POST") {
      const body = await readBody(request);
      const employee = state.employees.find((item) => item.employeeCode.toLowerCase() === String(body.employeeCode || "").trim().toLowerCase() || item.email.toLowerCase() === String(body.employeeCode || "").trim().toLowerCase());
      if (!employee) return sendJson(response, 401, { message: "Invalid employee ID or password." });
      const index = state.accounts.findIndex((item) => item.employeeId === employee.id);
      const account = { ...state.accounts[index] };
      if (!account.loginEnabled) return sendJson(response, 403, { message: "Employee login is disabled. Contact HR." });
      if (account.accountLocked) return sendJson(response, 423, { message: "This account is locked. Contact HR." });
      const valid = account.passwordHash && await bcrypt.compare(String(body.password || ""), account.passwordHash);
      if (!valid) {
        account.failedAttempts = (account.failedAttempts || 0) + 1;
        if (account.failedAttempts >= 5) account.accountLocked = true;
        const accounts = [...state.accounts]; accounts[index] = account; await writeState({ ...state, accounts });
        return sendJson(response, 401, { message: "Invalid employee ID or password." });
      }
      account.failedAttempts = 0; account.lastLogin = new Date().toISOString();
      const accounts = [...state.accounts]; accounts[index] = account; await writeState({ ...state, accounts });
      const cookie = `${EMPLOYEE_COOKIE}=${employeeToken({ employeeId: employee.id, sessionVersion: account.sessionVersion })}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${8 * 60 * 60}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
      return sendJson(response, 200, { employee, passwordResetRequired: account.passwordResetRequired }, { "Set-Cookie": cookie });
    }

    if (pathname === "/api/hrms/employee/logout") return sendJson(response, 200, { ok: true }, { "Set-Cookie": `${EMPLOYEE_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` });

    if (pathname === "/api/hrms/employee/me" && request.method === "GET") {
      const session = employeeSession(request);
      const account = session && state.accounts.find((item) => item.employeeId === session.employeeId);
      if (!session || !account || account.sessionVersion !== session.sessionVersion || !account.loginEnabled || account.accountLocked) return sendJson(response, 401, { message: "Employee sign-in required." });
      const employee = state.employees.find((item) => item.id === session.employeeId);
      return sendJson(response, 200, { employee, passwordResetRequired: account.passwordResetRequired, salarySlips: state.salarySlips.filter((item) => item.employeeId === session.employeeId && item.status === "Published"), form16: state.form16.filter((item) => item.employeeId === session.employeeId && item.status === "Published"), payrollQueries: state.payrollQueries.filter((item) => item.employeeId === session.employeeId), leaveRequests: (state.leaveRequests || []).filter((item) => item.employeeId === session.employeeId), leaveBalance: (state.leaveBalances || []).find((item) => item.employeeId === session.employeeId) || { casual: 0, sick: 0, earned: 0, compensatory: 0 } });
    }

    if (pathname === "/api/hrms/employee/leave-requests" && request.method === "POST") {
      const session = employeeSession(request);
      const account = session && state.accounts.find((item) => item.employeeId === session.employeeId);
      if (!session || !account || account.sessionVersion !== session.sessionVersion || !account.loginEnabled || account.accountLocked) return sendJson(response, 401, { message: "Employee sign-in required." });
      const body = await readBody(request);
      const leaveType = String(body.leaveType || "");
      const fromDate = String(body.fromDate || "");
      const toDate = String(body.toDate || "");
      const reason = String(body.reason || "").trim();
      if (!leaveType || !fromDate || !toDate || !reason) return sendJson(response, 400, { message: "Leave type, dates and reason are required." });
      const from = new Date(`${fromDate}T00:00:00`);
      const to = new Date(`${toDate}T00:00:00`);
      if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || to < from) return sendJson(response, 400, { message: "Select a valid leave date range." });
      const days = Math.floor((to - from) / 86400000) + 1;
      if (days > 31) return sendJson(response, 400, { message: "A single leave request cannot exceed 31 days." });
      const overlap = (state.leaveRequests || []).some((item) => item.employeeId === session.employeeId && !["Rejected", "Cancelled"].includes(item.status) && fromDate <= item.toDate && toDate >= item.fromDate);
      if (overlap) return sendJson(response, 409, { message: "A leave request already exists for the selected dates." });
      const employee = state.employees.find((item) => item.id === session.employeeId);
      const leaveRequest = { id: `leave-${Date.now()}`, employeeId: session.employeeId, leaveType, fromDate, toDate, days, halfDay: Boolean(body.halfDay), contactDuringLeave: String(body.contactDuringLeave || ""), reason, attachmentName: String(body.attachmentName || ""), status: "Pending", appliedOn: new Date().toISOString(), reportingManager: employee?.reportingManager || "", approverRemarks: "" };
      const next = { ...state, leaveRequests: [leaveRequest, ...(state.leaveRequests || [])] };
      next.auditLogs = [{ id: `audit-${Date.now()}`, actor: employee?.email || employee?.employeeCode, action: "LEAVE_REQUEST_SUBMITTED", employeeId: session.employeeId, detail: `${leaveType}: ${fromDate} to ${toDate}`, createdAt: new Date().toISOString() }, ...(next.auditLogs || [])].slice(0, 500);
      await writeState(next);
      return sendJson(response, 201, { leaveRequest, leaveRequests: next.leaveRequests.filter((item) => item.employeeId === session.employeeId), leaveBalance: (next.leaveBalances || []).find((item) => item.employeeId === session.employeeId) });
    }

    if (pathname === "/api/hrms/employee/change-password" && request.method === "POST") {
      const session = employeeSession(request);
      const index = session && state.accounts.findIndex((item) => item.employeeId === session.employeeId);
      if (!session || index < 0) return sendJson(response, 401, { message: "Employee sign-in required." });
      const body = await readBody(request);
      if (String(body.newPassword || "").length < 10) return sendJson(response, 400, { message: "Use at least 10 characters." });
      const account = { ...state.accounts[index], passwordHash: await bcrypt.hash(String(body.newPassword), 12), passwordResetRequired: false, firstLoginPending: false, sessionVersion: state.accounts[index].sessionVersion + 1 };
      const accounts = [...state.accounts]; accounts[index] = account; await writeState({ ...state, accounts });
      return sendJson(response, 200, { ok: true }, { "Set-Cookie": `${EMPLOYEE_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` });
    }

    const adminSession = sessionFromRequest(request);
    if (!adminSession) return sendJson(response, 401, { message: "Admin sign-in required." });
    if (!adminSession.role || !["Super Admin", "HR Admin"].includes(adminSession.role)) return sendJson(response, 403, { message: "HRMS access is not permitted." });

    if (pathname === "/api/hrms" && request.method === "GET") return sendJson(response, 200, { data: sanitize(state) });

    if (pathname === "/api/hrms/employees" && request.method === "POST") {
      const body = await readBody(request);
      const employee = { ...body, id: `emp-${Date.now()}`, employeeCode: String(body.employeeCode || `PS${String(state.employees.length + 1).padStart(4, "0")}`), employmentStatus: body.employmentStatus || "Active" };
      const next = {
        ...state,
        employees: [employee, ...state.employees],
        accounts: [{ employeeId: employee.id, passwordHash: "", loginEnabled: false, accountLocked: false, firstLoginPending: true, passwordResetRequired: true, failedAttempts: 0, lastLogin: null, sessionVersion: 1 }, ...state.accounts],
      };
      next.auditLogs = audit(next, adminSession, "EMPLOYEE_CREATED", employee.id, employee.employeeCode);
      await writeState(next);
      return sendJson(response, 201, { data: sanitize(next) });
    }

    const accessMatch = pathname.match(/^\/api\/hrms\/employees\/([^/]+)\/access$/);
    if (accessMatch && request.method === "POST") {
      const employeeId = decodeURIComponent(accessMatch[1]);
      const body = await readBody(request);
      const accountIndex = state.accounts.findIndex((item) => item.employeeId === employeeId);
      if (accountIndex < 0) return sendJson(response, 404, { message: "Employee account not found." });
      const account = { ...state.accounts[accountIndex] };
      let generatedPassword = null;
      const action = String(body.action || "");
      if (action === "generate-temporary-password" || action === "reset-password") {
        generatedPassword = temporaryPassword();
        account.passwordHash = await bcrypt.hash(generatedPassword, 12);
        account.passwordResetRequired = true;
        account.firstLoginPending = true;
        account.failedAttempts = 0;
        account.accountLocked = false;
        account.sessionVersion += 1;
      } else if (action === "enable-login") account.loginEnabled = true;
      else if (action === "disable-login") { account.loginEnabled = false; account.sessionVersion += 1; }
      else if (action === "lock-account") { account.accountLocked = true; account.sessionVersion += 1; }
      else if (action === "unlock-account") { account.accountLocked = false; account.failedAttempts = 0; }
      else if (action === "force-password-change") account.passwordResetRequired = true;
      else if (action === "sign-out-all-sessions") account.sessionVersion += 1;
      else return sendJson(response, 400, { message: "Unknown login access action." });
      const accounts = [...state.accounts];
      accounts[accountIndex] = account;
      const next = { ...state, accounts };
      next.auditLogs = audit(next, adminSession, action.toUpperCase().replaceAll("-", "_"), employeeId);
      await writeState(next);
      return sendJson(response, 200, { data: sanitize(next), ...(generatedPassword ? { temporaryPassword: generatedPassword, oneTimeDisplay: true } : {}) });
    }

    if (pathname === "/api/hrms/state" && request.method === "PUT") {
      const body = await readBody(request, 12 * 1024 * 1024);
      const safeKeys = ["salaryStructures", "payrollRuns", "salarySlips", "form16", "payrollQueries", "leaveRequests", "leaveBalances"];
      const next = { ...state };
      safeKeys.forEach((key) => { if (Array.isArray(body[key])) next[key] = body[key]; });
      next.auditLogs = audit(next, adminSession, "HRMS_STATE_UPDATED", "system");
      await writeState(next);
      return sendJson(response, 200, { data: sanitize(next) });
    }

    const workflowMatch = pathname.match(/^\/api\/hrms\/workflows\/([a-z0-9-]+)(?:\/([^/]+))?$/);
    if (workflowMatch) {
      const moduleKey = workflowMatch[1];
      const recordId = workflowMatch[2] ? decodeURIComponent(workflowMatch[2]) : null;
      const allowedModules = new Set([
        "departments", "designations", "reporting", "employee-documents", "statutory",
        "attendance", "leave-credits", "leave-policies", "holidays", "field-duty", "regularization",
        "reimbursements", "conveyance", "payroll-reports", "letter-templates", "offer-letters",
        "appointment-letters", "confirmation-letters", "promotion-letters", "increment-letters",
        "salary-revision-letters", "experience-letters", "relieving-letters", "other-documents",
        "visiting-cards", "id-cards", "hr-requests", "organization-updates", "policies", "announcements",
        "leave-approvals", "field-duty-approvals", "reimbursement-approvals", "profile-approvals",
        "visiting-card-approvals", "document-approvals", "roles", "system-login-access",
        "notifications", "settings"
      ]);
      if (!allowedModules.has(moduleKey)) return sendJson(response, 404, { message: "Unknown HRMS module." });

      if (request.method === "GET") {
        const url = new URL(request.url, "http://localhost");
        const search = String(url.searchParams.get("search") || "").toLowerCase();
        const status = String(url.searchParams.get("status") || "");
        const page = Math.max(1, Number(url.searchParams.get("page") || 1));
        const pageSize = Math.min(100, Math.max(5, Number(url.searchParams.get("pageSize") || 10)));
        let rows = (state.workflowRecords || []).filter((item) => item.module === moduleKey && !item.deletedAt);
        if (search) rows = rows.filter((item) => JSON.stringify(item).toLowerCase().includes(search));
        if (status) rows = rows.filter((item) => item.status === status);
        rows.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
        return sendJson(response, 200, { rows: rows.slice((page - 1) * pageSize, page * pageSize), total: rows.length, page, pageSize });
      }

      if (request.method === "POST" && !recordId) {
        const body = await readBody(request);
        const title = String(body.title || "").trim();
        if (title.length < 2 || title.length > 160) return sendJson(response, 400, { message: "Enter a title between 2 and 160 characters." });
        const now = new Date().toISOString();
        const record = { id: `wf-${Date.now()}-${randomBytes(3).toString("hex")}`, module: moduleKey, title, employeeId: String(body.employeeId || ""), effectiveDate: String(body.effectiveDate || ""), amount: Number(body.amount || 0), description: String(body.description || "").trim().slice(0, 4000), status: String(body.status || "Draft"), createdBy: adminSession.email, createdAt: now, updatedAt: now };
        const next = { ...state, workflowRecords: [record, ...(state.workflowRecords || [])] };
        next.auditLogs = audit(next, adminSession, `${moduleKey.toUpperCase().replaceAll("-", "_")}_CREATED`, record.employeeId || record.id, record.title);
        await writeState(next);
        return sendJson(response, 201, { record });
      }

      if (request.method === "PUT" && recordId) {
        const body = await readBody(request);
        const index = (state.workflowRecords || []).findIndex((item) => item.id === recordId && item.module === moduleKey && !item.deletedAt);
        if (index < 0) return sendJson(response, 404, { message: "Record not found." });
        const records = [...state.workflowRecords];
        records[index] = { ...records[index], ...(body.title !== undefined ? { title: String(body.title).trim().slice(0, 160) } : {}), ...(body.description !== undefined ? { description: String(body.description).trim().slice(0, 4000) } : {}), ...(body.status !== undefined ? { status: String(body.status) } : {}), ...(body.effectiveDate !== undefined ? { effectiveDate: String(body.effectiveDate) } : {}), ...(body.amount !== undefined ? { amount: Number(body.amount || 0) } : {}), updatedAt: new Date().toISOString() };
        const next = { ...state, workflowRecords: records };
        next.auditLogs = audit(next, adminSession, `${moduleKey.toUpperCase().replaceAll("-", "_")}_UPDATED`, records[index].employeeId || recordId, records[index].status);
        await writeState(next);
        return sendJson(response, 200, { record: records[index] });
      }

      if (request.method === "DELETE" && recordId) {
        const index = (state.workflowRecords || []).findIndex((item) => item.id === recordId && item.module === moduleKey && !item.deletedAt);
        if (index < 0) return sendJson(response, 404, { message: "Record not found." });
        const records = [...state.workflowRecords]; records[index] = { ...records[index], deletedAt: new Date().toISOString(), deletedBy: adminSession.email };
        const next = { ...state, workflowRecords: records };
        next.auditLogs = audit(next, adminSession, `${moduleKey.toUpperCase().replaceAll("-", "_")}_DELETED`, recordId, records[index].title);
        await writeState(next);
        return sendJson(response, 200, { ok: true });
      }
    }

    const leaveMatch = pathname.match(/^\/api\/hrms\/leave-requests\/([^/]+)$/);
    if (leaveMatch && request.method === "POST") {
      const body = await readBody(request);
      const allowed = ["Approved", "Rejected", "Cancelled", "Pending"];
      if (!allowed.includes(body.status)) return sendJson(response, 400, { message: "Invalid leave status." });
      const requestIndex = (state.leaveRequests || []).findIndex((item) => item.id === decodeURIComponent(leaveMatch[1]));
      if (requestIndex < 0) return sendJson(response, 404, { message: "Leave request not found." });
      const leaveRequests = [...state.leaveRequests];
      const previous = leaveRequests[requestIndex];
      leaveRequests[requestIndex] = { ...previous, status: body.status, approverRemarks: String(body.remarks || ""), reviewedOn: new Date().toISOString(), reviewedBy: adminSession.email };
      const leaveBalances = [...(state.leaveBalances || [])];
      if (body.status === "Approved" && previous.status !== "Approved") {
        const balanceIndex = leaveBalances.findIndex((item) => item.employeeId === previous.employeeId);
        const balanceKey = { "Casual Leave": "casual", "Sick Leave": "sick", "Earned Leave": "earned", "Compensatory Off": "compensatory" }[previous.leaveType];
        if (balanceIndex >= 0 && balanceKey) leaveBalances[balanceIndex] = { ...leaveBalances[balanceIndex], [balanceKey]: Math.max(0, Number(leaveBalances[balanceIndex][balanceKey] || 0) - Number(previous.days || 0)) };
      }
      const next = { ...state, leaveRequests, leaveBalances };
      next.auditLogs = audit(next, adminSession, `LEAVE_${body.status.toUpperCase()}`, previous.employeeId, previous.id);
      await writeState(next);
      return sendJson(response, 200, { data: sanitize(next) });
    }

    return sendJson(response, 404, { message: "HRMS endpoint not found." });
  } catch (error) {
    return sendJson(response, 500, { message: error.message || "HRMS request failed." });
  }
}
