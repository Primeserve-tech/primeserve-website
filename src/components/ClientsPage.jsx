import { useEffect, useRef, useState } from "react";
import logo from "../assets/primeserve-logo-clean.png";
import alankitLogo from "../assets/client-logos/alankit.png";
import cuttackLogo from "../assets/client-logos/cuttack-bulk-carrier.png";
import prathamLogo from "../assets/client-logos/pratham-group.png";
import vegasLogo from "../assets/client-logos/vegas-mall.png";
import axisLogo from "../assets/client-logos/axis-bank.png";
import airtelLogo from "../assets/client-logos/airtel-payments-bank.png";
import denizLogo from "../assets/client-logos/deniz-logistics.png";
import renutechLogo from "../assets/client-logos/renutech-solutions-hd.webp";
import maxiconLogo from "../assets/client-logos/maxicon-hd.webp";

function ClientsPage() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [heroClientCount, setHeroClientCount] = useState(() => reduceMotion ? 100 : 1);
  const [clientCount, setClientCount] = useState(() => reduceMotion ? 100 : 1);
  const [apiCount, setApiCount] = useState(() => reduceMotion ? 250 : 1);
  const [apiCallCount, setApiCallCount] = useState(() => reduceMotion ? 10 : 1);
  const heroCardRef = useRef(null);
  const trustStripRef = useRef(null);

  useEffect(() => {
    if (reduceMotion) return undefined;

    let frame;
    let isVisible = false;

    const startCountUp = () => {
      window.cancelAnimationFrame(frame);
      setHeroClientCount(1);
      const startedAt = performance.now();

      const countUp = (now) => {
        const progress = Math.min(1, (now - startedAt) / 1800);
        setHeroClientCount(Math.max(1, Math.round(1 + (99 * progress))));
        if (progress < 1) frame = window.requestAnimationFrame(countUp);
      };

      frame = window.requestAnimationFrame(countUp);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) startCountUp();
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.35 },
    );

    if (heroCardRef.current) observer.observe(heroCardRef.current);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    let frame;
    let isVisible = false;

    const startCountUp = () => {
      window.cancelAnimationFrame(frame);
      setClientCount(1);
      setApiCount(1);
      setApiCallCount(1);
      const startedAt = performance.now();

      const countUp = (now) => {
        const progress = Math.min(1, (now - startedAt) / 1800);
        setClientCount(Math.max(1, Math.round(1 + (99 * progress))));
        setApiCount(Math.max(1, Math.round(1 + (249 * progress))));
        setApiCallCount(Math.max(1, Math.round(1 + (9 * progress))));
        if (progress < 1) frame = window.requestAnimationFrame(countUp);
      };

      frame = window.requestAnimationFrame(countUp);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) startCountUp();
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.35 },
    );

    if (trustStripRef.current) observer.observe(trustStripRef.current);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  const clients = [
    { name: "Alankit Limited", logo: alankitLogo, sector: "Enterprise compliance and digital services" },
    { name: "Cuttack Bulk Carrier Pvt. Ltd.", logo: cuttackLogo, sector: "Logistics and transport operations" },
    { name: "Pratham Group", logo: prathamLogo, sector: "Enterprise and business group" },
    { name: "Vegas Mall", logo: vegasLogo, sector: "Retail and commercial operations" },
    { name: "Axis Bank", logo: axisLogo, sector: "Banking and financial services" },
    { name: "Bharti Airtel Payments Bank", logo: airtelLogo, sector: "Digital banking and payments" },
    { name: "Deniz", logo: denizLogo, sector: "Logistics and supply chain services" },
    { name: "Ré NuTech Solutions Inc.", logo: renutechLogo, sector: "Technology and software solutions" },
    { name: "Maxicon", logo: maxiconLogo, sector: "Business and enterprise services" },
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
            Primeserve supports enterprises, financial institutions, technology
            companies, logistics businesses, advisors and fast-growing brands
            with reliable APIs, compliance automation and digital solutions.
          </p>
        </div>
        <div className="clients-hero-card" ref={heroCardRef}>
          <img src={logo} alt="Primeserve Global Solution Pvt. Ltd." />
          <strong>{heroClientCount}+</strong>
          <span>Enterprise Clients</span>
          <p>Reliable APIs, innovative solutions and responsive support.</p>
        </div>
      </section>

      <section className="clients-showcase">
        <div className="about-section-heading centered">
          <span>Client Network</span>
          <h2>Organizations that trust Primeserve for digital execution.</h2>
        </div>
        <div className="clients-carousel" aria-label="Primeserve client carousel">
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

      <section className="clients-trust-strip" ref={trustStripRef}>
        <article>
          <strong>{clientCount}+</strong>
          <span>Enterprise Clients</span>
        </article>
        <article>
          <strong>{apiCount}+</strong>
          <span>APIs & Solutions</span>
        </article>
        <article>
          <strong>{apiCallCount}M+</strong>
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
