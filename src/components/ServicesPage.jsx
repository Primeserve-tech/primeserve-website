import { useEffect, useState } from "react";
import { createId, getCmsData, saveCmsData } from "../cmsStore";
import { notifyAdminOfSubmission } from "../adminNotifications";
import manpowerHero from "../assets/manpower-services-hero.png";
import { OtherVerticals } from "./BusinessVerticalsPage";

function readFileAsDataUrl(file) {
  if (!file || !file.name) return Promise.resolve("");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read the selected resume."));
    reader.readAsDataURL(file);
  });
}

const careerLevels = [
  ["01", "Junior & Entry Level", "Freshers, trainees, associates, executives and operational workforce."],
  ["02", "Mid-Level Professionals", "Experienced specialists, analysts, engineers, consultants and professional team members."],
  ["03", "Managers & Senior Professionals", "Team leads, managers, senior specialists and experienced functional professionals."],
  ["04", "Leadership & Critical Roles", "Senior management, department heads and business-critical specialist positions."],
];

const workforceServices = [
  "Permanent Staffing",
  "Contract Staffing",
  "Temporary & Seasonal Workforce",
  "Junior to Senior-Level Hiring",
  "Contract-to-Hire",
  "Bulk Hiring & Volume Recruitment",
  "Project-Based Team Deployment",
  "Payroll & Workforce Coordination",
  "Background & Document Verification",
  "Joining & Deployment Coordination",
];

const industries = [
  "Information Technology",
  "Banking & Financial Services",
  "FinTech & Financial Services",
  "Retail & E-Commerce",
  "Manufacturing",
  "Logistics & Supply Chain",
  "Telecom",
  "Customer Support & BPO",
  "Corporate & Administrative Functions",
  "Sales & Business Development",
  "Finance & Accounts",
  "Operations & Back Office",
];

const engagementModels = [
  "Permanent Hiring",
  "Contract Staffing",
  "Contract-to-Hire",
  "Fixed-Term Deployment",
  "Temporary Staffing",
  "Project-Based Teams",
  "Volume Recruitment",
];

const roleGroups = [
  ["Technology", "Developers, engineers, QA, technical support, infrastructure and technology roles."],
  ["Finance & Accounts", "Accountants, finance executives, analysts and related functional roles."],
  ["Sales & Business Development", "Sales executives, relationship teams, business development and field personnel."],
  ["Customer Operations", "Customer support, service desk, back-office and operations personnel."],
  ["Corporate Functions", "HR, administration, procurement and office support roles."],
  ["Manufacturing & Logistics", "Plant support, warehouse, logistics, supply-chain and operational workforce."],
  ["Management", "Team leads, managers and experienced functional professionals."],
];

const fulfilmentSteps = [
  ["01", "Requirement Discovery", "Roles, skills, experience, location, headcount and joining timelines."],
  ["02", "Sourcing & Screening", "Candidate identification, profile screening and preliminary checks."],
  ["03", "Shortlisting & Client Selection", "Relevant profiles are shared for client review, interviews and final selection."],
  ["04", "Documentation & Deployment", "Offer coordination, documentation, joining support and deployment."],
  ["05", "Ongoing Coordination", "Workforce follow-up and coordination based on the selected engagement model."],
];

const whyPrimeserve = [
  ["Structured Screening", "Profiles aligned with defined role requirements."],
  ["Flexible Hiring Models", "Support for permanent, contract and project-based workforce requirements."],
  ["Multiple Career Levels", "Workforce sourcing from junior to senior-level requirements."],
  ["Single Point of Coordination", "Structured coordination across sourcing, selection and deployment."],
];

