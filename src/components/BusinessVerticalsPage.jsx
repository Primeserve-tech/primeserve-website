import { useEffect } from "react";
import businessHero from "../assets/business-verticals-hero.png";
import technologyHero from "../assets/technology-apis-hero.png";
import taxHero from "../assets/tax-compliance-hero.png";
import enterpriseHero from "../assets/enterprise-solutions-hero.png";
import managedHero from "../assets/managed-services-hero.png";
import OfferingServiceIcon from "./OfferingServiceIcon";

const businessVerticals = [
  {
    id: "technology-apis",
    name: "Technology & APIs",
    path: "/business/technology-apis",
    image: technologyHero,
    alt: "Enterprise technology and API integration",
    hero: "Technology That Connects Business.",
    description: "Enterprise APIs, verification services and digital integrations designed to simplify complex workflows and connect business systems at scale.",
    heroCta: "Explore APIs",
    heroCtaPath: "/apis",
    overview: "Primeserve provides enterprise-ready APIs, digital compliance integrations and technology solutions that help organizations connect applications, access business data and automate digital workflows.",
    capabilities: ["API Integration", "Verification APIs", "Compliance APIs", "Enterprise Integrations", "Automation Solutions", "Application Integration", "Technical Support"],
    solutions: ["GST APIs", "e-Invoice APIs", "e-Way Bill APIs", "PAN Verification", "GST Verification", "PAN to GST", "Company Verification", "eKYC Solutions", "Credit Information Integrations", "ERP / Software Integration", "Custom API Integration"],
    audiences: ["FinTech Companies", "Software Companies", "ERP Providers", "Enterprises", "Banks & Financial Institutions", "E-Commerce Platforms", "Technology Startups"],
    reasons: ["Scalable Integration", "Secure Connectivity", "Developer-Friendly Implementation", "Enterprise Support", "Single Integration Partner"],
    finalHeading: "Build with Primeserve",
    finalCta: "Explore APIs",
    metaTitle: "Primeserve Technology & APIs | Enterprise API Solutions",
    metaDescription: "Explore Primeserve enterprise APIs, verification services and digital integrations for connected business systems.",
  },
  {
    id: "tax-compliance",
    name: "Tax & Compliance",
    path: "/business/tax-compliance",
    image: taxHero,
    alt: "Business tax and digital compliance services",
    hero: "Compliance Made More Connected.",
    description: "GST, e-Invoice, e-Way Bill and digital compliance solutions designed to simplify tax workflows across enterprise systems.",
    heroCta: "Explore Compliance Solutions",
    heroCtaPath: "#vertical-solutions",
    overview: "Our Tax & Compliance vertical combines technology, digital compliance workflows and managed support to help organizations simplify GST and indirect-tax-related processes.",
    capabilities: ["GST Compliance", "e-Invoice", "e-Way Bill", "GST Data Access", "Tax Technology", "Compliance Automation", "Managed Tax Support"],
    solutions: ["GST Public APIs", "GST Taxpayer APIs", "GST Return Data APIs", "e-Invoice Integration", "e-Way Bill Integration", "ASP-GSP Solutions", "GST Reconciliation Support", "Indirect Managed Tax Services", "ERP / SAP Compliance Integration"],
    audiences: ["Enterprises", "Manufacturers", "Retailers", "E-Commerce Businesses", "Logistics Companies", "ERP Users", "Finance Teams", "Tax & Compliance Teams"],
    reasons: ["Integrated Compliance Workflows", "Technology-Led Processing", "Enterprise Integration", "Structured Support"],
    finalHeading: "Connect Your Compliance Workflows",
    finalCta: "Talk to Our Compliance Team",
    metaTitle: "Primeserve Tax & Compliance | GST & Digital Compliance Solutions",
    metaDescription: "GST, e-Invoice, e-Way Bill and digital compliance solutions for connected enterprise tax workflows.",
  },
  {
    id: "enterprise-solutions",
    name: "Enterprise Solutions",
    path: "/business/enterprise-solutions",
    image: enterpriseHero,
    alt: "Enterprise systems integration and automation",
    hero: "Connected Enterprise. Smarter Operations.",
    description: "SAP, ERP, digital signature and enterprise integrations that connect systems, automate workflows and improve business operations.",
    heroCta: "Explore Enterprise Solutions",
    heroCtaPath: "#vertical-solutions",
    overview: "Our Enterprise Solutions vertical helps organizations integrate business applications, automate workflows and connect compliance, digital signing and enterprise systems.",
    capabilities: ["SAP Integration", "ERP Integration", "Digital Signature Integration", "Workflow Automation", "Business Process Integration", "Enterprise API Integration", "Custom Software Integration"],
    solutions: ["SAP Digital Signature", "SAP Integration Support", "ERP & API Integration", "Digital Signature Certificate Solutions", "Automated Business Workflows", "Compliance Integration", "Custom Enterprise Connectors", "Application Integration", "Technical Managed Support"],
    audiences: ["Large Enterprises", "Manufacturing Companies", "Shared Service Teams", "ERP Users", "SAP Customers", "IT Departments", "Finance & Compliance Teams"],
    reasons: ["End-to-End Integration Support", "Flexible Enterprise Architecture", "Structured Implementation", "Ongoing Support"],
    finalHeading: "Connect Your Enterprise Systems",
    finalCta: "Discuss Your Requirement",
    metaTitle: "Primeserve Enterprise Solutions | SAP, ERP & Integration Services",
    metaDescription: "Primeserve enterprise integration services for SAP, ERP, digital signing and automated business workflows.",
  },
  {
    id: "workforce-solutions",
    name: "Workforce Solutions",
    path: "/business/workforce-solutions",
    cardDescription: "Flexible staffing, hiring and workforce deployment across multiple career levels.",
  },
  {
    id: "managed-services",
    name: "Managed Services",
    path: "/business/managed-services",
    image: managedHero,
    alt: "Enterprise managed services and operational support",
    hero: "Managed Operations. Focused Growth.",
    description: "Structured technology, compliance and operational support that helps businesses focus on growth while Primeserve manages defined processes and services.",
    heroCta: "Explore Managed Services",
    heroCtaPath: "#vertical-solutions",
    overview: "Our Managed Services vertical enables organizations to outsource selected technology, compliance and operational activities through structured delivery and ongoing coordination.",
    capabilities: ["Technical Managed Services", "Managed Tax Services", "Application Support", "API Support", "SAP Support", "Compliance Operations", "Workforce Coordination", "Business Process Support"],
    solutions: ["API Operations Support", "GST & Compliance Managed Services", "SAP Support Services", "Application Support", "ERP Integration Support", "Technical Helpdesk", "Process Coordination", "Workforce Managed Services"],
    audiences: ["Enterprises", "Growing Businesses", "Technology Companies", "Finance Teams", "IT Teams", "Compliance Teams", "Organizations Seeking Outsourced Operations"],
    reasons: ["Structured Delivery", "Flexible Engagement", "Cross-Functional Capability", "Single Point of Coordination", "Ongoing Support"],
    finalHeading: "Extend Your Operational Capacity",
    finalCta: "Discuss Managed Services",
    metaTitle: "Primeserve Managed Services | Technology & Business Support",
    metaDescription: "Structured technology, compliance and operational managed services with coordinated enterprise delivery.",
  },
];

