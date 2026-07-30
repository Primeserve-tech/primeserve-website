import { useEffect, useState } from "react";
import logo from "../assets/primeserve-logo-clean.png";
import OfferingServiceIcon from "./OfferingServiceIcon";
import { getCmsData } from "../cmsStore";
import { servicePortfolio } from "../data/servicePortfolio";

function OfferingIcon({ type }) {
  const mappedType = type === "compliance" ? "asp-gsp" : type;
  return <OfferingServiceIcon type={mappedType} />;
}

function Navbar({ activePage, onNavigate }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const openRequestedMenu = (event) => {
      const label = event.detail?.label;
      if (!["Our Offerings", "Company", "Tools"].includes(label)) return;
      setMobileOpen(window.innerWidth <= 960);
      setOpenMenu(label);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("primeserve:open-navigation-menu", openRequestedMenu);
    return () => window.removeEventListener("primeserve:open-navigation-menu", openRequestedMenu);
  }, []);
  const settings = getCmsData().settings || {};
  const links = [
    { label: "Home", page: "home", activeWhen: "home" },
    { label: "Our Offerings", page: "services", activeWhen: "services" },
    { label: "Company", page: "company", activeWhen: "company" },
    { label: "Tools", page: "hsn-sac", activeWhen: "tools" },
  ];

  const serviceDetails = servicePortfolio.map((service) => ({
    label: service.title,
    description: service.description,
    page: service.page,
    icon: service.icon,
  }));

  const companyDetails = [
    { label: "About Us", page: "company-about" },
    { label: "Our Clients", page: "company-clients" },
    { label: "Careers", page: "careers" },
  ];

  const toolDetails = [
    settings.hsnSacToolEnabled !== "No" && { label: "HSN/SAC Code Finder", page: "hsn-sac" },
    settings.gstinValidatorEnabled !== "No" && { label: "GSTIN Validator", page: "gstin-validator" },
    settings.gstBulkDataFetchEnabled !== "No" && { label: "GST Bulk Data Fetch", href: "https://upload.primeserve.in/" },
  ].filter(Boolean);

  const isToolsPage = ["hsn-sac", "gstin-validator"].includes(activePage);
  const isOfferingPage = ["apis", "products", "solutions", "asp-gsp", "sap-services", "dsc", "services", "vertical-managed-services", "vertical-workforce-solutions", "application-development-ams"].includes(activePage);

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
        aria-label="Primeserve home"
      >
        <img src={logo} alt="Primeserve Global Solution Pvt. Ltd." />
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
          ) : link.label === "Our Offerings" || link.label === "Company" || link.label === "Tools" ? (
            <div
              className={`nav-menu-item ${link.label === "Our Offerings" ? "offerings-menu" : ""}`}
              key={link.label}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                className={
                  link.label === "Our Offerings"
                      ? isOfferingPage
                        ? "active"
                        : ""
                    : link.label === "Company"
                    ? activePage.startsWith("company") || activePage === "careers" || activePage === "news"
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
                  setOpenMenu((currentMenu) => currentMenu === link.label ? null : link.label);
                }}
              >
                {link.label}
                <span className="nav-menu-caret" aria-hidden="true">▼</span>
              </button>
              <div
                className={`nav-dropdown ${link.label === "Our Offerings" ? "offerings-mega-menu" : ""} ${openMenu === link.label ? "menu-open" : ""}`}
                aria-label={`${link.label} menu`}
                onMouseEnter={() => setOpenMenu(link.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                {(link.label === "Our Offerings" ? serviceDetails : link.label === "Company" ? companyDetails : toolDetails).map((item) => (
                  <button
                    key={item.label}
                    className={link.label === "Our Offerings" ? "offering-mega-card" : ""}
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
                    {link.label === "Our Offerings" ? (
                      <>
                        <span className="offering-mega-icon"><OfferingIcon type={item.icon} /></span>
                        <span className="offering-mega-copy">
                          <strong>{item.label}</strong>
                          <small>{item.description}</small>
                        </span>
                        <span className="offering-mega-arrow" aria-hidden="true">→</span>
                      </>
                    ) : item.label}
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
