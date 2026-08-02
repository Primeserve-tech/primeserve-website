import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const catalogueGroups = [
  ["KYC", ["Fetch PAN lite", "Fetch PAN Detailed", "Fetch PAN Essentials", "Verify PAN", "Verify PAN V3", "Check Aadhaar link", "Fetch Father's Name by PAN", "Fetch PAN Lite Plus", "Fetch Aadhaar by PAN", "Fetch PAN Advanced", "Fetch Name on PAN Card", "Verify ITR 206 Compliance", "Fetch PAN contact details", "Fetch Details Driving License", "Fetch Details Boson", "Fetch Details Meson", "Aadhaar UID masking", "DigiLocker", "Aadhaar app based QR verification", "Verify Digilocker Account", "Verify MRZ", "Generate MRZ", "Passport Fetch", "Verify Passport", "Fetch Individual Personal Profile", "Fetch Individual PAN by Phone", "Fetch Individual Address by Phone", "Fetch Individual National IDs byPhone", "Fetch Electricity Bill", "Mobile Lookup", "Fetch Mobile Number Age", "Fetch Whatsapp Profile", "Fetch Digital Footprint", "Name Lookup by mobile", "Mobile Prefill", "Pan lookup by mobile", "Image deepfake lookup", "Audio Deepfake lookup", "Video deepfake lookup", "Fetch LPG details by mobile", "Name Match", "E Sign", "Fetch Digipin form Lat-Long", "Fetch Lat-long from digipin", "Fetch distance between digipins", "Fetch Spend Insights"]],
  ["OCR", ["OCR PAN card", "OCR Aadhaar", "OCR V2 Aadhaar", "OCR Voter ID", "OCR Cheque", "OCR Bank Statement (firsf page)", "OCR Salary Slip", "OCR Udyam Certificate", "OCR Driving License", "OCR Passport", "Verify Face", "Passive Liveness Check"]],
  ["Employment", ["Fetch UAN by PAN", "Fetch UAN by Mobile", "Fetch UAN by Aadhaar", "Fetch Latest UAN Employment", "Fetch UAN EmploymentHistory", "Fetch Latest Employment by Mobile", "Fetch Latest Employment by Mobile", "Fetch EPFO Passbook", "Verify Employer", "EPFO passbook V2", "Fetch Employment history V2", "Fetch UAN Profile Details"]],
  ["Vehicle", ["Fetch RC Lite", "Fetch RC Detailed", "Fetch E-Challan", "Fetch Vehicle Reg number by Chassis", "Fetch Fastag Details", "Fetch RC Contact Details", "RC Lookup by Mobile", "Fetch RC Detailed By Chassis Number"]],
  ["GST", ["Fetch GSTIN by Enterprise Name", "Fetch GSTIN by PAN", "Fetch GSTIN Lite", "Fetch GSTIN Detailed", "Fetch GSTIN Contact Details", "Fetch GSTIN By Mobile", "Fetch MCC Codes by GSTIN", "Fetch GST Certificate"]],
  ["Business", ["Business KYC checks", "Check Entity Linkage", "Fetch Udyam by Mobile", "Fetch Udyam by PAN", "Verify Udyog Aadhaar", "Udyam Lookup", "Verify Udyam", "Verify Udyam Advanced", "Verify Udyam Detailed", "Fetch CIN by PAN", "Fetch Company", "Fetch Director", "Fetch DIN by PAN", "Fetch PAN by DIN", "TAN Verification", "Fetch Contact Details by DIN", "Fetch FSSAI License"]],
  ["Banking", ["Verify Bank Account", "Verify Bank Account V2", "Bank Account Verification Penniless", "Bank Account Verification Hybrid", "Bank Reverse Penny Drop", "Verify UPI", "Verify UPI Advanced", "Bank statement Analyzer", "Fetch Bank Account By Mobile", "Fetch Bank Account By UPI", "Fetch UPI Id", "Verify IFSC"]],
  ["Miscellaneous", ["Criminal and Court Record Verification Report", "Criminal and Court Record Verification Report Rapid"]],
];

