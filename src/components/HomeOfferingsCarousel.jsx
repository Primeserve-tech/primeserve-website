import { useCallback, useEffect, useMemo, useRef } from "react";
import { getCmsData } from "../cmsStore";

const coreOfferings = [
  {
    id: "offering-apis",
    eyebrow: "ENTERPRISE APIs",
    title: "API Services",
    description: "Secure verification, GST, identity and business APIs designed for reliable enterprise integration.",
    points: ["GST and verification APIs", "Identity and business checks", "Developer-ready integration"],
    href: "/apis",
    mark: "API",
  },
  {
    id: "offering-asp-gsp",
    eyebrow: "GST COMPLIANCE",
    title: "ASP-GSP Solutions",
    description: "Managed GST connectivity and compliance workflows for businesses that need dependable filing operations.",
    points: ["GST return workflows", "e-Invoice and e-Way Bill", "Enterprise compliance support"],
    href: "/solutions/asp-gsp",
    mark: "GST",
  },
  {
    id: "offering-products",
    eyebrow: "DIGITAL PRODUCTS",
    title: "Business Products",
    description: "Purpose-built digital products that simplify business processes, compliance and operational execution.",
    points: ["Ready business platforms", "Scalable deployment", "Ongoing product support"],
    href: "/products",
    mark: "PRD",
  },
];

export default function HomeOfferingsCarousel() {
  const railRef = useRef(null);
  const cards = useMemo(() => {
    const services = getCmsData().services || [];
    return [
      ...coreOfferings,
      ...services
      .filter((service) => service.status === "Active")
      .sort((a, b) => Number(a.sortOrder || 999) - Number(b.sortOrder || 999))
      .map((service) => ({
        id: service.id,
        eyebrow: service.category || "BUSINESS SERVICE",
        title: service.title,
        description: service.shortDescription,
        points: String(service.highlights || "").split(/\r?\n/).filter(Boolean).slice(0, 3),
        href: "/services",
        mark: service.icon || "SVC",
        })),
    ];
  }, []);

  const move = useCallback((direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".home-offering-card");
    const distance = (card?.getBoundingClientRect().width || 360) + 20;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    if (direction > 0 && atEnd) {
      rail.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    rail.scrollBy({ left: direction * distance, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => move(1), 4800);
    return () => window.clearInterval(timer);
  }, [move]);

  return (
    <section className="home-offerings">
      <div className="home-offerings-heading">
        <div>
          <span>EXPLORE PRIMESERVE</span>
          <h2>One partner. Multiple business capabilities.</h2>
          <p>Browse our technology, compliance, product and workforce offerings. Select any card to explore it.</p>
        </div>
        <div className="home-offering-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous offering">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next offering">→</button>
        </div>
      </div>

      <div className="home-offering-rail" ref={railRef}>
        {cards.map((card) => (
          <a className="home-offering-card" href={card.href} key={card.id}>
            <div className="home-offering-card-top">
              <b>{card.mark}</b>
              <span>{card.eyebrow}</span>
            </div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <ul>{card.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <strong>Explore offering <i>→</i></strong>
          </a>
        ))}
      </div>
    </section>
  );
}
