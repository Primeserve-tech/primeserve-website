import companyHero from "../assets/company-page-hero.png";

function CompanyPage() {
  const stats = [
    { icon: "code", number: "250+", title: "APIs", text: "and Growing" },
    { icon: "users", number: "100+", title: "Clients", text: "Across India" },
    { icon: "cloud", number: "10M+", title: "API Calls", text: "Every Month" },
    { icon: "shield", number: "99.99%", title: "Uptime", text: "High Reliability" },
    { icon: "support", number: "24x7", title: "Support", text: "Always Available" },
    { icon: "india", number: "PAN India", title: "Services", text: "Seamless Coverage" },
  ];

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
    { icon: "business", text: "Company APIs" },
    { icon: "identity", text: "KYC APIs" },
    { icon: "gst", text: "GST APIs" },
    { icon: "finance", text: "PAN India" },
  ];

  return (
    <div className="company-page">
      <section className="company-hero">
        <div className="company-hero-copy">
          <span className="company-eyebrow">ABOUT PRIMESERVE</span>
          <h1>
            Building Technology
            <br />
            that Empowers Businesses
            <br />
            <span>Across India</span>
          </h1>
          <p>
            PrimeServe Global Solution Pvt. Ltd. is a technology company
            delivering innovative APIs, products and solutions that simplify
            compliance, automate processes and accelerate digital transformation.
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
            {heroServices.map((item) => (
              <span className="hero-logo-chip" key={item.text}>
                <i className={`api-card-icon ${item.icon}`} />
                {item.text}
              </span>
            ))}
          </div>
        </div>

        <div className="company-hero-art">
          <img src={companyHero} alt="PrimeServe PAN India technology network" />
        </div>

      </section>

      <section className="company-content">
        <div className="company-stats-strip">
          {stats.map((stat) => (
            <article className="company-stat" key={stat.number}>
              <span className={`company-stat-icon ${stat.icon}`} />
              <strong>{stat.number}</strong>
              <b>{stat.title}</b>
              <small>{stat.text}</small>
            </article>
          ))}
        </div>

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
                    <a href="#contact">
                      Learn More <span className="arrow-icon">→</span>
                    </a>
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
