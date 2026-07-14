function Features() {
  const cards = [
    {
      icon: "document",
      title: "GST & Compliance APIs",
      text: "GST, E-Invoice, E-Way Bill, GST Returns, HSN/SAC, ITC, TDS, MCA, IEC, MSME and 250+ APIs.",
    },
    {
      icon: "identity",
      title: "Identity Verification APIs",
      text: "Aadhaar eKYC, PAN, Voter ID, Driving Licence, Passport, Video KYC, Face Match and Bank Verification.",
    },
    {
      icon: "business",
      title: "Business Verification APIs",
      text: "GSTIN, CIN, LLP, UDYAM, MSME, Director, FSSAI, Trademark, IEC and Company Verification.",
    },
    {
      icon: "ocr",
      title: "OCR & Document Intelligence APIs",
      text: "AI-powered OCR for Aadhaar, PAN, GST Certificates, Invoices, Cheques, Passbooks and Business Documents.",
    },
    {
      icon: "signature",
      title: "Digital Signature Certificates (DSC)",
      text: "Class 2 & Class 3 DSC, DGFT DSC, Document Signing, USB Tokens and Enterprise Digital Signature Solutions.",
    },
    {
      icon: "sap",
      title: "SAP Implementation & Digital Signature Solutions",
      text: "End-to-end SAP implementation, SAP Integration, SAP support and SAP DMS, GST Compliance and SAP Digital Signature Solutions.",
    },
    {
      icon: "tax",
      title: "Managed Tax & Compliance Services",
      text: "Direct Tax, Indirect Tax, GST Compliance, Return Filing, Advisory, Audit Support and Regulatory Compliance.",
    },
    {
      icon: "cloud",
      title: "Cloud ASP/GSP Platform & Managed Services",
      text: "Cloud-based GST automation, E-Invoicing, E-Way Bill, Reconciliation, Compliance Automation and more.",
    },
  ];

  return (
    <section className="solutions" id="solutions">
      <div className="section-heading">
        <span>- OUR SOLUTIONS -</span>
        <h2>One Platform. Infinite Possibilities.</h2>
        <p>
          From compliance to cloud, we deliver end-to-end solutions and 250+
          APIs to help your business grow faster and smarter.
        </p>
      </div>

      <div className="home-carousel-shell" aria-label="PrimeServe services carousel">
        <div className="home-card-track">
        {[...cards, ...cards].map((card, index) => (
          <article className="feature-card" key={`${card.title}-${index}`}>
            <div className={`feature-icon ${card.icon}`} />
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
