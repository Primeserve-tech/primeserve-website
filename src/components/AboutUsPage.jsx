import logo from "../assets/primeserve-logo-clean.png";

function AboutUsPage() {
  const services = [
    { tag: "API", title: "250+ Enterprise APIs", text: "Production-ready APIs for verification, GST, tax, banking and compliance workflows." },
    { tag: "ASP", title: "ASP-GSP Solutions", text: "Cloud GST, e-Invoice, e-Way Bill and reconciliation automation for enterprises." },
    { tag: "GST", title: "GST APIs & Compliance", text: "GST taxpayer, return filed, e-Invoice, e-Way Bill, MCA, IEC, MSME and HSN APIs." },
    { tag: "SAP", title: "SAP & ERP Integration", text: "SAP GST integration, DMS, invoice automation and enterprise workflow enablement." },
    { tag: "DSC", title: "Digital Signature Certificates", text: "Class 3 DSC support for filings, e-Tendering, MCA, GST, DGFT, ICEGATE and EPFO." },
    { tag: "KYC", title: "Identity Verification APIs", text: "PAN, Aadhaar eKYC, bank account, driving licence, voter ID, passport and video KYC." },
    { tag: "BIZ", title: "Business Verification APIs", text: "Company, director, CIN, DIN, TAN, FSSAI, MSME and risk verification APIs." },
    { tag: "TAX", title: "Managed Tax & Compliance", text: "Domain-led GST, direct tax, indirect tax, ROC, audit and advisory support." },
  ];

  const heroMetrics = [
    { value: "250+", label: "Enterprise APIs" },
    { value: "DSC", label: "Digital Signature" },
    { value: "ASP", label: "GSP Workflows" },
    { value: "SAP", label: "ERP Integration" },
  ];

  const strengths = [
    {
      title: "Enterprise APIs",
      text: "GST, e-Invoice, e-Way Bill, PAN, Aadhaar, credit bureau, MCA, MSME, bank verification and business verification APIs built for scale.",
    },
    {
      title: "Compliance Automation",
      text: "Cloud ASP-GSP workflows, GST reconciliation, return support, regulatory reporting and managed compliance services for growing businesses.",
    },
    {
      title: "Enterprise Integration",
      text: "SAP, ERP, DMS, digital signature and workflow automation support for teams that need secure connected operations.",
    },
  ];

  const carouselItems = [...services, ...services];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-copy">
          <span className="about-eyebrow">ABOUT PRIMESERVE</span>
          <h1>Powering Digital Compliance, Enterprise Integration & Business Transformation</h1>
          <p>
            PrimeServe Global Solution Private Limited is a technology and
            compliance solutions company helping businesses connect, automate,
            secure and transform critical operations through enterprise APIs,
            ASP-GSP services, SAP and ERP integration, Digital Signature
            Certificates, enterprise software and managed compliance services.
          </p>
          <div className="about-hero-metrics" aria-label="PrimeServe capabilities">
            {heroMetrics.map((metric) => (
              <article key={metric.value}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="about-hero-panel">
          <img src={logo} alt="PrimeServe Global Solution Pvt. Ltd." />
          <strong>Complete Enterprise Technology Partner</strong>
          <p>Connect systems, automate compliance and enable secure digital transactions.</p>
          <div>
            <span>APIs</span>
            <span>Compliance</span>
            <span>DSC</span>
            <span>SAP & ERP</span>
          </div>
        </div>
      </section>

      <section className="about-section about-intro">
        <div className="about-section-heading">
          <span>Who We Are</span>
          <h2>Built for businesses that need speed, security and reliability.</h2>
        </div>
        <div className="about-copy-block">
          <p>
            With a portfolio of more than 250 enterprise-grade APIs, PrimeServe
            enables businesses to integrate critical digital services into their
            applications with speed, security and reliability. Our solutions
            support Banking, NBFC, FinTech, Insurance, Logistics, Manufacturing,
            Healthcare, E-commerce, Government, HR Tech and Enterprise sectors.
          </p>
          <p>
            Our technology portfolio includes GST APIs, e-Invoice APIs, e-Way
            Bill APIs, PAN Verification, PAN Fetch, Aadhaar eKYC, Credit Bureau
            APIs, Business Verification APIs, Bank Verification APIs, ITR APIs,
            MCA and MSME APIs, SAP and ERP Integration, Digital Signature
            Certificates, GST Compliance Automation, Cloud ASP-GSP Solutions and
            Managed Tax and Regulatory Services.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-heading centered">
          <span>Our Core Services</span>
          <h2>One partner for APIs, compliance, DSC and enterprise automation.</h2>
        </div>
        <div className="about-service-carousel" aria-label="PrimeServe services carousel">
          <div className="about-service-track">
            {carouselItems.map((service, index) => (
              <article key={`${service.title}-${index}`} className="about-service-card">
                <i aria-hidden="true">{service.tag}</i>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-services-feature">
        {strengths.map((item) => (
          <article key={item.title}>
            <span>{item.title}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="about-section about-dsc">
        <div>
          <span className="about-eyebrow">DIGITAL SIGNATURE CERTIFICATES</span>
          <h2>Secure digital authentication for statutory and enterprise workflows.</h2>
          <p>
            PrimeServe provides Class 3 Digital Signature Certificates for
            individuals, organizations, directors, professionals and
            government-related applications. Our DSC solutions support
            e-Tendering, GST, Income Tax, MCA, ICEGATE, DGFT, EPFO and other
            regulatory platforms, helping organizations complete digital
            transactions with confidence and legal validity.
          </p>
        </div>
        <div className="about-dsc-list">
          <span>Class 3 DSC</span>
          <span>GST & Income Tax</span>
          <span>MCA & DGFT</span>
          <span>e-Tendering</span>
        </div>
      </section>

      <section className="about-section about-mission-grid">
        <article>
          <i aria-hidden="true">M</i>
          <div>
            <span>Our Mission</span>
            <h2>Make compliance and automation simpler.</h2>
            <p>
              To empower businesses with secure, scalable and innovative digital
              solutions that simplify compliance, automate operations and
              accelerate business growth through technology.
            </p>
          </div>
        </article>
        <article>
          <i aria-hidden="true">V</i>
          <div>
            <span>Our Vision</span>
            <h2>Become India&apos;s most trusted enterprise technology partner.</h2>
            <p>
              To lead in enterprise APIs, compliance automation, Digital Signature
              solutions, SAP integration and digital transformation by delivering
              excellence, innovation and long-term value to every customer.
            </p>
          </div>
        </article>
      </section>

      <section className="about-closing">
        <h2>At PrimeServe, we do not just provide APIs.</h2>
        <p>
          We deliver complete digital business solutions that connect, automate,
          secure and transform how modern businesses operate.
        </p>
      </section>
    </div>
  );
}

export default AboutUsPage;