const dedicatedApis = [
  ["TransUnion CIBIL Score API", "Credit"],
  ["Equifax Credit Score API", "Credit"],
  ["GST Get API", "GST"],
  ["E-Invoice API", "Compliance"],
  ["E-Way Bill API", "Compliance"],
  ["GST Public API", "GST"],
  ["GST Taxpayer API", "GST"],
];

const heroApis = [
  ...dedicatedApis.map(([name, category]) => ({ name, category })),
  ...catalogueGroups.flatMap(([category, names]) => names.map((name) => ({ name, category }))),
];

const categoryGlyphs = {
  GST: "GST", Compliance: "DOC", KYC: "ID", OCR: "OCR", Employment: "EMP",
  Vehicle: "RC", Business: "CO", Banking: "BANK", Credit: "SCORE", Miscellaneous: "LAW",
};

function visibleCardCount() {
  if (window.innerWidth <= 640) return 5;
  if (window.innerWidth <= 960) return 7;
  return 12;
}

export default function HeroApiOrbit() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(visibleCardCount);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(null);
  const reducedMotion = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const move = useCallback((direction) => {
    setActiveIndex((index) => (index + direction + heroApis.length) % heroApis.length);
  }, []);

  useEffect(() => {
    const onResize = () => setVisibleCount(visibleCardCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return undefined;
    const timer = window.setInterval(() => move(1), 1450);
    return () => window.clearInterval(timer);
  }, [move, paused, reducedMotion]);

  const cards = Array.from({ length: visibleCount + 2 }, (_, slot) => {
    const offset = slot - 1;
    const dataIndex = (activeIndex + offset + heroApis.length) % heroApis.length;
    return { ...heroApis[dataIndex], dataIndex, slot, offset };
  });

  return (
    <div
      className="hero-api-orbit"
      aria-label="Primeserve API carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
      onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        if (touchStart.current == null) return;
        const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
        if (Math.abs(distance) > 35) move(distance < 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      <div className="hero-api-glow" />
      <div className="hero-api-ring ring-one" />
      <div className="hero-api-ring ring-two" />
      <div className="hero-api-ring ring-three" />
      <div className="hero-api-centre" aria-label="More than 250 Primeserve APIs">
        <strong>250+</strong><span>APIs</span>
      </div>
      <div className="hero-api-card-stage">
        {cards.map((api) => {
          const angle = (api.offset / visibleCount) * Math.PI * 2;
          const x = Math.sin(angle) * 43;
          const y = -Math.cos(angle) * 36;
          const depth = (1 - Math.cos(angle)) / 2;
          const inView = api.offset >= 0 && api.offset < visibleCount;
          const style = {
            "--orbit-x": `${x}%`, "--orbit-y": `${y}%`,
            "--orbit-scale": (0.72 + depth * 0.28).toFixed(3),
            "--orbit-opacity": inView ? (0.48 + depth * 0.52).toFixed(3) : "0",
            "--orbit-depth": `${Math.round(-150 + depth * 250)}px`,
            "--orbit-brightness": (0.62 + depth * 0.55).toFixed(3),
            "--orbit-blur": `${((1 - depth) * 1.15).toFixed(2)}px`,
            "--orbit-z": String(Math.round(depth * 20)),
          };
          return (
            <a className={`hero-api-card category-${api.category.toLowerCase()}`} href="#api-list" style={style} key={api.dataIndex} tabIndex={inView ? 0 : -1} aria-hidden={!inView}>
              <i aria-hidden="true">{categoryGlyphs[api.category] || "API"}</i>
              <span>{api.name}</span>
            </a>
          );
        })}
      </div>
      <button className="hero-api-arrow previous" type="button" onClick={() => move(-1)} aria-label="Previous API">‹</button>
      <button className="hero-api-arrow next" type="button" onClick={() => move(1)} aria-label="Next API">›</button>
    </div>
  );
}
