import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import LatestCmsSections from "./components/LatestCmsSections";
import Testimonials from "./components/Testimonials";
import ApiPage from "./components/ApiPage";
import ProductPage from "./components/ProductPage";
import SolutionPage from "./components/SolutionPage";
import CompanyPage from "./components/CompanyPage";
import AboutUsPage from "./components/AboutUsPage";
import WhyPrimeServePage from "./components/WhyPrimeServePage";
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
import Footer from "./components/Footer";
import "./App.css";

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
    if (path.includes("resources")) return "resources";
    if (path.includes("blog")) return "blog";
    if (path.includes("news")) return "news";
    if (path.includes("updates")) return "updates";
    if (path.includes("solutions")) return "solutions";
    if (path.includes("products")) return "products";
    if (path.includes("apis")) return "apis";
    return "home";
  };

  const [page, setPage] = useState(getInitialPage);

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

  return (
    <>
      {page !== "admin" && <Navbar activePage={page} onNavigate={navigate} />}
      <main>
        {page === "admin" ? (
          <AdminDashboard />
        ) : page === "apis" ? (
          <ApiPage />
        ) : page === "products" ? (
          <ProductPage />
        ) : page === "solutions" ? (
          <SolutionPage />
        ) : page === "company" ? (
          <CompanyPage />
        ) : page === "company-about" ? (
          <AboutUsPage />
        ) : page === "company-why" ? (
          <WhyPrimeServePage />
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
            <LatestCmsSections />
            <Testimonials />
          </>
        )}
      </main>
      {page !== "admin" && <Footer />}
    </>
  );
}

export default App;
