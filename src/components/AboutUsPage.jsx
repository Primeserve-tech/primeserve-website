import { useEffect, useRef } from "react";
import logo from "../assets/primeserve-logo-clean.png";
import OfferingServiceIcon from "./OfferingServiceIcon";
import { servicePortfolio } from "../data/servicePortfolio";

function AboutUsPage() {
  const strengthRailRef = useRef(null);
  const services = servicePortfolio.map(({ icon, title, description }) => ({ icon, title, text: description }));

  const strengths = [
    {
      title: "Enterprise APIs",
      text: "GST, e-Invoice, e-Way Bill, PAN, Aadhaar, credit bureau, MCA, MSME, bank verification and business verification APIs built for scale.",
    },
    {
      title: "Compliance Automation",
      text: "ASP-GSP Solutions, GST reconciliation, return support, regulatory reporting and managed compliance services for growing businesses.",
    },
    {
      title: "Enterprise Integration",
      text: "SAP, ERP, DMS, digital signature and workflow automation support for teams that need secure connected operations.",
    },
    {
      title: "Workforce Solutions",
      text: "Permanent, contract and project-based staffing support that helps businesses deploy capable professionals at every level.",
    },
    {
      title: "Application Development & AMS",
      text: "Mobile apps, websites, portals, hosting, deployment and ongoing application maintenance support.",
    },
  ];

  const carouselItems = [...services, ...services];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => {
      const rail = strengthRailRef.current;
      if (!rail) return;
      const card = rail.querySelector(".about-strength-track > article");
      const distance = (card?.getBoundingClientRect().width || 520) + 20;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
      if (atEnd) rail.scrollTo({ left: 0, behavior: "smooth" });
      else rail.scrollBy({ left: distance, behavior: "smooth" });
    }, 3400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-copy">
          <span className="about-eyebrow">ABOUT PRIMESERVE</span>
          <h1>Powering Digital Compliance, Enterprise Integration & Business Transformation</h1>
          <p>
            Primeserve Global Solution Private Limited is a technology and
            compliance solutions company helping businesses connect, automate,
            secure and transform critical operations through enterprise APIs,
            ASP-GSP Solutions, SAP and ERP integration, Digital Signature
            Certificates, managed tax services, application development, workforce staffing and
            deployment, enterprise software and managed compliance services.
          </p>
          <div className="about-hero-offerings" aria-label="Primeserve offerings">
            <div className="about-hero-offerings-track">
              {[...servicePortfolio, ...servicePortfolio].map((service, index) => (
                <a href={service.href} key={`${service.id}-${index}`}>
                  <OfferingServiceIcon type={service.icon} />
                  <span>{service.title}</span>
                  <i aria-hidden="true">→</i>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="about-hero-panel">
          <img src={logo} alt="Primeserve Global Solution Pvt. Ltd." />
          <strong>Complete Enterprise Business Partner</strong>
          <p>Connect systems, automate compliance, manage tax operations and deploy capable workforce teams.</p>
          <div>
            <span>APIs</span>
            <span>Compliance</span>
            <span>DSC</span>
            <span>SAP & ERP</span>
            <span>Managed Tax</span>
            <span>Application &amp; AMS</span>
            <span>Workforce Staffing</span>
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
            With a portfolio of more than 250 enterprise-grade APIs, Primeserve
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
            Certificates, GST Compliance Automation, ASP-GSP Solutions and
            Managed Tax and Regulatory Services.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-heading centered">
          <span>Our Core Services</span>
          <h2>One partner for APIs, compliance, DSC and enterprise automation.</h2>
        </div>
        <div className="about-service-carousel" aria-label="Primeserve services carousel">
          <div className="about-service-track">
            {carouselItems.map((service, index) => (
              <article key={`${service.title}-${index}`} className="about-service-card">
                <OfferingServiceIcon type={service.icon} />
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-services-feature" ref={strengthRailRef}>
        <div className="about-strength-track">
          {strengths.map((item, index) => (
            <article key={`${item.title}-${index}`}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-dsc">
        <div>
          <span className="about-eyebrow">DIGITAL SIGNATURE CERTIFICATES</span>
          <h2>Secure digital authentication for statutory and enterprise workflows.</h2>
          <p>
            Primeserve provides Class 3 Digital Signature Certificates for
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
        <h2>One partner for technology, compliance and business operations.</h2>
        <p>
          Primeserve brings together enterprise APIs, ASP-GSP solutions, SAP and
          ERP integration, Digital Signature Certificates, managed tax services,
          application development, compliance automation and workforce staffing to help modern businesses
          connect, operate and grow.
        </p>
      </section>
    </div>
  );
}

export default AboutUsPage;
