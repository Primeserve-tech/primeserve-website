import { getCmsData } from "../cmsStore";

export default function LatestUpdatesTicker() {
  const data = getCmsData();

  const announcements = (data.productAnnouncements || [])
    .filter((item) => item.status === "Published" && item.showOnHomepage !== "No")
    .map((item) => ({ category: "Product Announcements", content: item.title }));
  const news = (data.news || [])
    .filter((item) => item.status === "Published" && item.showOnHomepage !== "No")
    .map((item) => ({ category: "News Updates", content: item.title }));
  const apiUpdates = (data.apiUpdates || [])
    .filter((item) => item.status === "Published" && item.showOnHomepage !== "No")
    .map((item) => ({
      category: "API Updates",
      content: [item.productName, item.description].filter(Boolean).join(": "),
    }));
  const hiringUpdates = (data.hiringUpdates || [])
    .filter((item) => item.status === "Published" && item.showOnHomepage !== "No")
    .map((item) => ({
      category: "Hiring Updates",
      content: [item.title, item.description].filter(Boolean).join(": "),
    }));

  const updates = [...announcements, ...news, ...apiUpdates, ...hiringUpdates];
  const displayUpdates = updates.length
    ? updates
    : [{
        category: "Latest Updates",
        content: "New Primeserve services and platform updates will appear here after publishing from Admin CMS.",
      }];

  return (
    <aside className="home-update-ticker" aria-label="Latest updates">
      <strong>
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 13.5v-3l11-4.5v12L4 13.5Z" />
          <path d="M7 14.5 8.5 20h3L10 13.8" />
          <path className="ticker-sound-wave ticker-sound-wave-1" d="M16.5 9.5c.8.9.8 4.1 0 5" />
          <path className="ticker-sound-wave ticker-sound-wave-2" d="M18.5 7.5c1.8 2 1.8 7 0 9" />
          <path className="ticker-sound-wave ticker-sound-wave-3" d="M20.5 5.5c3 3.2 3 9.8 0 13" />
        </svg>
        Latest Updates
      </strong>
      <div>
        <div className="home-update-track">
          {[...displayUpdates, ...displayUpdates].map((update, index) => (
            <span key={`${update.category}-${update.content}-${index}`}>
              <b>{update.category}:</b> {update.content}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
