import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import LatestUpdatesTicker from "./components/LatestUpdatesTicker";
import Testimonials from "./components/Testimonials";
import ApiPage from "./components/ApiPage";
import ProductPage from "./components/ProductPage";
import SolutionPage from "./components/SolutionPage";
import AspGspPage from "./components/AspGspPage";
import SapServicesPage from "./components/SapServicesPage";
import DscPage from "./components/DscPage";
import ServicesPage from "./components/ServicesPage";
import { BusinessOverviewPage, BusinessVerticalPage } from "./components/BusinessVerticalsPage";
import ManagedTaxServicesPage from "./components/ManagedTaxServicesPage";
import ApplicationDevelopmentPage from "./components/ApplicationDevelopmentPage";
import OfferingsPage from "./components/OfferingsPage";
import CompanyPage from "./components/CompanyPage";
import AboutUsPage from "./components/AboutUsPage";
import WhyPrimeservePage from "./components/WhyPrimeServePage";
import ClientsPage from "./components/ClientsPage";
import AdminDashboard from "./components/AdminDashboard";
import {
  ApiReleaseNotesPage,
  ApiUpdatesPage,
  BlogPage,
  CareersPage,
  CaseStudiesPage,
  FaqPage,
  GstinSearchPage,
  GstinValidatorPage,
  HsnSacFinderPage,
  NewsPage,
  ProductAnnouncementsPage,
  ResourcesPage,
  WebinarsPage,
} from "./components/CmsPublicPages";
import Footer from "./components/CompactFooter";
import "./App.css";
import "./home-hero-final.css";
import "./final-site-refinements.css";
import { loadCmsData } from "./cmsStore";

