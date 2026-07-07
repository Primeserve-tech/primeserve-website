function Stats() {
  const stats = [
    { icon: "bank", number: "250+", title: "APIs", desc: "and Growing" },
    { icon: "users", number: "100+", title: "Businesses Served", desc: "Across India" },
    { icon: "shield", number: "99.99%", title: "Platform Uptime", desc: "High Availability" },
    { icon: "clock", number: "24x7", title: "Enterprise Support", desc: "Always Available" },
    { icon: "lock", number: "Enterprise-Grade", title: "Security", desc: "Data Protection" },
  ];

  return (
    <section className="stats-wrap" aria-label="PrimeServe highlights">
      <div className="stats-card">
        {stats.map((item) => (
          <article className="stat-item" key={item.number}>
            <div className={`stat-icon ${item.icon}`} />
            <div>
              <strong>{item.number}</strong>
              <span>{item.title}</span>
              <p>{item.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Stats;
