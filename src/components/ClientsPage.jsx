import logo from "../assets/primeserve-logo-clean.png";
import alankitLogo from "../assets/client-logos/alankit.png";
import acsLogo from "../assets/client-logos/acs-infotech.png";
import cuttackLogo from "../assets/client-logos/cuttack-bulk-carrier.png";
import mcrtLogo from "../assets/client-logos/mcrt-software.png";
import viaszLogo from "../assets/client-logos/viasz-infotech.png";
import rjSoniLogo from "../assets/client-logos/rj-soni-associates.png";
import prathamLogo from "../assets/client-logos/pratham-group.png";
import vegasLogo from "../assets/client-logos/vegas-mall.png";
import axisLogo from "../assets/client-logos/axis-bank.png";
import airtelLogo from "../assets/client-logos/airtel-payments-bank.png";

function ClientsPage() {
  const clients = [
    { name: "Alankit Limited", logo: alankitLogo, sector: "Enterprise compliance and digital services" },
    { name: "ACS Infotech", logo: acsLogo, sector: "Technology and software services" },
    { name: "Cuttack Bulk Carrier Pvt. Ltd.", logo: cuttackLogo, sector: "Logistics and transport operations" },
    { name: "MCRT Software India Pvt. Ltd.", logo: mcrtLogo, sector: "Smart business software solutions" },
    { name: "Viasz Infotech (India) Pvt. Ltd.", logo: viaszLogo, sector: "IT services and digital solutions" },
    { name: "R.J. Soni & Associates", logo: rjSoniLogo, sector: "Chartered accountants and advisory" },
    { name: "Pratham Group", logo: prathamLogo, sector: "Enterprise and business group" },
    { name: "Vegas Mall", logo: vegasLogo, sector: "Retail and commercial operations" },
    { name: "Axis Bank", logo: axisLogo, sector: "Banking and financial services" },
    { name: "Bharti Airtel Payments Bank", logo: airtelLogo, sector: "Digital banking and payments" },
  ];

  const industries = [
    "Banking",
    "FinTech",
    "Logistics",
    "Retail",
    "Software",
    "Compliance",
    "Payments",
    "Advisory",
  ];

  const carouselClients = [...clients, ...clients];

  return (
    <div className="clients-page">
      <section className="clients-hero">
        <div className="clients-hero-copy">
          <span className="about-eyebrow">OUR ESTEEMED CLIENTELE</span>
          <h1>Trusted by leading organizations across industries.</h1>
          <p>
            PrimeServe supports enterprises, financial institutions, technology
            companies, logistics businesses, advisors and fast-growing brands
            with reliable APIs, compliance automation and digital solutions.
          </p>
        </div>
        <div className="clients-hero-card">
          <img src={logo} alt="PrimeServe Global Solution Pvt. Ltd." />
          <strong>100+</strong>
          <span>Enterprise Clients</span>
          <p>Reliable APIs, innovative solutions and responsive support.</p>
        </div>
      </section>

      <section className="clients-showcase">
        <div className="about-section-heading centered">
          <span>Client Network</span>
          <h2>Organizations that trust PrimeServe for digital execution.</h2>
        </div>
        <div className="clients-carousel" aria-label="PrimeServe client carousel">
          <div className="clients-track">
            {carouselClients.map((client, index) => (
              <article className="client-logo-card" key={`${client.name}-${index}`}>
                <div className="client-logo-mark">
                  <img src={client.logo} alt={`${client.name} logo`} />
                </div>
                <h3>{client.name}</h3>
                <p>{client.sector}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="clients-industries">
        <div className="clients-industries-copy">
          <span className="about-eyebrow">Industries We Support</span>
          <h2>Built for the teams that run critical business workflows.</h2>
          <p>
            Our platform supports organizations that need dependable
            verification, tax, compliance, payment and enterprise automation
            workflows across India.
          </p>
        </div>
        <div className="clients-industry-grid">
          {industries.map((industry) => (
            <span key={industry}>{industry}</span>
          ))}
        </div>
      </section>

      <section className="clients-trust-strip">
        <article>
          <strong>100+</strong>
          <span>Enterprise Clients</span>
        </article>
        <article>
          <strong>250+</strong>
          <span>APIs & Solutions</span>
        </article>
        <article>
          <strong>10M+</strong>
          <span>API Calls</span>
        </article>
        <article>
          <strong>PAN India</strong>
          <span>Business Coverage</span>
        </article>
      </section>
    </div>
  );
}

export default ClientsPage;
