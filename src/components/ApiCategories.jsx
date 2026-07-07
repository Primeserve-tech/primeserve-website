function ApiCategories() {
  const categories = [
    "GST",
    "E-Invoice",
    "E-Way Bill",
    "PAN",
    "Aadhaar",
    "Bank",
    "OCR",
    "Business KYC",
  ];

  return (
    <section className="section-shell api-band" id="apis">
      <div>
        <span className="eyebrow">API categories</span>
        <h2>Built for teams that need speed and accuracy</h2>
      </div>

      <div className="api-list">
        {categories.map((category) => (
          <span key={category}>{category}</span>
        ))}
      </div>
    </section>
  );
}

export default ApiCategories;
