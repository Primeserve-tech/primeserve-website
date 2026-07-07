const STORAGE_KEY = "primeserve_cms_data_v1";
const SESSION_KEY = "primeserve_admin_session_v1";

const today = "2026-07-07";

export const defaultAdminUsers = [
  {
    id: "admin-super",
    email: "primeserve45@gmail.com",
    password: "Password@#321",
    name: "Super Admin",
    role: "Super Admin",
    status: "Active",
  },
  {
    id: "admin-hr",
    email: "hr@primeserve.in",
    password: "Password@#321",
    name: "HR Admin",
    role: "HR Admin",
    status: "Active",
  },
  {
    id: "admin-content",
    email: "content@primeserve.in",
    password: "Password@#321",
    name: "Content Admin",
    role: "Content Admin",
    status: "Active",
  },
];

export const defaultCmsData = {
  adminUsers: defaultAdminUsers,
  jobs: [
    {
      id: "job-1",
      title: "React Frontend Developer",
      department: "Technology",
      experience: "2-5 Years",
      location: "Greater Noida / Remote",
      employmentType: "Full Time",
      salaryRange: "As per experience",
      description: "Build polished customer-facing dashboards and reusable React components for PrimeServe products.",
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
      message: "Interested in PrimeServe technology team.",
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
      author: "PrimeServe Team",
      tags: "GST, APIs, Compliance",
      seoTitle: "GST Compliance APIs for Enterprises",
      seoDescription: "Learn how PrimeServe GST APIs help enterprises automate compliance.",
      status: "Published",
      publishDate: today,
      lastUpdatedDate: today,
      featured: "Yes",
      showOnHomepage: "Yes",
      readingTime: "1 min read",
      ogImage: "",
      coverAlt: "PrimeServe GST compliance APIs",
      canonicalUrl: "",
      relatedBlogs: "",
      downloadPdf: "Yes",
    },
  ],
  faqs: [
    {
      id: "faq-1",
      question: "What API services does PrimeServe provide?",
      answer: "PrimeServe provides GST APIs, e-Invoice, e-Way Bill, identity verification, business verification, DSC, SAP integration and managed compliance services.",
      category: "Enterprise APIs",
      tags: "api,gst,verification",
      sortOrder: "1",
      status: "Active",
      showOnHomepage: "Yes",
      seoTitle: "PrimeServe API FAQs",
      seoDescription: "Frequently asked questions about PrimeServe APIs and compliance solutions.",
    },
  ],
  webinars: [],
  caseStudies: [],
  productAnnouncements: [],
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
  news: [
    {
      id: "news-1",
      title: "PrimeServe expands enterprise API catalogue",
      shortDescription: "New verification, GST and compliance APIs added for growing enterprises.",
      fullDescription: "PrimeServe continues to expand its enterprise API catalogue with secure and scalable APIs for verification, GST, compliance and automation workflows.",
      image: "",
      date: today,
      status: "Published",
    },
  ],
  apiUpdates: [
    {
      id: "update-1",
      productName: "GST Taxpayer API",
      updateType: "Enhancement",
      description: "Improved response handling and faster validation performance.",
      releaseDate: today,
      status: "Published",
    },
    {
      id: "update-2",
      productName: "e-Invoice API",
      updateType: "New Launch",
      description: "New automation support for enterprise invoice generation workflows.",
      releaseDate: today,
      status: "Published",
    },
  ],
  clients: [
    { id: "client-1", name: "Alankit Limited", logo: "", industry: "Compliance Services", status: "Active", sortOrder: "1" },
    { id: "client-2", name: "Axis Bank", logo: "", industry: "Banking", status: "Active", sortOrder: "2" },
    { id: "client-3", name: "Bharti Airtel Payments Bank", logo: "", industry: "Payments", status: "Active", sortOrder: "3" },
  ],
  testimonials: [
    {
      id: "testimonial-1",
      clientName: "Enterprise Client",
      companyName: "PrimeServe Customer",
      designation: "Operations Head",
      photo: "",
      testimonial: "PrimeServe helped us automate compliance workflows with reliable support.",
      rating: "5",
      status: "Active",
    },
  ],
  supportTeam: [],
  newsletterSubscribers: [],
  newsletterCampaigns: [
    {
      id: "newsletter-1",
      subject: "PrimeServe Updates",
      body: "Hello,\n\nHere are the latest updates from PrimeServe.\n\nRegards,\nPrimeServe Team",
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
    companyName: "PrimeServe Global Solution Pvt. Ltd.",
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
    gstinApiUrl: "https://api.primeserve.in/commonapi/v1.1/search",
    gstinApiKey: "",
  },
  seo: [
    {
      id: "seo-home",
      page: "Home",
      title: "PrimeServe - Enterprise APIs & Compliance Solutions",
      metaDescription: "PrimeServe provides GST APIs, e-Invoice, e-Way Bill, verification APIs, DSC, SAP and managed compliance solutions.",
      metaKeywords: "GST API, e-Invoice API, e-Way Bill API, DSC, ASP GSP, PrimeServe",
      ogImage: "",
    },
  ],
};

export function getCmsData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCmsData));
    return defaultCmsData;
  }
  try {
    const storedData = JSON.parse(stored);
    const settings = {
      ...defaultCmsData.settings,
      ...(storedData.settings || {}),
    };
    const mergedData = {
      ...defaultCmsData,
      ...storedData,
      adminUsers: storedData.adminUsers || defaultCmsData.adminUsers,
      settings,
    };

    const now = Date.now();
    mergedData.supportTeam = (mergedData.supportTeam || []).filter((member) => {
      if (member.status === "Inactive") return true;
      const createdAt = member.createdAt ? new Date(member.createdAt).getTime() : now;
      return now - createdAt < 24 * 60 * 60 * 1000;
    });

    if (!settings.careersSeedMigrated) {
      mergedData.jobs = (mergedData.jobs || []).map((job) =>
        ["job-1", "job-2"].includes(job.id) ? { ...job, status: "Inactive" } : job
      );
      mergedData.settings = { ...settings, careersSeedMigrated: "true" };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
    }

    return mergedData;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCmsData));
    return defaultCmsData;
  }
}

export function saveCmsData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetCmsData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCmsData));
}

export function getSession() {
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function loginAdmin(email, password) {
  const users = getCmsData().adminUsers || defaultAdminUsers;
  const user = users.find(
    (item) =>
      item.status === "Active" &&
      item.email.toLowerCase() === email.toLowerCase() &&
      item.password === password
  );
  if (!user) return null;
  const session = { email: user.email, name: user.name, role: user.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logoutAdmin() {
  localStorage.removeItem(SESSION_KEY);
}

export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}
