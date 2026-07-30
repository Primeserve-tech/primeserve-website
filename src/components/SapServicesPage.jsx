import { useCallback, useEffect, useRef } from "react";
import sapHero from "../assets/enterprise-solutions-hero.png";

const benefits = [
  ["Business-Focused Approach", "Solutions aligned with operational and transformation objectives."],
  ["End-to-End Support", "Support from planning and implementation through optimisation and ongoing operations."],
  ["Integration Expertise", "Connect SAP with enterprise applications, APIs and external platforms."],
  ["Automation-Driven", "Reduce repetitive processes through intelligent SAP workflow automation."],
];

const services = [
  {
    id: "implementation",
    number: "01",
    title: "SAP Implementation",
    text: "End-to-end SAP implementation support covering requirement analysis, solution planning, configuration, testing, deployment and post-go-live assistance.",
    capabilities: ["Requirement Assessment", "Solution Planning", "Configuration", "Testing & Deployment", "User Enablement", "Go-Live Support"],
  },
  {
    id: "consulting",
    number: "02",
    title: "SAP Consulting",
    text: "Business and technology consulting to help organisations evaluate processes, identify improvement opportunities and create a practical SAP transformation roadmap.",
    capabilities: ["Process Assessment", "SAP Strategy", "Solution Architecture", "Transformation Planning", "Process Optimisation", "Advisory Services"],
  },
  {
    id: "integration",
    number: "03",
    title: "SAP Integration",
    text: "Connect SAP securely with business applications, APIs, tax platforms, banking systems and other enterprise environments.",
    capabilities: ["API Integration", "ERP Integration", "Third-Party Systems", "GST Integration", "e-Invoice Integration", "e-Way Bill Integration"],
  },
  {
    id: "migration",
    number: "04",
    title: "SAP Migration",
    text: "Structured migration services for organisations modernising legacy environments or transitioning workloads, integrations and business processes.",
    capabilities: ["Migration Assessment", "Data Planning", "System Transition", "Integration Migration", "Validation", "Post-Migration Support"],
  },
  {
    id: "automation",
    number: "05",
    title: "SAP Automation",
    text: "Automate repetitive SAP processes and digital workflows to reduce manual intervention, improve turnaround time and strengthen operational controls.",
    capabilities: ["Workflow Automation", "Document Automation", "Approval Automation", "Process Integration", "Compliance Automation", "Custom Automation"],
  },
  {
    id: "support",
    number: "06",
    title: "SAP Support & Managed Services",
    text: "Ongoing technical and functional support to help organisations maintain reliable SAP operations and continuously improve their environment.",
    capabilities: ["Application Support", "Issue Resolution", "Performance Optimisation", "Functional Assistance", "Enhancements", "Continuous Support"],
  },
];

const sapSolutions = [
  ["SAP S/4HANA", "Enterprise ERP transformation and process modernisation.", ["Process transformation", "Finance & operations", "Integration readiness"]],
  ["SAP Business One", "ERP support and implementation for growing businesses.", ["Core process configuration", "Business reporting", "Operational support"]],
  ["SAP Analytics", "Enable reporting, analytics and business visibility across enterprise data.", ["KPI dashboards", "Data visibility", "Management reporting"]],
  ["SAP SuccessFactors", "Support digital HR and workforce management initiatives.", ["HR workflows", "Workforce data", "Process coordination"]],
  ["SAP Integration Services", "Connect SAP environments with enterprise applications and digital platforms.", ["APIs & middleware", "Third-party platforms", "Compliance connections"]],
  ["SAP Custom Development", "Build business-specific SAP extensions, workflows and integrations.", ["Custom extensions", "Business workflows", "Process automation"]],
];

const signatureFeatures = [
  ["Automated Signing", "Reduce manual document signing activities."],
  ["SAP Workflow Integration", "Integrate signing directly within configured SAP processes."],
  ["Multi-User Support", "Support controlled signing requirements across authorised users."],
  ["Document Automation", "Enable structured signing for business documents generated through SAP."],
  ["Secure Processing", "Designed for controlled enterprise document workflows."],
];

