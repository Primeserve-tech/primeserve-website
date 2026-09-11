import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

const navigationGroups = [
  ["Employee Management", [
    ["dashboard", "HR Dashboard"], ["employees", "Employees"], ["departments", "Departments"], ["designations", "Designations"], ["reporting", "Reporting Structure"], ["login-access", "Employee Login Access"], ["employee-documents", "Employee Documents"], ["statutory", "Bank & Statutory Details"],
  ]],
  ["Attendance & Leave", [
    ["attendance", "Attendance"], ["leave-requests", "Leave Requests"], ["leave-credits", "Leave Credits"], ["leave-policies", "Leave Policies"], ["holidays", "Holiday Calendar"], ["field-duty", "Field Duty"], ["regularization", "Attendance Regularization"],
  ]],
  ["Payroll & Tax", [
    ["payroll", "Payroll Dashboard"], ["salary-structure", "Salary Structure"], ["monthly-payroll", "Monthly Payroll"], ["salary-slips", "Salary Slips"], ["form-16", "Form 16"], ["reimbursements", "Reimbursements"], ["conveyance", "Conveyance Claims"], ["payroll-reports", "Payroll Reports"],
  ]],
  ["Letters & Documents", [
    ["letter-templates", "Letter Templates"], ["offer-letters", "Offer Letters"], ["appointment-letters", "Appointment Letters"], ["confirmation-letters", "Confirmation Letters"], ["promotion-letters", "Promotion Letters"], ["increment-letters", "Increment Letters"], ["salary-revision-letters", "Salary Revision Letters"], ["experience-letters", "Experience Letters"], ["relieving-letters", "Relieving Letters"], ["other-documents", "Other Documents"],
  ]],
  ["Employee Services", [
    ["visiting-cards", "Visiting Card Requests"], ["id-cards", "ID Card Requests"], ["hr-requests", "HR Requests"], ["payroll-queries", "Payroll Queries"], ["organization-updates", "Organization Updates"], ["policies", "Policies"], ["announcements", "Announcements"],
  ]],
  ["Approvals", [
    ["leave-approvals", "Leave Approvals"], ["field-duty-approvals", "Field Duty Approvals"], ["reimbursement-approvals", "Reimbursement Approvals"], ["profile-approvals", "Profile Change Approvals"], ["visiting-card-approvals", "Visiting Card Approvals"], ["document-approvals", "Document Approvals"],
  ]],
  ["System & Control", [
    ["roles", "Roles & Permissions"], ["system-login-access", "Login Access"], ["notifications", "Notifications"], ["audit-logs", "Audit Logs"], ["settings", "HRMS Settings"],
  ]],
];

const pageDescriptions = Object.fromEntries(navigationGroups.flatMap(([, items]) => items.map(([key, label]) => [key, {
  title: label,
  description: `Manage ${label.toLowerCase()} through a controlled, auditable HR workflow.`,
}])));

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));

function Status({ children }) {
  const key = String(children || "").toLowerCase().replaceAll(" ", "-");
  return <span className={`hr-status hr-status-${key}`}>{children}</span>;
}

function PageHeader({ title, description, actions }) {
  return <header className="hr-page-header"><div><span>Employee &amp; HR Management</span><h2>{title}</h2><p>{description}</p></div>{actions && <div className="hr-page-actions">{actions}</div>}</header>;
}

