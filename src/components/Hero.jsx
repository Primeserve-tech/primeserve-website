function Hero() {
  const openContact = () => window.dispatchEvent(new CustomEvent("primeserve:open-contact"));

  const trustItems = [
    { icon: "shield", text: "Secure & Reliable" },
    { icon: "bolt", text: "Real-time Data" },
    { icon: "headset", text: "Enterprise Support" },
  ];

  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        <div className="hero-copy">
          <h1>
            Powering Businesses with
            <br />
            Technology, Compliance &
            <br />
            <span>Enterprise Services</span>
          </h1>
          <p className="hero-portfolio-copy">
            One trusted partner for digital compliance, enterprise technology
            <br className="hero-desktop-break" /> and managed business solutions.
          </p>

          <div className="trust-row" aria-label="Service qualities">
            {trustItems.map((item) => (
              <div className="trust-item" key={item.text}>
                <span className={`trust-icon ${item.icon}`} />
                {item.text}
              </div>
            ))}
          </div>

          <div className="hero-primary-actions">
            <a href="#solutions">Explore Our Offerings <span aria-hidden="true">→</span></a>
            <button type="button" onClick={openContact}>Talk to Our Team <span aria-hidden="true">→</span></button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
