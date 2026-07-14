import { useMemo, useState } from "react";
import logo from "../assets/primeserve-logo-clean.png";
import {
  createId,
  getCmsData,
  getSession,
  loginAdmin,
  logoutAdmin,
  resetCmsData,
  saveCmsData,
} from "../cmsStore";

const moduleConfig = {
  adminUsers: {
    label: "Admin Users",
    roles: ["Super Admin"],
    prefix: "admin",
    fields: [
      ["name", "Name", "text"],
      ["email", "Email", "email"],
      ["password", "Temporary Password", "password"],
      ["role", "Role", "select", ["HR Admin", "Content Admin", "Super Admin"]],
      ["status", "Status", "select", ["Active", "Inactive"]],
    ],
    columns: ["name", "email", "role", "status"],
  },
  jobs: {
    label: "Careers",
    roles: ["Super Admin", "HR Admin"],
    prefix: "job",
    fields: [
      ["title", "Job Title", "text"],
      ["department", "Department", "text"],
      ["experience", "Experience", "text"],
      ["location", "Location", "text"],
      ["employmentType", "Employment Type", "select", ["Full Time", "Part Time", "Contract", "Internship"]],
      ["salaryRange", "Salary Range", "text"],
      ["description", "Job Description", "textarea"],
      ["responsibilities", "Responsibilities", "textarea"],
      ["skills", "Required Skills", "textarea"],
      ["status", "Status", "select", ["Active", "Inactive"]],
      ["publishDate", "Publish Date", "date"],
    ],
    columns: ["title", "department", "experience", "status"],
  },
  blogs: {
    label: "Blogs",
    roles: ["Super Admin", "Content Admin"],
    prefix: "blog",
    fields: [
      ["title", "Title", "text"],
      ["slug", "Slug", "text"],
      ["category", "Category", "text"],
      ["shortDescription", "Short Description", "textarea"],
      ["coverImage", "Cover Image", "file"],
      ["coverAlt", "Cover Image Alt Text", "text"],
      ["content", "Full Content", "richtext"],
      ["author", "Author", "text"],
      ["tags", "Tags", "text"],
      ["seoTitle", "SEO Title", "text"],
      ["seoDescription", "SEO Description", "textarea"],
      ["status", "Status", "select", ["Draft", "Published", "Scheduled", "Archived"]],
      ["publishDate", "Publish Date", "date"],
      ["lastUpdatedDate", "Last Updated Date", "date"],
      ["featured", "Featured Blog", "select", ["No", "Yes"]],
      ["showOnHomepage", "Show on Homepage", "select", ["Yes", "No"]],
      ["readingTime", "Reading Time", "text"],
      ["ogImage", "Open Graph Image", "file"],
      ["canonicalUrl", "Canonical URL", "url"],
      ["relatedBlogs", "Related Blogs Slugs", "text"],
      ["downloadPdf", "Download as PDF", "select", ["Yes", "No"]],
    ],
    columns: ["title", "category", "author", "status"],
  },
  faqs: {
    label: "FAQs",
    roles: ["Super Admin", "Content Admin"],
    prefix: "faq",
    fields: [
      ["question", "Question", "text"],
      ["answer", "Answer", "textarea"],
      ["category", "Category", "select", ["Enterprise APIs", "GST APIs", "e-Invoice", "e-Way Bill", "ASP-GSP", "Digital Signature Certificate", "SAP Integration", "Pricing", "Onboarding", "Support"]],
      ["tags", "Tags", "text"],
      ["sortOrder", "Sort Order", "number"],
      ["status", "Status", "select", ["Active", "Inactive"]],
      ["showOnHomepage", "Show on Homepage", "select", ["No", "Yes"]],
      ["seoTitle", "SEO Title", "text"],
      ["seoDescription", "SEO Description", "textarea"],
    ],
    columns: ["question", "category", "status", "sortOrder"],
  },
  webinars: {
    label: "Webinars",
    roles: ["Super Admin", "Content Admin"],
    prefix: "webinar",
    fields: [
      ["title", "Webinar Title", "text"],
      ["slug", "Slug", "text"],
      ["shortDescription", "Short Description", "textarea"],
      ["fullDescription", "Full Description", "textarea"],
      ["speakerName", "Speaker Name", "text"],
      ["speakerDesignation", "Speaker Designation", "text"],
      ["eventDate", "Event Date", "date"],
      ["eventTime", "Event Time", "time"],
      ["duration", "Duration", "text"],
      ["registrationLink", "Registration Link", "url"],
      ["webinarType", "Webinar Type", "select", ["Upcoming", "Completed", "Recorded"]],
      ["videoUrl", "Video URL", "url"],
      ["thumbnail", "Thumbnail Image", "file"],
      ["status", "Status", "select", ["Draft", "Published"]],
      ["seoTitle", "SEO Title", "text"],
      ["seoDescription", "SEO Description", "textarea"],
    ],
    columns: ["title", "eventDate", "webinarType", "status"],
  },
  caseStudies: {
    label: "Case Studies",
    roles: ["Super Admin", "Content Admin"],
    prefix: "case",
    fields: [
      ["title", "Case Study Title", "text"],
      ["slug", "Slug", "text"],
      ["clientName", "Client Name", "text"],
      ["industry", "Industry", "text"],
      ["challenge", "Challenge", "textarea"],
      ["solution", "Solution Provided", "textarea"],
      ["results", "Results / Impact", "textarea"],
      ["servicesUsed", "Services Used", "text"],
      ["clientLogo", "Client Logo", "file"],
      ["coverImage", "Cover Image", "file"],
      ["status", "Status", "select", ["Draft", "Published"]],
      ["featured", "Featured", "select", ["No", "Yes"]],
      ["seoTitle", "SEO Title", "text"],
      ["seoDescription", "SEO Description", "textarea"],
    ],
    columns: ["title", "clientName", "industry", "status"],
  },
  productAnnouncements: {
    label: "Product Announcements",
    roles: ["Super Admin", "Content Admin"],
    prefix: "announcement",
    fields: [
      ["title", "Title", "text"],
      ["slug", "Slug", "text"],
      ["product", "Product / Service", "text"],
      ["announcementType", "Announcement Type", "select", ["New Launch", "Feature Update", "Maintenance", "Partnership", "Security Update"]],
      ["shortDescription", "Short Description", "textarea"],
      ["fullDetails", "Full Details", "textarea"],
      ["publishDate", "Publish Date", "date"],
      ["image", "Image Optional", "file"],
      ["status", "Status", "select", ["Draft", "Published"]],
      ["showOnHomepage", "Show on Homepage", "select", ["No", "Yes"]],
    ],
    columns: ["title", "product", "announcementType", "status"],
  },
  apiReleaseNotes: {
    label: "API Release Notes",
    roles: ["Super Admin", "Content Admin"],
    prefix: "release",
    fields: [
      ["apiName", "API Name", "text"],
      ["version", "Version", "text"],
      ["releaseDate", "Release Date", "date"],
      ["updateType", "Update Type", "select", ["New API", "Enhancement", "Bug Fix", "Deprecation", "Maintenance"]],
      ["description", "Description", "textarea"],
      ["breakingChange", "Breaking Change", "select", ["No", "Yes"]],
      ["migrationNotes", "Migration Notes", "textarea"],
      ["status", "Status", "select", ["Draft", "Published"]],
    ],
    columns: ["apiName", "version", "updateType", "status"],
  },
  resources: {
    label: "Resources",
    roles: ["Super Admin", "Content Admin"],
    prefix: "resource",
    fields: [
      ["title", "Resource Title", "text"],
      ["category", "Category", "text"],
      ["description", "Description", "textarea"],
      ["file", "File Upload PDF/DOC/PPT/XLS", "file"],
      ["coverImage", "Cover Image", "file"],
      ["accessType", "Access Type", "select", ["Public", "Lead Capture"]],
      ["status", "Status", "select", ["Active", "Inactive"]],
      ["publishDate", "Publish Date", "date"],
    ],
    columns: ["title", "category", "accessType", "status"],
  },
  hsnSacRecords: {
    label: "HSN/SAC Records",
    roles: ["Super Admin", "Content Admin"],
    prefix: "hsn",
    fields: [
      ["code", "HSN/SAC Code", "text"],
      ["type", "Type", "select", ["HSN", "SAC"]],
      ["description", "Description", "textarea"],
      ["gstRate", "GST Rate", "text"],
      ["category", "Category", "text"],
      ["chapter", "Chapter", "text"],
      ["effectiveDate", "Effective Date", "date"],
      ["status", "Status", "select", ["Active", "Inactive"]],
    ],
    columns: ["code", "type", "gstRate", "status"],
  },
  leads: {
    label: "Leads",
    roles: ["Super Admin", "Content Admin"],
    prefix: "lead",
    fields: [
      ["name", "Name", "text"],
      ["company", "Company", "text"],
      ["email", "Email", "email"],
      ["mobile", "Mobile", "text"],
      ["service", "Service Interested", "text"],
      ["message", "Message", "textarea"],
      ["sourcePage", "Source Page", "text"],
      ["date", "Date", "date"],
      ["status", "Status", "select", ["New", "Contacted", "Converted", "Closed"]],
    ],
    columns: ["name", "service", "sourcePage", "status"],
  },
  news: {
    label: "News Updates",
    roles: ["Super Admin", "Content Admin"],
    prefix: "news",
    fields: [
      ["title", "Title", "text"],
      ["shortDescription", "Short Description", "textarea"],
      ["fullDescription", "Full Description", "textarea"],
      ["image", "Image", "file"],
      ["date", "Date", "date"],
      ["status", "Status", "select", ["Draft", "Published"]],
    ],
    columns: ["title", "date", "status"],
  },
  apiUpdates: {
    label: "API Updates",
    roles: ["Super Admin", "Content Admin"],
    prefix: "update",
    fields: [
      ["productName", "API/Product Name", "text"],
      ["updateType", "Update Type", "select", ["New Launch", "Enhancement", "Maintenance", "Deprecation"]],
      ["description", "Description", "textarea"],
      ["releaseDate", "Release Date", "date"],
      ["status", "Status", "select", ["Draft", "Published"]],
    ],
    columns: ["productName", "updateType", "releaseDate", "status"],
  },
  clients: {
    label: "Client Logos",
    roles: ["Super Admin", "Content Admin"],
    prefix: "client",
    fields: [
      ["name", "Client Name", "text"],
      ["logo", "Logo Upload", "file"],
      ["industry", "Industry", "text"],
      ["status", "Status", "select", ["Active", "Inactive"]],
      ["sortOrder", "Sort Order", "number"],
    ],
    columns: ["name", "industry", "status", "sortOrder"],
  },
  testimonials: {
    label: "Testimonials",
    roles: ["Super Admin", "Content Admin"],
    prefix: "testimonial",
    fields: [
      ["clientName", "Client Name", "text"],
      ["companyName", "Company Name", "text"],
      ["designation", "Designation", "text"],
      ["photo", "Photo Upload (Optional)", "file"],
      ["testimonial", "Testimonial", "textarea"],
      ["rating", "Rating", "number"],
      ["status", "Status", "select", ["Active", "Inactive"]],
    ],
    columns: ["clientName", "companyName", "rating", "status"],
  },
  supportTeam: {
    label: "24 Hour Support Team",
    roles: ["Super Admin", "Content Admin", "HR Admin"],
    prefix: "support",
    fields: [
      ["name", "Employee Name", "text"],
      ["image", "Employee Image", "file"],
      ["designation", "Designation", "text"],
      ["email", "Email", "email"],
      ["contact", "Contact", "text"],
      ["status", "Status", "select", ["Active", "Inactive"]],
      ["createdAt", "Created At", "datetime-local"],
    ],
    columns: ["name", "designation", "email", "status"],
  },
  newsletterSubscribers: {
    label: "Newsletter Subscribers",
    roles: ["Super Admin", "Content Admin"],
    prefix: "subscriber",
    fields: [
      ["email", "Email", "email"],
      ["status", "Status", "select", ["Active", "Unsubscribed"]],
      ["date", "Date", "date"],
    ],
    columns: ["email", "status", "date"],
  },
  newsletterCampaigns: {
    label: "Newsletter Campaigns",
    roles: ["Super Admin", "Content Admin"],
    prefix: "newsletter",
    fields: [
      ["subject", "Email Subject", "text"],
      ["body", "Email Body", "textarea"],
      ["status", "Status", "select", ["Draft", "Ready"]],
      ["date", "Date", "date"],
    ],
    columns: ["subject", "status", "date"],
  },
  applications: {
    label: "Applicants",
    roles: ["Super Admin", "HR Admin"],
    prefix: "app",
    readonlyCreate: true,
    fields: [
      ["fullName", "Full Name", "text"],
      ["email", "Email", "email"],
      ["mobile", "Mobile", "text"],
      ["position", "Position", "text"],
      ["experience", "Experience", "text"],
      ["currentCtc", "Current CTC", "text"],
      ["expectedCtc", "Expected CTC", "text"],
      ["noticePeriod", "Notice Period", "text"],
      ["resumeName", "Resume File", "text"],
      ["message", "Message", "textarea"],
      ["status", "Status", "select", ["New", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"]],
      ["date", "Date", "date"],
    ],
    columns: ["fullName", "position", "status", "date"],
  },
  enquiries: {
    label: "Enquiries",
    roles: ["Super Admin", "Content Admin"],
    prefix: "enquiry",
    fields: [
      ["name", "Name", "text"],
      ["company", "Company", "text"],
      ["email", "Email", "email"],
      ["mobile", "Mobile", "text"],
      ["service", "Service Interested", "text"],
      ["message", "Message", "textarea"],
      ["date", "Date", "date"],
      ["status", "Status", "select", ["New", "Contacted", "Converted", "Closed"]],
      ["type", "Type", "select", ["Contact Enquiry", "Demo Request"]],
    ],
    columns: ["name", "service", "status", "type"],
  },
  seo: {
    label: "SEO Settings",
    roles: ["Super Admin", "Content Admin"],
    prefix: "seo",
    fields: [
      ["page", "Page", "text"],
      ["title", "Page Title", "text"],
      ["metaDescription", "Meta Description", "textarea"],
      ["metaKeywords", "Meta Keywords", "textarea"],
      ["ogImage", "Open Graph Image", "file"],
    ],
    columns: ["page", "title", "metaKeywords"],
  },
};

const settingsFields = [
  ["companyName", "Company Name", "text"],
  ["website", "Website", "text"],
  ["salesEmail", "Sales Email", "email"],
  ["infoEmail", "Info Email", "email"],
  ["careersEmail", "Careers Email", "email"],
  ["phone", "Phone Number", "text"],
  ["address", "Address", "textarea"],
  ["linkedin", "LinkedIn", "url"],
  ["instagram", "Instagram", "url"],
  ["whatsapp", "WhatsApp", "url"],
  ["footerContent", "Footer Content", "textarea"],
  ["privacyUrl", "Privacy Policy URL", "text"],
  ["termsUrl", "Terms URL", "text"],
  ["hsnSacToolEnabled", "HSN/SAC Tool Enabled", "select", ["Yes", "No"]],
  ["gstinValidatorEnabled", "GSTIN Validator Enabled", "select", ["Yes", "No"]],
  ["gstBulkDataFetchEnabled", "GST Bulk Data Fetch Enabled", "select", ["Yes", "No"]],
  ["gstinApiUrl", "GSTIN API URL", "url"],
  ["gstinApiKey", "GSTIN API Key", "password"],
  ["gstinAdminSecret", "Server Update Secret", "password"],
];

function AdminLogin({ onLogin }) {
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const session = loginAdmin(form.get("email"), form.get("password"));
    if (!session) {
      setError("Invalid admin email or password.");
      return;
    }
    onLogin(session);
  };

  const handleForgotPassword = () => {
    const emailInput = document.querySelector("input[name='email']");
    const email = emailInput?.value || "your registered email";
    setError("");
    setResetMessage(
      `A secure password reset link has been requested for ${email}. In production, this link will be sent to the registered email address.`
    );
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <img src={logo} alt="PrimeServe" />
        <span>Secure CMS Login</span>
        <h1>PrimeServe Admin Dashboard</h1>
        {error && <p className="admin-error">{error}</p>}
        <input name="email" type="email" placeholder="Admin email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <button className="admin-forgot-btn" type="button" onClick={handleForgotPassword}>
          Forgot password?
        </button>
        {resetMessage && <p className="admin-reset-message">{resetMessage}</p>}
      </form>
    </div>
  );
}

function renderInput(field, value, onChange) {
  const [key, , type, options] = field;
  if (type === "richtext") {
    return (
      <>
        <div className="admin-richtext-toolbar" aria-label="Rich text helper">
          <span>H1</span>
          <span>H2</span>
          <span>H3</span>
          <span>B</span>
          <span>I</span>
          <span>List</span>
          <span>Table</span>
          <span>Link</span>
          <span>Quote</span>
          <span>Code</span>
        </div>
        <textarea
          rows="10"
          value={value || ""}
          placeholder="Write SEO-friendly HTML or formatted article content here."
          onChange={(event) => onChange(key, event.target.value)}
        />
      </>
    );
  }
  if (type === "textarea") {
    return <textarea rows="5" value={value || ""} onChange={(event) => onChange(key, event.target.value)} />;
  }
  if (type === "select") {
    return (
      <select value={value || options[0]} onChange={(event) => onChange(key, event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }
  if (type === "file") {
    return (
      <>
        <input
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              if (!file.type.startsWith("image/")) {
                onChange(key, reader.result || "");
                return;
              }
              const image = new Image();
              image.onload = () => {
                const maxSide = 900;
                const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.max(1, Math.round(image.width * scale));
                canvas.height = Math.max(1, Math.round(image.height * scale));
                const context = canvas.getContext("2d");
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                onChange(key, canvas.toDataURL("image/jpeg", 0.68));
              };
              image.src = reader.result;
            };
            reader.readAsDataURL(file);
          }}
        />
        {value && (
          <small>
            Current file: <a href={value} target="_blank" rel="noreferrer">View / Download</a>
          </small>
        )}
      </>
    );
  }
  return <input type={type} value={value || ""} onChange={(event) => onChange(key, event.target.value)} />;
}

function compressStoredImage(dataUrl, maxSide = 900, quality = 0.68) {
  if (!String(dataUrl || "").startsWith("data:image/")) return Promise.resolve(dataUrl);
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const optimized = canvas.toDataURL("image/jpeg", quality);
      resolve(optimized.length < dataUrl.length ? optimized : dataUrl);
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}

async function optimizeCmsStorage(value, key = "", maxSide = 900, quality = 0.68) {
  if (typeof value === "string") {
    if ((key === "pdf" || key === "attachment") && value.startsWith("data:")) return "";
    return compressStoredImage(value, maxSide, quality);
  }
  if (Array.isArray(value)) return Promise.all(value.map((entry) => optimizeCmsStorage(entry, "", maxSide, quality)));
  if (value && typeof value === "object") {
    const entries = await Promise.all(
      Object.entries(value).map(async ([childKey, childValue]) => [childKey, await optimizeCmsStorage(childValue, childKey, maxSide, quality)])
    );
    return Object.fromEntries(entries);
  }
  return value;
}

function AdminDashboard() {
  const [session, setSession] = useState(getSession);
  const [data, setData] = useState(getCmsData);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const allowedModules = useMemo(() => {
    if (!session) return [];
    return Object.entries(moduleConfig)
      .filter(([, config]) => config.roles.includes(session.role))
      .map(([key]) => key);
  }, [session]);

  if (!session) return <AdminLogin onLogin={setSession} />;

  const updateData = (nextData, message) => {
    saveCmsData(nextData);
    setData(nextData);
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const summary = [
    ["Total Blogs", data.blogs.length],
    ["Published Blogs", data.blogs.filter((blog) => blog.status === "Published").length],
    ["Draft Blogs", data.blogs.filter((blog) => blog.status === "Draft").length],
    ["Total News Updates", data.news.length],
    ["Active Jobs", data.jobs.filter((job) => job.status === "Active").length],
    ["Total Applicants", data.applications.length],
    ["Total FAQs", (data.faqs || []).length],
    ["Case Studies", (data.caseStudies || []).length],
    ["Webinars", (data.webinars || []).length],
    ["Announcements", (data.productAnnouncements || []).length],
    ["HSN/SAC Records", ((data.hsnSacRecords || []).length || 22537)],
    ["Total Leads", (data.leads || []).length],
    ["Contact Enquiries", data.enquiries.filter((item) => item.type === "Contact Enquiry").length],
    ["Demo Requests", data.enquiries.filter((item) => item.type === "Demo Request").length],
  ];

  const openCreate = (moduleKey) => {
    const config = moduleConfig[moduleKey];
    const item = { id: createId(config.prefix) };
    config.fields.forEach(([key, , type, options]) => {
      if (key === "date" || key === "publishDate" || key === "releaseDate" || key === "lastUpdatedDate" || key === "eventDate") item[key] = new Date().toISOString().slice(0, 10);
      else if (key === "createdAt") item[key] = new Date().toISOString().slice(0, 16);
      else if (type === "select") item[key] = options[0];
      else item[key] = "";
    });
    setEditing({ moduleKey, item, isNew: true });
  };

  const downloadNewsletterCsv = () => {
    const rows = [["Email", "Status", "Date"], ...(data.newsletterSubscribers || []).map((item) => [item.email, item.status, item.date])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "primeserve-newsletter-subscribers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const sendNewsletterCampaign = (campaign) => {
    const recipients = (data.newsletterSubscribers || [])
      .filter((item) => item.status === "Active")
      .map((item) => item.email)
      .filter(Boolean);
    if (recipients.length === 0) {
      setToast("No active newsletter subscribers found.");
      return;
    }
    const mailto = `mailto:?bcc=${encodeURIComponent(recipients.join(","))}&subject=${encodeURIComponent(campaign.subject || "")}&body=${encodeURIComponent(campaign.body || "")}`;
    window.location.href = mailto;
  };

  const saveItem = async () => {
    const { moduleKey, item, isNew } = editing;
    const nextItem = { ...item };
    if (moduleKey === "blogs") {
      const plainText = String(nextItem.content || "").replace(/<[^>]*>/g, " ");
      const words = plainText.trim().split(/\s+/).filter(Boolean).length;
      nextItem.readingTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
      nextItem.lastUpdatedDate = nextItem.lastUpdatedDate || new Date().toISOString().slice(0, 10);
    }
    if (moduleKey === "caseStudies" && !String(nextItem.slug || "").trim()) {
      nextItem.slug = String(nextItem.title || "case-study")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    const list = data[moduleKey] || [];
    const nextList = isNew ? [nextItem, ...list] : list.map((entry) => (entry.id === nextItem.id ? nextItem : entry));
    const nextData = { ...data, [moduleKey]: nextList };
    try {
      updateData(nextData, "Saved successfully.");
      setEditing(null);
    } catch (error) {
      const storageFull = error?.name === "QuotaExceededError";
      if (!storageFull) {
        setToast("Unable to save this record. Please try again.");
        return;
      }
      setToast("Optimizing uploaded media and retrying automatically...");
      try {
        const optimizedData = await optimizeCmsStorage(nextData);
        try {
          updateData(optimizedData, "Saved successfully. Media was optimized automatically.");
          setEditing(null);
        } catch (retryError) {
          if (retryError?.name !== "QuotaExceededError") throw retryError;
          const compactData = await optimizeCmsStorage(optimizedData, "", 600, 0.5);
          updateData(compactData, "Saved successfully. Media was optimized automatically.");
          setEditing(null);
        }
      } catch {
        setToast("Storage is still full. Remove one old large attachment and save again.");
      }
    }
  };

  const importHsnCsv = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setToast("Please upload CSV here. The uploaded Excel data is already loaded into the public HSN/SAC finder.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const rows = String(reader.result || "").split(/\r?\n/).filter(Boolean);
      const parsed = rows.slice(1).map((line) => {
        const cols = line.split(",").map((cell) => cell.replace(/^"|"$/g, "").trim());
        return {
          id: createId("hsn"),
          code: cols[0] || "",
          type: cols[1] || "HSN",
          description: cols[2] || "",
          gstRate: cols[3] || "",
          category: cols[4] || "",
          chapter: cols[5] || "",
          effectiveDate: cols[6] || "",
          status: "Active",
        };
      }).filter((row) => row.code);
      const nextData = {
        ...data,
        hsnSacRecords: [...parsed, ...(data.hsnSacRecords || [])],
        hsnImportHistory: [
          {
            id: createId("import"),
            fileName: file.name,
            date: new Date().toISOString().slice(0, 10),
            totalRecords: String(parsed.length),
            duplicateRecords: "0",
            status: "Imported",
          },
          ...(data.hsnImportHistory || []),
        ],
      };
      updateData(nextData, `${parsed.length} HSN/SAC records imported.`);
    };
    reader.readAsText(file);
  };

  const deleteItem = (moduleKey, itemId) => {
    if (!window.confirm("Delete this item?")) return;
    updateData({ ...data, [moduleKey]: data[moduleKey].filter((item) => item.id !== itemId) }, "Deleted successfully.");
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const settings = { ...data.settings };
    settingsFields.forEach(([key]) => {
      if (key === "gstinApiKey" || key === "gstinAdminSecret") return;
      settings[key] = form.get(key);
    });

    const apiKey = String(form.get("gstinApiKey") || "").trim();
    const adminSecret = String(form.get("gstinAdminSecret") || "").trim();
    if (apiKey) {
      try {
        const response = await fetch("/api/gstin-key.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey, adminSecret }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error || "Unable to update GSTIN API key.");
        }
      } catch (error) {
        setToast(error.message || "Unable to update GSTIN API key.");
        return;
      }
    }
    settings.gstinApiKey = "";

    updateData({ ...data, settings }, "Website settings saved.");
    event.currentTarget.gstinApiKey.value = "";
    event.currentTarget.gstinAdminSecret.value = "";
  };

  const filteredRows = (moduleKey) => {
    const rows = data[moduleKey] || [];
    if (!query) return rows;
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <img src={logo} alt="PrimeServe" />
        <p>{session.name}</p>
        <span>{session.role}</span>
        <button className={activeModule === "dashboard" ? "active" : ""} onClick={() => setActiveModule("dashboard")}>Dashboard</button>
        {allowedModules.map((moduleKey) => (
          <button
            key={moduleKey}
            className={activeModule === moduleKey ? "active" : ""}
            onClick={() => setActiveModule(moduleKey)}
          >
            {moduleConfig[moduleKey].label}
          </button>
        ))}
        {session.role === "Super Admin" && (
          <button className={activeModule === "settings" ? "active" : ""} onClick={() => setActiveModule("settings")}>Website Settings</button>
        )}
        <button onClick={() => {
          logoutAdmin();
          setSession(null);
        }}>
          Logout
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>PrimeServe CMS</span>
            <h1>{activeModule === "dashboard" ? "Dashboard Home" : activeModule === "settings" ? "Website Settings" : moduleConfig[activeModule]?.label}</h1>
          </div>
          <button onClick={() => {
            resetCmsData();
            setData(getCmsData());
            setToast("Seed data restored.");
          }}>
            Restore Seed Data
          </button>
        </header>

        {toast && <div className="admin-toast">{toast}</div>}

        {activeModule === "dashboard" && (
          <div className="admin-summary-grid">
            {summary.map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>
        )}

        {activeModule === "settings" && (
          <form className="admin-form-grid" onSubmit={saveSettings}>
            {settingsFields.map((field) => (
              <label key={field[0]}>
                <span>{field[1]}</span>
                {field[2] === "textarea" ? (
                  <textarea name={field[0]} rows="4" defaultValue={data.settings[field[0]]} />
                ) : field[2] === "select" ? (
                  <select name={field[0]} defaultValue={data.settings[field[0]] || field[3][0]}>
                    {field[3].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field[0]}
                    type={field[2]}
                    defaultValue={field[2] === "password" ? "" : data.settings[field[0]]}
                    placeholder={field[0] === "gstinApiKey" ? "Enter new API key only when changing it" : ""}
                  />
                )}
              </label>
            ))}
            <button type="submit">Save Settings</button>
          </form>
        )}

        {moduleConfig[activeModule] && (
          <div className="admin-table-card">
            <div className="admin-table-tools">
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records..." />
              {activeModule === "newsletterSubscribers" && (
                <button onClick={downloadNewsletterCsv}>Download Report</button>
              )}
              {activeModule === "hsnSacRecords" && (
                <label className="admin-import-btn">
                  Import CSV
                  <input type="file" accept=".csv,.xlsx" onChange={importHsnCsv} />
                </label>
              )}
              {!moduleConfig[activeModule].readonlyCreate && (
                <button onClick={() => openCreate(activeModule)}>Add New</button>
              )}
            </div>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    {moduleConfig[activeModule].columns.map((column) => <th key={column}>{column}</th>)}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows(activeModule).map((row) => (
                    <tr key={row.id}>
                      {moduleConfig[activeModule].columns.map((column) => <td key={column}>{row[column]}</td>)}
                      <td>
                        <button onClick={() => setEditing({ moduleKey: activeModule, item: row, isNew: false })}>Edit</button>
                        {activeModule === "newsletterCampaigns" && <button onClick={() => sendNewsletterCampaign(row)}>Send Email</button>}
                        {row.resumeName && <button onClick={() => alert(`Resume file: ${row.resumeName}`)}>Resume</button>}
                        <button onClick={() => deleteItem(activeModule, row.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {editing && (
        <div className="admin-modal-overlay" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setEditing(null)}>x</button>
            <h2>{editing.isNew ? "Add" : "Edit"} {moduleConfig[editing.moduleKey].label}</h2>
            <div className="admin-form-grid">
              {moduleConfig[editing.moduleKey].fields.map((field) => (
                <label key={field[0]}>
                  <span>{field[1]}</span>
                  {renderInput(field, editing.item[field[0]], (key, value) => {
                    setEditing({ ...editing, item: { ...editing.item, [key]: value } });
                  })}
                </label>
              ))}
            </div>
            <button className="admin-save-btn" onClick={saveItem}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