function WorkflowPage({ page, employees, onToast }) {
  const info = pageDescriptions[page] || { title: "HR Workspace", description: "Manage HR records." };
  const [rows, setRows] = useState([]), [search, setSearch] = useState(""), [status, setStatus] = useState("");
  const [pageNumber, setPageNumber] = useState(1), [total, setTotal] = useState(0), [loading, setLoading] = useState(true), [showForm, setShowForm] = useState(false);
  const pageSize = 10;
  const load = async () => { setLoading(true); const params = new URLSearchParams({ search, status, page: String(pageNumber), pageSize: String(pageSize) }); const response = await fetch(`/api/hrms/workflows/${page}?${params}`, { credentials: "same-origin" }); const payload = await response.json(); if (response.ok) { setRows(payload.rows); setTotal(payload.total); } else onToast(payload.message || "Unable to load records."); setLoading(false); };
  useEffect(() => { const timer = setTimeout(load, 180); return () => clearTimeout(timer); }, [page, search, status, pageNumber]); // eslint-disable-line react-hooks/exhaustive-deps
  const create = async (event) => { event.preventDefault(); const body = Object.fromEntries(new FormData(event.currentTarget)); const response = await fetch(`/api/hrms/workflows/${page}`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(body) }); const payload = await response.json(); if (!response.ok) return onToast(payload.message || "Unable to create record."); setShowForm(false); setPageNumber(1); await load(); onToast(`${info.title} record created.`); };
  const updateStatus = async (row, nextStatus) => { const response = await fetch(`/api/hrms/workflows/${page}/${encodeURIComponent(row.id)}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ status: nextStatus }) }); const payload = await response.json(); if (!response.ok) return onToast(payload.message || "Unable to update record."); await load(); onToast(`Status updated to ${nextStatus}.`); };
  const remove = async (row) => { if (!window.confirm(`Delete “${row.title}”? This is a recoverable soft delete.`)) return; const response = await fetch(`/api/hrms/workflows/${page}/${encodeURIComponent(row.id)}`, { method: "DELETE", credentials: "same-origin" }); const payload = await response.json(); if (!response.ok) return onToast(payload.message || "Unable to delete record."); await load(); onToast("Record deleted."); };
  const exportCsv = () => { const csv = [["Title", "Employee", "Effective Date", "Amount", "Status", "Updated"], ...rows.map((row) => [row.title, employees.find((item) => item.id === row.employeeId)?.name || "", row.effectiveDate || "", row.amount || 0, row.status, row.updatedAt])].map((cells) => cells.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n"); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); link.download = `${page}-export.csv`; link.click(); URL.revokeObjectURL(link.href); };
  return <><PageHeader {...info} actions={<button type="button" onClick={() => setShowForm(true)}>+ Add Record</button>} /><section className="hr-panel"><div className="hr-filters"><input value={search} onChange={(event) => { setSearch(event.target.value); setPageNumber(1); }} placeholder={`Search ${info.title.toLowerCase()}…`} /><select value={status} onChange={(event) => { setStatus(event.target.value); setPageNumber(1); }}><option value="">All Statuses</option>{["Draft", "Pending", "Under Review", "Approved", "Published", "Completed", "Rejected", "Inactive"].map((item) => <option key={item}>{item}</option>)}</select><button className="secondary" type="button" onClick={exportCsv} disabled={!rows.length}>Export CSV</button></div>{loading ? <div className="hr-loading">Loading records…</div> : rows.length ? <><div className="hr-table-wrap"><table><thead><tr><th>Title</th><th>Employee</th><th>Effective Date</th><th>Amount</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.title}</strong><small>{row.description || "No description"}</small></td><td>{employees.find((item) => item.id === row.employeeId)?.name || "All / Not applicable"}</td><td>{row.effectiveDate || "—"}</td><td>{row.amount ? money(row.amount) : "—"}</td><td><Status>{row.status}</Status></td><td>{new Date(row.updatedAt).toLocaleDateString("en-IN")}</td><td><select aria-label={`Update ${row.title}`} value="" onChange={(event) => { if (event.target.value === "delete") remove(row); else if (event.target.value) updateStatus(row, event.target.value); }}><option value="" disabled>Actions</option><option value="Under Review">Send for review</option><option value="Approved">Approve</option><option value="Published">Publish</option><option value="Completed">Complete</option><option value="Rejected">Reject</option><option value="delete">Delete</option></select></td></tr>)}</tbody></table></div><div className="hr-pagination"><span>{total} record{total === 1 ? "" : "s"}</span><button className="secondary" disabled={pageNumber === 1} onClick={() => setPageNumber((value) => value - 1)}>Previous</button><strong>Page {pageNumber}</strong><button className="secondary" disabled={pageNumber * pageSize >= total} onClick={() => setPageNumber((value) => value + 1)}>Next</button></div></> : <div className="hr-empty-state"><b>✓</b><h3>No {info.title.toLowerCase()} records</h3><p>Create the first controlled record. Changes are validated and written to the audit log.</p><button onClick={() => setShowForm(true)}>Create first record</button></div>}</section>{showForm && <div className="hr-modal-backdrop"><form className="hr-form-modal" onSubmit={create}><button type="button" className="hr-modal-close" onClick={() => setShowForm(false)}>×</button><h2>Add {info.title} record</h2><p>Complete the relevant fields. The record remains auditable throughout its workflow.</p><div className="hr-form-grid"><label className="wide">Title<input name="title" minLength="2" maxLength="160" required /></label><label>Employee<select name="employeeId"><option value="">All / Not applicable</option>{employees.map((employee) => <option value={employee.id} key={employee.id}>{employee.employeeCode} · {employee.name}</option>)}</select></label><label>Effective Date<input name="effectiveDate" type="date" /></label><label>Amount<input name="amount" type="number" min="0" step="0.01" /></label><label>Status<select name="status"><option>Draft</option><option>Pending</option><option>Under Review</option><option>Approved</option></select></label><label className="wide">Description<textarea name="description" rows="4" maxLength="4000" /></label></div><button className="hr-modal-primary">Save Record</button></form></div>}</>;
}

function HrDashboard({ data }) {
  const active = data.employees.filter((employee) => employee.employmentStatus === "Active").length;
  const cards = [
    ["Total Employees", data.employees.length], ["Active Employees", active], ["Inactive Employees", data.employees.length - active], ["New Joiners", 1], ["On Leave Today", 2], ["Pending Leave Approvals", 4], ["Pending Field Duty", 2], ["Pending Reimbursements", 3], ["Payroll Pending", 0], ["Salary Slips Published", data.salarySlips.filter((item) => item.status === "Published").length], ["Form 16 Published", data.form16.filter((item) => item.status === "Published").length], ["Visiting Card Requests", 2],
  ];
  const departments = Object.entries(data.employees.reduce((acc, employee) => ({ ...acc, [employee.department]: (acc[employee.department] || 0) + 1 }), {}));
  return <>
    <PageHeader title="HR Dashboard" description="A concise overview of workforce activity, payroll readiness and approvals requiring attention." actions={<button type="button">Export Summary</button>} />
    <div className="hr-kpi-grid">{cards.map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>View details →</small></article>)}</div>
    <div className="hr-dashboard-grid">
      <section className="hr-panel"><h3>Department-wise employee count</h3>{departments.map(([name, count]) => <div className="hr-progress-row" key={name}><span>{name}</span><div><i style={{ width: `${Math.max(22, count / data.employees.length * 100)}%` }} /></div><strong>{count}</strong></div>)}</section>
      <section className="hr-panel"><h3>Pending approvals</h3>{[["Leave requests", 4], ["Field duty", 2], ["Reimbursements", 3], ["Profile changes", 1]].map(([label, value]) => <button className="hr-list-action" key={label}><span>{label}</span><strong>{value}</strong></button>)}</section>
      <section className="hr-panel"><h3>Upcoming milestones</h3><div className="hr-person-row"><b>AS</b><span><strong>Aarav Sharma</strong><small>Birthday · 08 August</small></span></div><div className="hr-person-row"><b>MI</b><span><strong>Meera Iyer</strong><small>Work anniversary · 03 September</small></span></div></section>
      <section className="hr-panel"><h3>Recent HR activities</h3>{(data.auditLogs || []).slice(0, 4).map((log) => <div className="hr-activity" key={log.id}><i /><span><strong>{log.action.replaceAll("_", " ")}</strong><small>{new Date(log.createdAt).toLocaleString("en-IN")}</small></span></div>)}{!data.auditLogs?.length && <p>No recent administrative changes.</p>}</section>
    </div>
  </>;
}

function EmployeesPage({ data, onAdd, onAccess }) {
  const [query, setQuery] = useState("");
  const rows = data.employees.filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase()));
  return <>
    <PageHeader title="Employees" description="Manage employee profiles, employment records, reporting relationships and account access." actions={<button type="button" onClick={onAdd}>+ Add Employee</button>} />
    <section className="hr-panel"><div className="hr-filters"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by employee, code, department…" /><select><option>All Departments</option></select><select><option>All Statuses</option></select><button type="button" className="secondary">Export</button></div>
      <div className="hr-table-wrap"><table><thead><tr><th>Employee</th><th>Department</th><th>Designation</th><th>Reporting Manager</th><th>Joining Date</th><th>Status</th><th>Login</th><th>Actions</th></tr></thead><tbody>{rows.map((employee) => { const account = data.accounts.find((item) => item.employeeId === employee.id); return <tr key={employee.id}><td><strong>{employee.name}</strong><small>{employee.employeeCode}</small></td><td>{employee.department}</td><td>{employee.designation}</td><td>{employee.reportingManager}</td><td>{employee.joiningDate}</td><td><Status>{employee.employmentStatus}</Status></td><td><Status>{account?.loginEnabled ? "Enabled" : "Disabled"}</Status></td><td><button className="hr-more" title="Employee actions">•••</button><button className="hr-link-button" onClick={() => onAccess(employee.id)}>Login Access</button></td></tr>; })}</tbody></table></div>
    </section>
  </>;
}

function LoginAccessPage({ data, onAction }) {
  return <>
    <PageHeader title="Employee Login Access" description="Control employee sign-in without exposing or storing readable passwords." actions={<button type="button" className="secondary">Export Access Report</button>} />
    <div className="hr-security-note"><strong>Security enforced</strong><span>Existing passwords cannot be viewed or retrieved. Password resets create a one-time temporary password and store only its bcrypt hash.</span></div>
    <section className="hr-panel"><div className="hr-table-wrap"><table><thead><tr><th>Employee</th><th>Login</th><th>Account Status</th><th>First Login</th><th>Last Login</th><th>Failed</th><th>Reset Required</th><th>Actions</th></tr></thead><tbody>{data.employees.map((employee) => { const account = data.accounts.find((item) => item.employeeId === employee.id) || {}; return <tr key={employee.id}><td><strong>{employee.name}</strong><small>{employee.employeeCode}</small></td><td><Status>{account.loginEnabled ? "Enabled" : "Disabled"}</Status></td><td><Status>{account.accountLocked ? "Locked" : "Active"}</Status></td><td>{account.firstLoginPending ? "Pending" : "Completed"}</td><td>{account.lastLogin ? new Date(account.lastLogin).toLocaleString("en-IN") : "Never"}</td><td>{account.failedAttempts || 0}</td><td>{account.passwordResetRequired ? "Yes" : "No"}</td><td><select aria-label={`Actions for ${employee.name}`} defaultValue="" onChange={(event) => { if (event.target.value) onAction(employee, event.target.value); event.target.value = ""; }}><option value="" disabled>Choose action</option><option value={account.loginEnabled ? "disable-login" : "enable-login"}>{account.loginEnabled ? "Disable Login" : "Enable Login"}</option><option value={account.accountLocked ? "unlock-account" : "lock-account"}>{account.accountLocked ? "Unlock Account" : "Lock Account"}</option><option value="generate-temporary-password">Generate Temporary Password</option><option value="reset-password">Reset Password</option><option value="force-password-change">Force Password Change</option><option value="sign-out-all-sessions">Sign Out All Sessions</option></select></td></tr>; })}</tbody></table></div></section>
  </>;
}

function LeaveRequestsPage({ data, onReview }) {
  const [status, setStatus] = useState("");
  const rows = (data.leaveRequests || []).filter((item) => !status || item.status === status);
  return <><PageHeader title="Leave Requests" description="Review employee leave applications, balances and reporting-manager recommendations." actions={<button type="button" className="secondary">Export Leave Report</button>} /><div className="hr-kpi-grid">{[["Pending", (data.leaveRequests || []).filter((item) => item.status === "Pending").length], ["Approved This Month", (data.leaveRequests || []).filter((item) => item.status === "Approved").length], ["Rejected", (data.leaveRequests || []).filter((item) => item.status === "Rejected").length], ["Employees on Leave Today", 0]].map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div><section className="hr-panel"><div className="hr-filters"><input placeholder="Search employee or leave type…" /><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All Statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option></select><select><option>All Leave Types</option><option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option></select></div><div className="hr-table-wrap"><table><thead><tr><th>Employee</th><th>Leave Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Reporting Manager</th><th>Applied On</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((request) => { const employee = data.employees.find((item) => item.id === request.employeeId); return <tr key={request.id}><td><strong>{employee?.name}</strong><small>{employee?.employeeCode}</small></td><td>{request.leaveType}</td><td>{request.fromDate}<small>to {request.toDate}</small></td><td>{request.days}</td><td className="hr-reason-cell">{request.reason}</td><td>{request.reportingManager || employee?.reportingManager}</td><td>{new Date(request.appliedOn).toLocaleDateString("en-IN")}</td><td><Status>{request.status}</Status></td><td>{request.status === "Pending" ? <div className="hr-inline-actions"><button onClick={() => onReview(request, "Approved")}>Approve</button><button className="danger" onClick={() => onReview(request, "Rejected")}>Reject</button></div> : <button className="hr-link-button">View</button>}</td></tr>; })}</tbody></table></div>{!rows.length && <div className="hr-empty-state"><b>✓</b><h3>No leave requests found</h3><p>Employee leave applications will appear here immediately after submission.</p></div>}</section></>;
}

function PayrollDashboard({ data, setPage }) {
  const run = data.payrollRuns[0] || {};
  return <><PageHeader title="Payroll Dashboard" description="Review payroll readiness, approvals, documents and statutory deliverables." actions={<button onClick={() => setPage("monthly-payroll")}>Process Payroll</button>} /><div className="hr-kpi-grid payroll">{[["Current Period", `${run.month || "—"} ${run.year || ""}`], ["Payroll Status", run.status || "Not Started"], ["Eligible Employees", run.employees || 0], ["Gross Payroll", money(run.gross)], ["Net Pay", money(run.netPay)], ["Salary Slips", data.salarySlips.length], ["Form 16 Documents", data.form16.length], ["Open Queries", data.payrollQueries.filter((item) => item.status !== "Closed").length]].map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div><div className="hr-dashboard-grid"><section className="hr-panel"><h3>Payroll workflow</h3>{["Attendance imported", "Leave and LWP reviewed", "Earnings and deductions calculated", "Payroll approved", "Salary slips published"].map((label, index) => <div className="hr-check-row" key={label}><b>{index < 5 ? "✓" : index + 1}</b><span>{label}</span></div>)}</section><section className="hr-panel"><h3>Quick actions</h3><button className="hr-list-action" onClick={() => setPage("salary-structure")}><span>Salary Structure</span><b>→</b></button><button className="hr-list-action" onClick={() => setPage("salary-slips")}><span>Salary Slips</span><b>→</b></button><button className="hr-list-action" onClick={() => setPage("form-16")}><span>Form 16</span><b>→</b></button></section></div></>;
}

const earningsFields = ["Basic Salary", "House Rent Allowance", "Special Allowance", "Conveyance Allowance", "Medical Allowance", "Telephone/Internet Allowance", "Other Allowance", "Bonus", "Incentive", "Arrears", "Reimbursement", "Other Earnings"];
const deductionFields = ["Provident Fund", "Employee State Insurance", "Professional Tax", "TDS", "Labour Welfare Fund", "Loan/Advance Deduction", "Leave Without Pay", "Notice Pay", "Other Deductions"];
const employerFields = ["Employer PF", "Employer ESIC", "Gratuity", "Bonus Provision", "Insurance", "Other Employer Contribution"];

function SalaryStructure({ data, onSave }) {
  const [employeeId, setEmployeeId] = useState(data.employees[0]?.id || "");
  const [values, setValues] = useState({});
  const sum = (fields) => fields.reduce((total, name) => total + Number(values[name] || 0), 0);
  const gross = sum(earningsFields), deductions = sum(deductionFields), employer = sum(employerFields);
  const update = (name, value) => setValues((current) => ({ ...current, [name]: value }));
  return <><PageHeader title="Salary Structure" description="Configure employee earnings, deductions, employer contributions and effective salary revisions." actions={<button onClick={() => onSave({ id: `salary-${Date.now()}`, employeeId, effectiveFrom: values.effectiveFrom, values, gross, deductions, employer, netPay: gross - deductions, status: "Draft" })}>Save Salary Structure</button>} /><section className="hr-panel hr-salary-form"><div className="hr-form-grid"><label>Employee<select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>{data.employees.map((employee) => <option value={employee.id} key={employee.id}>{employee.employeeCode} · {employee.name}</option>)}</select></label><label>Effective From<input type="date" value={values.effectiveFrom || ""} onChange={(e) => update("effectiveFrom", e.target.value)} /></label><label>Annual CTC<input type="number" value={values.annualCtc || ""} onChange={(e) => update("annualCtc", e.target.value)} /></label><label>Approval Status<select><option>Draft</option><option>Under Review</option><option>Approved</option></select></label></div>{[["Earnings", earningsFields], ["Deductions", deductionFields], ["Employer Contributions", employerFields]].map(([title, fields]) => <fieldset key={title}><legend>{title}</legend><div className="hr-form-grid">{fields.map((field) => <label key={field}>{field}<input type="number" min="0" value={values[field] || ""} onChange={(e) => update(field, e.target.value)} /></label>)}</div></fieldset>)}<div className="hr-calculation-strip"><span>Gross Earnings<strong>{money(gross)}</strong></span><span>Total Deductions<strong>{money(deductions)}</strong></span><span>Net Pay<strong>{money(gross - deductions)}</strong></span><span>Employer Contribution<strong>{money(employer)}</strong></span><span>Monthly CTC<strong>{money(gross + employer)}</strong></span></div></section></>;
}

function MonthlyPayroll({ data, onSave }) {
  const [status, setStatus] = useState("Draft");
  const transitions = ["Draft", "Processing", "Under Review", "Approved", "Locked", "Published"];
  const current = transitions.indexOf(status);
  return <><PageHeader title="Monthly Payroll" description="Process attendance-linked payroll through review, approval, locking and publication." actions={<><button className="secondary">Import Attendance</button><button onClick={() => { const next = transitions[Math.min(current + 1, transitions.length - 1)]; setStatus(next); onSave(next); }} disabled={status === "Published"}>{status === "Draft" ? "Start Processing" : status === "Locked" ? "Publish Salary Slips" : "Move to Next Stage"}</button></>} /><section className="hr-panel"><div className="hr-period-bar"><label>Payroll Month<select><option>July</option><option>August</option></select></label><label>Year<select><option>2026</option></select></label><Status>{status}</Status></div><div className="hr-stepper">{transitions.map((step, index) => <div className={index <= current ? "complete" : ""} key={step}><b>{index < current ? "✓" : index + 1}</b><span>{step}</span></div>)}</div><div className="hr-table-wrap"><table><thead><tr><th>Employee</th><th>Payable Days</th><th>Paid Days</th><th>LWP</th><th>Gross</th><th>Deductions</th><th>Net Pay</th><th>Review</th></tr></thead><tbody>{data.employees.filter((item) => item.employmentStatus === "Active").map((employee, index) => <tr key={employee.id}><td><strong>{employee.name}</strong><small>{employee.employeeCode}</small></td><td>31</td><td>{31 - index}</td><td>{index}</td><td>{money(70000 + index * 7500)}</td><td>{money(8500 + index * 1000)}</td><td>{money(61500 + index * 6500)}</td><td><Status>Ready</Status></td></tr>)}</tbody></table></div>{status === "Locked" && <div className="hr-lock-note">🔒 This payroll period is locked. An authorized unlock action and audit entry are required before editing.</div>}</section></>;
}

function downloadSalarySlip(slip, employee) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFillColor(4, 34, 72); doc.rect(0, 0, 210, 38, "F");
  doc.setTextColor(255, 193, 7); doc.setFontSize(18); doc.text("PRIMESERVE", 15, 16);
  doc.setTextColor(255, 255, 255); doc.setFontSize(11); doc.text("Primeserve Global Solution Private Limited", 15, 25); doc.text(`Salary Slip for ${slip.month} ${slip.year}`, 195, 25, { align: "right" });
  doc.setTextColor(20, 45, 75); doc.setFontSize(9); doc.text("Registered & Corporate Office: Greater Noida, Gautam Buddha Nagar, Uttar Pradesh 201306", 15, 47); doc.text("CIN: U62011UW2026PTC253187", 15, 53);
  const details = [["Employee Name", employee.name], ["Employee Code", employee.employeeCode], ["Designation", employee.designation], ["Department", employee.department], ["Date of Joining", employee.joiningDate], ["Work Location", employee.workLocation], ["PAN", employee.pan], ["UAN", employee.uan], ["Bank Name", employee.bankName], ["Bank Account", employee.bankAccountMasked], ["Payable Days", "31"], ["Paid Days", "31"]];
  let y = 64; details.forEach(([label, value], index) => { const x = index % 2 ? 112 : 15; if (index && index % 2 === 0) y += 9; doc.setFont(undefined, "bold"); doc.text(`${label}:`, x, y); doc.setFont(undefined, "normal"); doc.text(String(value || "—"), x + 34, y); });
  y += 15; doc.setFillColor(235, 242, 250); doc.rect(15, y, 180, 9, "F"); doc.setFont(undefined, "bold"); doc.text("EARNINGS", 20, y + 6); doc.text("DEDUCTIONS", 112, y + 6); y += 17;
  const earn = [["Basic Salary", slip.gross * .5], ["House Rent Allowance", slip.gross * .2], ["Special Allowance", slip.gross * .3], ["Gross Earnings", slip.gross]];
  const deduct = [["Provident Fund", slip.deductions * .55], ["Professional Tax", 200], ["TDS", slip.deductions * .45 - 200], ["Total Deductions", slip.deductions]];
  for (let i = 0; i < 4; i += 1) { doc.setFont(undefined, i === 3 ? "bold" : "normal"); doc.text(earn[i][0], 20, y); doc.text(money(earn[i][1]), 96, y, { align: "right" }); doc.text(deduct[i][0], 112, y); doc.text(money(deduct[i][1]), 190, y, { align: "right" }); y += 9; }
  y += 5; doc.setFillColor(255, 247, 214); doc.rect(15, y, 180, 20, "F"); doc.setFontSize(11); doc.text("Net Pay", 20, y + 8); doc.setFontSize(16); doc.text(money(slip.netPay), 190, y + 9, { align: "right" }); doc.setFontSize(9); doc.text("Net Pay in Words: Rupees Sixty-Three Thousand Three Hundred Sixty Only", 20, y + 16);
  doc.setFont(undefined, "normal"); doc.setTextColor(90, 100, 115); doc.text("This is a computer-generated salary slip and does not require a physical signature.", 105, 282, { align: "center" });
  doc.save(`Salary_Slip_${employee.employeeCode}_${slip.month}_${slip.year}.pdf`);
}

function SalarySlips({ data, onUpdate }) {
  return <><PageHeader title="Salary Slips" description="Generate, publish and manage monthly employee salary slips." actions={<><button>Generate Salary Slips</button><button className="secondary">Upload Salary Slips</button><button className="secondary">Export Report</button></>} /><section className="hr-panel"><div className="hr-filters"><select><option>July 2026</option></select><select><option>All Departments</option></select><input placeholder="Search employee…" /><button className="secondary">Bulk Download ZIP</button></div><div className="hr-table-wrap"><table><thead><tr><th>Payroll Month</th><th>Employee</th><th>Department</th><th>Gross Earnings</th><th>Deductions</th><th>Net Pay</th><th>Status</th><th>Published</th><th>Actions</th></tr></thead><tbody>{data.salarySlips.map((slip) => { const employee = data.employees.find((item) => item.id === slip.employeeId); return <tr key={slip.id}><td>{slip.month} {slip.year}</td><td><strong>{employee?.name}</strong><small>{employee?.employeeCode}</small></td><td>{employee?.department}</td><td>{money(slip.gross)}</td><td>{money(slip.deductions)}</td><td><strong>{money(slip.netPay)}</strong></td><td><Status>{slip.status}</Status></td><td>{slip.publishedDate || "—"}</td><td><button className="hr-link-button" onClick={() => downloadSalarySlip(slip, employee)}>Download PDF</button><button className="hr-more" onClick={() => onUpdate(slip)}>•••</button></td></tr>; })}</tbody></table></div></section></>;
}

function Form16Page({ data, onUpload, onTogglePublish }) {
  const [employeeId, setEmployeeId] = useState(data.employees[0]?.id || "");
  const [financialYear, setFinancialYear] = useState("2025-26");
  return <><PageHeader title="Form 16" description="Upload, map, publish and maintain versioned Form 16 documents securely." actions={<><label className="hr-upload-button">Upload Form 16<input type="file" accept="application/pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(file, employeeId, financialYear); event.target.value = ""; }} /></label><button className="secondary">Bulk Upload</button></>} /><section className="hr-panel"><div className="hr-filters"><select value={financialYear} onChange={(event) => setFinancialYear(event.target.value)}><option>2025-26</option><option>2026-27</option></select><select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>{data.employees.map((employee) => <option value={employee.id} key={employee.id}>{employee.employeeCode} · {employee.name}</option>)}</select><input placeholder="Search employee code or PAN…" /><button className="secondary">Notify Employees</button></div><div className="hr-table-wrap"><table><thead><tr><th>Financial Year</th><th>Employee</th><th>PAN</th><th>Uploaded</th><th>Published</th><th>Status</th><th>Downloaded</th><th>Version</th><th>Actions</th></tr></thead><tbody>{data.form16.map((item) => { const employee = data.employees.find((entry) => entry.id === item.employeeId); return <tr key={item.id}><td>{item.financialYear}</td><td><strong>{employee?.name}</strong><small>{employee?.employeeCode}</small></td><td>{employee?.pan}</td><td>{item.uploadedDate}</td><td>{item.publishedDate || "—"}</td><td><Status>{item.status}</Status></td><td>{item.downloaded ? "Yes" : "No"}</td><td>v{item.version || 1}</td><td><button className="hr-link-button" onClick={() => item.fileData && window.open(item.fileData, "_blank", "noopener,noreferrer")}>Preview</button><button className="hr-link-button" onClick={() => onTogglePublish(item)}>{item.status === "Published" ? "Unpublish" : "Publish"}</button></td></tr>; })}</tbody></table></div></section></>;
}

function PayrollQueries({ data, onAdd }) {
  return <><PageHeader title="Payroll Queries" description="Track employee payroll questions through assignment, resolution and closure." actions={<button onClick={onAdd}>+ New Payroll Query</button>} /><section className="hr-panel"><div className="hr-filters"><select><option>All Categories</option></select><select><option>All Statuses</option></select><input placeholder="Search queries…" /></div>{data.payrollQueries.length ? <div className="hr-table-wrap"><table><thead><tr><th>Category</th><th>Employee</th><th>Month</th><th>Subject</th><th>Status</th><th>Created</th></tr></thead><tbody>{data.payrollQueries.map((item) => <tr key={item.id}><td>{item.category}</td><td>{item.employeeName}</td><td>{item.month}</td><td>{item.subject}</td><td><Status>{item.status}</Status></td><td>{item.createdAt}</td></tr>)}</tbody></table></div> : <div className="hr-empty-state"><b>?</b><h3>No payroll queries</h3><p>New employee queries will appear here for assignment and resolution.</p></div>}</section></>;
}

export default function AdminHrms({ onToast }) {
  const initialPage = location.pathname.startsWith("/admin/hr/") ? location.pathname.split("/").pop() : "dashboard";
  const [page, setPageState] = useState(initialPage === "hr" ? "dashboard" : initialPage);
  const [expanded, setExpanded] = useState(() => navigationGroups.find(([, items]) => items.some(([key]) => key === initialPage))?.[0] || "Employee Management");
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(true);
  const [modal, setModal] = useState(null);
  const [temporaryPassword, setTemporaryPassword] = useState(null);

  const setPage = (next) => {
    setPageState(next);
    history.pushState({}, "", next === "dashboard" ? "/admin/hr/dashboard" : `/admin/hr/${next}`);
  };

  useEffect(() => {
    fetch("/api/hrms", { credentials: "same-origin" }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message);
      setData(payload.data);
    }).catch((error) => onToast(error.message || "Unable to load HRMS.")).finally(() => setBusy(false));
  }, [onToast]);

  const updateState = async (patch) => {
    const response = await fetch("/api/hrms/state", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(patch) });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message);
    setData(payload.data);
    onToast("HRMS changes saved locally.");
  };

  const accessAction = async (employee, action) => {
    const response = await fetch(`/api/hrms/employees/${encodeURIComponent(employee.id)}/access`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ action }) });
    const payload = await response.json();
    if (!response.ok) return onToast(payload.message || "Action failed.");
    setData(payload.data);
    if (payload.temporaryPassword) setTemporaryPassword({ employee, password: payload.temporaryPassword });
    else onToast("Employee login access updated.");
  };

  const reviewLeave = async (request, status) => {
    const remarks = window.prompt(`${status} leave request for ${request.leaveType}. Add remarks (optional):`, "") ?? null;
    if (remarks === null) return;
    const response = await fetch(`/api/hrms/leave-requests/${encodeURIComponent(request.id)}`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ status, remarks }) });
    const payload = await response.json();
    if (!response.ok) return onToast(payload.message || "Unable to review leave request.");
    setData(payload.data);
    onToast(`Leave request ${status.toLowerCase()}.`);
  };

  const title = pageDescriptions[page]?.title || "HRMS";
  const content = (() => {
    if (!data) return null;
    if (page === "dashboard") return <HrDashboard data={data} />;
    if (page === "employees") return <EmployeesPage data={data} onAdd={() => setModal("employee")} onAccess={() => setPage("login-access")} />;
    if (page === "login-access") return <LoginAccessPage data={data} onAction={accessAction} />;
    if (page === "leave-requests") return <LeaveRequestsPage data={data} onReview={reviewLeave} />;
    if (page === "payroll") return <PayrollDashboard data={data} setPage={setPage} />;
    if (page === "salary-structure") return <SalaryStructure data={data} onSave={(item) => updateState({ salaryStructures: [item, ...data.salaryStructures] })} />;
    if (page === "monthly-payroll") return <MonthlyPayroll data={data} onSave={(status) => updateState({ payrollRuns: [{ ...(data.payrollRuns[0] || { id: `pay-${Date.now()}`, month: "July", year: 2026, employees: data.employees.length }), status }, ...data.payrollRuns.slice(1)] })} />;
    if (page === "salary-slips") return <SalarySlips data={data} onUpdate={() => onToast("Salary slip actions are available from the action menu.")} />;
    if (page === "form-16") return <Form16Page data={data} onUpload={(file, employeeId, financialYear) => { const reader = new FileReader(); reader.onload = () => updateState({ form16: [{ id: `f16-${Date.now()}`, employeeId, financialYear, assessmentYear: `${Number(financialYear.slice(0, 4)) + 1}-${String(Number(financialYear.slice(2, 4)) + 1).padStart(2, "0")}`, uploadedDate: new Date().toISOString().slice(0, 10), publishedDate: "", status: "Draft", downloaded: false, version: 1, fileName: file.name, fileData: reader.result }, ...data.form16] }); reader.readAsDataURL(file); }} onTogglePublish={(item) => updateState({ form16: data.form16.map((entry) => entry.id === item.id ? { ...entry, status: entry.status === "Published" ? "Draft" : "Published", publishedDate: entry.status === "Published" ? "" : new Date().toISOString().slice(0, 10) } : entry) })} />;
    if (page === "payroll-queries") return <PayrollQueries data={data} onAdd={() => setModal("query")} />;
    if (page === "audit-logs") return <><PageHeader title="Audit Logs" description="Review immutable HRMS security and data-change events." /><section className="hr-panel"><div className="hr-table-wrap"><table><thead><tr><th>Date & Time</th><th>Actor</th><th>Action</th><th>Employee</th><th>Detail</th></tr></thead><tbody>{data.auditLogs.map((log) => <tr key={log.id}><td>{new Date(log.createdAt).toLocaleString("en-IN")}</td><td>{log.actor}</td><td>{log.action}</td><td>{log.employeeId}</td><td>{log.detail || "—"}</td></tr>)}</tbody></table></div></section></>;
    return <WorkflowPage page={page} employees={data.employees} onToast={onToast} />;
  })();

  if (busy) return <div className="hr-loading">Loading secure HR workspace…</div>;
  if (!data) return <div className="hr-loading">HRMS could not be loaded. Please sign in again.</div>;

  return <div className="hrms-layout">
    <aside className="hrms-sidebar"><div className="hrms-sidebar-heading"><span>HR</span><div><strong>Employee &amp; HR</strong><small>Management</small></div><button aria-label="Collapse HR navigation">‹</button></div>{navigationGroups.map(([group, items]) => <section key={group}><button className="hrms-group-toggle" onClick={() => setExpanded(expanded === group ? "" : group)} aria-expanded={expanded === group}><span>{group}</span><b>{expanded === group ? "−" : "+"}</b></button>{expanded === group && <nav>{items.map(([key, label]) => <button className={page === key ? "active" : ""} onClick={() => setPage(key)} key={key}>{label}</button>)}</nav>}</section>)}</aside>
    <div className="hrms-content" aria-label={title}>{content}</div>

    {temporaryPassword && <div className="hr-modal-backdrop"><section className="hr-secure-modal" role="dialog" aria-modal="true"><div className="hr-secure-icon">🔐</div><h2>Temporary password generated</h2><p>Give this password securely to <strong>{temporaryPassword.employee.name}</strong>.</p><div className="hr-temp-password"><code>{temporaryPassword.password}</code><button onClick={() => navigator.clipboard.writeText(temporaryPassword.password)}>Copy</button></div><div className="hr-warning"><strong>This temporary password will not be shown again.</strong><span>Only its bcrypt hash has been stored. The employee must change it at the next login.</span></div><button className="hr-modal-primary" onClick={() => setTemporaryPassword(null)}>I have copied it · Close</button></section></div>}

    {modal === "employee" && <div className="hr-modal-backdrop"><form className="hr-form-modal" onSubmit={async (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); const response = await fetch("/api/hrms/employees", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(values) }); const payload = await response.json(); if (response.ok) { setData(payload.data); setModal(null); onToast("Employee created. Login remains disabled until explicitly enabled."); } }}><button type="button" className="hr-modal-close" onClick={() => setModal(null)}>×</button><h2>Add Employee</h2><p>Create the employment profile first. Login access is enabled separately.</p><div className="hr-form-grid"><label>Employee Code<input name="employeeCode" placeholder="PS0005" required /></label><label>Employee Name<input name="name" required /></label><label>Department<input name="department" required /></label><label>Designation<input name="designation" required /></label><label>Reporting Manager<input name="reportingManager" /></label><label>Joining Date<input name="joiningDate" type="date" required /></label><label>Email<input name="email" type="email" /></label><label>Work Location<input name="workLocation" /></label><label>Employment Status<select name="employmentStatus"><option>Active</option><option>Inactive</option></select></label></div><button className="hr-modal-primary">Add Employee</button></form></div>}

    {modal === "query" && <div className="hr-modal-backdrop"><form className="hr-form-modal" onSubmit={(event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); updateState({ payrollQueries: [{ id: `query-${Date.now()}`, ...values, employeeName: "Admin created", status: "Open", createdAt: new Date().toISOString().slice(0, 10) }, ...data.payrollQueries] }); setModal(null); }}><button type="button" className="hr-modal-close" onClick={() => setModal(null)}>×</button><h2>New Payroll Query</h2><div className="hr-form-grid"><label>Query Category<select name="category">{["Salary Difference", "Deduction Query", "TDS Query", "PF Query", "ESIC Query", "Form 16 Query", "Reimbursement Query", "Bank Credit Query", "Other"].map((item) => <option key={item}>{item}</option>)}</select></label><label>Payroll Month<input name="month" type="month" /></label><label className="wide">Subject<input name="subject" required /></label><label className="wide">Description<textarea name="description" rows="4" required /></label></div><button className="hr-modal-primary">Create Query</button></form></div>}
  </div>;
}
