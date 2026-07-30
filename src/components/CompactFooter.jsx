import { useEffect, useState } from "react";
import PolicyModal from "./PolicyModal";
import { createId, getCmsData, saveCmsData } from "../cmsStore";
import { notifyAdminOfSubmission } from "../adminNotifications";
import { serviceOptions, servicePortfolio } from "../data/servicePortfolio";

const offerings = servicePortfolio.map(({ title, href }) => [title, href]);

function isValidIndianMobile(value) {
  const digits = String(value || "").trim();
  if (!/^[6-9]\d{9}$/.test(digits)) return false;
  if (/^(\d)\1{9}$/.test(digits)) return false;
  const numbers = [...digits].map(Number);
  const ascending = numbers.every((number, index) => index === 0 || number === (numbers[index - 1] + 1) % 10);
  const descending = numbers.every((number, index) => index === 0 || number === (numbers[index - 1] + 9) % 10);
  return !ascending && !descending;
}

function MiniIcon({ type }) {
  const paths = {
    phone: "M6.5 3h3l1.4 4-2 1.5a14 14 0 0 0 6.6 6.6l1.5-2 4 1.4v3A2.5 2.5 0 0 1 18.5 20C10.5 19.4 4.6 13.5 4 5.5A2.5 2.5 0 0 1 6.5 3Z",
    mail: "M3 6h18v12H3V6Zm1 1 8 6 8-6",
    globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 0c3 3 3 17 0 20m0-20c-3 3-3 17 0 20M2 12h20",
    pin: "M12 22s7-6.3 7-13a7 7 0 1 0-14 0c0 6.7 7 13 7 13Zm0-10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    whatsapp: "M20 11.5a8 8 0 0 1-11.8 7L3 20l1.5-5.1A8 8 0 1 1 20 11.5Z",
  };
  return <svg className="compact-footer-icon" viewBox="0 0 24 24" aria-hidden="true"><path d={paths[type]} /></svg>;
}

function SocialIcon({ type }) {
  if (type === "linkedin") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.2H3.2V21h3.3V8.2ZM4.9 3A1.9 1.9 0 1 0 5 6.8 1.9 1.9 0 0 0 4.9 3ZM21 13.7c0-3.8-2-5.6-4.7-5.6-2.2 0-3.2 1.2-3.7 2.1v-2H9.3V21h3.3v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2.1 1.9 2.1 3.4V21H21v-7.3Z" /></svg>;
  }
  if (type === "instagram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm0 2A3.2 3.2 0 0 0 4 7.2v9.6A3.2 3.2 0 0 0 7.2 20h9.6a3.2 3.2 0 0 0 3.2-3.2V7.2A3.2 3.2 0 0 0 16.8 4H7.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.3-3.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.2 1.6 6L.2 24l6.4-1.7a11.8 11.8 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.3-6.1-3.6-8.4Zm-8.3 18.2a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.7 9.7 0 1 1 8.4 4.7Zm5.4-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.7.1-.2 0-.4 0-.6l-.9-2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.3 3.4 1.5 3.6c.2.2 2.5 3.8 6 5.3.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.4-.2-.8-.3Z" /></svg>;
}

