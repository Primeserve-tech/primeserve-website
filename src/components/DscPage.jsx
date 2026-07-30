import { useCallback, useEffect, useRef, useState } from "react";
import DSCIcon from "./DSCIcon";
import sapLogo from "../assets/sap-logo.svg";
import { createId, getCmsData, saveCmsData } from "../cmsStore";
import { notifyAdminOfSubmission } from "../adminNotifications";

const products = [
  ["Class 3 DSC", "Secure digital signing and authentication for eligible digital transactions and filings."],
  ["Class 3 Individual DSC", "For individuals, professionals, directors and authorized signatories."],
  ["Class 3 Organization DSC", "For companies, LLPs and organizations requiring authorized digital signing."],
  ["DGFT DSC", "For applicable DGFT and foreign trade requirements."],
  ["Signing DSC", "For digitally signing documents, forms and online filings."],
  ["Signing + Encryption DSC", "For applications requiring both digital signing and encryption capabilities."],
];

const useCases = [
  "GST", "Income Tax", "MCA / ROC", "e-Tendering", "e-Procurement", "DGFT",
  "ICEGATE", "EPFO", "Document Signing", "Banking & Financial Documentation",
  "Patent & Trademark Filing", "Corporate Compliance",
];

const serviceActions = [
  ["Apply for New DSC", "Class 3 DSC"],
  ["Renew DSC", "Renewal"],
  ["DSC Application Status", "Other"],
  ["DSC Download Assistance", "Other"],
  ["DSC Reissue Assistance", "Other"],
  ["DSC Revocation Assistance", "Other"],
  ["Bulk / Enterprise DSC", "Enterprise / Bulk DSC"],
  ["DSC Support", "Other"],
];

const faqs = [
  ["What is a Digital Signature Certificate?", "A DSC is an electronic credential used to authenticate identity and digitally sign supported documents and online transactions."],
  ["What is Class 3 DSC?", "Class 3 DSC is a certificate category used for eligible high-assurance digital signing and authentication requirements."],
  ["Who can apply for a DSC?", "Eligible individuals, professionals, authorized signatories and organizations can apply, subject to the applicable verification requirements."],
  ["What is the difference between Individual and Organization DSC?", "An Individual DSC represents an eligible person, while an Organization DSC is associated with an authorized signatory acting for an eligible organization."],
  ["What is DGFT DSC?", "DGFT DSC supports applicable foreign-trade and DGFT-related digital transactions."],
  ["What is Signing DSC?", "A Signing DSC is used to authenticate and digitally sign supported documents and filings."],
  ["What is Signing + Encryption DSC?", "It combines digital signing with encryption capabilities for supported applications that require both."],
  ["How long is a DSC valid?", "Available validity options may include one, two or three years, depending on certificate type and the authorized ecosystem."],
  ["Can I renew my DSC?", "Yes. Primeserve can assist with the applicable renewal and verification process."],
  ["Where can a DSC be used?", "Common use cases include GST, Income Tax, MCA, tenders, procurement, DGFT, ICEGATE, EPFO and document signing."],
  ["What documents are required for DSC?", "Requirements vary by applicant and certificate type. The Primeserve team will share the applicable checklist after reviewing your request."],
  ["Does Primeserve provide DSC support for enterprises?", "Yes. Primeserve supports coordinated onboarding, renewal and assistance for multiple employees and authorized signatories."],
  ["What is Primeserve's role as a Super RA?", "Primeserve supports applications, verification, issuance coordination, renewal and customer assistance through the authorized DSC ecosystem. Primeserve is not represented as a Certifying Authority."],
];

function validMobile(value) {
  return /^[6-9]\d{9}$/.test(String(value || "").trim());
}