const complianceLinks = [
  ["GST APIs", "GST taxpayer, return and compliance integrations.", "/apis"],
  ["e-Invoice", "Automate invoice generation and compliance workflows.", "/apis"],
  ["e-Way Bill", "Connect SAP transactions with e-Way Bill processes.", "/apis"],
  ["250+ APIs", "Integrate verification, KYC, business and compliance APIs.", "/apis"],
  ["Digital Signature", "Automate document signing within enterprise workflows.", "/products"],
  ["ASP-GSP Platform", "Connect GST compliance workflows through Primeserve's cloud platform.", "/solutions/asp-gsp"],
];

const delivery = [
  ["01", "Discover", "Understand business processes, existing systems and objectives."],
  ["02", "Design", "Define solution architecture, integrations and implementation roadmap."],
  ["03", "Implement", "Configure, develop and integrate the approved solution."],
  ["04", "Validate", "Perform testing, process validation and user readiness activities."],
  ["05", "Go Live", "Deploy the solution with controlled transition and support."],
  ["06", "Optimise", "Provide ongoing support, improvements and process optimisation."],
];

const industries = [
  ["Manufacturing", "Connect planning, production, inventory and operational reporting."],
  ["Retail & E-Commerce", "Support connected commerce, inventory and fulfilment processes."],
  ["Financial Services", "Improve controlled workflows, reporting and enterprise integration."],
  ["Logistics & Transportation", "Coordinate movement, documentation and operational visibility."],
  ["Healthcare", "Support structured operations, procurement and enterprise reporting."],
  ["Professional Services", "Connect project, finance, resource and approval workflows."],
  ["Enterprise & Corporate", "Standardise cross-functional processes across business teams."],
  ["Technology", "Integrate digital platforms, APIs and scalable business operations."],
];

const reasons = [
  ["End-to-End Capability", "SAP, APIs, compliance, ASP-GSP and digital automation under one technology ecosystem."],
  ["Integration-First Approach", "Designed to connect enterprise systems rather than create isolated applications."],
  ["Compliance Expertise", "Strong understanding of GST, e-Invoice, e-Way Bill and enterprise compliance workflows."],
  ["Scalable Architecture", "Solutions designed for growing transaction and enterprise requirements."],
  ["Continuous Support", "Support throughout implementation and ongoing operations."],
];

function openContact() {
  window.dispatchEvent(new CustomEvent("primeserve:open-contact"));
}

