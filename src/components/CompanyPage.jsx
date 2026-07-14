import companyHeroOriginal from "../assets/company-page-hero.png";
import companyHeroV2 from "../assets/company-page-hero-v2.png";
import companyHeroV3 from "../assets/company-page-hero-v3.png";
import companyHeroV4 from "../assets/company-page-hero-v4.png";
import companyHeroV5 from "../assets/company-page-hero-v5.png";
import companyHeroV6 from "../assets/company-page-hero-v6.png";

// Change this value to an earlier version to restore a previous Company hero.
const COMPANY_HERO_VERSION = "v6";
const companyHero = COMPANY_HERO_VERSION === "v6"
  ? companyHeroV6
  : COMPANY_HERO_VERSION === "v5"
    ? companyHeroV5
  : COMPANY_HERO_VERSION === "v4"
    ? companyHeroV4
  : COMPANY_HERO_VERSION === "v3"
    ? companyHeroV3
  : COMPANY_HERO_VERSION === "v2"
    ? companyHeroV2
    : companyHeroOriginal;

function CompanyPage() {
  const industries = [
    { icon: "bank", title: "Banking & Financial Services", text: "Identity verification, credit bureau, bank verification, KYC and GST validation." },
    { icon: "fintech", title: "FinTech & Lending", text: "Customer onboarding, income verification, credit decisioning, GST and ITR APIs." },
    { icon: "tax", title: "Tax & Accounting", text: "GST returns, GSTR-2B, GSTR-3B, ITR APIs and compliance automation." },
    { icon: "logistics", title: "Logistics & Supply Chain", text: "e-Way Bill, e-Invoice, vehicle verification and GST compliance workflows." },
    { icon: "retail", title: "Retail & E-Commerce", text: "Vendor verification, GST APIs, business validation and invoice automation." },
    { icon: "manufacturing", title: "Manufacturing & Enterprises", text: "SAP integration, vendor compliance and enterprise workflow automation." },
    { icon: "erp", title: "ERP & SaaS Platforms", text: "White-label APIs, REST APIs, SDKs and enterprise integrations." },
    { icon: "healthcare", title: "Healthcare & Insurance", text: "Identity verification, document validation and secure digital onboarding." },
    { icon: "hr", title: "HR & Recruitment", text: "Employee verification, PAN verification, Aadhaar eKYC and background checks." },
    { icon: "government", title: "Government & Public Sector", text: "Digital verification, compliance services and enterprise integration." },
    { icon: "msme", title: "MSMEs & Startups", text: "Affordable APIs for compliance, verification and business growth." },
    { icon: "partners", title: "API Partners & Resellers", text: "White-label platform, dedicated infrastructure and partner success programs." },
  ];

  const heroServices = [
    { icon: "document", text: "250+ APIs" },
    { icon: "sap", text: "SAP Solution" },
    { icon: "cloud", text: "ASP GSP Solution" },
    { icon: "signature", text: "DSC" },
    { icon: "tax", text: "Managed Services" },
  ];

  return (
    <div className="company-page">
      <section className="company-hero" style={{ "--page-hero-image": `url(${companyHero})` }}>
        <div className="company-hero-copy">
          <h1>
            Empowering Businesses Through
            <br />
            APIs, Compliance &
            <br />
            <span>Enterprise Technology</span>
          </h1>
          <p>
            Primeserve Global Solution Pvt. Ltd. delivers enterprise APIs, GST
            automation, Digital Signature solutions, SAP services and compliance
            technologies that help businesses automate operations, simplify
            regulatory processes and accelerate digital transformation.
          </p>

          <div className="company-actions">
            <a className="btn company-primary-btn" href="#industries">
              Our Industries <span className="arrow-icon">→</span>
            </a>
            <a className="btn company-outline-btn" href="#contact">
              Get In Touch <span className="arrow-icon">→</span>
            </a>
          </div>

          <div className="hero-logo-strip" aria-label="PrimeServe company logos">
            {heroServices.map((item, index) => (
              <span className="hero-service-entry" key={item.text}>
                {index === 3 && <span className="hero-service-row-break" aria-hidden="true" />}
                <span className="hero-logo-chip">
                  <i className={`feature-icon ${item.icon}`} />
                  {item.text}
                </span>
              </span>
            ))}
          </div>
        </div>

      </section>

      <section className="company-content">
        <section className="industry-section" id="industries">
          <div className="industry-heading">
            <span>- INDUSTRIES WE SERVE -</span>
            <h2>Powering Every Industry with Intelligent APIs</h2>
            <p>
              From startups to large enterprises, PrimeServe delivers secure APIs
              and compliance solutions that accelerate digital transformation.
            </p>
          </div>

          <div className="industry-carousel-shell" aria-label="Industries carousel">
            <div className="industry-card-track">
              {[...industries, ...industries].map((item, index) => (
                <article className="industry-card" key={`${item.title}-${index}`}>
                  <span className={`industry-icon ${item.icon}`} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="company-footer-cta" id="contact">
          <span className="company-building-icon" />
          <div>
            <h3>Build Smarter. Scale Faster.</h3>
            <p>
              PrimeServe provides the APIs and expertise to help your business
              launch with confidence.
            </p>
          </div>
          <a href="#contact">
            Talk to an Expert <span className="arrow-icon">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}

export default CompanyPage;
