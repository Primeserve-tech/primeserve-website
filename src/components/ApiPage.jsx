import apiHero from "../assets/api-page-hero.png";
import Stats from "./Stats";

function ApiPage() {
  const trustItems = [
    { icon: "easy", text: "Easy Integration" },
    { icon: "code", text: "Developer Friendly" },
    { icon: "time", text: "Real-time Data" },
    { icon: "uptime", text: "High Availability" },
  ];

  const heroServices = [
    { icon: "gst", text: "GST APIs" },
    { icon: "utility", text: "E-Invoice APIs" },
    { icon: "finance", text: "Bank APIs" },
    { icon: "business", text: "Company APIs" },
  ];

  const apiCards = [
    { icon: "gst", title: "GST Get APIs", text: "Fetch GSTIN by name, PAN, mobile, GSTIN Lite, GSTIN Detailed and contact details." },
    { icon: "utility", title: "E-Invoice & E-Way Bill APIs", text: "Enable GST compliance, e-Invoice, e-Way Bill, certificate and return workflows." },
    { icon: "identity", title: "PAN Verification APIs", text: "Fetch PAN Lite, Detailed, Essentials, PAN contact, Aadhaar link and ITR compliance." },
    { icon: "identity", title: "Aadhaar & DigiLocker APIs", text: "Aadhaar masking, QR verification, DigiLocker document fetch and account verification." },
    { icon: "business", title: "Passport & Voter ID APIs", text: "Passport fetch and verify, voter ID Boson/Meson checks and MRZ generation." },
    { icon: "ocr", title: "OCR Document APIs", text: "PAN, Aadhaar, voter ID, cheque, bank statement, salary slip, Udyam, DL and passport OCR." },
    { icon: "finance", title: "Face Match & Liveness APIs", text: "Verify face-to-face images, passive liveness checks and document matching utilities." },
    { icon: "business", title: "Employment Verification APIs", text: "Fetch UAN by PAN, mobile, Aadhaar, latest employment, EPFO passbook and employer checks." },
    { icon: "utility", title: "Vehicle RC & FASTag APIs", text: "RC Lite, RC Detailed, e-Challan, chassis lookup, FASTag details and RC contact checks." },
    { icon: "business", title: "MSME Udyam APIs", text: "Fetch and verify Udyam by mobile, PAN, reference number, OTP and advanced details." },
    { icon: "business", title: "Company & Director APIs", text: "Fetch CIN by PAN, company details, director DIN, PAN by DIN, TAN and FSSAI license." },
    { icon: "finance", title: "Bank Account & UPI APIs", text: "Verify bank account, reverse penny drop, UPI, UPI advanced and account lookup by mobile." },
    { icon: "finance", title: "IFSC & Bank Statement APIs", text: "Verify IFSC, bank branch details, payment channels and analyse bank statement PDFs." },
    { icon: "utility", title: "Mobile Intelligence APIs", text: "Mobile lookup, WhatsApp profile, digital footprint, mobile prefill and spend insights." },
    { icon: "identity", title: "Criminal & Court APIs", text: "Criminal and court record verification reports for identity and risk assessment workflows." },
  ];

  return (
    <div className="api-page">
      <section className="api-hero">
        <div className="api-hero-copy">
          <h1>
            Enterprise APIs for
            <br />
            Seamless <span>Integration</span>
          </h1>
          <p>
            Integrate once and connect with a universe of data, verification and
            compliance APIs. Reliable, secure and built for scale.
          </p>

          <div className="api-actions">
            <a className="btn api-primary-btn" href="#api-list">
              View All APIs <span className="arrow-icon">→</span>
            </a>
            <a
              className="btn api-doc-btn"
              href="https://www.postman.com/primeserve45-7863096/prime-serve-s-workspace/request/53737460-86d255f2-4fa1-49da-81a6-8911c52ac7b5?sideView=agentMode&tab=body"
              target="_blank"
              rel="noreferrer"
            >
              <span className="doc-mini-icon" /> API Documentation
            </a>
          </div>

          <div className="api-trust-row">
            {trustItems.map((item) => (
              <div className="api-trust-item" key={item.text}>
                <span className={`api-trust-icon ${item.icon}`} />
                {item.text}
              </div>
            ))}
          </div>

          <div className="hero-logo-strip" aria-label="PrimeServe API logos">
            {heroServices.map((item) => (
              <span className="hero-logo-chip" key={item.text}>
                <i className={`api-card-icon ${item.icon}`} />
                {item.text}
              </span>
            ))}
          </div>
        </div>

        <div className="api-hero-art">
          <img src={apiHero} alt="API gateway connected to API categories" />
        </div>
      </section>

      <Stats />

      <section className="api-list-section" id="api-list">
        <div className="api-section-heading">
          <span>- OUR APIs -</span>
          <h2>Powerful APIs for Every Business Need</h2>
          <p>
            Choose from our wide range of APIs and build powerful, reliable and
            compliant applications.
          </p>
        </div>

        <div className="api-carousel-shell" aria-label="PrimeServe API catalogue carousel">
          <div className="api-card-track">
          {[...apiCards, ...apiCards].map((card, index) => (
            <article className="api-card" key={`${card.title}-${index}`}>
              <div className={`api-card-icon ${card.icon}`} />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <a href="#api-list">
                Explore APIs <span className="arrow-icon">→</span>
              </a>
            </article>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ApiPage;