const overviewDescriptions = {
  "technology-apis": "APIs, verification, digital integrations and scalable technology solutions.",
  "tax-compliance": "GST, e-Invoice, e-Way Bill and digital compliance solutions.",
  "enterprise-solutions": "SAP, ERP, digital signature and enterprise integration services.",
  "workforce-solutions": "Flexible staffing, hiring and workforce deployment across multiple career levels.",
  "managed-services": "Structured technology, compliance and operational support.",
};

const verticalIconTypes = {
  "technology-apis": "api",
  "tax-compliance": "tax",
  "enterprise-solutions": "sap",
  "workforce-solutions": "workforce",
  "managed-services": "tax",
  "sap-services": "sap",
};

function Meta({ title, description }) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);
  return null;
}

function VerticalHero({ image, alt, title, description, cta, ctaPath }) {
  return (
    <section className="business-vertical-hero">
      <img src={image} alt={alt} />
      <div className="business-vertical-hero-copy">
        <h1>{title}</h1>
        <p>{description}</p>
        <a href={ctaPath}>{cta}</a>
      </div>
    </section>
  );
}

function Breadcrumb({ current }) {
  return (
    <nav className="business-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a><span>›</span><a href="/business">Business Verticals</a>
      {current && <><span>›</span><b>{current}</b></>}
    </nav>
  );
}

