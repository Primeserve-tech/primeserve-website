import { useEffect } from "react";
import OfferingServiceIcon from "./OfferingServiceIcon";
import { servicePortfolio } from "../data/servicePortfolio";

export default function OfferingsPage() {
  useEffect(() => {
    document.title = "Our Offerings | Primeserve";
  }, []);

  return (
    <main className="portfolio-page">
      <section className="portfolio-hero">
        <span>OUR OFFERINGS</span>
        <h1>Technology, compliance and business services—connected.</h1>
        <p>Explore Primeserve&apos;s complete portfolio of enterprise APIs, platforms, integration, managed services, application support and workforce solutions.</p>
      </section>
      <section className="portfolio-grid" aria-label="Primeserve service portfolio">
        {servicePortfolio.map((service) => (
          <a className="portfolio-card" href={service.href} key={service.id}>
            <OfferingServiceIcon type={service.icon} />
            <div>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
            </div>
            <span aria-hidden="true">→</span>
          </a>
        ))}
      </section>
    </main>
  );
}
