import { useEffect, useState } from "react";
import multiGstinDashboard from "../assets/asp-gsp-multi-gstin-dashboard.png";
import reconciliationDashboard from "../assets/asp-gsp-reconciliation-dashboard.png";
import bulkDocumentsDashboard from "../assets/asp-gsp-bulk-documents-dashboard.png";
import imsNoticesVendorsDashboard from "../assets/asp-gsp-ims-notices-vendors-dashboard.png";

const capabilities = [
  ["Multi-GSTIN Management", "Manage GST registrations across companies, states and business units from one centralized workspace."],
  ["GST Returns", "Coordinate return preparation, review and filing workflows with clearer status visibility."],
  ["Reconciliation", "Compare purchase, sales and GST data to identify mismatches and support resolution."],
  ["e-Invoicing", "Create, validate and generate e-Invoices individually or in bulk for enterprise billing operations."],
  ["e-Way Bills", "Generate and manage e-Way Bills individually or in bulk through structured business workflows."],
  ["ITC Workflows", "Review input tax credit data, exceptions and follow-up actions from a unified workspace."],
  ["Enterprise Reporting", "Give finance and compliance teams consistent operational views and downloadable reports."],
  ["ERP Integration", "Connect ERP, SAP and business systems through secure integration workflows."],
  ["Bulk e-Invoice Generation", "Import, validate and generate e-Invoices in bulk through a controlled enterprise workflow."],
  ["Bulk e-Way Bill Generation", "Process high-volume e-Way Bill requirements with validation, review and export controls."],
  ["IMS Workflows", "Review inward supply records, take required actions and monitor exceptions from one workspace."],
  ["Notice Management", "Track GST notices, due dates, action status and supporting follow-ups across business units."],
  ["Vendor Management", "Coordinate vendor compliance status, document follow-ups and inward-data readiness."],
];

const workflow = [
  "Connect companies, GSTINs and authorized users",
  "Integrate ERP, billing and source systems",
  "Review compliance data and exceptions",
  "Complete approvals and filing workflows",
];

const showcaseSlides = [
  {
    title: "Multi-GSTIN visibility",
    description: "Monitor companies, registrations, filing status and action items from one centralized workspace.",
    src: multiGstinDashboard,
  },
  {
    title: "Reconciliation and ITC",
    description: "Review matched, mismatched and missing records with clear ITC and exception summaries.",
    src: reconciliationDashboard,
  },
  {
    title: "Bulk document generation",
    description: "Validate and process bulk e-Invoice and e-Way Bill requirements through structured controls.",
    src: bulkDocumentsDashboard,
  },
  {
    title: "IMS, notices and vendors",
    description: "Coordinate IMS actions, GST notices and vendor compliance follow-ups in one operational view.",
    src: imsNoticesVendorsDashboard,
  },
];

function BrowserFrame({ title, src }) {
  return (
    <figure className="asp-dashboard-frame">
      <div className="asp-browser-bar" aria-hidden="true">
        <span /><span /><span />
        <b>ASP-GSP Solutions</b>
      </div>
      <img src={src} alt={`${title} in ASP-GSP Solutions`} />
    </figure>
  );
}

export default function AspGspPage() {
  const [activeShowcase, setActiveShowcase] = useState(0);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");
    document.title = "ASP-GSP Solutions";
    description?.setAttribute(
      "content",
      "ASP-GSP Solutions for multi-GSTIN management, GST returns, reconciliation, e-Invoicing, e-Way Bills, IMS, notices, vendor management, reporting and enterprise integration.",
    );
    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.setAttribute("content", previousDescription);
    };
  }, []);

  useEffect(() => {
    const rotation = window.setInterval(() => {
      setActiveShowcase((current) => (current + 1) % showcaseSlides.length);
    }, 2000);
    return () => window.clearInterval(rotation);
  }, []);

  return (
    <div className="asp-gsp-page">
      <section className="asp-gsp-hero">
        <div className="asp-gsp-hero-copy">
          <h1>Enterprise GST Compliance with ASP-GSP Solutions</h1>
          <p>
            A unified solution for multi-GSTIN management, GST returns,
            reconciliation, e-Invoicing, e-Way Bills, IMS, notice and vendor
            management, reporting and enterprise integration.
          </p>
          <div>
            <a href="#asp-gsp-demo">Request a Demo</a>
            <a href="/company">Contact Sales</a>
          </div>
        </div>
        <div className="asp-gsp-hero-visual">
          <img
            src={multiGstinDashboard}
            alt="Multi-GSTIN management dashboard in ASP-GSP Solutions"
          />
        </div>
      </section>

      <section className="asp-gsp-intro">
        <div>
          <h2>Compliance visibility across every GSTIN</h2>
        </div>
        <div>
          <p>
            With ASP-GSP Solutions, businesses can manage multiple
            GSTINs from one centralized workspace.
          </p>
          <p>
            ASP-GSP Solutions simplifies GST compliance across
            companies, states and enterprise teams while supporting structured
            reviews, approvals and reporting.
          </p>
        </div>
      </section>

      <section className="asp-gsp-capabilities">
        <div className="asp-gsp-heading">
          <h2>Connected GST operations for enterprise teams</h2>
          <p>
            Bring GST processes, business data and operational workflows
            together through ASP-GSP Solutions.
          </p>
        </div>
        <div className="asp-capability-carousel">
          <div className="asp-capability-track">
            {[...capabilities, ...capabilities].map(([title, description], index) => {
              const isDuplicate = index >= capabilities.length;
              return (
                <article
                  key={`${title}-${index}`}
                  aria-hidden={isDuplicate ? "true" : undefined}
                >
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="asp-gsp-showcase">
        <div>
          <h2>Dashboards for faster compliance action</h2>
          <p>
            Monitor returns, reconciliations and pending actions through
            structured enterprise views designed around ASP-GSP
            Solutions.
          </p>
          <div className="asp-showcase-stage" aria-live="polite">
            <BrowserFrame
              title={showcaseSlides[activeShowcase].title}
              src={showcaseSlides[activeShowcase].src}
            />
            <div className="asp-showcase-caption">
              <div>
                <strong>{showcaseSlides[activeShowcase].title}</strong>
                <span>{showcaseSlides[activeShowcase].description}</span>
              </div>
              <div className="asp-showcase-controls" aria-label="Product dashboard views">
                {showcaseSlides.map((slide, index) => (
                  <button
                    type="button"
                    key={slide.title}
                    className={index === activeShowcase ? "is-active" : ""}
                    onClick={() => setActiveShowcase(index)}
                    aria-label={`Show ${slide.title}`}
                    aria-pressed={index === activeShowcase}
                  >
                    <span className="sr-only">{index + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="asp-gsp-workflow">
          <h2>Integrate systems without fragmenting compliance operations</h2>
          <p>
            Connect your ERP and business systems with ASP-GSP
            Solutions.
          </p>
          <ol>
            {workflow.map((item, index) => (
              <li key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="asp-gsp-final-cta" id="asp-gsp-demo">
        <div>
          <h2>Simplify GST Compliance with ASP-GSP Solutions</h2>
          <p>Discuss your GSTIN structure, compliance workflows and integration requirements with our team.</p>
        </div>
        <div>
          <a href="/company">Request a Demo</a>
          <a href="/company">Contact Sales</a>
        </div>
      </section>
    </div>
  );
}
