import { useEffect, useState } from "react";
import solutionHeroOriginal from "../assets/solution-page-hero.png";
import solutionHeroV2 from "../assets/solution-page-hero-v2.png";

// Change this to false at any time to restore the original hero image.
const USE_SOLUTION_HERO_V2 = true;
const solutionHero = USE_SOLUTION_HERO_V2 ? solutionHeroV2 : solutionHeroOriginal;

function SolutionPage() {
  const [selectedSolution, setSelectedSolution] = useState(null);

  const solutions = [
    {
      category: "Enterprise Integration",
      icon: "sap",
      title: "SAP Implementation & Digital Signature Solutions",
      description:
        "End-to-end SAP implementation, integration, vendor payment automation, digital signatures and enterprise workflow transformation.",
      bullets: [
        "SAP Implementation",
        "SAP GST Integration",
        "SAP DMS",
        "SAP Digital Signature",
        "Invoice Automation",
        "Vendor Payment Automation",
        "Vendor Onboarding",
        "Workflow Automation",
        "SAP FICO Integration",
        "SAP API Integration",
        "Payment Reconciliation",
        "SAP Support & Consulting",
      ],
    },
    {
      category: "Compliance Services",
      icon: "tax",
      title: "Managed Tax & Compliance Services",
      description:
        "Complete direct tax, indirect tax, GST, corporate and regulatory compliance services delivered by domain experts.",
      bullets: [
        "GST Return Filing",
        "Direct Tax",
        "Indirect Tax",
        "ROC Compliance",
        "Income Tax Returns",
        "TDS & TCS Compliance",
        "GST Reconciliation",
        "Notice Management",
        "Vendor Compliance",
        "Audit Support",
        "Tax Advisory",
        "Compliance Automation",
      ],
    },
    {
      category: "Cloud Platform",
      icon: "cloud",
      title: "Cloud ASP/GSP Platform & Managed Services",
      description:
        "Cloud-based GST, vendor management, e-Invoice, e-Way Bill and reconciliation platform for enterprises, ASPs and GSPs.",
      bullets: [
        "Cloud GST Platform",
        "e-Invoice Automation",
        "e-Way Bill Automation",
        "GST Reconciliation",
        "Vendor Management",
        "Vendor Onboarding",
        "Vendor Compliance Tracking",
        "Purchase Register Matching",
        "Input Tax Credit Controls",
        "Multi-user Dashboard",
        "Compliance Reports",
        "API Integration",
        "Managed Support",
      ],
    },
    {
      category: "Compliance APIs",
      icon: "gst",
      title: "GST & Compliance APIs",
      description:
        "Extensive APIs for GST, returns, e-Invoice, e-Way Bill, MCA, IEC, MSME, TDS and enterprise compliance automation.",
      bullets: [
        "GST Public Search",
        "GST Taxpayer API",
        "GST Return Filed API",
        "GSTR-1, 2A, 2B, 3B, 6, 9",
        "e-Invoice APIs",
        "e-Way Bill APIs",
        "GST Registration Status",
        "GST Filing History",
        "GSTR-2B Reconciliation",
        "ITC Eligibility",
        "HSN/SAC & Tax Rates",
        "TDS & TCS APIs",
        "MCA / CIN / DIN / TAN",
        "IEC / MSME / HSN / TDS",
      ],
    },
    {
      category: "Verification APIs",
      icon: "identity",
      title: "Identity Verification APIs",
      description:
        "180+ real-time Vehicle, PAN, Passport, Aadhaar, MSME, Company, CIN and DIN verification APIs for onboarding, KYC and business risk checks.",
      bullets: [
        "Vehicle APIs",
        "PAN Verification",
        "Passport",
        "Aadhaar eKYC",
        "MSME Verification",
        "Company Verification",
        "CIN Verification",
        "DIN Verification",
        "Bank Account Verification",
        "Driving Licence",
        "Voter ID",
        "Face Match & Video KYC",
        "UAN & Employment Check",
        "Criminal & Court Check",
        "FSSAI Verification",
        "Bank & UPI Verification",
        "Mobile Intelligence",
      ],
    },
    {
      category: "Digital Signature",
      icon: "signature",
      title: "Digital Signature Certificates (DSC)",
      description: "Secure Digital Signature Certificates (DSC), USB Crypto Tokens, document signing, tender participation, GST, MCA, Income Tax, DGFT and enterprise authentication solutions.",
      bullets: [
        "Class 3 Individual DSC",
        "Class 3 Organisation DSC",
        "Signing & Encryption",
        "DGFT Digital Signature",
        "USB Crypto Token",
        "e-Tendering & e-Procurement",
        "Document Signing",
        "Enterprise Support",
      ],
    },
  ];

  const stats = [
    { icon: "rocket", number: "250+", text: "APIs & Solutions Built for Scale" },
    { icon: "users", number: "100+", text: "Enterprises Trust PrimeServe" },
    { icon: "shield", number: "99.99%", text: "Platform Uptime & Reliability" },
    { icon: "support", number: "24x7", text: "Expert Support Always Available" },
    { icon: "lock", number: "Enterprise-Grade", text: "Security & Data Protection" },
  ];

  const heroServices = [
    { icon: "business", text: "Business" },
    { icon: "identity", text: "Verification" },
    { icon: "gst", text: "Compliance" },
    { icon: "tax", text: "Automation" },
    { icon: "cloud", text: "Growth" },
  ];

  useEffect(() => {
    if (!selectedSolution) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedSolution(null);
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSolution]);

  const closeSolutionModal = () => setSelectedSolution(null);

  return (
    <div className="solution-page">
      <section className="solution-hero" style={{ "--solution-hero-image": `url(${solutionHero})` }}>
        <div className="solution-hero-copy">
          <h1>
            Enterprise Solutions for
            <br />
            Digital Compliance,
            <br />
            <span>Verification & Automation</span>
          </h1>
          <p>
            End-to-end solutions to help businesses streamline compliance,
            verify identities and documents, automate processes and drive
            growth with confidence.
          </p>

          <div className="solution-actions">
            <a className="btn solution-primary-btn" href="#solutions">
              Explore Solutions <span className="arrow-icon">→</span>
            </a>
            <a className="btn solution-outline-btn" href="#demo">
              Request a Demo
            </a>
          </div>

          <div className="hero-logo-strip" aria-label="PrimeServe solution logos">
            {heroServices.map((item) => (
              <span className="hero-logo-chip" key={item.text}>
                <i className={`solution-card-icon ${item.icon}`} />
                {item.text}
              </span>
            ))}
          </div>
        </div>

      </section>

      <section className="solution-list-section" id="solutions">
        <div className="solution-section-heading">
          <h2>Our Enterprise Solutions</h2>
          <p>
            Comprehensive solutions designed to address your business challenges
            and accelerate digital transformation.
          </p>
        </div>

        <div className="solution-carousel-shell" aria-label="PrimeServe solutions">
          <div className="solution-card-track">
            {[...solutions, ...solutions].map((solution, index) => (
              <article className="solution-card" key={`${solution.title}-${index}`}>
                <div className={`solution-card-icon ${solution.icon}`} />
                <span className={`solution-card-category ${solution.icon}`}>
                  {solution.category}
                </span>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
                <div className="solution-card-highlights" aria-label={`${solution.title} features`}>
                  {solution.bullets.slice(0, 8).map((bullet) => (
                    <span key={bullet}>{bullet}</span>
                  ))}
                  <span className="solution-card-more">Many More...</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="solution-bottom-row">
          <div className="solution-stat-strip">
            {stats.map((stat) => (
              <article className="solution-stat" key={stat.number}>
                <div className={`solution-stat-icon ${stat.icon}`} />
                <strong>{stat.number}</strong>
                <span>{stat.text}</span>
              </article>
            ))}
          </div>

          <div className="solution-transform-card" id="demo">
            <strong>Ready to transform your business?</strong>
            <a href="#demo">Talk to Our Experts <span className="arrow-icon">→</span></a>
          </div>
        </div>
      </section>

      {selectedSolution ? (
        <div
          className="solution-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSolutionModal();
          }}
        >
          <aside
            className="solution-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="solution-modal-title"
          >
            <button
              className="solution-modal-close"
              type="button"
              aria-label="Close solution details"
              onClick={closeSolutionModal}
            >
              ×
            </button>
            <div className="solution-modal-header">
              <span className={`solution-card-icon ${selectedSolution.icon}`} />
              <div>
                <span>{selectedSolution.category}</span>
                <h2 id="solution-modal-title">{selectedSolution.title}</h2>
              </div>
            </div>
            <p className="solution-modal-description">
              {selectedSolution.description}
            </p>
            <div className="solution-modal-bullets">
              {selectedSolution.bullets.map((bullet) => (
                <span key={bullet}>{bullet}</span>
              ))}
            </div>
            <div className="solution-modal-actions">
              <a className="solution-modal-primary" href="#demo" onClick={closeSolutionModal}>
                Request Demo
              </a>
              <a className="solution-modal-secondary" href="#solutions" onClick={closeSolutionModal}>
                View Full Catalogue
              </a>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

export default SolutionPage;