export function OtherVerticals({ currentId }) {
  const relatedVerticals = [
    ...businessVerticals.filter((item) => item.id !== currentId),
    { id: "sap-services", name: "SAP Services", path: "/sap-services" },
  ];
  return (
    <section className="other-verticals">
      <div className="business-section-heading">
        <h2>Explore Other Business Verticals</h2>
      </div>
      <div className="other-vertical-grid">
        {relatedVerticals.map((item) => (
          <a href={item.path} key={item.id}>
            <OfferingServiceIcon type={verticalIconTypes[item.id]} />
            <h3>{item.name}</h3>
            <p>{overviewDescriptions[item.id] || "Implementation, integration, automation and managed SAP support."}</p>
            <span>Explore →</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function BusinessOverviewPage() {
  return (
    <div className="business-page">
      <Meta
        title="Primeserve Business Verticals | Integrated Enterprise Solutions"
        description="Explore Primeserve business verticals across technology, compliance, enterprise solutions, workforce and managed services."
      />
      <VerticalHero
        image={businessHero}
        alt="Primeserve integrated business services"
        title="Integrated Solutions Across Business Functions."
        description="Primeserve operates across technology, compliance, enterprise solutions, workforce and managed services, helping organizations address diverse business requirements through integrated technology and structured service delivery."
        cta="Explore Our Business Verticals"
        ctaPath="#business-verticals"
      />
      <Breadcrumb />
      <section className="business-overview" id="business-verticals">
        <div className="business-section-heading">
          <h2>Five Verticals. One Primeserve.</h2>
          <p>Explore connected capabilities designed around the technology, compliance, operational and workforce requirements of modern organizations.</p>
        </div>
        <div className="business-card-grid">
          {businessVerticals.map((item) => (
            <a href={item.path} key={item.id}>
              <span>{String(businessVerticals.indexOf(item) + 1).padStart(2, "0")}</span>
              <h3>{item.name}</h3>
              <p>{overviewDescriptions[item.id]}</p>
              <b>Explore Vertical →</b>
            </a>
          ))}
        </div>
      </section>
      <section className="business-final-cta">
        <div><h2>Integrated Support for Diverse Business Requirements</h2><p>Connect with Primeserve to identify the right technology, compliance, enterprise, workforce or managed-service approach.</p></div>
        <a href="/company">Connect with Primeserve</a>
      </section>
    </div>
  );
}

export function BusinessVerticalPage({ verticalId }) {
  const vertical = businessVerticals.find((item) => item.id === verticalId);
  if (!vertical || vertical.id === "workforce-solutions") return null;

  return (
    <div className="business-page">
      <Meta title={vertical.metaTitle} description={vertical.metaDescription} />
      <VerticalHero image={vertical.image} alt={vertical.alt} title={vertical.hero} description={vertical.description} cta={vertical.heroCta} ctaPath={vertical.heroCtaPath} />
      <Breadcrumb current={vertical.name} />
      <section className="business-detail-overview">
        <div className="business-section-heading"><h2>{vertical.name}</h2><p>{vertical.overview}</p></div>
      </section>
      <section className="business-capability-layout">
        <div>
          <div className="business-section-heading"><h2>Core Capabilities</h2></div>
          <div className="business-list-grid">{vertical.capabilities.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
        <div id="vertical-solutions">
          <div className="business-section-heading"><h2>Key Solutions & Services</h2></div>
          <div className="business-solution-grid">{vertical.solutions.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
      </section>
      <section className="business-audience">
        <div className="business-section-heading"><h2>Who It Is For</h2></div>
        <div>{vertical.audiences.map((item) => <span key={item}>{item}</span>)}</div>
      </section>
      <section className="business-why">
        <div className="business-section-heading"><h2>Why Primeserve</h2></div>
        <div>{vertical.reasons.map((item, index) => <article key={item}><b>{String(index + 1).padStart(2, "0")}</b><h3>{item}</h3></article>)}</div>
      </section>
      <OtherVerticals currentId={vertical.id} />
      <section className="business-final-cta">
        <div><h2>{vertical.finalHeading}</h2><p>Share your requirement and the Primeserve team will help identify an appropriate solution and engagement path.</p></div>
        <a href={vertical.heroCtaPath}>{vertical.finalCta}</a>
      </section>
    </div>
  );
}
