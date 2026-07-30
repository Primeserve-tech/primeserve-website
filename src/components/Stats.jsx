import { useEffect, useRef, useState } from "react";

function AnimatedStat({ target, decimals = 0, suffix = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let frame;
    let wasVisible = false;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || wasVisible) return;
      wasVisible = true;
      const started = performance.now();
      const duration = 1500;
      const tick = (now) => {
        const progress = Math.min((now - started) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setValue(target * eased);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.35 });

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return <strong ref={ref}>{value.toFixed(decimals)}{suffix}</strong>;
}

function Stats() {
  const stats = [
    { icon: "bank", target: 250, suffix: "+", title: "APIs", desc: "and Growing" },
    { icon: "users", target: 100, suffix: "+", title: "Businesses Served", desc: "Across India" },
    { icon: "shield", target: 99.99, decimals: 2, suffix: "%", title: "Platform Uptime", desc: "High Availability" },
    { icon: "clock", target: 24, suffix: "x7", title: "Enterprise Support", desc: "Always Available" },
    { icon: "lock", label: "Enterprise-Grade", title: "Security", desc: "Data Protection" },
  ];

  return (
    <section className="stats-wrap" aria-label="Primeserve highlights">
      <div className="stats-card">
        {stats.map((item) => (
          <article className="stat-item" key={item.title}>
            <div className={`stat-icon ${item.icon}`} />
            <div>
              {item.label
                ? <strong>{item.label}</strong>
                : <AnimatedStat target={item.target} decimals={item.decimals} suffix={item.suffix} />}
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