function DscPage() {
  const productRailRef = useRef(null);
  const [productsPaused, setProductsPaused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [requirement, setRequirement] = useState("Class 3 DSC");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const moveProducts = useCallback((direction) => {
    const rail = productRailRef.current;
    if (!rail) return;
    const card = rail.querySelector(".dsc-product-card");
    const distance = (card?.getBoundingClientRect().width || 360) + 20;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    const atStart = rail.scrollLeft <= 8;
    if (direction > 0 && atEnd) rail.scrollTo({ left: 0, behavior: "smooth" });
    else if (direction < 0 && atStart) rail.scrollTo({ left: rail.scrollWidth, behavior: "smooth" });
    else rail.scrollBy({ left: direction * distance, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (productsPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const timer = window.setInterval(() => moveProducts(1), 3500);
    return () => window.clearInterval(timer);
  }, [moveProducts, productsPaused]);

  useEffect(() => {
    const oldTitle = document.title;
    document.title = "Digital Signature Certificate (DSC) Services | Primeserve";
    let meta = document.querySelector('meta[name="description"]');
    const oldDescription = meta?.content || "";
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Apply for Digital Signature Certificates with Primeserve. Class 3 DSC, DGFT, Individual, Organization, renewal, enterprise DSC and digital signing solutions.";

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.dscFaqSchema = "true";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
    document.head.appendChild(schema);
    return () => {
      document.title = oldTitle;
      meta.content = oldDescription;
      schema.remove();
    };
  }, []);

  useEffect(() => {
    if (!modalOpen) return undefined;
    const close = (event) => {
      if (event.key === "Escape" && !submitting) setModalOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [modalOpen, submitting]);

  const openApplication = (nextRequirement = "Class 3 DSC") => {
    setRequirement(nextRequirement);
    setErrors({});
    setSuccess("");
    setModalOpen(true);
  };

  const submitRequest = (event) => {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const nextErrors = {};
    if (!String(values.name || "").trim()) nextErrors.name = "Full name is required.";
    if (!validMobile(values.mobile)) nextErrors.mobile = "Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email || "").trim())) nextErrors.email = "Enter a valid email address.";
    if (!values.applicantType) nextErrors.applicantType = "Select an applicant type.";
    if (!values.requirement) nextErrors.requirement = "Select a DSC requirement.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    const now = new Date();
    const enquiry = {
      id: createId("dsc"),
      name: String(values.name).trim(),
      company: String(values.company || "").trim(),
      email: String(values.email).trim(),
      mobile: String(values.mobile).trim(),
      service: `Digital Signature Certificate - ${values.requirement}`,
      message: [
        `Applicant: ${values.applicantType}`,
        `Validity: ${values.validity || "Not selected"}`,
        String(values.message || "").trim(),
      ].filter(Boolean).join(" | "),
      date: now.toISOString().slice(0, 10),
      dateTime: now.toISOString(),
      status: "New",
      type: "DSC Request",
    };
    const data = getCmsData();
    saveCmsData({ ...data, enquiries: [enquiry, ...(data.enquiries || [])] });
    notifyAdminOfSubmission("DSC request", enquiry);
    setSubmitting(false);
    setSuccess("Thank you. Your DSC request has been submitted successfully. The Primeserve team will contact you shortly.");
    form.reset();
  };

  return (
    <div className="dsc-page">
      <section className="dsc-hero">
        <div className="dsc-hero-copy">
          <h1>Digital Signature Certificate <span>(DSC)</span></h1>
          <h2>Secure Digital Signing for Individuals &amp; Businesses</h2>
          <p>Primeserve provides Digital Signature Certificate services through its Super RA network, enabling individuals, professionals and organizations to obtain DSCs through a simple, secure and professionally supported digital process.</p>
          <div className="dsc-actions">
            <button className="btn btn-primary" onClick={() => openApplication("Class 3 DSC")}>Apply for DSC</button>
            <button className="btn btn-ghost" onClick={() => openApplication("Renewal")}>Renew DSC</button>
          </div>
        </div>
        <div className="dsc-hero-visual" aria-label="Secure digital certificate illustration">
          <div className="dsc-orbit dsc-orbit-one" />
          <div className="dsc-orbit dsc-orbit-two" />
          <DSCIcon size="lg" />
          <div className="dsc-service-orbit" aria-label="Digital Signature Certificate services">
            <span className="dsc-visual-chip chip-identity">Class 3 DSC</span>
            <span className="dsc-visual-chip chip-signing">DGFT DSC</span>
            <span className="dsc-visual-chip chip-auth">Individual DSC</span>
            <span className="dsc-visual-chip chip-organization">Organization DSC</span>
            <span className="dsc-visual-chip chip-foreign">Foreign DSC</span>
          </div>
          <div className="dsc-token-orbit" aria-label="Digital Signature Certificate token options">
            <span className="dsc-token-chip token-heading">Tokens</span>
            <span className="dsc-token-chip token-epass">E-Pass</span>
            <span className="dsc-token-chip token-proxkey">ProxKey</span>
            <span className="dsc-token-chip token-mtoken">M-Token</span>
          </div>
        </div>
      </section>

      <section className="dsc-section dsc-products" id="dsc-products">
        <div className="dsc-section-heading">
          <DSCIcon size="md" />
          <div><h2>Digital Signature Certificate Solutions</h2><p>Choose a certificate requirement suited to your individual, organizational or enterprise use case.</p></div>
          <nav className="dsc-product-controls" aria-label="DSC product carousel controls">
            <button type="button" onClick={() => moveProducts(-1)} aria-label="Previous DSC product">←</button>
            <button type="button" onClick={() => moveProducts(1)} aria-label="Next DSC product">→</button>
          </nav>
        </div>
        <div
          className="dsc-product-grid"
          ref={productRailRef}
          aria-live="off"
          onMouseEnter={() => setProductsPaused(true)}
          onMouseLeave={() => setProductsPaused(false)}
          onFocusCapture={() => setProductsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setProductsPaused(false);
          }}
        >
          {products.map(([title, text]) => (
            <article className="dsc-product-card" key={title}>
              <DSCIcon size="sm" />
              <h3>{title}</h3><p>{text}</p>
              <button onClick={() => openApplication(title)}>Explore / Apply <span>→</span></button>
            </article>
          ))}
        </div>
      </section>

      <section className="dsc-section dsc-validity-section">
        <div><h2>Choose Your DSC Validity</h2><p>Select a preferred duration. Final availability depends on the selected certificate and authorized process.</p></div>
        <div className="dsc-validity-options">
          {["1 Year", "2 Years", "3 Years"].map((item) => <button key={item} onClick={() => openApplication("Class 3 DSC")}><strong>{item}</strong><span>Validity option</span></button>)}
        </div>
      </section>

      <section className="dsc-section">
        <div className="dsc-centered-heading"><h2>One DSC. Multiple Digital Use Cases.</h2><p>Support for common statutory, business and digital-document workflows.</p></div>
        <div className="dsc-use-grid">{useCases.map((item) => <div key={item}><span>✓</span>{item}</div>)}</div>
      </section>

      <section className="dsc-section dsc-process-section">
        <div className="dsc-centered-heading"><h2>Simple &amp; Secure DSC Application Process</h2></div>
        <div className="dsc-process-grid">
          {[
            ["01", "Choose Your DSC", "Select certificate type, applicant type and validity."],
            ["02", "Complete Application & KYC", "Provide required information and complete the applicable verification process."],
            ["03", "Verification & Processing", "The application is verified and processed through the authorized DSC ecosystem."],
            ["04", "DSC Issuance / Download", "After successful approval, complete the applicable issuance and download process."],
          ].map(([number, title, text]) => <article key={number}><span>{number}</span><DSCIcon size="sm" /><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="dsc-section dsc-applicant-grid">
        <article><h2>For Individuals</h2><p>Suitable for professionals, directors, authorized signatories, consultants and eligible individual applicants.</p><button className="btn btn-primary" onClick={() => openApplication("Individual DSC")}>Apply for Individual DSC</button></article>
        <article><h2>For Organizations</h2><p>Suitable for companies, LLPs, enterprises and other eligible organizations requiring DSCs for digital transactions and statutory filings.</p><button className="btn btn-primary" onClick={() => openApplication("Organization DSC")}>Apply for Organization DSC</button></article>
      </section>

      <section className="dsc-super-ra">
        <div className="dsc-super-ra-copy"><DSCIcon size="lg" /><div><h2>Primeserve Super RA Services</h2><p>Primeserve operates as a Super Registration Authority (Super RA), supporting Digital Signature Certificate applications, verification, issuance coordination, renewal and customer assistance through the authorized DSC ecosystem.</p><small>Primeserve supports the authorized issuance process and is not represented as a Certifying Authority.</small></div></div>
        <div className="dsc-capability-grid">{["Application Assistance", "KYC & Verification Support", "DSC Issuance Coordination", "Renewal & Support"].map((item) => <div key={item}><span>✓</span>{item}</div>)}</div>
      </section>

      <section className="dsc-section">
        <div className="dsc-section-heading"><DSCIcon size="md" /><div><h2>DSC Application &amp; Support</h2><p>Where an automated backend is not available, our team coordinates the request through the existing support workflow.</p></div></div>
        <div className="dsc-service-grid">{serviceActions.map(([title, selection]) => <button key={title} onClick={() => openApplication(selection)}><DSCIcon size="sm" /><span>{title}</span><b>→</b></button>)}</div>
      </section>

      <section className="dsc-enterprise-section">
        <div><DSCIcon size="md" /><h2>DSC Solutions for Enterprises</h2><p>Need Digital Signature Certificates for multiple employees, authorized signatories or business requirements? Primeserve provides coordinated DSC onboarding and support for enterprise requirements.</p><button className="btn btn-primary" onClick={() => openApplication("Enterprise / Bulk DSC")}>Talk to Our DSC Team</button></div>
        <div className="dsc-enterprise-list">{["Bulk DSC Requirements", "Organization DSC", "Employee / Signatory Onboarding", "Centralized Coordination", "Renewal Assistance", "Enterprise Support"].map((item) => <span key={item}>{item}</span>)}</div>
      </section>

      <section className="dsc-section dsc-sap-signing">
        <div><img className="dsc-sap-logo" src={sapLogo} alt="SAP" /><h2>Digital Signing Inside SAP</h2><p>Automate document signing workflows within SAP and reduce manual signing processes with Primeserve's SAP Digital Signature solutions.</p><div className="dsc-sap-tags">{["Invoices", "Purchase Orders", "Financial Documents", "Business Documents", "Compliance Documents"].map((item) => <span key={item}>{item}</span>)}</div><a className="btn btn-primary" href="/sap-services#digital-signature">Explore SAP Digital Signature</a></div>
      </section>

      <section className="dsc-section dsc-renewal">
        <DSCIcon size="lg" /><div><h2>Renew Your DSC</h2><p>Get professional assistance with the applicable renewal, verification and issuance-coordination process.</p></div><button className="btn btn-primary" onClick={() => openApplication("Renewal")}>Renew DSC</button>
      </section>

      <section className="dsc-section dsc-faq-section">
        <div className="dsc-centered-heading"><h2>Digital Signature Certificate FAQs</h2></div>
        <div className="dsc-faq-list">{faqs.map(([question, answer], index) => <article key={question} className={openFaq === index ? "is-open" : ""}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{question}</span><b>{openFaq === index ? "−" : "+"}</b></button>{openFaq === index && <p>{answer}</p>}</article>)}</div>
      </section>

      <section className="dsc-bottom-cta">
        <DSCIcon size="md" /><div><h2>Need Help Choosing the Right DSC?</h2><p>Our team can assist you in selecting the appropriate Digital Signature Certificate based on your individual, organizational or enterprise requirement.</p></div>
        <div><button className="btn btn-primary" onClick={() => openApplication("Class 3 DSC")}>Apply for DSC</button><button className="btn btn-ghost" onClick={() => openApplication("Other")}>Talk to Our DSC Team</button></div>
      </section>

      {modalOpen && (
        <div className="dsc-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !submitting && setModalOpen(false)}>
          <section className="dsc-modal" role="dialog" aria-modal="true" aria-labelledby="dsc-modal-title">
            <button className="dsc-modal-close" onClick={() => setModalOpen(false)} disabled={submitting} aria-label="Close DSC request form">×</button>
            <header><DSCIcon size="md" /><div><h2 id="dsc-modal-title">Digital Signature Certificate</h2><p>Primeserve Super RA Services</p></div></header>
            {success ? <div className="dsc-modal-success">{success}</div> : (
              <form onSubmit={submitRequest} noValidate>
                <label>Full Name *<input name="name" />{errors.name && <small>{errors.name}</small>}</label>
                <label>Mobile Number *<input name="mobile" inputMode="numeric" maxLength="10" onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 10); }} />{errors.mobile && <small>{errors.mobile}</small>}</label>
                <label>Email Address *<input type="email" name="email" />{errors.email && <small>{errors.email}</small>}</label>
                <label>Applicant Type *<select name="applicantType" defaultValue=""><option value="" disabled>Select</option><option>Individual</option><option>Organization</option></select>{errors.applicantType && <small>{errors.applicantType}</small>}</label>
                <label>DSC Requirement *<select name="requirement" value={requirement} onChange={(event) => setRequirement(event.target.value)}>{["Class 3 DSC", "Individual DSC", "Organization DSC", "DGFT DSC", "Signing DSC", "Signing + Encryption DSC", "Renewal", "Enterprise / Bulk DSC", "Other"].map((item) => <option key={item}>{item}</option>)}</select>{errors.requirement && <small>{errors.requirement}</small>}</label>
                <label>Validity<select name="validity" defaultValue="2 Years"><option>1 Year</option><option>2 Years</option><option>3 Years</option></select></label>
                <label className="dsc-modal-wide">Company Name<input name="company" /></label>
                <label className="dsc-modal-wide">Message<textarea name="message" rows="3" /></label>
                <button className="btn btn-primary dsc-modal-submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit DSC Request"}</button>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default DscPage;
