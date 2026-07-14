function Hero() {
  const trustItems = [
    { icon: "shield", text: "Secure & Reliable" },
    { icon: "bolt", text: "Real-time Data" },
    { icon: "headset", text: "24x7 Enterprise Support" },
  ];

  const heroServices = [
    { icon: "document", text: "250+ APIs" },
    { icon: "sap", text: "SAP Solution" },
    { icon: "cloud", text: "ASP GSP Solution" },
    { icon: "signature", text: "DSC" },
    { icon: "tax", text: "Managed Services" },
  ];

  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        <div className="hero-copy">
          <h1>
            Powering Businesses with
            <br />
            Digital Compliance &
            <br />
            <span>Enterprise Solutions</span>
          </h1>
          <p>
            One trusted platform for APIs, GST Compliance, SAP Solutions,
            Digital Signatures, Managed Tax Services and Cloud Automation.
          </p>

          <div className="hero-actions">
            <a className="btn btn-gold btn-large" href="#solutions">
              Explore Solutions <span className="arrow-icon">→</span>
            </a>
            <a className="btn btn-outline btn-large" href="#demo">
              Request a Demo <span className="arrow-icon">→</span>
            </a>
          </div>

          <div className="trust-row" aria-label="Service qualities">
            {trustItems.map((item) => (
              <div className="trust-item" key={item.text}>
                <span className={`trust-icon ${item.icon}`} />
                {item.text}
              </div>
            ))}
          </div>

          <div className="hero-logo-strip" aria-label="PrimeServe service logos">
            {heroServices.map((item, index) => (
              <span className="hero-service-entry" key={item.text}>
                {index === 3 && <span className="hero-service-row-break" aria-hidden="true" />}
                <span className="hero-logo-chip">
                  <i className={`feature-icon ${item.icon}`} />
                  {item.text}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
