import { useCallback, useEffect, useRef } from "react";
import applicationDevelopmentHero from "../assets/application-development-hero.png";

const applicationServices = [
  {
    title: "Mobile App Development",
    text: "Build responsive and scalable mobile applications aligned with business requirements.",
    capabilities: ["Android Apps", "iOS Apps", "Cross-Platform Apps", "Enterprise Applications", "Customer Applications", "API Integration", "Business Workflow Apps"],
  },
  {
    title: "Website & Web Application Development",
    text: "Design and develop modern business websites, portals and web applications.",
    capabilities: ["Corporate Websites", "Business Websites", "Customer Portals", "Business Portals", "Admin Panels", "Dashboards", "Custom Web Applications", "API-Driven Applications"],
  },
  {
    title: "Hosting & Deployment Support",
    text: "Support applications from development through production deployment.",
    capabilities: ["VPS Deployment", "Cloud Deployment Support", "Application Deployment", "Domain/Subdomain Configuration", "SSL Configuration", "Environment Setup", "Database Deployment", "Release Deployment"],
  },
  {
    title: "Application Maintenance & Support (AMS)",
    text: "Provide ongoing application support beyond go-live.",
    capabilities: ["Bug Fixing", "Issue Resolution", "Application Updates", "Minor Enhancements", "Integration Support", "Performance Improvement", "Production Support", "Release Support"],
  },
];

const process = [
  ["Discover", "Understand requirements, users and business goals."],
  ["Design", "Plan architecture, workflows and user experience."],
  ["Develop", "Build web/mobile applications and required integrations."],
  ["Test", "Validate functionality, responsiveness and integration."],
  ["Deploy", "Deploy to the agreed hosting/production environment."],
  ["Support", "Provide ongoing AMS, fixes, updates and enhancement support."],
];

const maintenance = [
  ["Corrective Maintenance", "Resolve application defects and production issues."],
  ["Adaptive Maintenance", "Adapt applications to technology, integration or business changes."],
  ["Enhancement Support", "Support approved functionality and usability improvements."],
  ["Production Support", "Assist with application, deployment, database and integration issues."],
];

const integrations = ["GST", "KYC", "PAN Verification", "Company Verification", "e-Invoice", "e-Way Bill", "Business Verification", "Other API Integrations"];

function openContact() {
  window.dispatchEvent(new CustomEvent("primeserve:open-contact", {
    detail: { service: "Application Development & AMS" },
  }));
}

export default function ApplicationDevelopmentPage() {
  const servicesRailRef = useRef(null);

  const moveServices = useCallback((direction) => {
    const rail = servicesRailRef.current;
    if (!rail) return;
    const card = rail.querySelector("article");
    const distance = (card?.getBoundingClientRect().width || 520) + 22;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    const atStart = rail.scrollLeft <= 8;

    if (direction > 0 && atEnd) rail.scrollTo({ left: 0, behavior: "smooth" });
    else if (direction < 0 && atStart) rail.scrollTo({ left: rail.scrollWidth, behavior: "smooth" });
    else rail.scrollBy({ left: direction * distance, behavior: "smooth" });
  }, []);

  useEffect(() => {
    document.title = "Application Development & AMS Support | Primeserve";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Primeserve provides mobile app development, website development, hosting and deployment support, and Application Maintenance & Support services for business applications.";

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.primeserveApplicationDevelopment = "true";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Application Development & AMS Support",
      provider: { "@type": "Organization", name: "Primeserve Global Solution Pvt. Ltd." },
      serviceType: ["Mobile App Development", "Web Application Development", "Hosting and Deployment Support", "Application Maintenance and Support"],
      url: `${window.location.origin}/application-development-ams`,
    });
    document.head.appendChild(schema);
    return () => schema.remove();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => moveServices(1), 4200);
    return () => window.clearInterval(timer);
  }, [moveServices]);

  return (
    <main className="appdev-page">
      <section className="appdev-hero appdev-hero-full-image">
        <div className="appdev-hero-copy">
          <h1>Application Development &amp; AMS Support</h1>
          <h2>Build. Deploy. Maintain. Scale.</h2>
          <p>Primeserve provides end-to-end application development services covering mobile applications, websites, hosting and deployment support, and ongoing Application Maintenance &amp; Support (AMS).</p>
          <button className="btn btn-primary" type="button" onClick={openContact}>Discuss Your Project</button>
        </div>
        <div className="appdev-hero-image-column">
          <img src={applicationDevelopmentHero} alt="Website, mobile application, cloud deployment and development environment" />
        </div>
      </section>

      <section className="appdev-services">
        <header>
          <div><h2>From build to business continuity.</h2></div>
          <nav aria-label="Application service carousel controls">
            <button type="button" onClick={() => moveServices(-1)} aria-label="Previous application service">←</button>
            <button type="button" onClick={() => moveServices(1)} aria-label="Next application service">→</button>
          </nav>
        </header>
        <div className="appdev-service-grid" ref={servicesRailRef}>
          {applicationServices.map((service, index) => (
            <article key={service.title}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <ul>{service.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="appdev-process">
        <header><span>OUR DEVELOPMENT PROCESS</span><h2>From Idea to Ongoing Support</h2></header>
        <div className="appdev-process-flow">
          {process.map(([title, text], index) => (
            <article key={title}>
              <b>{index + 1}</b>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="appdev-ams">
        <header><h2>Support Doesn&apos;t Stop at Go-Live.</h2></header>
        <div>
          {maintenance.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="appdev-integrations">
        <div>
          <span>CONNECTED APPLICATIONS</span>
          <h2>Development Meets Integration</h2>
          <p>Build applications that can integrate with Primeserve&apos;s API ecosystem and other approved third-party services based on project requirements.</p>
          <a className="btn btn-primary" href="/apis">Explore 250+ APIs</a>
        </div>
        <ul>{integrations.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="appdev-final-cta">
        <div><h2>Ready to build and support your next application?</h2><p>Discuss your requirements, integrations, deployment environment and ongoing AMS needs with Primeserve.</p></div>
        <button className="btn btn-primary" type="button" onClick={openContact}>Discuss Your Project</button>
      </section>
    </main>
  );
}
