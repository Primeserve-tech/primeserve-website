function DSCIcon({ size = "md", className = "" }) {
  return (
    <span className={`dsc-icon dsc-icon-${size} ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 64 64" focusable="false">
        <path className="dsc-icon-document" d="M14 6h25l11 11v39H14z" />
        <path className="dsc-icon-fold" d="M39 6v12h11" />
        <path className="dsc-icon-line" d="M22 26h18M22 33h13" />
        <path className="dsc-icon-signature" d="M20 45c5-8 7 5 12-2 4-5 5 3 12-2" />
        <path className="dsc-icon-shield" d="M43 35l10 4v8c0 6-4 10-10 12-6-2-10-6-10-12v-8z" />
        <path className="dsc-icon-check" d="m38 47 3 3 6-7" />
      </svg>
    </span>
  );
}

export default DSCIcon;
