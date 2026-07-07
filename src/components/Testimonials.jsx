import { getCmsData } from "../cmsStore";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function Testimonials() {
  const data = getCmsData();
  const testimonials = (data.testimonials || [])
    .filter((item) => item.status === "Active")
    .slice(0, 8);

  if (testimonials.length === 0) return null;

  const displayTestimonials =
    testimonials.length > 1 ? [...testimonials, ...testimonials] : testimonials;

  return (
    <section className="home-testimonials-section" aria-label="Client testimonials">
      <div className="section-heading">
        <span>- CLIENT TESTIMONIALS -</span>
        <h2>Trusted by growing businesses.</h2>
        <p>
          Feedback published from the PrimeServe Admin CMS appears here
          automatically.
        </p>
      </div>

      <div className="testimonial-carousel-shell">
        <div className={`testimonial-track ${testimonials.length > 1 ? "is-sliding" : ""}`}>
          {displayTestimonials.map((item, index) => (
            <article className="testimonial-card" key={`${item.id}-${index}`}>
              <div className="testimonial-profile">
                {item.photo ? (
                  <img src={item.photo} alt={item.clientName} />
                ) : (
                  <span>{getInitials(item.clientName) || "PS"}</span>
                )}
                <div>
                  <h3>{item.clientName}</h3>
                  <p>{item.designation}</p>
                </div>
              </div>
              <blockquote>{item.testimonial}</blockquote>
              <div className="testimonial-meta">
                <strong>{item.companyName}</strong>
                {item.rating && <span>{item.rating}/5</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
