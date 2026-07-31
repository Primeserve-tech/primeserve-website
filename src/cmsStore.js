import { servicePortfolio } from "./data/servicePortfolio";

const SESSION_KEY = "primeserve_admin_session_v1";

const today = "2026-07-07";

export const defaultAdminUsers = [
  {
    id: "admin-super",
    email: "primeserve45@gmail.com",
    password: "Password@#321",
    name: "Super Admin",
    role: "Super Admin",
    letterheadAccess: "Yes",
    status: "Active",
  },
  {
    id: "admin-hr",
    email: "hr@primeserve.in",
    password: "Password@#321",
    name: "HR Admin",
    role: "HR Admin",
    letterheadAccess: "No",
    status: "Active",
  },
  {
    id: "admin-content",
    email: "content@primeserve.in",
    password: "Password@#321",
    name: "Content Admin",
    role: "Content Admin",
    letterheadAccess: "No",
    status: "Active",
  },
];

export const defaultCmsData = {
  adminUsers: defaultAdminUsers,
  services: servicePortfolio.map((service, index) => ({
    id: `service-${service.id}`,
    title: service.title,
    slug: service.href.replace(/^\//, ""),
    category: service.category,
    shortDescription: service.description,
    fullDescription: service.description,
    highlights: service.points.join("\n"),
    industries: "",
    engagementModels: "",
    icon: service.icon,
    ctaLabel: "Explore Service",
    status: "Active",
    featured: "Yes",
    sortOrder: String(index + 1),
  })),
  jobs: [
    {
      id: "job-1",
      title: "React Frontend Developer",
      department: "Technology",
      experience: "2-5 Years",
      location: "Greater Noida / Remote",
      employmentType: "Full Time",
      salaryRange: "As per experience",
      description: "Build polished customer-facing dashboards and reusable React components for Primeserve products.",
      responsibilities: "Develop UI modules, integrate APIs, improve performance, support responsive design.",
      skills: "React, JavaScript, CSS, REST APIs, Git",
      status: "Inactive",
      publishDate: today,
    },
    {
      id: "job-2",
      title: "GST API Support Executive",
      department: "Operations",
      experience: "1-3 Years",
      location: "Greater Noida",
      employmentType: "Full Time",
      salaryRange: "",
      description: "Support API customers for GST, e-Invoice, e-Way Bill and verification workflows.",
      responsibilities: "Handle tickets, coordinate with technical teams, maintain issue reports.",
      skills: "GST knowledge, communication, Excel, API basics",
      status: "Inactive",
      publishDate: today,
    },
  ],
  applications: [
    {
      id: "app-1",
      fullName: "Sample Applicant",
      email: "candidate@example.com",
      mobile: "9999999999",
      position: "React Frontend Developer",
      experience: "3 Years",
      currentCtc: "5 LPA",
      expectedCtc: "7 LPA",
      noticePeriod: "30 Days",
      resumeName: "sample-resume.pdf",
      message: "Interested in Primeserve technology team.",
      status: "New",
      date: today,
    },
  ],
  blogs: [
    {
      id: "blog-1",
      title: "How APIs Simplify GST Compliance for Enterprises",
      slug: "apis-simplify-gst-compliance",
      category: "Compliance",
      shortDescription: "A practical look at how GST, e-Invoice and e-Way Bill APIs reduce manual work.",
      coverImage: "",
      content: "Enterprise GST compliance becomes faster when validation, filing status, e-Invoice and e-Way Bill workflows are automated through secure APIs.",
      author: "Primeserve Team",
      tags: "GST, APIs, Compliance",
      seoTitle: "GST Compliance APIs for Enterprises",
      seoDescription: "Learn how Primeserve GST APIs help enterprises automate compliance.",
      status: "Published",
      publishDate: today,
      lastUpdatedDate: today,
      featured: "Yes",
      showOnHomepage: "Yes",
      readingTime: "1 min read",
      ogImage: "",
      coverAlt: "Primeserve GST compliance APIs",
      canonicalUrl: "",
      relatedBlogs: "",
      downloadPdf: "Yes",
    },
  ],
  faqs: [
    {
      id: "faq-1",
      question: "What API services does Primeserve provide?",
      answer: "Primeserve provides GST APIs, e-Invoice, e-Way Bill, identity verification, business verification, DSC, SAP integration and managed compliance services.",
      category: "Enterprise APIs",
      tags: "api,gst,verification",
      sortOrder: "1",
      status: "Active",
      showOnHomepage: "Yes",
      seoTitle: "Primeserve API FAQs",
      seoDescription: "Frequently asked questions about Primeserve APIs and compliance solutions.",
    },
  ],
  webinars: [],
  caseStudies: [],
  productAnnouncements: [],
  hiringUpdates: [],
  apiReleaseNotes: [],
  resources: [],
  hsnSacRecords: [],
  hsnImportHistory: [
    {
      id: "import-1",
      fileName: "UPDATED HSN_SAC WITH RATE AND UNIT.xlsx",
      date: today,
      totalRecords: "22537",
      duplicateRecords: "5",
      status: "Imported",
    },
  ],
  leads: [],
  news: [],
  apiUpdates: [],
  clients: [
    { id: "client-1", name: "Alankit Limited", logo: "", industry: "Compliance Services", status: "Active", sortOrder: "1" },
    { id: "client-2", name: "Axis Bank", logo: "", industry: "Banking", status: "Active", sortOrder: "2" },
    { id: "client-3", name: "Bharti Airtel Payments Bank", logo: "", industry: "Payments", status: "Active", sortOrder: "3" },
  ],
  testimonials: [],
  supportTeam: [],
  newsletterSubscribers: [],
  updatesHub: [
    {
      id: "updates-hub-1",
      heading: "Primeserve Updates",
      shortDescription: "Stay informed about product launches, compliance updates, platform alerts and business insights.",
      newsletterText: "No spam. Unsubscribe anytime.",
      apiLaunchesContent: "New API releases and capabilities.",
      apiLaunchesEnabled: "Yes",
      productNewsContent: "Product, compliance and regulatory news.",
      productNewsEnabled: "Yes",
      platformAlertsContent: "System alerts and service notifications.",
      platformAlertsEnabled: "Yes",
      specialOffersContent: "Business insights and selected offers.",
      specialOffersEnabled: "Yes",
      newsletterEnabled: "Yes",
      status: "Active",
    },
  ],
  newsletterCampaigns: [
    {
      id: "newsletter-1",
      subject: "Primeserve Updates",
      body: "Hello,\n\nHere are the latest updates from Primeserve.\n\nRegards,\nPrimeserve Team",
      status: "Draft",
      date: today,
    },
  ],
  enquiries: [
    {
      id: "enquiry-1",
      name: "Sample Lead",
      company: "Demo Company",
      email: "lead@example.com",
      mobile: "8888888888",
      service: "GST APIs",
      message: "Need API demo and pricing discussion.",
      date: today,
      status: "New",
      type: "Demo Request",
    },
  ],
  settings: {
    id: "settings-1",
    companyName: "Primeserve Global Solution Pvt. Ltd.",
    website: "www.primeserve.in",
    salesEmail: "sales@primeserve.in",
    infoEmail: "info@primeserve.in",
    careersEmail: "info@primeserve.in",
    phone: "+91 836 841 4690",
    address: "Greater Noida, Gautam Buddha Nagar, Uttar Pradesh 201306, India",
    linkedin: "https://www.linkedin.com/company/prime-serve/posts/?feedView=all",
    instagram: "https://www.instagram.com/primeserve45",
    whatsapp: "https://api.whatsapp.com/send/?phone=918368414690",
    footerContent: "Enterprise APIs, compliance automation and verification services for modern businesses.",
    privacyUrl: "/privacy-policy",
    termsUrl: "/terms-of-service",
    hsnSacToolEnabled: "Yes",
    gstinValidatorEnabled: "Yes",
    gstBulkDataFetchEnabled: "Yes",
    gstinApiUrl: "https://api.primeserve.in/commonapi/v1.1/search",
    gstinApiKey: "",
  },
  seo: [
    {
      id: "seo-home",
      page: "Home",
      title: "Primeserve - Enterprise APIs & Compliance Solutions",
      metaDescription: "Primeserve provides GST APIs, e-Invoice, e-Way Bill, verification APIs, DSC, SAP and managed compliance solutions.",
      metaKeywords: "GST API, e-Invoice API, e-Way Bill API, DSC, ASP GSP, Primeserve",
      ogImage: "",
    },
  ],
};

let cmsDataCache = defaultCmsData;

export function getCmsData() {
  return cmsDataCache;
}

export async function loadCmsData() {
  const response = await fetch("/api/cms", { credentials: "same-origin", cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load shared CMS data.");
  const payload = await response.json();
  cmsDataCache = { ...(payload.data || {}), settings: { ...defaultCmsData.settings, ...(payload.data?.settings || {}) } };
  if (payload.session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload.session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  return cmsDataCache;
}

export async function saveCmsData(data) {
  const response = await fetch("/api/cms", {
    method: "PUT",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || "Unable to save shared CMS data.");
  cmsDataCache = data;
  return data;
}

export async function resetCmsData() {
  return saveCmsData(defaultCmsData);
}

export function getSession() {
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export async function loginAdmin(email, password) {
  const response = await fetch("/api/cms/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) return null;
  const payload = await response.json();
  cmsDataCache = payload.data || defaultCmsData;
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload.session));
  return payload.session;
}

export function logoutAdmin() {
  localStorage.removeItem(SESSION_KEY);
  fetch("/api/cms/logout", { method: "POST", credentials: "same-origin" }).catch(() => {});
}

export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}
