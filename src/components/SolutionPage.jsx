import { useEffect, useState } from "react";
import solutionHero from "../assets/solution-page-hero.png";

function SolutionPage() {
  const [selectedSolution, setSelectedSolution] = useState(null);

  const solutions = [
    {
      category: "Enterprise Integration",
      icon: "sap",
      title: "SAP Implementation & Digital Signature Solutions",
      description:
        "End-to-end SAP integration, automation and digital signature enablement for enterprise compliance workflows.",
      bullets: [
        "SAP Implementation",
        "SAP GST Integration",
        "SAP DMS",
        "SAP Digital Signature",
        "Invoice Automation",
        "Workflow Automation",
        "SAP Support & Consulting",
      ],
    },
    {
      category: "Compliance Services",
      icon: "tax",
      title: "Managed Tax & Compliance Services",
      description:
        "Complete tax, GST and regulatory compliance support delivered by domain experts.",
      bullets: [
        "GST Return Filing",
        "Direct Tax",
        "Indirect Tax",
        "ROC Compliance",
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
        "Cloud-based GST, e-Invoice and e-Way Bill automation platform for enterprises, ASPs and GSP-led workflows.",
      bullets: [
        "Cloud GST Platform",
        "e-Invoice Automation",
        "e-Way Bill Automation",
        "GST Reconciliation",
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
        "Reliable APIs for GST, e-Invoice, e-Way Bill, MCA, IEC, MSME and compliance automation.",
      bullets: [
        "GST Public Search",
        "GST Taxpayer API",
        "GST Return Filed API",
        "GSTR-1, 2A, 2B, 3B, 6, 9",
        "e-Invoice APIs",
        "e-Way Bill APIs",
        "MCA / CIN / DIN / TAN",
        "IEC / MSME / HSN / TDS",
      ],
    },
    {
      category: "Verification APIs",
      icon: "identity",
      title: "Identity Verification APIs",
      description:
        "Real-time verification APIs for customer onboarding, KYC, business verification and risk checks.",
      bullets: [
        "Aadhaar eKYC",
        "PAN Verification",
        "PAN Fetch",
        "PAN to GST",
        "PAN to MSME",
        "Bank Account Verification",
        "Driving Licence",
        "Voter ID",
        "Passport",
        "Face Match",
        "Video KYC",
        "TransUnion & Equifax Credit APIs",
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
      <section className="solution-hero">
        <div className="solution-hero-copy">
          <span className="solution-eyebrow">OUR SOLUTIONS</span>
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

        <div className="solution-hero-art">
          <img src={solutionHero} alt="Business verification compliance automation growth workflow" />
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
            {solutions.map((solution) => (
              <article className="solution-card" key={solution.title}>
                <div className={`solution-card-icon ${solution.icon}`} />
                <span className={`solution-card-category ${solution.icon}`}>
                  {solution.category}
                </span>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
                <button type="button" onClick={() => setSelectedSolution(solution)}>
                  Learn More <span className="arrow-icon">→</span>
                </button>
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