export default function ServicesPage() {
  const [cmsData, setCmsData] = useState(getCmsData);
  const [formStatus, setFormStatus] = useState("");
  const [candidateOpen, setCandidateOpen] = useState(false);
  const [candidateStatus, setCandidateStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    document.title = "Primeserve Workforce Solutions | Staffing & Manpower Services";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Primeserve workforce staffing, hiring and deployment support across junior, mid-level, senior and managerial requirements.";
  }, []);

  const submitEnquiry = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const mobile = String(form.get("mobile") || "").trim();

    if (!email && !mobile) {
      setFormStatus("Please provide either a business email or mobile number.");
      return;
    }

    const enquiry = {
      id: createId("enquiry"),
      name: String(form.get("name") || "").trim(),
      company: String(form.get("company") || "").trim(),
      email,
      mobile,
      hiringLocation: String(form.get("hiringLocation") || "").trim(),
      requiredRole: String(form.get("requiredRole") || "").trim(),
      positions: String(form.get("positions") || "").trim(),
      experienceLevel: String(form.get("experienceLevel") || "").trim(),
      employmentType: String(form.get("employmentType") || "").trim(),
      requirement: String(form.get("requirement") || "").trim(),
      message: String(form.get("message") || "").trim(),
      service: "Workforce Solutions",
      date: new Date().toISOString().slice(0, 10),
      status: "New",
      type: "Service Enquiry",
    };

    const nextData = { ...cmsData, enquiries: [enquiry, ...(cmsData.enquiries || [])] };
    saveCmsData(nextData);
    setCmsData(nextData);
    notifyAdminOfSubmission("workforce enquiry", enquiry);
    event.currentTarget.reset();
    setFormStatus("");
    setSuccessMessage(
      "Thank you for sharing your workforce requirement. Our team will review the details and get in touch with you shortly."
    );
  };

  const submitCandidateProfile = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const resume = form.get("resume");
    setCandidateStatus("Submitting your profile...");

    try {
      const resumeData = await readFileAsDataUrl(resume);
      const now = new Date();
      const application = {
        id: createId("app"),
        fullName: String(form.get("fullName") || "").trim(),
        email: String(form.get("email") || "").trim(),
        mobile: String(form.get("mobile") || "").trim(),
        position: String(form.get("currentRole") || "General Workforce Application").trim(),
        experience: String(form.get("experience") || "").trim(),
        currentLocation: String(form.get("currentLocation") || "").trim(),
        preferredLocation: String(form.get("preferredLocation") || "").trim(),
        expertise: String(form.get("expertise") || "").trim(),
        jobType: String(form.get("jobType") || "").trim(),
        resumeName: resume?.name || "",
        resumeData,
        message: String(form.get("additionalInformation") || "").trim(),
        status: "New",
        date: now.toISOString().slice(0, 10),
        dateTime: now.toISOString(),
      };
      const latestData = getCmsData();
      const nextData = {
        ...latestData,
        applications: [application, ...(latestData.applications || [])],
      };
      saveCmsData(nextData);
      setCmsData(nextData);
      notifyAdminOfSubmission("candidate profile", application);
      formElement.reset();
      setCandidateStatus("");
      setCandidateOpen(false);
      setSuccessMessage(
        "Your profile has been submitted successfully. Our recruitment team will review it and contact you when a suitable opportunity matches your experience and skills."
      );
    } catch {
      setCandidateStatus("We could not read the selected resume. Please choose the file again and resubmit.");
    }
  };

  return (
    <div className="services-page">
      <section className="services-hero">
        <img className="services-hero-background" src={manpowerHero} alt="Primeserve professional workforce team" />
        <div className="services-hero-content">
          <h1>
            Flexible Workforce.
            <br />
            Reliable Delivery.
          </h1>
          <p>
            Scalable workforce sourcing and deployment, managed by Primeserve with
            structured delivery and a single point of coordination.
          </p>
          <a href="#workforce-details">Explore Workforce Solutions</a>
        </div>
      </section>

      <div className="workforce-content-layout" id="workforce-details">
        <main className="workforce-main-column">
          <section className="workforce-introduction workforce-section">
            <span>WORKFORCE SOLUTIONS</span>
            <h2>Manpower Services</h2>
            <p>
              Primeserve helps organizations identify, screen and deploy suitable talent across business
              functions, industries and experience levels. From junior and entry-level roles to experienced
              professionals, managers and senior-level positions, we support both individual hiring and
              large-scale workforce requirements through a structured sourcing and fulfilment process.
            </p>
            <p>
              Whether you need a single specialist, an entire project team or high-volume workforce
              deployment, Primeserve provides flexible hiring support aligned with your business requirements.
            </p>
          </section>

          <section className="workforce-section">
            <div className="workforce-section-heading">
              <span>CAREER LEVELS</span>
              <h2>Talent Across Every Career Level</h2>
              <p>
                From entry-level talent to experienced professionals and senior roles, we help businesses
                source candidates based on skills, experience, location and deployment requirements.
              </p>
            </div>
            <div className="career-level-grid">
              {careerLevels.map(([number, title, text]) => (
                <article key={number}>
                  <b>{number}</b>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="workforce-section workforce-soft-section">
            <div className="workforce-section-heading">
              <span>STAFFING SUPPORT</span>
              <h2>What We Provide</h2>
            </div>
            <div className="workforce-check-grid">
              {workforceServices.map((item) => <span key={item}>{item}</span>)}
            </div>
          </section>

          <section className="workforce-section">
            <div className="workforce-section-heading">
              <span>BUSINESS FUNCTIONS</span>
              <h2>Industries Supported</h2>
            </div>
            <div className="workforce-industry-grid">
              {industries.map((item) => <span key={item}>{item}</span>)}
            </div>
          </section>

          <section className="workforce-section workforce-soft-section">
            <div className="workforce-section-heading">
              <span>FLEXIBLE DELIVERY</span>
              <h2>Flexible Engagement Models</h2>
            </div>
            <div className="workforce-model-chips">
              {engagementModels.map((item) => <span key={item}>{item}</span>)}
            </div>
          </section>

          <section className="workforce-section">
            <div className="workforce-section-heading">
              <span>ROLE COVERAGE</span>
              <h2>Roles We Can Support</h2>
              <p>Workforce support across technical, functional, operational and corporate requirements.</p>
            </div>
            <div className="workforce-role-grid">
              {roleGroups.map(([title, text]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="workforce-section workforce-soft-section">
            <div className="workforce-section-heading">
              <span>OUR PROCESS</span>
              <h2>How Manpower Fulfilment Works</h2>
            </div>
            <ol className="workforce-process">
              {fulfilmentSteps.map(([number, title, text]) => (
                <li key={number}>
                  <b>{number}</b>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <section className="workforce-section">
            <div className="workforce-section-heading">
              <span>WHY PRIMESERVE</span>
              <h2>Why Primeserve</h2>
            </div>
            <div className="workforce-value-grid">
              {whyPrimeserve.map(([title, text]) => (
                <article key={title}><h3>{title}</h3><p>{text}</p></article>
              ))}
            </div>
          </section>
        </main>

        <aside className="workforce-enquiry-card" id="request-workforce">
          <span>EMPLOYER ENQUIRY</span>
          <h2>Request Workforce</h2>
          <p>Share your hiring or workforce requirement and the Primeserve team will connect with you.</p>
          <form onSubmit={submitEnquiry}>
            <div className="workforce-form-row">
              <label><span>Name *</span><input name="name" required /></label>
              <label><span>Company</span><input name="company" /></label>
            </div>
            <div className="workforce-form-row">
              <label><span>Business Email</span><input name="email" type="email" /></label>
              <label><span>Mobile</span><input name="mobile" inputMode="numeric" maxLength="10" onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 10); }} /></label>
            </div>
            <label><span>Hiring Location</span><input name="hiringLocation" /></label>
            <label><span>Required Role / Skill</span><input name="requiredRole" /></label>
            <div className="workforce-form-row">
              <label><span>Number of Positions</span><input name="positions" type="number" min="1" /></label>
              <label>
                <span>Experience Level</span>
                <select name="experienceLevel" defaultValue="">
                  <option value="">Select level</option>
                  <option>Entry / Junior Level</option><option>Mid Level</option><option>Senior Level</option>
                  <option>Managerial Level</option><option>Multiple Levels</option>
                </select>
              </label>
            </div>
            <label>
              <span>Employment Type</span>
              <select name="employmentType" defaultValue="">
                <option value="">Select type</option>
                <option>Permanent</option><option>Contract</option><option>Contract-to-Hire</option>
                <option>Temporary</option><option>Project-Based</option><option>Not Sure</option>
              </select>
            </label>
            <label><span>Requirement Summary *</span><textarea name="requirement" rows="3" required /></label>
            <label><span>Additional Details</span><textarea name="message" rows="3" /></label>
            <button type="submit">Submit Requirement</button>
            {formStatus && <strong className="workforce-form-status">{formStatus}</strong>}
          </form>
        </aside>
      </div>

      <OtherVerticals currentId="workforce-solutions" />

      <section className="candidate-opportunity">
        <div>
          <span>CANDIDATE OPPORTUNITIES</span>
          <h2>Looking for Your Next Opportunity?</h2>
          <p>
            Primeserve connects suitable candidates with workforce requirements across multiple industries
            and career levels. Whether you are starting your career or exploring your next professional
            opportunity, you can share your profile with our recruitment team.
          </p>
          <p>
            Opportunities may be available across junior, mid-level, senior and managerial positions
            depending on current client requirements.
          </p>
          <small>
            Opportunities depend on available client requirements, profile suitability, experience,
            skill requirements and the applicable selection process.
          </small>
        </div>
        <button type="button" onClick={() => { setCandidateOpen(true); setCandidateStatus(""); }}>
          Submit Your Profile
        </button>
      </section>

      <section className="workforce-final-cta">
        <div>
          <h2>Build the Right Workforce with Primeserve</h2>
          <p>
            From individual hiring to large-scale workforce deployment, share your requirement and our
            team will help structure an appropriate hiring approach.
          </p>
        </div>
        <div>
          <a href="#request-workforce">Request Workforce</a>
          <button type="button" onClick={() => { setCandidateOpen(true); setCandidateStatus(""); }}>
            Submit Your Profile
          </button>
        </div>
      </section>

      {candidateOpen && (
        <div className="candidate-modal-overlay" onClick={() => setCandidateOpen(false)}>
          <section className="candidate-modal" onClick={(event) => event.stopPropagation()}>
            <button className="candidate-modal-close" type="button" onClick={() => setCandidateOpen(false)} aria-label="Close">×</button>
            <span>CANDIDATE PROFILE</span>
            <h2>Submit Your Profile</h2>
            <p>Share your details for suitable future workforce requirements. Submission does not guarantee a job or placement.</p>
            <form onSubmit={submitCandidateProfile}>
              <div><input name="fullName" placeholder="Full Name" required /><input name="email" type="email" placeholder="Email" required /></div>
              <div><input name="mobile" inputMode="numeric" maxLength="10" placeholder="Mobile" onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 10); }} /><input name="currentLocation" placeholder="Current Location" /></div>
              <div><input name="preferredLocation" placeholder="Preferred Location" /><input name="experience" placeholder="Total Experience" /></div>
              <input name="currentRole" placeholder="Current / Most Recent Role" />
              <input name="expertise" placeholder="Area of Expertise" />
              <select name="jobType" defaultValue=""><option value="">Preferred Job Type</option><option>Permanent</option><option>Contract</option><option>Temporary</option><option>Project-Based</option><option>Open to Options</option></select>
              <label className="candidate-file"><span>Resume Upload</span><input name="resume" type="file" accept=".pdf,.doc,.docx" required /></label>
              <textarea name="additionalInformation" placeholder="Additional Information" rows="3" />
              <button type="submit">Submit Profile</button>
              {candidateStatus && <strong>{candidateStatus}</strong>}
            </form>
          </section>
        </div>
      )}

      {successMessage && (
        <div className="cms-success-backdrop" role="presentation">
          <section className="cms-success-popup" role="alertdialog" aria-modal="true" aria-labelledby="workforce-success-title">
            <div className="cms-success-check" aria-hidden="true">✓</div>
            <h2 id="workforce-success-title">Successfully Submitted</h2>
            <p>{successMessage}</p>
            <button type="button" onClick={() => setSuccessMessage("")}>Done</button>
          </section>
        </div>
      )}
    </div>
  );
}
