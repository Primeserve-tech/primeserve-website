import { useEffect, useState } from "react";
import { createId, getCmsData, saveCmsData } from "../cmsStore";
import { hsnSacSeedData } from "../data/hsnSacData";

function PublicHero({ eyebrow, title, text, compact = false }) {
  return (
    <section className={`cms-public-hero ${compact ? "cms-public-hero-compact" : ""}`}>
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function usePageSeo({ title, description, path }) {
  useEffect(() => {
    const previousTitle = document.title;
    const managed = [];
    const upsertMeta = (selector, attrs) => {
      let tag = document.head.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        Object.entries(attrs).forEach(([key, value]) => tag.setAttribute(key, value));
        document.head.appendChild(tag);
        managed.push(tag);
      } else {
        Object.entries(attrs).forEach(([key, value]) => tag.setAttribute(key, value));
      }
      return tag;
    };
    const upsertLink = () => {
      let tag = document.head.querySelector('link[rel="canonical"]');
      if (!tag) {
        tag = document.createElement("link");
        tag.setAttribute("rel", "canonical");
        document.head.appendChild(tag);
        managed.push(tag);
      }
      tag.setAttribute("href", `https://primeserve.in${path}`);
    };

    document.title = title;
    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertLink();

    return () => {
      document.title = previousTitle;
      managed.forEach((tag) => tag.remove());
    };
  }, [title, description, path]);
}

function renderRichContent(content = "") {
  const looksHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  if (looksHtml) {
    return <div className="cms-rich-content" dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return (
    <div className="cms-rich-content">
      {content.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

function getHeadings(content = "") {
  const headings = [];
  const regex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
  let match = regex.exec(content);
  while (match) {
    headings.push(match[2].replace(/<[^>]*>/g, ""));
    match = regex.exec(content);
  }
  return headings;
}

function LeadCaptureForm({ sourcePage = "Website", service = "PrimeServe Services" }) {
  const [sent, setSent] = useState(false);

  const submitLead = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = getCmsData();
    const lead = {
      id: createId("lead"),
      name: form.get("name"),
      company: form.get("company"),
      email: form.get("email"),
      mobile: form.get("mobile"),
      service: form.get("service") || service,
      message: form.get("message"),
      sourcePage,
      date: new Date().toISOString().slice(0, 10),
      status: "New",
    };
    saveCmsData({ ...data, leads: [lead, ...(data.leads || [])] });
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <form className="lead-capture-card" onSubmit={submitLead}>
      <h3>Need help from PrimeServe?</h3>
      <p>Share your details and our team will connect with you.</p>
      {sent && <strong className="lead-success">Request saved successfully.</strong>}
      <input name="name" placeholder="Name" required />
      <input name="company" placeholder="Company" />
      <input name="email" type="email" placeholder="Email" required />
      <input name="mobile" placeholder="Mobile" />
      <input name="service" placeholder="Service Interested" defaultValue={service} />
      <textarea name="message" rows="4" placeholder="Message" />
      <button type="submit">Submit Enquiry</button>
    </form>
  );
}

export function CareersPage() {
  const [data, setData] = useState(getCmsData);
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState("");
  const jobs = data.jobs.filter((job) => job.status === "Active");
  const careersEmail = data.settings?.careersEmail || data.settings?.infoEmail || "info@primeserve.in";

  const workFeatures = [
    {
      title: "Growth Opportunities",
      text: "Work on enterprise projects and build your career with emerging technologies.",
    },
    {
      title: "Innovation First",
      text: "Contribute to APIs, compliance platforms, SAP integrations and digital business solutions.",
    },
    {
      title: "Collaborative Culture",
      text: "Work with experienced professionals in a supportive and inclusive environment.",
    },
    {
      title: "Continuous Learning",
      text: "Enhance your skills through challenging projects and ongoing learning opportunities.",
    },
    {
      title: "Employee Recognition",
      text: "We value dedication, performance and innovation that drive real customer success.",
    },
    {
      title: "Work-Life Balance",
      text: "We believe strong outcomes come from a healthy professional and personal balance.",
    },
  ];

  const benefits = [
    "Competitive Compensation",
    "Career Growth Opportunities",
    "Performance-Based Rewards",
    "Professional Development",
    "Flexible Working Environment",
    "Collaborative Team Culture",
    "Modern Technology Stack",
    "Enterprise-Level Projects",
  ];

  const process = [
    "Application Submission",
    "Resume Screening",
    "Technical / HR Interview",
    "Final Discussion",
    "Offer & Onboarding",
  ];

  const submitApplication = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const resume = form.get("resume");
    const application = {
      id: createId("app"),
      fullName: form.get("fullName"),
      email: form.get("email"),
      mobile: form.get("mobile"),
      position: form.get("position"),
      experience: form.get("experience"),
      currentCtc: form.get("currentCtc"),
      expectedCtc: form.get("expectedCtc"),
      noticePeriod: form.get("noticePeriod"),
      resumeName: resume?.name || "",
      message: form.get("message"),
      status: "New",
      date: new Date().toISOString().slice(0, 10),
    };
    const nextData = { ...data, applications: [application, ...data.applications] };
    saveCmsData(nextData);
    setData(nextData);
    setToast("Application submitted successfully.");
    event.currentTarget.reset();
  };

  return (
    <div className="cms-public-page">
      <PublicHero
        eyebrow="CAREERS"
        title="Join PrimeServe"
        text="Build the future of digital compliance, enterprise APIs and business technology with us."
      />
      {toast && <div className="cms-toast">{toast}</div>}

      <section className="careers-intro-band">
        <div>
          <span>WHY JOIN PRIMESERVE</span>
          <h2>Build meaningful enterprise technology.</h2>
          <p>
            At PrimeServe Global Solution Private Limited, we are passionate
            about innovation, technology and customer success. Whether you are a
            software developer, sales professional, compliance expert, SAP
            consultant or customer support specialist, PrimeServe offers an
            environment where your ideas are valued and your career can grow.
          </p>
        </div>
        <a href="#open-positions">View Open Positions</a>
      </section>

      <section className="careers-section">
        <div className="careers-section-heading">
          <span>- WHY WORK WITH US -</span>
          <h2>A place to learn, contribute and grow.</h2>
        </div>
        <div className="careers-feature-grid">
          {workFeatures.map((item, index) => (
            <article className="careers-feature-card" key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="careers-section" id="open-positions">
        <div className="careers-section-heading">
          <span>- CURRENT OPENINGS -</span>
          <h2>Active vacancies published by HR.</h2>
          <p>
            Only roles marked Active in the Admin CMS are shown here.
          </p>
        </div>

        {jobs.length > 0 ? (
          <div className="career-openings-wrap">
            {jobs.map((job) => (
              <article className="career-opening-card" key={job.id}>
                <div>
                  <span>{job.department}</span>
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>
                </div>
                <div className="cms-card-meta">
                  <b>{job.experience}</b>
                  <b>{job.location}</b>
                  <b>{job.employmentType}</b>
                </div>
                <button type="button" onClick={() => setSelectedJob(job)}>
                  Apply Now
                </button>
              </article>
            ))}
          </div>
        ) : (
          <article className="careers-empty-card">
            <span>No Current Openings</span>
            <h3>Did not find a suitable role?</h3>
            <p>
              We are always looking for passionate and talented individuals. If
              you do not see a suitable opening, send your resume and we will
              contact you when a relevant opportunity becomes available.
            </p>
            <a href={`mailto:${careersEmail}`}>{careersEmail}</a>
          </article>
        )}
      </section>

      <section className="careers-section careers-two-column">
        <div>
          <div className="careers-section-heading left">
            <span>- EMPLOYEE BENEFITS -</span>
            <h2>Support that helps people do good work.</h2>
          </div>
          <div className="careers-benefit-grid">
            {benefits.map((benefit) => (
              <span key={benefit}>{benefit}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="careers-section-heading left">
            <span>- RECRUITMENT PROCESS -</span>
            <h2>Simple, clear and respectful.</h2>
          </div>
          <div className="careers-process">
            {process.map((step, index) => (
              <article key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="careers-resume-card">
        <div>
          <span>SUBMIT RESUME</span>
          <h2>Stay connected for future roles.</h2>
          <p>
            Share your profile with PrimeServe. This request is sent to the
            careers email configured in Admin CMS.
          </p>
        </div>
        <form
          className="careers-resume-form"
          action={`mailto:${careersEmail}`}
          method="post"
          encType="text/plain"
        >
          <input name="Full Name" placeholder="Full Name" required />
          <input name="Email" type="email" placeholder="Email" required />
          <input name="Mobile" placeholder="Mobile" />
          <input name="Preferred Role" placeholder="Preferred Role" />
          <input name="Resume" type="file" accept=".pdf,.doc,.docx" />
          <textarea name="Message" placeholder="Short message" rows="4" />
          <button type="submit">Submit Your Resume</button>
        </form>
      </section>

      {selectedJob && (
        <div className="cms-apply-overlay" onClick={() => setSelectedJob(null)}>
          <div className="cms-apply-modal" onClick={(event) => event.stopPropagation()}>
            <button className="cms-close" type="button" onClick={() => setSelectedJob(null)}>
              x
            </button>
            <h2>{selectedJob.title}</h2>
            <p>{selectedJob.description}</p>
            <div className="cms-job-detail">
              <strong>Responsibilities</strong>
              <p>{selectedJob.responsibilities}</p>
              <strong>Required Skills</strong>
              <p>{selectedJob.skills}</p>
            </div>
            <form onSubmit={submitApplication}>
              <input name="fullName" placeholder="Full Name" required />
              <input name="email" type="email" placeholder="Email" required />
              <input name="mobile" placeholder="Mobile" required />
              <input name="position" value={selectedJob.title} readOnly />
              <input name="experience" placeholder="Experience" required />
              <input name="currentCtc" placeholder="Current CTC" />
              <input name="expectedCtc" placeholder="Expected CTC" />
              <input name="noticePeriod" placeholder="Notice Period" />
              <input name="resume" type="file" accept=".pdf,.doc,.docx" />
              <textarea name="message" placeholder="Message" rows="4" />
              <button type="submit">Submit Application</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function BlogPage() {
  const data = getCmsData();
  const slug = window.location.pathname.split("/blog/")[1];
  const blogs = data.blogs.filter((blog) => blog.status === "Published");
  const activeBlog = slug ? blogs.find((blog) => blog.slug === slug) : null;

  if (activeBlog) {
    const headings = getHeadings(activeBlog.content);
    const relatedSlugs = String(activeBlog.relatedBlogs || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const relatedBlogs = blogs.filter((blog) => relatedSlugs.includes(blog.slug) && blog.id !== activeBlog.id);
    const shareUrl = window.location.href;
    return (
      <div className="cms-public-page">
        <PublicHero eyebrow={activeBlog.category} title={activeBlog.title} text={activeBlog.shortDescription} />
        <article className="cms-detail-article blog-detail-layout">
          <div>
            <div className="cms-card-meta">
              <b>{activeBlog.category}</b>
              <b>By {activeBlog.author}</b>
              <b>{activeBlog.publishDate}</b>
              <b>{activeBlog.readingTime}</b>
            </div>
            {activeBlog.coverImage && activeBlog.coverImage.startsWith("data:image") && (
              <img className="blog-cover-image" src={activeBlog.coverImage} alt={activeBlog.coverAlt || activeBlog.title} />
            )}
            {activeBlog.coverImage && !activeBlog.coverImage.startsWith("data:image") && (
              <a className="cms-media-link" href={activeBlog.coverImage} target="_blank" rel="noreferrer" download>
                View / Download Attachment
              </a>
            )}
            {renderRichContent(activeBlog.content)}
            <div className="cms-share-row">
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${activeBlog.title} ${shareUrl}`)}`} target="_blank" rel="noreferrer">WhatsApp</a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(activeBlog.title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">X</a>
              <a href={`mailto:?subject=${encodeURIComponent(activeBlog.title)}&body=${encodeURIComponent(shareUrl)}`}>Email</a>
              {activeBlog.downloadPdf !== "No" && <button type="button" onClick={() => window.print()}>Download PDF</button>}
            </div>
            <div className="blog-cta-box">
              <h3>Looking for enterprise APIs, GST solutions, DSC, SAP integration or managed compliance services?</h3>
              <p>Contact PrimeServe for secure, scalable and reliable digital business solutions.</p>
            </div>
            {relatedBlogs.length > 0 && (
              <div className="related-articles">
                <h3>Related Articles</h3>
                {relatedBlogs.map((blog) => (
                  <a key={blog.id} href={`/blog/${blog.slug}`}>{blog.title}</a>
                ))}
              </div>
            )}
          </div>
          <aside className="blog-sidebar">
            <div className="toc-card">
              <h3>Table of Contents</h3>
              {headings.length ? headings.map((heading) => <span key={heading}>{heading}</span>) : <span>Article Overview</span>}
            </div>
            <LeadCaptureForm sourcePage={`/blog/${activeBlog.slug}`} service="Enterprise APIs" />
          </aside>
        </article>
      </div>
    );
  }

  return (
    <div className="cms-public-page">
      <PublicHero
        eyebrow="BLOG"
        title="Insights for APIs, compliance and digital transformation."
        text="Read PrimeServe updates and practical guides for enterprise technology teams."
      />
      <section className="cms-public-grid">
        {blogs.map((blog) => (
          <article className="cms-public-card" key={blog.id}>
            <span>{blog.category}</span>
            <h2>{blog.title}</h2>
            <p>{blog.shortDescription}</p>
            {blog.coverImage && (
              <a className="cms-media-link" href={blog.coverImage} target="_blank" rel="noreferrer" download>
                View / Download Attachment
              </a>
            )}
            <a href={`/blog/${blog.slug}`}>Read Blog</a>
          </article>
        ))}
      </section>
    </div>
  );
}

export function NewsPage() {
  const data = getCmsData();
  const news = data.news.filter((item) => item.status === "Published");
  return (
    <div className="cms-public-page">
      <PublicHero
        eyebrow="NEWS & UPDATES"
        title="Latest company updates from PrimeServe."
        text="Follow new launches, business updates and important announcements."
      />
      <section className="cms-public-grid">
        {news.map((item) => (
          <article className="cms-public-card" key={item.id}>
            <span>{item.date}</span>
            <h2>{item.title}</h2>
            <p>{item.fullDescription}</p>
            {item.image && (
              <a className="cms-media-link" href={item.image} target="_blank" rel="noreferrer" download>
                View / Download Attachment
              </a>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}

export function ApiUpdatesPage() {
  const data = getCmsData();
  const updates = data.apiUpdates.filter((item) => item.status === "Published");
  return (
    <div className="cms-public-page">
      <PublicHero
        eyebrow="WHAT'S NEW"
        title="API and product release updates."
        text="Track new launches, enhancements, maintenance notices and product changes."
      />
      <section className="cms-public-grid">
        {updates.map((item) => (
          <article className="cms-public-card" key={item.id}>
            <span>{item.updateType}</span>
            <h2>{item.productName}</h2>
            <p>{item.description}</p>
            <div className="cms-card-meta">
              <b>{item.releaseDate}</b>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export function FaqPage() {
  const data = getCmsData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const faqs = (data.faqs || []).filter((item) => item.status === "Active");
  const categories = ["All", ...new Set(faqs.map((item) => item.category).filter(Boolean))];
  const filtered = faqs
    .filter((item) => category === "All" || item.category === category)
    .filter((item) => `${item.question} ${item.answer} ${item.tags}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));

  return (
    <div className="cms-public-page">
      <PublicHero eyebrow="FAQS" title="Answers for PrimeServe services." text="Search common questions about APIs, GST, DSC, ASP-GSP, onboarding and support." />
      <section className="knowledge-section">
        <div className="knowledge-filters">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search FAQs by keyword" />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="faq-list">
          {filtered.map((item) => (
            <details key={item.id}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

export function WebinarsPage() {
  const data = getCmsData();
  const webinars = (data.webinars || []).filter((item) => item.status === "Published");
  return (
    <div className="cms-public-page">
      <PublicHero eyebrow="WEBINARS" title="PrimeServe webinars and events." text="Join upcoming sessions or watch recorded discussions from our experts." />
      <section className="knowledge-grid">
        {webinars.map((item) => (
          <article className="knowledge-card" key={item.id}>
            {item.thumbnail && item.thumbnail.startsWith("data:image") && <img src={item.thumbnail} alt={item.title} />}
            <span>{item.webinarType}</span>
            <h2>{item.title}</h2>
            <p>{item.shortDescription}</p>
            <div className="cms-card-meta">
              <b>{item.eventDate}</b>
              <b>{item.eventTime}</b>
              <b>{item.duration}</b>
            </div>
            {item.webinarType === "Recorded" && item.videoUrl ? (
              <a href={item.videoUrl} target="_blank" rel="noreferrer">Watch Recording</a>
            ) : (
              <a href={item.registrationLink || "#"} target="_blank" rel="noreferrer">Register</a>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}

export function CaseStudiesPage() {
  const data = getCmsData();
  const caseStudies = (data.caseStudies || []).filter((item) => item.status === "Published");
  const slug = window.location.pathname.split("/case-studies/")[1];
  const active = slug ? caseStudies.find((item) => item.slug === slug) : null;

  if (active) {
    return (
      <div className="cms-public-page">
        <PublicHero eyebrow={active.industry} title={active.title} text={`How PrimeServe supported ${active.clientName}.`} />
        <article className="cms-detail-article">
          <h2>About the Client</h2>
          <p>{active.clientName}</p>
          <h2>Business Challenge</h2>
          <p>{active.challenge}</p>
          <h2>PrimeServe Solution</h2>
          <p>{active.solution}</p>
          <h2>Results Achieved</h2>
          <p>{active.results}</p>
          <h2>Services Used</h2>
          <p>{active.servicesUsed}</p>
          {active.pdf && <a className="cms-media-link" href={active.pdf} target="_blank" rel="noreferrer" download>Download PDF</a>}
          <LeadCaptureForm sourcePage={`/case-studies/${active.slug}`} service="Case Study Enquiry" />
        </article>
      </div>
    );
  }

  return (
    <div className="cms-public-page">
      <PublicHero eyebrow="CASE STUDIES" title="Enterprise results powered by PrimeServe." text="Explore how our APIs, automation and compliance services help businesses move faster." />
      <section className="knowledge-grid">
        {caseStudies.map((item) => (
          <article className="knowledge-card" key={item.id}>
            {item.coverImage && item.coverImage.startsWith("data:image") && <img src={item.coverImage} alt={item.title} />}
            <span>{item.industry}</span>
            <h2>{item.title}</h2>
            <p>{item.challenge}</p>
            <a href={`/case-studies/${item.slug}`}>Read Case Study</a>
          </article>
        ))}
      </section>
    </div>
  );
}

export function ProductAnnouncementsPage() {
  const data = getCmsData();
  const announcements = (data.productAnnouncements || []).filter((item) => item.status === "Published");
  return (
    <div className="cms-public-page">
      <PublicHero eyebrow="ANNOUNCEMENTS" title="Product and service announcements." text="Track PrimeServe launches, feature updates, maintenance and partnership news." />
      <section className="knowledge-grid">
        {announcements.map((item) => (
          <article className="knowledge-card" key={item.id}>
            {item.image && item.image.startsWith("data:image") && <img src={item.image} alt={item.title} />}
            <span>{item.announcementType}</span>
            <h2>{item.title}</h2>
            <p>{item.fullDetails || item.shortDescription}</p>
            <div className="cms-card-meta"><b>{item.product}</b><b>{item.publishDate}</b></div>
          </article>
        ))}
      </section>
    </div>
  );
}

export function ApiReleaseNotesPage() {
  const data = getCmsData();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const releases = (data.apiReleaseNotes || []).filter((item) => item.status === "Published");
  const types = ["All", ...new Set(releases.map((item) => item.updateType).filter(Boolean))];
  const filtered = releases
    .filter((item) => type === "All" || item.updateType === type)
    .filter((item) => `${item.apiName} ${item.description}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="cms-public-page">
      <PublicHero eyebrow="API RELEASE NOTES" title="Track API changes and releases." text="Search updates, enhancements, maintenance notes and breaking changes." />
      <section className="knowledge-section">
        <div className="knowledge-filters">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by API name" />
          <select value={type} onChange={(event) => setType(event.target.value)}>
            {types.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="release-timeline">
          {filtered.map((item) => (
            <article key={item.id}>
              <span>{item.releaseDate} | {item.updateType}</span>
              <h2>{item.apiName} {item.version && `v${item.version}`}</h2>
              <p>{item.description}</p>
              {item.breakingChange === "Yes" && <strong>Breaking Change</strong>}
              {item.migrationNotes && <p>{item.migrationNotes}</p>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ResourcesPage() {
  const data = getCmsData();
  const [unlocked, setUnlocked] = useState({});
  const resources = (data.resources || []).filter((item) => item.status === "Active");

  const unlock = (event, item) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lead = {
      id: createId("lead"),
      name: form.get("name"),
      company: form.get("company"),
      email: form.get("email"),
      mobile: form.get("mobile"),
      service: item.title,
      message: "Resource download request",
      sourcePage: "/resources",
      date: new Date().toISOString().slice(0, 10),
      status: "New",
    };
    const cms = getCmsData();
    saveCmsData({ ...cms, leads: [lead, ...(cms.leads || [])] });
    setUnlocked({ ...unlocked, [item.id]: true });
  };

  return (
    <div className="cms-public-page">
      <PublicHero eyebrow="RESOURCES" title="Download PrimeServe resources." text="Access catalogues, guides, documents and business resources." />
      <section className="knowledge-grid">
        {resources.map((item) => (
          <article className="knowledge-card" key={item.id}>
            {item.coverImage && item.coverImage.startsWith("data:image") && <img src={item.coverImage} alt={item.title} />}
            <span>{item.category}</span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            {item.accessType === "Lead Capture" && !unlocked[item.id] ? (
              <form className="mini-lead-form" onSubmit={(event) => unlock(event, item)}>
                <input name="name" placeholder="Name" required />
                <input name="company" placeholder="Company" />
                <input name="email" type="email" placeholder="Email" required />
                <input name="mobile" placeholder="Mobile" />
                <button type="submit">Unlock Download</button>
              </form>
            ) : (
              item.file && <a href={item.file} target="_blank" rel="noreferrer" download>Download</a>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}

export function HsnSacFinderPage() {
  const data = getCmsData();
  const [code, setCode] = useState("");
  const [searched, setSearched] = useState(false);
  const [matches, setMatches] = useState([]);
  const isEnabled = data.settings?.hsnSacToolEnabled !== "No";
  const records = [...(data.hsnSacRecords || []), ...hsnSacSeedData].filter((item) => item.status !== "Inactive");

  const handleSearch = (event) => {
    event.preventDefault();
    const cleanCode = code.trim().replace(/\s+/g, "").toLowerCase();
    setSearched(true);
    if (!cleanCode) {
      setMatches([]);
      return;
    }
    const found = records
      .filter((item) => String(item.code || "").trim().replace(/\s+/g, "").toLowerCase() === cleanCode)
      .slice(0, 12);
    setMatches(found);
  };

  return (
    <div className="cms-public-page">
      <PublicHero compact eyebrow="TOOLS" title="HSN/SAC Code Finder" text="Enter an HSN or SAC code and click Search to view GST rate and classification details." />
      <section className="hsn-tool-panel tools-search-panel">
        {!isEnabled ? (
          <div className="tool-disabled-card">
            <h2>HSN/SAC Code Finder is currently unavailable.</h2>
            <p>Please contact PrimeServe for GST API or HSN/SAC integration support.</p>
          </div>
        ) : (
          <form className="tool-search-card" onSubmit={handleSearch}>
            <label htmlFor="hsn-sac-code">Enter HSN/SAC Code</label>
            <div>
              <input
                id="hsn-sac-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Example: 998313 or 1001"
                inputMode="numeric"
              />
              <button type="submit">Search</button>
            </div>
          </form>
        )}
        {isEnabled && searched && matches.length === 0 && (
          <div className="hsn-no-result">
            <h2>No matching HSN/SAC code found.</h2>
            <p>Please contact PrimeServe for assistance.</p>
            <LeadCaptureForm sourcePage="/tools/hsn-sac-code-finder" service="GST APIs / HSN SAC Integration" />
          </div>
        )}
        {isEnabled && matches.length > 0 && (
          <div className="tool-result-list">
            {matches.map((item, index) => (
              <article className="tool-result-card" key={`${item.code}-${index}`}>
                <div className="tool-result-head">
                  <span>{item.type || "HSN/SAC"}</span>
                  <strong>{item.code}</strong>
                </div>
                <div className="tool-result-grid">
                  <div>
                    <small>Description</small>
                    <p>{item.description || "Not available"}</p>
                  </div>
                  <div>
                    <small>GST Rate</small>
                    <p>{item.gstRate ? `${item.gstRate}%` : "Not available"}</p>
                  </div>
                  <div>
                    <small>Category</small>
                    <p>{item.category || "Not available"}</p>
                  </div>
                  <div>
                    <small>Chapter</small>
                    <p>{item.chapter || "Not available"}</p>
                  </div>
                </div>
                <button type="button" onClick={() => navigator.clipboard?.writeText(item.code)}>
                  Copy Code
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function formatJsonLabel(key) {
  return String(key)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getBase64Candidate(payload) {
  if (typeof payload === "string") return payload.trim();
  if (!payload || typeof payload !== "object") return "";
  const keys = ["data", "response", "result", "payload", "message", "encodedData"];
  for (const key of keys) {
    if (typeof payload[key] === "string" && payload[key].trim()) return payload[key].trim();
  }
  return "";
}

function decodePrimeServeResponse(rawPayload) {
  let payload = rawPayload;
  if (typeof rawPayload === "string") {
    try {
      payload = JSON.parse(rawPayload);
    } catch {
      payload = rawPayload;
    }
  }

  const candidate = getBase64Candidate(payload);
  if (!candidate) return payload;

  try {
    const decodedText = decodeURIComponent(
      Array.prototype.map.call(atob(candidate), (char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join("")
    );
    try {
      return JSON.parse(decodedText);
    } catch {
      return { decodedResponse: decodedText };
    }
  } catch {
    return payload;
  }
}

function normalizeGstinPayload(payload) {
  if (!payload || typeof payload !== "object") return payload;

  const directKeys = ["gstin", "lgnm", "tradeNam", "rgdt", "ctb", "sts", "dty", "pradr"];
  if (directKeys.some((key) => Object.prototype.hasOwnProperty.call(payload, key))) return payload;

  const wrappers = ["data", "result", "response", "payload", "taxpayerInfo", "gstinDetails"];
  for (const key of wrappers) {
    if (payload[key] && typeof payload[key] === "object") {
      const normalized = normalizeGstinPayload(payload[key]);
      if (normalized && typeof normalized === "object" && normalized !== payload[key]) return normalized;
      if (normalized && typeof normalized === "object" && directKeys.some((field) => Object.prototype.hasOwnProperty.call(normalized, field))) {
        return normalized;
      }
    }
  }

  return payload;
}

function ReadableJson({ data }) {
  if (data === null || data === undefined || data === "") {
    return <span className="json-empty">Not available</span>;
  }

  if (Array.isArray(data)) {
    return (
      <div className="readable-json-list">
        {data.map((item, index) => (
          <div className="readable-json-nested" key={index}>
            <ReadableJson data={item} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === "object") {
    return (
      <div className="readable-json-grid">
        {Object.entries(data).map(([key, value]) => (
          <div className="readable-json-row" key={key}>
            <small>{formatJsonLabel(key)}</small>
            <ReadableJson data={value} />
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(data)}</span>;
}

function formatAddress(address = {}) {
  if (!address || typeof address !== "object") return "Not available";
  return [
    address.bno,
    address.flno,
    address.bnm,
    address.st,
    address.loc || address.locality,
    address.dst,
    address.stcd,
    address.pncd,
  ].filter(Boolean).join(", ") || "Not available";
}

function formatOffice(label, code, text) {
  const lines = [code, text].filter(Boolean);
  return lines.length ? lines.join("\n") : "Not available";
}

function yesNo(value) {
  if (value === true || value === "Y" || value === "Yes" || value === "YES") return "Yes";
  if (value === false || value === "N" || value === "No" || value === "NO") return "No";
  return value || "No";
}

function GstInfoCell({ label, value, isLink }) {
  return (
    <div className="gst-info-cell">
      <strong>{label}</strong>
      {isLink ? <button type="button">{value}</button> : <span>{value || "Not available"}</span>}
    </div>
  );
}

function GstSection({ title, children }) {
  return (
    <details className="gst-accordion" open>
      <summary>{title}</summary>
      <div>{children}</div>
    </details>
  );
}

function getReadableApiError(rawText, fallback) {
  try {
    const parsed = JSON.parse(rawText);
    return parsed.error || parsed.message || fallback;
  } catch {
    return rawText || fallback;
  }
}

async function fetchGstinViaProxy({ gstin, endpoint }) {
  const response = await fetch(endpoint, { method: "GET" });
  const rawText = await response.text();
  if (!response.ok) {
    throw new Error(getReadableApiError(rawText, "GSTIN validation failed."));
  }

  const trimmedText = rawText.trim().toLowerCase();
  if (trimmedText.startsWith("<!doctype") || trimmedText.startsWith("<html") || rawText.includes('id="root"')) {
    throw new Error("GSTIN server endpoint is not active. Please restart the local server and save the API key again from Admin > Website Settings.");
  }

  const decoded = normalizeGstinPayload(decodePrimeServeResponse(rawText));
  if (decoded?.error || decoded?.message === "API key required") {
    throw new Error(decoded.error || decoded.message);
  }
  return decoded;
}

function GstinResultView({ data, searchedGstin, onBack }) {
  const principalAddress = data?.pradr?.addr;
  const additionalTradeNames = Array.isArray(data?.tradeNamAdditional)
    ? data.tradeNamAdditional.join(", ")
    : data?.additionalTradeName || "View";
  const natureOfBusiness = Array.isArray(data?.nba) ? data.nba : [];
  const additionalPlaces = Array.isArray(data?.adadr) ? data.adadr : [];

  return (
    <article className="gst-result-panel">
      <div className="gst-result-topbar">
        <h2>Search Result based on GSTIN/UIN : <span>{data?.gstin || searchedGstin}</span></h2>
        <button type="button" onClick={onBack}>Back</button>
      </div>

      <div className="gst-info-grid">
        <GstInfoCell label="Legal Name of Business" value={data?.lgnm} />
        <GstInfoCell label="Trade Name" value={data?.tradeNam || data?.tradeName} />
        <GstInfoCell label="Effective Date of Registration" value={data?.rgdt} />
        <GstInfoCell label="Constitution of Business" value={data?.ctb} />
        <GstInfoCell label="GSTIN / UIN Status" value={data?.sts} />
        <GstInfoCell label="Taxpayer Type" value={data?.dty} />
        <GstInfoCell label="Administrative Office" value={formatOffice("(JURISDICTION - STATE)", data?.stjCd, data?.stj)} />
        <GstInfoCell label="Other Office" value={formatOffice("(JURISDICTION - CENTER)", data?.ctjCd, data?.ctj)} />
        <GstInfoCell label="Principal Place of Business" value={formatAddress(principalAddress)} />
        <GstInfoCell label="Whether Aadhaar Authenticated?" value={yesNo(data?.adhrVFlag || data?.aadhaarVerified)} />
        <GstInfoCell label="Whether e-KYC Verified?" value={yesNo(data?.ekycVFlag || data?.ekycVerified)} />
        <GstInfoCell label="Additional Trade Name" value={additionalTradeNames} isLink={additionalTradeNames === "View"} />
      </div>

      <GstSection title="Nature of Core Business Activity">
        <p className="gst-red-text">{data?.nba?.[0] || data?.ntcrbs || "Not available"}</p>
      </GstSection>

      <GstSection title="Nature of Business Activities">
        {natureOfBusiness.length ? (
          <ol className="gst-business-list">
            {natureOfBusiness.map((item, index) => <li key={item}>{item}</li>)}
          </ol>
        ) : (
          <p>Not available</p>
        )}
      </GstSection>

      {additionalPlaces.length > 0 && (
        <GstSection title="Additional Places of Business">
          <div className="gst-address-list">
            {additionalPlaces.map((item, index) => (
              <p key={index}>{formatAddress(item.addr)}{item.ntr ? ` - ${item.ntr}` : ""}</p>
            ))}
          </div>
        </GstSection>
      )}
    </article>
  );
}

export function GstinValidatorPage() {
  const data = getCmsData();
  const settings = data.settings || {};
  const [gstin, setGstin] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEnabled = settings.gstinValidatorEnabled !== "No";

  const handleSearch = async (event) => {
    event.preventDefault();
    const cleanGstin = gstin.trim().toUpperCase();
    setResult(null);
    setError("");

    if (!cleanGstin) {
      setError("Please enter a GSTIN before searching.");
      return;
    }

    setLoading(true);
    try {
      setResult(await fetchGstinViaProxy({
        gstin: cleanGstin,
        endpoint: `/api/gstin-validator.php?gstin=${encodeURIComponent(cleanGstin)}`,
      }));
    } catch (requestError) {
      setError(requestError.message || "Unable to validate GSTIN right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cms-public-page">
      <PublicHero compact eyebrow="TOOLS" title="GSTIN Validator" text="Enter a GSTIN and click Search to validate taxpayer details through PrimeServe API." />
      <section className="hsn-tool-panel tools-search-panel">
        {!isEnabled ? (
          <div className="tool-disabled-card">
            <h2>GSTIN Validator is currently disabled.</h2>
            <p>Please contact PrimeServe for GST verification API access.</p>
          </div>
        ) : (
          <>
            <form className="tool-search-card" onSubmit={handleSearch}>
              <label htmlFor="gstin-input">Enter GSTIN</label>
              <div>
                <input
                  id="gstin-input"
                  value={gstin}
                  onChange={(event) => setGstin(event.target.value.toUpperCase())}
                  placeholder="Example: 09ABCDE1234F1Z5"
                  maxLength="15"
                />
                <button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
              </div>
            </form>
            {error && <div className="tool-error">{error}</div>}
            {loading && <div className="tool-loading">Checking GSTIN details...</div>}
            {result && (
              <GstinResultView
                data={result}
                searchedGstin={gstin.trim().toUpperCase()}
                onBack={() => setResult(null)}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}

export function GstinSearchPage() {
  usePageSeo({
    title: "GSTIN Search | GST Public Search API | PrimeServe",
    description: "Search GSTIN details securely using PrimeServe GST Public API. Enter a valid GSTIN to view taxpayer status, legal name, trade name, registration details and business activity.",
    path: "/gstin-search",
  });

  const [gstin, setGstin] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateGstin = (value) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value);

  const handleSearch = async (event) => {
    event.preventDefault();
    const cleanGstin = gstin.trim().toUpperCase();
    setGstin(cleanGstin);
    setResult(null);
    setError("");

    if (!cleanGstin) {
      setError("Please enter a GSTIN before searching.");
      return;
    }

    if (cleanGstin.length !== 15 || !validateGstin(cleanGstin)) {
      setError("Please enter a valid 15-character GSTIN in uppercase format.");
      return;
    }

    setLoading(true);
    try {
      setResult(await fetchGstinViaProxy({
        gstin: cleanGstin,
        endpoint: `/api/gstin-search.php?gstin=${encodeURIComponent(cleanGstin)}`,
      }));
    } catch (requestError) {
      setError(requestError.message || "Unable to search GSTIN right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cms-public-page">
      <PublicHero compact eyebrow="GST PUBLIC SEARCH" title="GSTIN Search" text="Enter a GSTIN and click Search to view live taxpayer details through PrimeServe GST Public API." />
      <section className="hsn-tool-panel tools-search-panel gstin-search-hidden-page">
        <form className="tool-search-card" onSubmit={handleSearch}>
          <label htmlFor="gstin-search-input">Enter GSTIN</label>
          <div>
            <input
              id="gstin-search-input"
              value={gstin}
              onChange={(event) => setGstin(event.target.value.toUpperCase().replace(/\s/g, ""))}
              placeholder="Example: 09ABCDE1234F1Z5"
              maxLength="15"
              autoComplete="off"
              aria-describedby="gstin-search-help"
            />
            <button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
          </div>
          <p id="gstin-search-help" className="tool-helper-text">GSTIN must be 15 characters. The API key is handled server-side and is never exposed in this page.</p>
        </form>
        {error && <div className="tool-error" role="alert">{error}</div>}
        {loading && <div className="tool-loading">Searching live GSTIN details...</div>}
        {result && (
          <GstinResultView
            data={result}
            searchedGstin={gstin.trim().toUpperCase()}
            onBack={() => setResult(null)}
          />
        )}
      </section>
    </div>
  );
}
