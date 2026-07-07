import { useState } from "react";
import logo from "../assets/primeserve-logo-clean.png";

function Navbar({ activePage, onNavigate }) {
  const [openMenu, setOpenMenu] = useState(null);

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
    { label: "HSN/SAC Code Finder", page: "hsn-sac" },
    { label: "GSTIN Validator", page: "gstin-validator" },
  ];

  const isKnowledgePage = ["blog", "faqs", "case-studies", "webinars", "product-announcements", "api-release-notes", "resources"].includes(activePage);
  const isToolsPage = ["hsn-sac", "gstin-validator"].includes(activePage);

  return (
    <header className="site-header">
      <button
        className="brand"
        type="button"
        onClick={() => onNavigate("home")}
        aria-label="PrimeServe home"
      >
        <img src={logo} alt="PrimeServe Global Solution Pvt. Ltd." />
      </button>

      <nav className="nav-links" aria-label="Main navigation">
        {links.map((link) => (
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
                onMouseEnter={() => setOpenMenu(link.label)}
                onClick={() => {
                  setOpenMenu(null);
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
              onClick={() => onNavigate(link.page)}
            >
              {link.label}
            </button>
          )
        ))}
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
