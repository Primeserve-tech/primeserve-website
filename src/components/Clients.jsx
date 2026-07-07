function Clients() {
  const industries = ["Fintech", "Accounting", "Logistics", "SaaS", "Retail"];

  return (
    <section className="section-shell clients" id="product">
      <div className="client-copy">
        <span className="eyebrow">Who we serve</span>
        <h2>Reliable digital infrastructure for growing businesses</h2>
        <p>
          From startups to enterprise teams, PrimeServe supports businesses that
          need secure verification, tax compliance, and automation workflows.
        </p>
      </div>

      <div className="industry-grid">
        {industries.map((industry) => (
          <article key={industry}>
            <span>{industry.slice(0, 2).toUpperCase()}</span>
            <strong>{industry}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Clients;
