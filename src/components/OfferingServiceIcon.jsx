import sapLogo from "../assets/sap-logo.svg";
import DSCIcon from "./DSCIcon";

function LineIcon({ type }) {
  if (type === "api") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M19 45h-3a10 10 0 0 1-1-20 16 16 0 0 1 30-4 11 11 0 0 1 2 22h-4" />
        <path d="M24 35h16v15H24zM29 35v-5h6v5M28 42h8" />
        <text x="32" y="48" textAnchor="middle">API</text>
      </svg>
    );
  }
  if (type === "asp-gsp") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M16 31a13 13 0 0 1 24-7 10 10 0 0 1 6 18H21a10 10 0 0 1-5-11Z" />
        <rect x="10" y="39" width="27" height="12" rx="3" />
        <path d="M15 45h12M31 45h1" />
        <rect x="40" y="37" width="14" height="15" rx="3" />
        <path d="M44 37v-4a3 3 0 0 1 6 0v4M47 43v4" />
      </svg>
    );
  }
  if (type === "tax") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M13 8h27l9 9v36H13zM40 8v10h10" />
        <path d="M19 25h23M19 32h16M19 39h13" />
        <path className="offering-icon-gold" d="m18 46 4 4 8-9" />
        <rect x="37" y="36" width="17" height="18" rx="3" />
        <path d="M41 41h9M41 46h2m4 0h3M41 50h2m4 0h3" />
      </svg>
    );
  }
  if (type === "development") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="7" y="12" width="39" height="30" rx="4" />
        <path d="M7 20h39M19 50h15M26 42v8" />
        <path className="offering-icon-gold" d="m19 27-5 4 5 4m10-8 5 4-5 4m-3-10-4 12" />
        <rect x="42" y="27" width="15" height="27" rx="3" />
        <path d="M47 31h5M48 49h3" />
        <path className="offering-icon-gold" d="M51 18a7 7 0 0 1 6 7m-3-9 1 4 4-1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="21" r="8" />
      <circle cx="16" cy="25" r="6" />
      <circle cx="48" cy="25" r="6" />
      <path d="M20 50c1-10 5-15 12-15s11 5 12 15M5 49c1-8 5-12 11-12 3 0 5 1 7 3M59 49c-1-8-5-12-11-12-3 0-5 1-7 3" />
    </svg>
  );
}

export default function OfferingServiceIcon({ type, className = "" }) {
  return (
    <span className={`offering-service-icon ${className}`.trim()} aria-hidden="true">
      {type === "sap" ? (
        <img src={sapLogo} alt="" />
      ) : type === "dsc" ? (
        <DSCIcon size="sm" />
      ) : (
        <LineIcon type={type} />
      )}
    </span>
  );
}
