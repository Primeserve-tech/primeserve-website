import logo from "../assets/primeserve-logo-clean.png";

function WhyPrimeServePage() {
  const differentiators = [
    {
      tag: "250+",
      title: "250+ Enterprise APIs",
      text: "Comprehensive APIs covering GST, identity verification, banking, financial services, business verification, credit bureau, ITR, MCA, MSME, vehicle verification and more.",
    },
    {
      tag: "API",
      title: "Fast & Reliable Integration",
      text: "Developer-friendly REST APIs, clear documentation, SDK-ready workflows and rapid onboarding for seamless integration with existing applications.",
    },
    {
      tag: "SEC",
      title: "Secure & Compliant",
      text: "Enterprise-grade security, encrypted communication, role-based access and solutions designed around compliance and privacy best practices.",
    },
    {
      tag: "ECO",
      title: "Complete Digital Ecosystem",
      text: "APIs, ASP-GSP services, SAP integration, enterprise software, Digital Signature Certificates and managed compliance services under one roof.",
    },
    {
      tag: "UP",
      title: "Scalable Infrastructure",
      text: "Cloud-based infrastructure built for high availability, strong performance and growth across startups, SMEs and large enterprises.",
    },
    {
      tag: "SUP",
      title: "Dedicated Customer Support",
      text: "Experienced technical and business teams support onboarding, implementation, issue resolution and long-term success.",
    },
    {
      tag: "IN",
      title: "PAN India Presence",
      text: "Serving businesses across India with reliable digital solutions backed by domain expertise and responsive support.",
    },
    {
      tag: "CX",
      title: "Customer-First Approach",
      text: "We focus on practical, cost-effective solutions that solve real business problems and create long-term value.",
    },
  ];

  const proofPoints = [
    "250+ Enterprise APIs",
    "ASP-GSP Solution Provider",
    "SAP & ERP Integration Expertise",
    "Digital Signature Certificate Services",
    "GST, e-Invoice & e-Way Bill Solutions",
    "Identity, Business & Financial Verification APIs",
    "Enterprise Software Development",
    "Managed GST & Compliance Services",
    "Secure, Scalable Infrastructure",
    "Dedicated Technical Support",
  ];

  const carouselItems = [...differentiators, ...differentiators];

  return (
    <div className="about-page why-page">
      <section className="why-hero">
        <div className="why-hero-copy">
          <span className="about-eyebrow">WHY PRIMESERVE</span>
          <h1>Technology that simplifies compliance, integration and business growth.</h1>
          <p>
            At PrimeServe Global Solution Private Limited, we combine industry
            expertise with enterprise-grade technology to help organizations
            automate operations, strengthen compliance and accelerate digital
            transformation.
          </p>
          <p>
            From startups and SMEs to large enterprises, banks, NBFCs, fintech
            companies and government organizations, our solutions are designed
            to deliver speed, security, scalability and reliability.
          </p>
        </div>

        <div className="why-hero-card">
          <img src={logo} alt="PrimeServe Global Solution Pvt. Ltd." />
          <h2>Your trusted partner for end-to-end digital transformation.</h2>
          <div className="why-hero-tags">
            <span>Enterprise APIs</span>
            <span>GST Automation</span>
            <span>ASP-GSP</span>
            <span>SAP & ERP</span>
            <span>DSC</span>
            <span>Managed Compliance</span>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-heading centered">
          <span>What Makes Us Different</span>
          <h2>A complete enterprise technology and compliance partner.</h2>
        </div>
        <div className="why-carousel" aria-label="PrimeServe differentiators">
          <div className="why-carousel-track">
            {carouselItems.map((item, index) => (
              <article className="why-card" key={`${item.title}-${index}`}>
                <i aria-hidden="true">{item.tag}</i>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section why-proof-section">
        <div className="why-proof-copy">
          <span className="about-eyebrow">Why Businesses Choose PrimeServe</span>
          <h2>One platform. Practical solutions. Reliable execution.</h2>
          <p>
            PrimeServe gives businesses a single partner for API integration,
            compliance automation, Digital Signature Certificates, SAP and ERP
            workflows, managed services and enterprise-grade support.
          </p>
        </div>
        <div className="why-proof-grid">
          {proofPoints.map((point) => (
            <article key={point}>
              <span aria-hidden="true" />
              <p>{point}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-closing why-closing">
        <h2>PrimeServe is built for businesses that need dependable digital execution.</h2>
        <p>
          We help you move faster with secure APIs, compliance automation,
          enterprise integration and support that understands the realities of
          business operations in India.
        </p>
      </section>
    </div>
  );
}

export default WhyPrimeServePage;
