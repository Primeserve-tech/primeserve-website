import { useEffect, useMemo, useRef, useState } from "react";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";
import originalLogo from "../assets/primeserve-logo-hd-cropped.png";

const STORAGE_KEY = "primeserve_letterhead_documents_v2";
const CATEGORY_STORAGE_KEY = "primeserve_letterhead_categories_v1";
const DEFAULT_CATEGORIES = ["HR", "Accounts", "Admin", "IT", "PO"];
const FOOTER = {
  cin: "CIN: U62011UW2026PTC253187",
  registered: "Registered Office: Greater Noida, Gautam Buddha Nagar, Uttar Pradesh 201306, India",
  corporate: "Corporate Office: Kedar Chauk, Hajipur, Vaishali, Bihar – 844102, India",
  contact: "Email: info@primeserve.in | Mobile: +91 836 841 4690 | Website: www.primeserve.in",
};
const starterContent = "<p>Dear Sir/Madam,</p><p>Write or paste your official letter content here.</p><p>Yours sincerely,</p><p><strong>Authorised Signatory</strong><br>Primeserve Global Solution Private Limited</p>";

function getSavedDocuments() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || "[]";
    const migrated = stored.replaceAll("PrimeServe", "Primeserve");
    if (migrated !== stored) localStorage.setItem(STORAGE_KEY, migrated);
    const next = JSON.parse(migrated);
    return Array.isArray(next) ? next : [];
  } catch {
    return [];
  }
}

