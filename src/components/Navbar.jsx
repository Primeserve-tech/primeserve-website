import { useState } from "react";
import logo from "../assets/primeserve-logo-clean.png";
import { getCmsData } from "../cmsStore";

function Navbar({ activePage, onNavigate }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const settings = getCmsData().settings || {};

  const links = [
    { label: "Home", page: "home", activeWhen: "home" },
    { label: "APIs", page: "apis", activeWhen: "apis" },
    { label: "Products", page: "products", activeWhen: "products" },
    { label: "Solutions", page: "solutions", activeWhen: "solutions" },
    { label: "Company", page: "company", activeWhen: "company" },
    { label: "Knowledge Center", page: "blog", activeWhen: "knowledge" },
    { label: "Tools", page: "hsn-sac", activeWhen: "tools" },
  ];

  const companyDetails = [
    { label: "About Us", page: "company-about" },
    { label: "Why PrimeServe", page: "company-why" },
    { label: "Our Clients", page: "company-clients" },
    { label: "Careers", page: "careers" },
    { label: "Partners", page: "company" },
    { label: "News & Updates", page: "news" },
    { label: "Contact Us", page: "company" },
  ];

  const knowledgeDetails = [
    { label: "Blogs", page: "blog" },
    { label: "FAQs", page: "faqs" },
    { label: "Case Studies", page: "case-studies" },
    { label: "Webinars", page: "webinars" },
    { label: "Product Announcements", page: "product-announcements" },
    { label: "API Release Notes", page: "api-release-notes" },
    { label: "Resources", page: "resources" },
  ];

  const toolDetails = [
    settings.hsnSacToolEnabled !== "No" && { label: "HSN/SAC Code Finder", page: "hsn-sac" },
    settings.gstinValidatorEnabled !== "No" && { label: "GSTIN Validator", page: "gstin-validator" },
    settings.gstBulkDataFetchEnabled !== "No" && { label: "GST Bulk Data Fetch", href: "https://upload.primeserve.in/" },
  ].filter(Boolean);

  const isKnowledgePage = ["blog", "faqs", "case-studies", "webinars", "product-announcements", "api-release-notes", "resources"].includes(activePage);
  const isToolsPage = ["hsn-sac", "gstin-validator"].includes(activePage);

  return (
    <header className="site-header">
      <button
        className="brand"
        type="button"
        onClick={() => {
          setMobileOpen(false);
          setOpenMenu(null);
          onNavigate("home");
        }}
        aria-label="PrimeServe home"
      >
        <img src={logo} alt="PrimeServe Global Solution Pvt. Ltd." />
      </button>

      <button
        className={`mobile-nav-toggle ${mobileOpen ? "is-open" : ""}`}
        type="button"
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileOpen}
        aria-controls="primary-navigation"
        onClick={() => {
          setMobileOpen((isOpen) => !isOpen);
          setOpenMenu(null);
        }}
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        className={`nav-links ${mobileOpen ? "mobile-open" : ""}`}
        id="primary-navigation"
        aria-label="Main navigation"
      >
        {links.filter((link) => link.label !== "Tools" || toolDetails.length > 0).map((link) => (
          link.href ? (
            <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ) : link.label === "Company" || link.label === "Knowledge Center" || link.label === "Tools" ? (
            <div
              className="nav-menu-item"
              key={link.label}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                className={
                  link.label === "Company"
                    ? activePage.startsWith("company") || activePage === "careers" || activePage === "news"
                      ? "active"
                      : ""
                    : link.label === "Knowledge Center"
                      ? isKnowledgePage
                        ? "active"
                        : ""
                      : isToolsPage
                        ? "active"
                        : ""
                }
                type="button"
                aria-haspopup="menu"
                aria-expanded={openMenu === link.label}
                onMouseEnter={() => setOpenMenu(link.label)}
                onClick={() => {
                  if (
                    link.label === "Tools" ||
                    link.label === "Knowledge Center" ||
                    (link.label === "Company" && window.innerWidth <= 760)
                  ) {
                    setOpenMenu((currentMenu) => currentMenu === link.label ? null : link.label);
                    return;
                  }
                  setOpenMenu(null);
                  setMobileOpen(false);
                  onNavigate(link.page);
                }}
              >
                {link.label}
              </button>
              <div
                className={`nav-dropdown ${openMenu === link.label ? "menu-open" : ""}`}
                aria-label={`${link.label} menu`}
                onMouseEnter={() => setOpenMenu(link.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                {(link.label === "Company" ? companyDetails : link.label === "Knowledge Center" ? knowledgeDetails : toolDetails).map((item) => (
                  <button
                    key={item.label}
                    type="button"
                      onClick={(event) => {
                        event.currentTarget.blur();
                        setOpenMenu(null);
                        setMobileOpen(false);
                        if (item.href) {
                          window.open(item.href, "_blank", "noopener,noreferrer");
                          return;
                        }
                        onNavigate(item.page);
                      }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              className={activePage === link.activeWhen ? "active" : ""}
              key={link.label}
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setOpenMenu(null);
                onNavigate(link.page);
              }}
            >
              {link.label}
            </button>
          )
        ))}
        <a
          className="mobile-login-link"
          href="https://app.primeserve.in/login"
          target="_blank"
          rel="noreferrer"
        >
          Login
        </a>
      </nav>

      <div className="nav-actions">
        <a
          className="btn btn-ghost"
          href="https://app.primeserve.in/login"
          target="_blank"
          rel="noreferrer"
        >
          Login
        </a>
      </div>
    </header>
  );
}

export default Navbar;
