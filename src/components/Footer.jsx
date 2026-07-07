import { useEffect, useState } from "react";
import logo from "../assets/primeserve-logo-clean.png";
import PolicyModal from "./PolicyModal";
import { createId, getCmsData, saveCmsData } from "../cmsStore";

function FooterIcon({ type }) {
  const icons = {
    phone: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.6 10.8c1.5 3 3.9 5.4 6.8 6.8l2.3-2.3c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1v3.7c0 .6-.4 1-1 1C10.4 21.8 2.2 13.6 2.2 3.4c0-.6.4-1 1-1h3.7c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-1.6 2.5Z" />
      </svg>
    ),
    whatsapp: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.2a9.6 9.6 0 0 0-8.2 14.6L2.6 22l5.3-1.2A9.6 9.6 0 1 0 12 2.2Zm0 17.4c-1.4 0-2.8-.4-4-1.1l-.3-.2-3.1.7.7-3-.2-.3A7.6 7.6 0 1 1 12 19.6Zm4.2-5.7c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8.9-.1.2-.3.2-.5.1-.8-.4-1.6-.8-2.2-1.4-.5-.5-1-1.1-1.3-1.8-.1-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3s1 2.6 1.1 2.8c.1.2 1.9 3 4.7 4.1.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.4-.6 1.6-1.1.2-.6.2-1 .2-1.1 0-.1-.2-.2-.4-.3Z" />
      </svg>
    ),
    mail: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 5h17c.8 0 1.5.7 1.5 1.5v11c0 .8-.7 1.5-1.5 1.5h-17c-.8 0-1.5-.7-1.5-1.5v-11C2 5.7 2.7 5 3.5 5Zm8.5 8 7.3-5.8H4.7L12 13Zm0 2.4L4 9.1v7.7h16V9.1l-8 6.3Z" />
      </svg>
    ),
    globe: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-3a15.5 15.5 0 0 0-1.3-3 8.1 8.1 0 0 1 4.3 3ZM12 4.1c.6.9 1.2 2.2 1.6 3.9h-3.2c.4-1.7 1-3 1.6-3.9ZM4.3 14a7.6 7.6 0 0 1 0-4h3.4a16.3 16.3 0 0 0 0 4H4.3Zm.8 2h3a15.5 15.5 0 0 0 1.3 3 8.1 8.1 0 0 1-4.3-3Zm3-8h-3a8.1 8.1 0 0 1 4.3-3 15.5 15.5 0 0 0-1.3 3Zm3.9 11.9c-.6-.9-1.2-2.2-1.6-3.9h3.2c-.4 1.7-1 3-1.6 3.9Zm2-5.9h-4a13.7 13.7 0 0 1 0-4h4a13.7 13.7 0 0 1 0 4Zm.6 5a15.5 15.5 0 0 0 1.3-3h3a8.1 8.1 0 0 1-4.3 3Zm1.7-5a16.3 16.3 0 0 0 0-4h3.4a7.6 7.6 0 0 1 0 4h-3.4Z" />
      </svg>
    ),
    pin: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.2a7.3 7.3 0 0 0-7.3 7.3c0 5.5 7.3 12.3 7.3 12.3s7.3-6.8 7.3-12.3A7.3 7.3 0 0 0 12 2.2Zm0 10.1a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z" />
      </svg>
    ),
  };

  return <span className={`footer-icon footer-icon-${type}`}>{icons[type]}</span>;
}