function App() {
  const getInitialPage = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("admin")) return "admin";
    if (path.includes("company/about-us") || path.includes("company/about%20us")) {
      return "company-about";
    }
    if (path.includes("company/why-primeserve")) return "company-why";
    if (path.includes("company/our-clients")) return "company-clients";
    if (path.includes("company")) return "company";
    if (path.includes("careers")) return "careers";
    if (path === "/gstin-search" || path.includes("/gstin-search/")) return "gstin-search";
    if (path.includes("tools/gstin-validator")) return "gstin-validator";
    if (path.includes("tools/hsn-sac-code-finder")) return "hsn-sac";
    if (path.includes("faqs")) return "faqs";
    if (path.includes("webinars")) return "webinars";
    if (path.includes("case-studies")) return "case-studies";
    if (path.includes("product-announcements")) return "product-announcements";
    if (path.includes("api-release-notes")) return "api-release-notes";
    if (path.includes("solutions/asp-gsp")) return "asp-gsp";
    if (path.includes("sap-services")) return "sap-services";
    if (path.includes("digital-signature-certificate")) return "dsc";
    if (path.includes("application-development-ams")) return "application-development-ams";
    if (path.includes("resources")) return "resources";
    if (path.includes("blog")) return "blog";
    if (path.includes("news")) return "news";
    if (path.includes("updates")) return "updates";
    if (path === "/business" || path === "/business/") return "business";
    if (path.includes("business/technology-apis")) return "vertical-technology-apis";
    if (path.includes("business/tax-compliance")) return "vertical-tax-compliance";
    if (path.includes("business/enterprise-solutions")) return "vertical-enterprise-solutions";
    if (path.includes("business/workforce-solutions")) return "vertical-workforce-solutions";
    if (path.includes("business/managed-services")) return "vertical-managed-services";
    if (path.includes("services/technology-apis")) return "vertical-technology-apis";
    if (path.includes("services/tax-compliance")) return "vertical-tax-compliance";
    if (path.includes("services/enterprise-solutions")) return "vertical-enterprise-solutions";
    if (path.includes("services/workforce-solutions")) return "vertical-workforce-solutions";
    if (path.includes("services/managed-services")) return "vertical-managed-services";
    if (path.includes("solutions")) return "solutions";
    if (path.includes("services")) return "services";
    if (path.includes("products")) return "products";
    if (path.includes("apis")) return "apis";
    return "home";
  };

  const [page, setPage] = useState(getInitialPage);
  const [cmsReady, setCmsReady] = useState(false);

  useEffect(() => {
    loadCmsData()
      .catch((error) => console.error(error))
      .finally(() => setCmsReady(true));
  }, []);

  useEffect(() => {
    const handlePopState = () => setPage(getInitialPage());

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPage) => {
    setPage(nextPage);
    const pagePaths = {
      home: "/",
      apis: "/apis",
      products: "/products",
      solutions: "/solutions",
      "asp-gsp": "/solutions/asp-gsp",
      "sap-services": "/sap-services",
      dsc: "/digital-signature-certificate",
      services: "/services",
      business: "/business",
      "vertical-technology-apis": "/business/technology-apis",
      "vertical-tax-compliance": "/business/tax-compliance",
      "vertical-enterprise-solutions": "/business/enterprise-solutions",
      "vertical-workforce-solutions": "/business/workforce-solutions",
      "vertical-managed-services": "/business/managed-services",
      "application-development-ams": "/application-development-ams",
      company: "/company",
      "company-about": "/company/about-us",
      "company-why": "/company/why-primeserve",
      "company-clients": "/company/our-clients",
      careers: "/careers",
      faqs: "/faqs",
      webinars: "/webinars",
      "case-studies": "/case-studies",
      "product-announcements": "/product-announcements",
      "api-release-notes": "/api-release-notes",
      resources: "/resources",
      "gstin-search": "/gstin-search",
      "hsn-sac": "/tools/hsn-sac-code-finder",
      "gstin-validator": "/tools/gstin-validator",
      blog: "/blog",
      news: "/news",
      updates: "/updates",
      admin: "/admin",
    };
    const path = pagePaths[nextPage] || "/";
    window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Public pages can render immediately from the built-in CMS cache. The
  // server response refreshes the same tree as soon as it arrives, avoiding
  // a blocking loading screen on every visit. Admin still waits for the
  // authoritative shared CMS data before it becomes interactive.
  if (!cmsReady && page === "admin") {
    return null;
  }

  return (
    <>
      {page !== "admin" && (
        <div className="public-sticky-header">
          <LatestUpdatesTicker />
          <Navbar activePage={page} onNavigate={navigate} />
        </div>
      )}
      <main>
        {page === "admin" ? (
          <AdminDashboard />
        ) : page === "business" ? (
          <BusinessOverviewPage />
        ) : page === "vertical-technology-apis" ? (
          <BusinessVerticalPage verticalId="technology-apis" />
        ) : page === "vertical-tax-compliance" ? (
          <BusinessVerticalPage verticalId="tax-compliance" />
        ) : page === "vertical-enterprise-solutions" ? (
          <BusinessVerticalPage verticalId="enterprise-solutions" />
        ) : page === "vertical-managed-services" ? (
          <ManagedTaxServicesPage />
        ) : page === "application-development-ams" ? (
          <ApplicationDevelopmentPage />
        ) : page === "apis" ? (
          <ApiPage />
        ) : page === "products" ? (
          <ProductPage />
        ) : page === "solutions" ? (
          <SolutionPage />
        ) : page === "asp-gsp" ? (
          <AspGspPage />
        ) : page === "sap-services" ? (
          <SapServicesPage />
        ) : page === "dsc" ? (
          <DscPage />
        ) : page === "services" ? (
          <OfferingsPage />
        ) : page === "vertical-workforce-solutions" ? (
          <ServicesPage />
        ) : page === "company" ? (
          <CompanyPage />
        ) : page === "company-about" ? (
          <AboutUsPage />
        ) : page === "company-why" ? (
          <WhyPrimeservePage />
        ) : page === "company-clients" ? (
          <ClientsPage />
        ) : page === "careers" ? (
          <CareersPage />
        ) : page === "faqs" ? (
          <FaqPage />
        ) : page === "webinars" ? (
          <WebinarsPage />
        ) : page === "case-studies" ? (
          <CaseStudiesPage />
        ) : page === "product-announcements" ? (
          <ProductAnnouncementsPage />
        ) : page === "api-release-notes" ? (
          <ApiReleaseNotesPage />
        ) : page === "resources" ? (
          <ResourcesPage />
        ) : page === "gstin-search" ? (
          <GstinSearchPage />
        ) : page === "hsn-sac" ? (
          <HsnSacFinderPage />
        ) : page === "gstin-validator" ? (
          <GstinValidatorPage />
        ) : page === "blog" ? (
          <BlogPage />
        ) : page === "news" ? (
          <NewsPage />
        ) : page === "updates" ? (
          <ApiUpdatesPage />
        ) : (
          <>
            <Hero />
            <Stats />
            <Features />
            <Testimonials />
          </>
        )}
      </main>
      {page !== "admin" && <Footer />}
    </>
  );
}

export default App;
