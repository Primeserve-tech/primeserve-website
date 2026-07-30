const notificationFields = [
  "name", "fullName", "company", "email", "mobile", "service", "type",
  "position", "requiredRole", "experience", "experienceLevel", "employmentType",
  "hiringLocation", "positions", "sourcePage", "message", "requirement",
  "resumeName", "dateTime", "date",
];

export function notifyAdminOfSubmission(kind, record) {
  const details = Object.fromEntries(
    notificationFields
      .filter((field) => record?.[field])
      .map((field) => [field, String(record[field]).slice(0, 2000)])
  );
  const attachment = record?.resumeData && record?.resumeName
    ? { name: String(record.resumeName).slice(0, 180), data: String(record.resumeData) }
    : undefined;

  return fetch("/api/admin/submission-notification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, details, attachment }),
  }).catch(() => null);
}
