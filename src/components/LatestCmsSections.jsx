import { getCmsData } from "../cmsStore";

function LatestCmsSections() {
  const data = getCmsData();
  const latestBlogs = data.blogs.filter((item) => item.status === "Published").slice(0, 3);
  const latestNews = data.news.filter((item) => item.status === "Published").slice(0, 3);
  const latestUpdates = data.apiUpdates.filter((item) => item.status === "Published").slice(0, 3);
  const latestJobs = data.jobs.filter((item) => item.status === "Active").slice(0, 3);

  const sections = [
    {
      title: "Latest Blogs",
      href: "/blog",
      emptyTitle: "No blogs published",
      emptyText: "Published blogs from Admin CMS will appear here.",
      items: latestBlogs.map((item) => ({ title: item.title, text: item.shortDescription, attachment: item.coverImage })),
    },
    {
      title: "News Updates",
      href: "/news",
      emptyTitle: "No news updates",
      emptyText: "Company updates will appear here after publishing.",
      items: latestNews.map((item) => ({ title: item.title, text: item.shortDescription, attachment: item.image })),
    },
    {
      title: "API Updates",
      href: "/updates",
      emptyTitle: "No API updates",
      emptyText: "Release notes and product updates will appear here.",
      items: latestUpdates.map((item) => ({ title: item.productName, text: item.description })),
    },
    {
      title: "Hiring Updates",
      href: "/careers",
      emptyTitle: "No openings currently",
      emptyText: "Active jobs published by HR or Super Admin will appear here.",
      items: latestJobs.map((item) => ({ title: item.title, text: `${item.experience} | ${item.location} | ${item.employmentType}` })),
    },
  ];

  const getCarouselItems = (section) => {
    const { items } = section;
    if (items.length === 0) {
      const emptyItem = { title: section.emptyTitle, text: section.emptyText, isEmpty: true };
      return [emptyItem, emptyItem, emptyItem];
    }
    if (items.length === 1) return [items[0], items[0], items[0]];
    if (items.length === 2) return [...items, items[0]];
    return items;
  };

  return (
    <section className="latest-cms-section">
      <div className="section-heading">
        <span>- PRIME SERVE UPDATES -</span>
        <h2>Latest from our CMS</h2>
        <p>Published blogs, company updates and API release notes are managed from the admin dashboard.</p>
      </div>
      <div className="latest-cms-grid">
        {sections.map((section) => (
          <article key={section.title}>
            <div>
              <h3>{section.title}</h3>
              <a href={section.href}>View All</a>
            </div>
            <div
              className="latest-cms-carousel is-sliding"
              style={{ "--cms-items": Math.max(getCarouselItems(section).length, 1) }}
            >
              <div className="latest-cms-track">
                {[...getCarouselItems(section), ...getCarouselItems(section)].map((item, index) => (
                  <section className={item.isEmpty ? "latest-cms-empty" : ""} key={`${item.title}-${index}`}>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                    {item.attachment && (
                      <a className="latest-cms-file-link" href={item.attachment} target="_blank" rel="noreferrer" download>
                        View / Download
                      </a>
                    )}
                  </section>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LatestCmsSections;