function getCategories() {
  try {
    const stored = JSON.parse(localStorage.getItem(CATEGORY_STORAGE_KEY) || "[]");
    return Array.isArray(stored) && stored.length ? stored : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

function safeFileName(value) {
  return String(value || "Primeserve-letter").replace(/[<>:"/\\|?*]+/g, "-").trim();
}

function formatSavedDate(value) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

async function imageAsDataUrl(url) {
  const blob = await fetch(url).then((response) => response.blob());
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function htmlBlocks(html) {
  const parsed = document.createElement("div");
  parsed.innerHTML = html;
  return [...parsed.children];
}

function textWithLineBreaks(element) {
  const clone = element.cloneNode(true);
  clone.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
  return String(clone.textContent || "")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

// Kept as a compatibility renderer for previously saved documents.
// eslint-disable-next-line no-unused-vars
function previewPages(subject, content, pageStyle) {
  const pages = [];
  let current = [];
  let usedLines = subject.trim() ? 3 : 0;
  htmlBlocks(content).forEach((block) => {
    const text = textWithLineBreaks(block);
    const explicitLines = Math.max(1, text.split("\n").length);
    const wrappedLines = Math.max(explicitLines, Math.ceil(text.length / 88));
    const lineEstimate = wrappedLines + (block.matches("h1,h2,h3,ul,ol") ? 1 : 0) + 0.75;
    const currentLimit = pages.length === 0 || pageStyle === "every-page" ? 43 : 58;
    if (current.length && usedLines + lineEstimate > currentLimit) {
      pages.push(current);
      current = [];
      usedLines = 0;
    }
    current.push(block.outerHTML);
    usedLines += lineEstimate;
  });
  pages.push(current);
  return pages.length ? pages : [[]];
}

// Kept as a compatibility renderer for previously saved documents.
// eslint-disable-next-line no-unused-vars
function LetterheadPage({ subject, html, pageNumber, totalPages, branded = true }) {
  return (
    <article className={`official-letter-page ${branded ? "" : "plain-continuation-page"}`}>
      {branded && <header className="official-letter-header"><img src={originalLogo} alt="Primeserve Global Solution Pvt. Ltd." /></header>}
      <section className="official-letter-content">
        {pageNumber === 1 && subject.trim() && <h1>{subject}</h1>}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </section>
      {branded && <footer className="official-letter-footer">
        <div className="official-footer-goldline" />
        <p><strong>CIN:</strong> U62011UW2026PTC253187</p>
        <p><strong>Registered Office:</strong> Greater Noida, Gautam Buddha Nagar, Uttar Pradesh 201306, India</p>
        <p><strong>Corporate Office:</strong> Kedar Chauk, Hajipur, Vaishali, Bihar – 844102, India</p>
        <p className="official-footer-contact">Email: info@primeserve.in <i /> Mobile: +91 836 841 4690 <i /> Website: www.primeserve.in</p>
      </footer>}
      {totalPages > 1 && <span className="official-page-number">{pageNumber} / {totalPages}</span>}
    </article>
  );
}

export default function LetterheadDocuments({ session }) {
  const [subject, setSubject] = useState("Subject: Official communication from Primeserve");
  const [content, setContent] = useState(starterContent);
  const [documentName, setDocumentName] = useState("Primeserve letter");
  const [categories, setCategories] = useState(getCategories);
  const [department, setDepartment] = useState(() => getCategories()[0]);
  const [newCategory, setNewCategory] = useState("");
  const [pageStyle, setPageStyle] = useState("every-page");
  const [categoryError, setCategoryError] = useState("");
  const [letterSearch, setLetterSearch] = useState("");
  const [status, setStatus] = useState("Ready");
  const [savedDocuments, setSavedDocuments] = useState(getSavedDocuments);
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");
  const [pdfPreviewPages, setPdfPreviewPages] = useState(0);
  const [livePdfUrl, setLivePdfUrl] = useState("");
  const [livePdfPages, setLivePdfPages] = useState(1);
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const previewPdfRef = useRef(null);
  const filteredDocuments = useMemo(() => {
    const query = letterSearch.trim().toLowerCase();
    if (!query) return savedDocuments;
    return savedDocuments.filter((record) =>
      [record.name, record.department, record.subject, record.content]
        .some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [savedDocuments, letterSearch]);

  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  useEffect(() => () => {
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
  }, [pdfPreviewUrl]);

  const setEditorContent = (html) => {
    setContent(html);
    requestAnimationFrame(() => {
      if (editorRef.current) editorRef.current.innerHTML = html;
    });
  };

  const persistDocuments = (documents) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    setSavedDocuments(documents);
  };

  const resetDocument = () => {
    setActiveDocumentId(null);
    setDocumentName("Primeserve letter");
    setSubject("Subject: Official communication from Primeserve");
    setDepartment(categories[0] || "General");
    setPageStyle("every-page");
    setEditorContent(starterContent);
    setStatus("New document ready.");
  };

  const addCategory = () => {
    const value = newCategory.trim();
    if (!value) {
      setCategoryError("Enter a document type first.");
      return;
    }
    if (categories.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setCategoryError("This document type already exists.");
      return;
    }
    const next = [...categories, value];
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(next));
    setCategories(next);
    setDepartment(value);
    setNewCategory("");
    setCategoryError("");
    setStatus(`${value} document type added.`);
  };

  const deleteCategory = (value) => {
    if (categories.length === 1) return setStatus("At least one document type is required.");
    if (!window.confirm(`Delete the "${value}" document type? Existing saved letters will remain available.`)) return;
    const next = categories.filter((item) => item !== value);
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(next));
    setCategories(next);
    if (department === value) setDepartment(next[0]);
    setStatus(`${value} document type deleted.`);
  };

  const saveDocument = (message = "") => {
    const name = documentName.trim();
    if (!name) return setStatus("Enter a document name before saving.");
    const now = new Date().toISOString();
    if (activeDocumentId) {
      persistDocuments(savedDocuments.map((item) => item.id === activeDocumentId ? { ...item, name, department, pageStyle, subject, content, updatedAt: now } : item));
      setStatus(message || "Saved document updated.");
      return activeDocumentId;
    }
    const documentRecord = {
      id: `letter-${Date.now()}`,
      name,
      department,
      pageStyle,
      subject,
      content,
      createdAt: now,
      updatedAt: now,
      generatedBy: {
        name: session?.name || "Admin",
        email: session?.email || "",
        role: session?.role || "Admin",
      },
      downloadCount: 0,
      lastDownloadedAt: "",
    };
    persistDocuments([documentRecord, ...savedDocuments]);
    setActiveDocumentId(documentRecord.id);
    setStatus(message || "Document saved in the admin portal.");
    return documentRecord.id;
  };

  const openDocument = (record) => {
    setActiveDocumentId(record.id);
    setDocumentName(record.name);
    setDepartment(record.department || categories[0] || "General");
    setPageStyle(record.pageStyle || "every-page");
    setSubject(record.subject || "");
    setEditorContent(record.content || "");
    setStatus(`Opened ${record.name}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteDocument = (record) => {
    if (session?.role !== "Super Admin") {
      setStatus("Only Super Admin can delete saved letters.");
      return;
    }
    if (!window.confirm(`Delete "${record.name}" permanently?`)) return;
    persistDocuments(savedDocuments.filter((item) => item.id !== record.id));
    if (activeDocumentId === record.id) resetDocument();
    setStatus("Saved document deleted.");
  };

  const format = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setContent(editorRef.current?.innerHTML || "");
  };

  const importDocument = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".docx")) {
      setStatus("Please choose a .docx Word document.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus("The Word document exceeds 10 MB.");
      return;
    }
    setStatus("Importing Word document...");
    try {
      const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
      setActiveDocumentId(null);
      setDocumentName(file.name.replace(/\.docx$/i, ""));
      setEditorContent(result.value || "<p></p>");
      setStatus(result.messages.length ? "Imported. Please review the formatting." : "Word document imported.");
    } catch {
      setStatus("The Word document could not be imported.");
    }
    event.target.value = "";
  };

  const buildPdf = async () => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true, putOnlyUsedFonts: true });
    const logoData = await imageAsDataUrl(originalLogo);
    const contentLeft = 20;
    const contentWidth = 170;
    const top = 58;
    const bottom = 263;
    let y = top;
    let pageNumber = 1;

    const drawFrame = (addPage = false) => {
      if (addPage) {
        pdf.addPage("a4", "portrait");
        pageNumber += 1;
      }
      const brandedPage = pageNumber === 1 || pageStyle === "every-page";
      if (!brandedPage) {
        y = 22;
        return;
      }
      pdf.addImage(logoData, "PNG", 12, 6, 186, 47.8, undefined, "NONE");
      pdf.setFillColor(2, 37, 82);
      pdf.rect(-5, 269, 220, 29, "F");
      pdf.setFillColor(211, 160, 28);
      pdf.rect(-5, 269, 220, 1, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.1);
      pdf.text(FOOTER.cin, 105, 275, { align: "center" });
      pdf.setFontSize(7.8);
      pdf.text(FOOTER.registered, 105, 280.2, { align: "center" });
      pdf.text(FOOTER.corporate, 105, 285.4, { align: "center" });
      pdf.setDrawColor(211, 160, 28);
      pdf.line(15, 288.4, 195, 288.4);
      pdf.setFontSize(7.4);
      pdf.text(FOOTER.contact, 105, 294, { align: "center" });
      pdf.setTextColor(20, 35, 56);
      y = top;
    };

    const ensureSpace = (height) => {
      const pageBottom = pageNumber === 1 || pageStyle === "every-page" ? bottom : 280;
      if (y + height <= pageBottom) return;
      drawFrame(true);
    };

    drawFrame();
    if (subject.trim()) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12.5);
      const titleLines = pdf.splitTextToSize(subject.trim(), contentWidth);
      ensureSpace(titleLines.length * 6.5 + 7);
      pdf.text(titleLines, contentLeft, y);
      y += titleLines.length * 6.5 + 7;
    }

    for (const block of htmlBlocks(content)) {
      const tag = block.tagName;
      const text = textWithLineBreaks(block);
      if (!text) {
        // Match the live preview's empty paragraph height. The editor renders an
        // empty paragraph as one text line plus its paragraph margin; using only
        // 3 mm here pulled signatures and closing text upward in downloaded PDFs.
        ensureSpace(9.2);
        y += 9.2;
        continue;
      }
      const isHeading = /^H[1-6]$/.test(tag);
      const allBold = isHeading || (block.querySelector("strong,b") && block.textContent.trim() === block.querySelector("strong,b")?.textContent.trim());
      const isList = tag === "UL" || tag === "OL";
      const fontSize = isHeading ? 13 : 10.5;
      const lineHeight = isHeading ? 6.5 : 5.2;
      pdf.setFont("helvetica", allBold ? "bold" : "normal");
      pdf.setFontSize(fontSize);
      const printable = isList
        ? [...block.querySelectorAll("li")].map((item, index) => `${tag === "OL" ? `${index + 1}.` : "•"} ${item.textContent.trim()}`).join("\n")
        : text;
      const lines = pdf.splitTextToSize(printable, contentWidth);
      for (const line of lines) {
        ensureSpace(lineHeight);
        pdf.text(line, contentLeft, y);
        y += lineHeight;
      }
      y += isHeading ? 3 : 4;
    }
    return pdf;
  };

  const openPdfPreview = async () => {
    setStatus("Preparing exact PDF preview...");
    try {
      const pdf = await buildPdf();
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
      const url = URL.createObjectURL(pdf.output("blob"));
      previewPdfRef.current = pdf;
      setPdfPreviewPages(pdf.getNumberOfPages());
      setPdfPreviewUrl(url);
      setStatus("Review the exact PDF, then choose Download or Print.");
    } catch {
      setStatus("PDF preview generation failed. Please try again.");
    }
  };

  const closePdfPreview = () => {
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    setPdfPreviewUrl("");
    setPdfPreviewPages(0);
    previewPdfRef.current = null;
  };

  const confirmPdfDownload = () => {
    try {
      const pdf = previewPdfRef.current;
      if (!pdf) return;
      const now = new Date().toISOString();
      const targetId = activeDocumentId || `letter-${Date.now()}`;
      const existing = savedDocuments.find((item) => item.id === targetId);
      const auditRecord = {
        ...(existing || {}),
        id: targetId,
        name: documentName.trim() || "Primeserve letter",
        department,
        pageStyle,
        subject,
        content,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        generatedBy: existing?.generatedBy || {
          name: session?.name || "Admin",
          email: session?.email || "",
          role: session?.role || "Admin",
        },
        downloadCount: Number(existing?.downloadCount || 0) + 1,
        lastDownloadedAt: now,
        lastDownloadedBy: {
          name: session?.name || "Admin",
          email: session?.email || "",
          role: session?.role || "Admin",
        },
      };
      const auditedDocuments = existing
        ? savedDocuments.map((item) => item.id === targetId ? auditRecord : item)
        : [auditRecord, ...savedDocuments];
      persistDocuments(auditedDocuments);
      if (!activeDocumentId) setActiveDocumentId(targetId);
      const count = pdf.getNumberOfPages();
      pdf.save(`${safeFileName(documentName)}.pdf`);
      setStatus(`PDF downloaded and saved automatically (${count} page${count === 1 ? "" : "s"}).`);
    } catch {
      setStatus("PDF download failed. Please try again.");
    }
  };

  const printLetter = async () => {
    setStatus("Preparing printable PDF...");
    try {
      const pdf = await buildPdf();
      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank", "noopener,noreferrer");
      setStatus("Print-ready PDF opened.");
    } catch {
      setStatus("Could not prepare the print view.");
    }
  };

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const pdf = await buildPdf();
        if (cancelled) return;
        const nextUrl = URL.createObjectURL(pdf.output("blob"));
        setLivePdfPages(pdf.getNumberOfPages());
        setLivePdfUrl((previousUrl) => {
          if (previousUrl) URL.revokeObjectURL(previousUrl);
          return nextUrl;
        });
      } catch {
        // Keep the last valid preview while the editor is changing.
      }
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, content, pageStyle]);

  useEffect(() => () => {
    if (livePdfUrl) URL.revokeObjectURL(livePdfUrl);
  }, [livePdfUrl]);

  return (
    <>
    <section className="letter-creator-v2">
      <div className="letter-editor-panel">
        <div className="letter-editor-heading"><span>Official correspondence</span><h2>Letter creator</h2><p>Create sharp, print-ready company letters using the approved Primeserve identity.</p></div>
        <label><span>Document name</span><input value={documentName} onChange={(event) => setDocumentName(event.target.value)} /></label>
        <label><span>Department / document type</span><select value={department} onChange={(event) => setDepartment(event.target.value)}>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
        <label><span>Letterhead pages</span><select value={pageStyle} onChange={(event) => setPageStyle(event.target.value)}><option value="every-page">Header and footer on every page</option><option value="first-page-only">Letterhead on first page, plain continuation pages</option></select></label>
        <div className="letter-category-manager">
          <div><input value={newCategory} onChange={(event) => { setNewCategory(event.target.value); setCategoryError(""); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addCategory(); } }} placeholder="Add HR, Accounts, IT, PO..." /><button type="button" onClick={addCategory}>Add</button></div>
          {categoryError && <p className="letter-category-error">{categoryError}</p>}
          <div className="letter-category-chips">{categories.map((category) => <span key={category}>{category}<button type="button" aria-label={`Delete ${category}`} onClick={() => deleteCategory(category)}>×</button></span>)}</div>
        </div>
        <label><span>Letter subject / title</span><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Enter the letter subject" /></label>
        <div className="letter-format-toolbar" aria-label="Formatting toolbar">
          <button type="button" onClick={() => format("bold")} title="Bold"><strong>B</strong></button>
          <button type="button" onClick={() => format("italic")} title="Italic"><em>I</em></button>
          <button type="button" onClick={() => format("underline")} title="Underline"><u>U</u></button>
          <span />
          <button type="button" onClick={() => format("justifyLeft")} title="Align left">≡</button>
          <button type="button" onClick={() => format("justifyCenter")} title="Align center">≡</button>
          <button type="button" onClick={() => format("justifyRight")} title="Align right">≡</button>
          <span />
          <button type="button" onClick={() => format("insertUnorderedList")} title="Bullet list">• List</button>
          <button type="button" onClick={() => format("insertOrderedList")} title="Numbered list">1. List</button>
        </div>
        <div ref={editorRef} className="letter-rich-editor" contentEditable suppressContentEditableWarning onInput={(event) => setContent(event.currentTarget.innerHTML)} />
        <button className="letter-import" type="button" onClick={() => inputRef.current?.click()}>Import Word (.docx)</button>
        <input ref={inputRef} hidden type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={importDocument} />
        <p className="letter-editor-status">{status}</p>
        <div className="letter-actions">
          <button className="preview" type="button" onClick={openPdfPreview}>Print Preview</button>
          <button className="download" type="button" onClick={openPdfPreview}>Download PDF</button>
          <button type="button" onClick={printLetter}>Print</button>
          <button type="button" onClick={resetDocument}>Reset</button>
        </div>
        <button className="letter-save" type="button" onClick={() => saveDocument()}>{activeDocumentId ? "Update Saved Letter" : "Save Letter"}</button>
      </div>

      <div className="letter-preview-column">
        <section className="letter-preview-panel">
          <div className="letter-preview-heading"><span>Live A4 PDF preview</span><strong>{livePdfPages} page{livePdfPages === 1 ? "" : "s"}</strong></div>
          {livePdfUrl
            ? <iframe className="letter-live-pdf-frame" src={`${livePdfUrl}#toolbar=0&navpanes=0&view=FitH`} title="Live Primeserve A4 PDF preview" />
            : <div className="letter-live-pdf-loading">Preparing A4 preview…</div>}
        </section>

        <section className="letter-saved-library">
          <div><span>Saved letters</span><strong>{filteredDocuments.length}</strong></div>
          <label className="letter-search-box"><span aria-hidden="true">⌕</span><input value={letterSearch} onChange={(event) => setLetterSearch(event.target.value)} placeholder="Search by name, department or subject..." aria-label="Search saved letters" /></label>
          {savedDocuments.length === 0 ? <p>No saved letters yet.</p> : filteredDocuments.length === 0 ? <p>No saved letters match your search.</p> : filteredDocuments.map((record) => (
            <article key={record.id}>
              <div>
                <strong>{record.name}</strong>
                <small><b>{record.department || "General"}</b> · Generated by {record.generatedBy?.name || "Admin"} ({record.generatedBy?.role || "Admin"})</small>
                <small>Created {formatSavedDate(record.createdAt)} · Downloads {Number(record.downloadCount || 0)}{record.lastDownloadedAt ? ` · Last ${formatSavedDate(record.lastDownloadedAt)}` : ""}</small>
              </div>
              <div><button type="button" onClick={() => openDocument(record)}>Open</button>{session?.role === "Super Admin" && <button className="delete" type="button" onClick={() => deleteDocument(record)}>Delete</button>}</div>
            </article>
          ))}
        </section>
      </div>
    </section>
    {pdfPreviewUrl && (
      <div className="letter-pdf-preview-overlay" role="dialog" aria-modal="true" aria-label="Final PDF preview">
        <section className="letter-pdf-preview-modal">
          <header>
            <div><strong>Final print preview</strong><span>{pdfPreviewPages} A4 page{pdfPreviewPages === 1 ? "" : "s"} · This is exactly what will download</span></div>
            <button type="button" onClick={closePdfPreview} aria-label="Close PDF preview">×</button>
          </header>
          <iframe src={pdfPreviewUrl} title="Primeserve final PDF preview" />
          <footer>
            <button type="button" onClick={closePdfPreview}>Back to editor</button>
            <button type="button" onClick={() => {
              const pdf = previewPdfRef.current;
              if (!pdf) return;
              pdf.autoPrint();
              window.open(pdf.output("bloburl"), "_blank", "noopener,noreferrer");
            }}>Print</button>
            <button className="download" type="button" onClick={confirmPdfDownload}>Download this PDF</button>
          </footer>
        </section>
      </div>
    )}
    </>
  );
}
