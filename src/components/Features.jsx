import { useCallback, useEffect, useRef } from "react";
import OfferingServiceIcon from "./OfferingServiceIcon";
import { servicePortfolio } from "../data/servicePortfolio";

function Features() {
  const railRef = useRef(null);

  const move = useCallback((direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".home-solution-card");
    const distance = (card?.getBoundingClientRect().width || 350) + 18;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    const atStart = rail.scrollLeft <= 8;

    if (direction > 0 && atEnd) {
      rail.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && atStart) {
      rail.scrollTo({ left: rail.scrollWidth, behavior: "smooth" });
    } else {
      rail.scrollBy({ left: direction * distance, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => move(1), 4500);
    return () => window.clearInterval(timer);
  }, [move]);

  return (
    <section className="solutions home-solutions" id="solutions">
      <div className="home-solutions-toolbar">
        <strong>Explore our services</strong>
        <div>
          <button type="button" onClick={() => move(-1)} aria-label="Previous services">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next services">→</button>
        </div>
      </div>

      <div className="home-solutions-carousel" aria-label="Primeserve offerings" ref={railRef}>
        {servicePortfolio.map((offering) => (
          <a className="home-solution-card" href={offering.href} key={offering.title}>
            <div className="home-solution-card-top">
              <OfferingServiceIcon type={offering.icon} />
              <b>{offering.category}</b>
            </div>
            <h3>{offering.title}</h3>
            <p>{offering.description}</p>
            <div className="home-solution-points">
              {offering.points.map((point) => <span key={point}>{point}</span>)}
            </div>
            <strong>Explore offering <i>→</i></strong>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Features;
