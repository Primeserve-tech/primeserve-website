import { useCallback, useEffect, useRef } from "react";
import OfferingServiceIcon from "./OfferingServiceIcon";
import managedTaxHero from "../assets/managed-services-hero.webp";

const taxServices = [
  ["Direct Tax Compliance", "Corporate tax, TDS/TCS, computation, return-filing coordination and documentation support.", ["Corporate tax support", "TDS/TCS compliance", "Tax computation support", "Return filing coordination", "Tax documentation support"]],
  ["Indirect Tax / GST Compliance", "Structured GST compliance support from transaction validation through reporting.", ["GST return support", "Reconciliation", "Invoice-level compliance", "e-Invoice support", "e-Way Bill support", "GST data validation"]],
  ["Tax Reconciliation & Reporting", "Clear exception visibility and periodic compliance reporting for finance teams.", ["Transaction reconciliation", "Exception identification", "Compliance reports", "Management dashboards", "Periodic reporting support"]],
  ["Notice & Assessment Support", "Organised tracking, document preparation and coordination for tax notices and assessments.", ["Notice tracking", "Data and document preparation", "Response coordination support", "Assessment documentation"]],
  ["Tax Data & Technology Support", "Technology-enabled processing that connects compliance data with enterprise workflows.", ["API-enabled tax workflows", "ERP data integration", "GST data processing", "Automated validation", "Workflow automation"]],
  ["Advisory & Process Support", "Practical support for improving tax processes, controls, reporting and coordination.", ["Compliance process review", "SOP support", "Reporting structure", "Process optimisation", "Team coordination"]],
];

const process = [
  ["Assess", "Understand current tax operations, systems and compliance requirements."],
  ["Configure", "Define workflows, reporting structure and required integrations."],
  ["Manage", "Support routine compliance, reconciliation and reporting activities."],
  ["Review", "Monitor exceptions, compliance status and reporting requirements."],
];

const benefits = [
  "Technology-enabled approach",
  "Integrated tax and API capabilities",
  "Direct & Indirect Tax support",
  "Structured compliance workflows",
  "ERP/API integration support",
  "Scalable support for growing organisations",
];

function openContact() {
  window.dispatchEvent(new CustomEvent("primeserve:open-contact", {
    detail: { service: "Managed Tax Services" },
  }));
}

export default function ManagedTaxServicesPage() {
  const servicesRailRef = useRef(null);
  const serviceIndexRef = useRef(0);
  const moveServices = useCallback((direction) => {
    const rail = servicesRailRef.current;
    if (!rail) return;
    const card = rail.querySelector("article");
    const distance = (card?.getBoundingClientRect().width || 380) + 22;
    const visibleCards = Math.max(1, Math.round(rail.clientWidth / distance));
    const lastIndex = Math.max(0, taxServices.length - visibleCards);
    serviceIndexRef.current = direction > 0
      ? (serviceIndexRef.current >= lastIndex ? 0 : serviceIndexRef.current + 1)
      : (serviceIndexRef.current <= 0 ? lastIndex : serviceIndexRef.current - 1);
    rail.scrollTo({ left: serviceIndexRef.current * distance, behavior: "smooth" });
  }, []);

  useEffect(() => {
    document.title = "Managed Tax Services | Primeserve";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Primeserve Managed Tax Services for direct and indirect tax compliance, GST, reconciliation, reporting, notices, advisory and technology-enabled workflows.";
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => moveServices(1), 3000);
    return () => window.clearInterval(timer);
  }, [moveServices]);

  return (
    <main className="managed-tax-page">
      <section className="managed-tax-hero">
        <div>
          <h1>Managed Tax Services</h1>
          <h2>End-to-End Tax Compliance, Reporting &amp; Advisory</h2>
          <p>Primeserve helps businesses manage routine and complex direct and indirect tax compliance through structured processes, technology-enabled workflows and professional support.</p>
          <div className="managed-tax-actions">
            <button className="btn btn-ghost" onClick={openContact}>Request Consultation</button>
          </div>
        </div>
        <div className="managed-tax-hero-visual">
          <img src={managedTaxHero} alt="Professionals reviewing tax compliance and reporting" />
        </div>
      </section>

      <section className="managed-tax-overview">
        <div>
          <h2>Simplify Tax Compliance. Strengthen Control.</h2>
          <p>Primeserve supports businesses with managing compliance activities across tax functions, enabling internal teams to focus on business priorities while maintaining structured reporting, review and compliance processes.</p>
        </div>
        <aside>
          <b>Structured delivery</b>
          <p>Defined workflows, clear coordination and reliable operational visibility.</p>
        </aside>
      </section>

      <section className="managed-tax-services" id="managed-tax-services">
        <header>
          <div><h2>Our Managed Tax Services</h2><p>Connected support across compliance, reporting, technology and process coordination.</p></div>
          <nav aria-label="Managed tax service carousel controls">
            <button type="button" onClick={() => moveServices(-1)} aria-label="Previous managed tax service">←</button>
            <button type="button" onClick={() => moveServices(1)} aria-label="Next managed tax service">→</button>
          </nav>
        </header>
        <div className="managed-tax-services-carousel" ref={servicesRailRef}>
          {taxServices.map(([title, text, items]) => (
            <article key={title}>
              <OfferingServiceIcon type="tax" />
              <h3>{title}</h3>
              <p>{text}</p>
              <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="managed-tax-process">
        <header><h2>How It Works</h2><p>A clear operating model from assessment through ongoing review.</p></header>
        <div>{process.map(([title, text], index) => <article key={title}><b>{String(index + 1).padStart(2, "0")}</b><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="managed-tax-benefits">
        <div><OfferingServiceIcon type="tax" /><h2>Why Primeserve</h2><p>Enterprise tax support strengthened by connected compliance technology and structured delivery.</p></div>
        <ul>{benefits.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="managed-tax-final-cta">
        <div><h2>Looking for a Reliable Managed Tax Partner?</h2><p>Talk to Primeserve about building a structured tax compliance and reporting model for your organisation.</p></div>
        <button className="btn btn-primary" onClick={openContact}>Request Consultation</button>
      </section>
    </main>
  );
}