function Footer() {
  const [activePolicy, setActivePolicy] = useState(null);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const cmsData = getCmsData();
  const supportTeam = (cmsData.supportTeam || [])
    .filter((member) => member.status === "Active")
    .slice(0, 2);

  useEffect(() => {
    if (!activePolicy) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActivePolicy(null);
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePolicy]);

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("Newsletter Email");
    if (!email) return;
    const data = getCmsData();
    const existing = (data.newsletterSubscribers || []).find(
      (item) => item.email.toLowerCase() === String(email).toLowerCase()
    );
    const subscribers = existing
      ? (data.newsletterSubscribers || []).map((item) =>
          item.id === existing.id ? { ...item, status: "Active" } : item
        )
      : [
          {
            id: createId("subscriber"),
            email,
            status: "Active",
            date: new Date().toISOString().slice(0, 10),
          },
          ...(data.newsletterSubscribers || []),
        ];
    saveCmsData({ ...data, newsletterSubscribers: subscribers });
    setNewsletterMessage("Subscribed successfully.");
    event.currentTarget.reset();
  };

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-grid">
          <section className="footer-brand-block" aria-label="PrimeServe contact">
            <img className="footer-logo" src={logo} alt="PrimeServe" />
            <p className="footer-about">
              PrimeServe Global Solution Pvt. Ltd. delivers powerful API
              solutions that help businesses automate workflows, ensure
              compliance, and drive growth with secure, reliable, and real-time
              data.
            </p>

            <ul className="footer-contact-list">
              <li>
                <FooterIcon type="phone" />
                <a href="tel:+918368414690">+91 836 841 4690</a>
              </li>
              <li>
                <FooterIcon type="whatsapp" />
                <a
                  href="https://api.whatsapp.com/send/?phone=918368414690"
                  target="_blank"
                  rel="noreferrer"
                >
                  +91 836 841 4690
                </a>
              </li>
              <li>
                <FooterIcon type="mail" />
                <a href="mailto:sales@primeserve.in">sales@primeserve.in</a>
              </li>
              <li>
                <FooterIcon type="globe" />
                <a href="https://www.primeserve.in" target="_blank" rel="noreferrer">
                  www.primeserve.in
                </a>
              </li>
              <li>
                <FooterIcon type="pin" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Greater%20Noida%2C%20Gautam%20Buddha%20Nagar%2C%20Uttar%20Pradesh%20201306%2C%20India"
                  target="_blank"
                  rel="noreferrer"
                >
                  Greater Noida,
                  <br />
                  Gautam Buddha Nagar,
                  <br />
                  Uttar Pradesh 201306, India
                </a>
              </li>
            </ul>

            <div className="footer-social-block">
              <h3>Follow Us</h3>
              <div className="footer-socials" aria-label="Social links">
                <a
                  className="social-link linkedin"
                  href="https://www.linkedin.com/company/prime-serve/posts/?feedView=all"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noreferrer"
                >
                  in
                </a>
                <a
                  className="social-link instagram"
                  href="https://www.instagram.com/primeserve45"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noreferrer"
                >
                  ig
                </a>
                <a
                  className="social-link whatsapp"
                  href="https://api.whatsapp.com/send/?phone=918368414690"
                  aria-label="WhatsApp"
                  target="_blank"
                  rel="noreferrer"
                >
                  wa
                </a>
              </div>
            </div>

            <div className="footer-certifications" aria-label="Certifications">
              <span className="footer-badge">ISO<br />27001:2013</span>
              <span className="footer-badge">SOC 2<br />TYPE II</span>
            </div>
            <a className="footer-admin-link footer-admin-link-left" href="/admin">
              Admin Login Panel
            </a>
          </section>

          <section className="footer-newsletter-column" aria-label="Newsletter signup">
            <div className="footer-newsletter-heading">
              <span className="footer-newsletter-main-icon">!</span>
              <div>
                <h3>PrimeServe <span>Updates Hub</span></h3>
                <p>Stay informed. Stay ahead.</p>
              </div>
            </div>
            <div className="footer-newsletter-rule" />
            <div className="footer-update-list">
              <article>
                <span className="footer-update-icon">R</span>
                <div>
                  <h4>API Launches</h4>
                  <p>Be the first to know about new API releases and powerful capabilities.</p>
                </div>
              </article>
              <article>
                <span className="footer-update-icon">N</span>
                <div>
                  <h4>Product & Compliance News</h4>
                  <p>Get updates on product enhancements, compliance changes and regulatory news.</p>
                </div>
              </article>
              <article>
                <span className="footer-update-icon">A</span>
                <div>
                  <h4>Platform Alerts</h4>
                  <p>Important system alerts, maintenance updates and service notifications.</p>
                </div>
              </article>
              <article>
                <span className="footer-update-icon">G</span>
                <div>
                  <h4>Special Offers & Insights</h4>
                  <p>Receive offers, success stories and industry insights straight to your inbox.</p>
                </div>
              </article>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
            >
              <input
                name="Newsletter Email"
                type="email"
                placeholder="Email for newsletter"
                required
              />
              <button type="submit">Subscribe</button>
            </form>
            {newsletterMessage && <p className="footer-subscribe-message">{newsletterMessage}</p>}
            <p className="footer-privacy-note">We respect your privacy. No spam, ever.</p>
          </section>

          <section className="footer-contact-form-card" aria-label="Contact form">
            <h3>Need Help?</h3>
            <p>
              PrimeServe Global Solution Pvt. Ltd. team will get back to you.
            </p>
            {supportTeam.length > 0 && (
              <div className="footer-support-team">
                {supportTeam.map((member) => (
                  <article key={member.id}>
                    {member.image ? <img src={member.image} alt={member.name} /> : <span>{member.name?.slice(0, 1) || "P"}</span>}
                    <div>
                      <h4>{member.name}</h4>
                      <p>{member.designation}</p>
                      <a href={`mailto:${member.email}`}>{member.email}</a>
                      <a href={`tel:${member.contact}`}>{member.contact}</a>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <form
              action="mailto:info@primeserve.in"
              method="post"
              encType="text/plain"
            >
              <input name="Name" type="text" placeholder="Your name" required />
              <input name="Company" type="text" placeholder="Company name" required />
              <input name="Email" type="email" placeholder="Email address" required />
              <input name="Phone" type="tel" placeholder="Phone number" />
              <textarea name="Message" placeholder="How can we help?" rows="4" required />
              <button type="submit">Submit Request</button>
            </form>
          </section>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2026 PrimeServe Global Solution Pvt. Ltd. All rights reserved.
          <span>CIN U62011UW2026PTC253187</span>
        </p>
        <div className="footer-policy-links">
          <button type="button" onClick={() => setActivePolicy("privacy")}>
            Privacy Policy
          </button>
          <button type="button" onClick={() => setActivePolicy("terms")}>
            Terms of Service
          </button>
          <button type="button" onClick={() => setActivePolicy("refund")}>
            Refund Policy
          </button>
          <button type="button" onClick={() => setActivePolicy("dpdp")}>
            DPDP Act
          </button>
          <button type="button" onClick={() => setActivePolicy("disclaimer")}>
            Disclaimer
          </button>
        </div>
      </div>
      <PolicyModal policy={activePolicy} onClose={() => setActivePolicy(null)} />
    </footer>
  );
}

export default Footer;
