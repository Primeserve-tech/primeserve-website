import productHero from "../assets/product-page-hero.png";
import productCta from "../assets/product-cta.png";

function ProductPage() {
  const trustItems = [
    { icon: "security", title: "Enterprise Grade", text: "Security" },
    { icon: "cloud", title: "Cloud Native", text: "Platform" },
    { icon: "scale", title: "Scalable &", text: "High Performance" },
    { icon: "support", title: "24x7 Expert", text: "Support" },
  ];

  const products = [
    {
      icon: "gst",
      title: "GST Compliance Platform",
      text: "Automate GST returns, reconciliation, notices and compliance with accuracy.",
    },
    {
      icon: "invoice",
      title: "E-Invoice Platform",
      text: "Generate, validate and manage e-Invoices seamlessly.",
    },
    {
      icon: "eway",
      title: "E-Way Bill Platform",
      text: "Generate and manage E-Way Bills in real-time with ease.",
    },
    {
      icon: "signature",
      title: "Digital Signature Certificates",
      text: "Class 3, DGFT, document signing certificates with secure tokens.",
    },
    {
      icon: "sap",
      title: "SAP GST Connector",
      text: "Seamless integration of SAP with GST, e-Invoice, e-Way Bill and DSC.",
    },
    {
      icon: "ocr",
      title: "OCR Platform",
      text: "AI-powered OCR to extract data from documents with high accuracy.",
    },
    {
      icon: "cloud",
      title: "Cloud ASP/GSP Platform",
      text: "Cloud-native platform for GST automation and enterprise compliance.",
    },
  ];

  const heroServices = [
    { icon: "invoice", text: "E-Invoice" },
    { icon: "eway", text: "E-Way Bill" },
    { icon: "signature", text: "DSC" },
    { icon: "sap", text: "SAP" },
    { icon: "ocr", text: "OCR" },
  ];

  return (
    <div className="product-page">
      <section className="product-hero">
        <div className="product-hero-copy">
          <span className="product-eyebrow">OUR PRODUCTS</span>
          <h1>
            Enterprise Products Built for
            <br />
            Digital <span>Compliance & Automation</span>
          </h1>
          <p>
            Powerful, secure and scalable products to simplify compliance,
            automate workflows and accelerate your business operations.
          </p>

          <div className="product-actions">
            <a className="btn product-primary-btn" href="#products">
              Explore Products <span className="arrow-icon">→</span>
            </a>
            <a className="btn product-outline-btn" href="#demo">
              Request a Demo
            </a>
          </div>

          <div className="product-trust-row">
            {trustItems.map((item) => (
              <div className="product-trust-item" key={item.title}>
                <span className={`product-trust-icon ${item.icon}`} />
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </div>
            ))}
          </div>

          <div className="hero-logo-strip" aria-label="PrimeServe product logos">
            {heroServices.map((item) => (
              <span className="hero-logo-chip" key={item.text}>
                <i className={`product-card-icon ${item.icon}`} />
                {item.text}
              </span>
            ))}
          </div>
        </div>

        <div className="product-hero-art">
          <img src={productHero} alt="PrimeServe product dashboard" />
        </div>
      </section>

      <section className="product-list-section" id="products">
        <div className="product-section-heading">
          <span>- OUR PRODUCTS -</span>
          <h2>Complete Suite of Products for Modern Businesses</h2>
          <p>
            From compliance to automation, we have the right product for every
            business need.
          </p>
        </div>

        <div className="product-carousel-shell" aria-label="PrimeServe products carousel">
          <div className="product-card-track">
          {[...products, ...products].map((product, index) => (
            <article className="product-card" key={`${product.title}-${index}`}>
              <div className={`product-card-icon ${product.icon}`} />
              <h3>{product.title}</h3>
              <p>{product.text}</p>
              <a href="#products">
                Learn More <span className="arrow-icon">→</span>
              </a>
            </article>
          ))}
          </div>
        </div>

        <div className="product-cta" id="demo">
          <img src={productCta} alt="" />
          <div>
            <h3>Ready to transform your compliance and automation journey?</h3>
            <p>
              Explore our products or speak to our experts to find the right
              solution for your business.
            </p>
          </div>
          <a className="product-demo-btn" href="#demo">
            Schedule a Demo
          </a>
          <a className="product-contact-btn" href="#contact">
            Contact Sales
          </a>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