function CompactFooter() {
  const [activePolicy, setActivePolicy] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [preselectedService, setPreselectedService] = useState("");

  useEffect(() => {
    if (!contactOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) setContactOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [contactOpen, submitting]);

  useEffect(() => {
    const handleOpenContact = (event) => {
      setErrors({});
      setSuccess("");
      setPreselectedService(event.detail?.service || "");
      setContactOpen(true);
    };
    window.addEventListener("primeserve:open-contact", handleOpenContact);
    return () => window.removeEventListener("primeserve:open-contact", handleOpenContact);
  }, []);

  const openContact = (event) => {
    event?.preventDefault();
    setErrors({});
    setSuccess("");
    setContactOpen(true);
  };

  const openHeaderMenu = (label) => {
    window.dispatchEvent(new CustomEvent("primeserve:open-navigation-menu", { detail: { label } }));
  };

  const submitContact = (event) => {
    event.preventDefault();
    if (submitting) return;
    const formElement = event.currentTarget;
    const values = Object.fromEntries(new FormData(formElement));
    const nextErrors = {};
    if (!String(values.name || "").trim()) nextErrors.name = "Full name is required.";
    const email = String(values.email || "").trim();
    const mobile = String(values.mobile || "").trim();
    if (!email && !mobile) nextErrors.contact = "Enter either an email address or phone number.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    if (mobile && !isValidIndianMobile(mobile)) {
      nextErrors.mobile = "Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9. Repeated or sequential numbers are not allowed.";
    }
    if (!String(values.message || "").trim()) nextErrors.message = "Message is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const data = getCmsData();
    const signature = `${String(values.email || values.mobile).toLowerCase()}|${String(values.message).trim().toLowerCase()}`;
    const duplicate = (data.enquiries || []).some((item) =>
      `${String(item.email || item.mobile).toLowerCase()}|${String(item.message).trim().toLowerCase()}` === signature
    );
    if (duplicate) {
      setErrors({ form: "This enquiry has already been submitted." });
      return;
    }

    setSubmitting(true);
    const now = new Date();
    const enquiry = {
      id: createId("enquiry"),
      name: String(values.name).trim(),
      company: "",
      email,
      mobile,
      service: values.service || "General Enquiry",
      message: String(values.message).trim(),
      date: now.toISOString().slice(0, 10),
      dateTime: now.toISOString(),
      status: "New",
      type: "Contact Enquiry",
    };
    saveCmsData({ ...data, enquiries: [enquiry, ...(data.enquiries || [])] });
    notifyAdminOfSubmission("contact enquiry", enquiry);
    setSubmitting(false);
    setSuccess("Thank you for contacting Primeserve. We have received your enquiry, and our team will review it and get in touch with you shortly.");
    formElement.reset();
  };

  return (
    <footer className="site-footer compact-footer">
      <div className="compact-footer-main compact-footer-reference">
        <section className="compact-footer-column compact-footer-intro">
          <h3>About Us</h3>
          <p>
            Primeserve helps businesses simplify technology, compliance and operations through{" "}
            <a href="/apis">250+ APIs</a>, <a href="/solutions/asp-gsp">ASP-GSP</a>,{" "}
            <a href="/sap-services">SAP</a>,{" "}
            <a href="/digital-signature-certificate">Digital Signature Certificate</a>,{" "}
            <a href="/business/managed-services">Managed Tax Services</a>,{" "}
            <a href="/application-development-ams">Application Development &amp; AMS</a> and{" "}
            <a href="/services/workforce-solutions">Workforce Staffing &amp; Deployment</a>.
          </p>
          <div className="compact-follow">
            <div>
              <a className="linkedin" href="https://www.linkedin.com/company/prime-serve/posts/?feedView=all" aria-label="LinkedIn"><SocialIcon type="linkedin" /></a>
              <a className="instagram" href="https://www.instagram.com/primeserve45" aria-label="Instagram"><SocialIcon type="instagram" /></a>
              <a className="whatsapp" href="https://api.whatsapp.com/send/?phone=918368414690" aria-label="WhatsApp"><SocialIcon type="whatsapp" /></a>
            </div>
          </div>
          <div className="compact-certifications"><span>ISO CERTIFIED<br />27001:2013</span><span>SOC 2<br />TYPE II</span></div>
        </section>

        <section className="compact-footer-column">
          <h3>Quick Links</h3>
          <nav className="compact-footer-links compact-footer-quick-links">
            <a href="/">Home</a>
            <button type="button" onClick={() => openHeaderMenu("Our Offerings")}>Our Offerings</button>
            <button type="button" onClick={() => openHeaderMenu("Company")}>Company</button>
            <button type="button" onClick={() => openHeaderMenu("Tools")}>Tools</button>
          </nav>
        </section>

        <section className="compact-footer-column">
          <h3>Our Offerings</h3>
          <nav className="compact-footer-links">{offerings.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</nav>
        </section>

        <section className="compact-footer-column">
          <h3>Company Address</h3>
          <ul className="compact-contact-list">
            <li><MiniIcon type="phone" /><a href="tel:+918368414690">+91 836 841 4690</a></li>
            <li><MiniIcon type="whatsapp" /><a href="https://api.whatsapp.com/send/?phone=918368414690">+91 836 841 4690</a></li>
            <li><MiniIcon type="mail" /><a href="mailto:info@primeserve.in">info@primeserve.in</a></li>
            <li><MiniIcon type="pin" /><span>Greater Noida,<br />Gautam Buddha Nagar,<br />Uttar Pradesh 201306, India</span></li>
          </ul>
        </section>
      </div>

      <div className="compact-footer-bottom">
        <p>© 2026 Primeserve Global Solution Pvt. Ltd. All rights reserved. <small>CIN U62011UW2026PTC253187</small></p>
        <div>
          <button onClick={() => setActivePolicy("privacy")}>Privacy Policy</button>
          <button onClick={() => setActivePolicy("terms")}>Terms of Service</button>
          <button onClick={() => setActivePolicy("refund")}>Refund Policy</button>
          <button onClick={() => setActivePolicy("dpdp")}>DPDP Act</button>
          <button onClick={() => setActivePolicy("disclaimer")}>Disclaimer</button>
        </div>
      </div>

      <a className="footer-admin-tab" href="/admin" target="_blank" rel="noreferrer" aria-label="Open Admin Login in a new tab">
        <span className="footer-admin-arrow" aria-hidden="true">›</span>
        <span className="footer-admin-label">Admin Login</span>
      </a>
      <button className="footer-enquire-tab" type="button" onClick={openContact}>Enquire Now</button>

      {contactOpen && (
        <div className="contact-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !submitting && setContactOpen(false)}>
          <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
            <button className="contact-modal-close" type="button" disabled={submitting} onClick={() => setContactOpen(false)} aria-label="Close contact form">×</button>
            <h2 id="contact-modal-title">Enquire Now</h2>
            <p>Share your details and our Primeserve team will get in touch with you shortly.</p>
            {success ? <div className="contact-modal-success">{success}</div> : (
              <form onSubmit={submitContact} noValidate>
                <label className="contact-modal-wide">Full Name<input name="name" placeholder="Your name" />{errors.name && <small>{errors.name}</small>}</label>
                <label className="contact-modal-wide">Phone Number<input name="mobile" inputMode="numeric" maxLength="10" pattern="[6-9][0-9]{9}" placeholder="9876543210" onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 10); }} />{errors.mobile && <small>{errors.mobile}</small>}</label>
                <label className="contact-modal-wide">Email<input name="email" type="email" placeholder="you@example.com" />{errors.email && <small>{errors.email}</small>}{errors.contact && <small>{errors.contact}</small>}</label>
                <label className="contact-modal-wide">What are you interested in?<select key={preselectedService || "empty"} name="service" defaultValue={preselectedService}><option value="" disabled>Please Select</option>{serviceOptions.map((item) => <option key={item}>{item}</option>)}</select>{errors.service && <small>{errors.service}</small>}</label>
                <label className="contact-modal-wide">Message<textarea name="message" rows="4" />{errors.message && <small>{errors.message}</small>}</label>
                {errors.form && <div className="contact-modal-form-error">{errors.form}</div>}
                <button className="contact-modal-submit" type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Enquiry"}</button>
              </form>
            )}
          </section>
        </div>
      )}
      <PolicyModal policy={activePolicy} onClose={() => setActivePolicy(null)} />
    </footer>
  );
}

export default CompactFooter;