function SapCarousel({ children, label, className = "" }) {
  const railRef = useRef(null);

  const move = useCallback((direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.firstElementChild;
    const distance = (card?.getBoundingClientRect().width || 360) + 18;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    const atStart = rail.scrollLeft <= 8;

    if (direction > 0 && atEnd) rail.scrollTo({ left: 0, behavior: "smooth" });
    else if (direction < 0 && atStart) rail.scrollTo({ left: rail.scrollWidth, behavior: "smooth" });
    else rail.scrollBy({ left: direction * distance, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => move(1), 4500);
    return () => window.clearInterval(timer);
  }, [move]);

  return (
    <div className={`sap-carousel-wrap ${className}`}>
      <div className="sap-carousel-controls">
        <button type="button" onClick={() => move(-1)} aria-label={`Previous ${label}`}>←</button>
        <button type="button" onClick={() => move(1)} aria-label={`Next ${label}`}>→</button>
      </div>
      <div className="sap-carousel" aria-label={label} ref={railRef}>{children}</div>
    </div>
  );
}

function SapServicesPage() {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");
    document.title = "SAP Services, Integration & Automation | Primeserve";
    if (description) {
      description.setAttribute("content", "Primeserve provides SAP implementation, integration, migration, automation, Digital Signature and managed support services for modern enterprises.");
    }
    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.setAttribute("content", previousDescription);
    };
  }, []);

  return (
    <div className="sap-services-page">
      <section className="sap-services-hero" style={{ "--sap-hero-image": `url(${sapHero})` }}>
        <div className="sap-services-hero-copy">
          <h1>Transform Business Operations with <em>SAP Services</em></h1>
          <p>From implementation and integration to automation, migration and ongoing support, Primeserve helps enterprises build efficient, connected and scalable SAP environments.</p>
          <div className="sap-hero-actions">
            <button className="sap-btn sap-btn-primary" type="button" onClick={openContact}>Talk to Our SAP Team</button>
            <a className="sap-btn sap-btn-outline" href="#sap-services">Explore SAP Services</a>
          </div>
        </div>
      </section>

      <section className="sap-section sap-intro">
        <div className="sap-section-heading">
          <h2>Built Around Your Business. Powered by SAP Expertise.</h2>
          <p>Every organisation has different processes, systems and transformation priorities. Primeserve provides SAP services designed around business requirements, helping enterprises simplify operations, automate workflows, connect systems and improve visibility across their technology landscape.</p>
        </div>
        <div className="sap-benefit-grid">{benefits.map(([title, text]) => <article key={title}><span>✓</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="sap-section sap-services-section" id="sap-services">
        <div className="sap-section-heading">
          <h2>End-to-End SAP Services</h2>
        </div>
        <SapCarousel label="SAP services" className="sap-services-carousel">
          {services.map((service) => (
            <article className="sap-service-card" id={service.id} key={service.id}>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <div>{service.capabilities.map((item) => <span key={item}>{item}</span>)}</div>
              {service.id === "implementation" && <a href="#implementation">Explore Implementation <i>→</i></a>}
            </article>
          ))}
        </SapCarousel>
      </section>

      <section className="sap-section sap-solutions-section">
        <div className="sap-section-heading">
          <h2>SAP Solutions for Modern Enterprises</h2>
        </div>
        <SapCarousel label="SAP solutions" className="sap-solutions-carousel">
          {sapSolutions.map(([title, text, capabilities]) => <article key={title}><h3>{title}</h3><p>{text}</p><div>{capabilities.map((item) => <span key={item}>{item}</span>)}</div></article>)}
        </SapCarousel>
      </section>

      <section className="sap-signature-section" id="digital-signature">
        <div className="sap-signature-copy">
          <h2>Automated Digital Signature Inside SAP</h2>
          <h3>Simplify document signing without disrupting SAP workflows.</h3>
          <p>Primeserve Digital Signature Solutions enable organisations to integrate Digital Signature Certificates into SAP-based workflows for secure and automated document signing.</p>
          <button className="sap-btn sap-btn-primary" type="button" onClick={openContact}>Discuss SAP Digital Signature</button>
        </div>
        <div className="sap-signature-grid">{signatureFeatures.map(([title, text]) => <article key={title}><span>↗</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </section>

      <section className="sap-section sap-compliance-section">
        <div className="sap-section-heading">
          <h2>Connect SAP with Primeserve Compliance Solutions</h2>
          <p>Extend SAP workflows with Primeserve&apos;s compliance and API capabilities to automate critical business processes from a single connected ecosystem.</p>
        </div>
        <div className="sap-compliance-grid">{complianceLinks.map(([title, text, href]) => <a href={href} key={title}><span>↗</span><h3>{title}</h3><p>{text}</p></a>)}</div>
      </section>

      <section className="sap-section sap-delivery-section">
        <div className="sap-section-heading"><h2>Our SAP Delivery Approach</h2></div>
        <div className="sap-timeline">{delivery.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="sap-section sap-industries-section">
        <div className="sap-section-heading"><h2>SAP Services Across Industries</h2></div>
        <SapCarousel label="SAP industries" className="sap-industries-carousel">
          {industries.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </SapCarousel>
      </section>

      <section className="sap-section sap-reasons-section">
        <div className="sap-section-heading"><h2>Why Enterprises Choose Primeserve</h2></div>
        <div className="sap-reasons-grid">{reasons.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="sap-final-cta">
        <div><h2>Planning Your SAP Transformation?</h2><p>Talk to Primeserve about implementation, integration, automation, Digital Signature and ongoing SAP support.</p></div>
        <div><button className="sap-btn sap-btn-primary" type="button" onClick={openContact}>Talk to Our SAP Team</button><button className="sap-btn sap-btn-outline" type="button" onClick={openContact}>Request a Consultation</button></div>
      </section>
    </div>
  );
}

export default SapServicesPage;
