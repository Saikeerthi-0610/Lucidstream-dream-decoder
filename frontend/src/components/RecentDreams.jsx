import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const SAMPLE_DREAMS = [
  {
    id: 1,
    name: "Maya",
    time: "a few minutes ago",
    excerpt: "I kept returning to a warm kitchen where a table was set for a celebration I couldn't remember.",
    analysis:
      "Reflection: A recurring domestic scene can point to unresolved feelings around family or comfort—perhaps it's time to revisit an old memory with kindness."
  },
  {
    id: 2,
    name: "Owen",
    time: "30 minutes ago",
    excerpt: "I walked down a long hallway of doors; each one had a different landscape beyond it.",
    analysis:
      "Reflection: Doorways often symbolize choices—your subconscious may be presenting new paths or possible directions to consider."
  },
  {
    id: 3,
    name: "Noor",
    time: "an hour ago",
    excerpt: "I was reunited with someone I haven't spoken to in years and we sat together on a quiet pier.",
    analysis:
      "Reflection: Reunion dreams can reflect healing or the desire to reconnect; it may be helpful to think what that person represents to you now."
  },
  {
    id: 4,
    name: "Ethan",
    time: "2 hours ago",
    excerpt: "I found a small, hidden room filled with old maps and a single glowing compass.",
    analysis:
      "Reflection: Discovering maps and a compass may suggest you're searching for direction or clarity—trust small signs when making decisions."
  },
  {
    id: 5,
    name: "Rina",
    time: "yesterday",
    excerpt: "I was dancing quickly but my feet never quite touched the ground.",
    analysis:
      "Reflection: A floating dance could mean excitement mixed with uncertainty—you're embracing change while needing gentle grounding."
  }
];

export default function RecentDreams() {
  const [dreams, setDreams] = useState(SAMPLE_DREAMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/history/")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            name: item.user || "Guest",
            time: "recent",
            excerpt: item.dream || "Dream entry",
            analysis: `Reflection: Model predicted "${item.dream}" with confidence ${(item.confidence * 100).toFixed(1)}%.`
          }));

          setDreams(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch recent dreams:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="recent-dreams">
      <div className="recent-inner">
        <div className="recent-header">
          <div>
            <h2>Recent Dreams</h2>
            <p className="recent-sub">Explore fresh dream insights from the community</p>
          </div>

          <div className="recent-link">
            <a href="/history">View all →</a>
          </div>
        </div>

        <div className="dream-list">
          {loading ? (
            <p style={{ color: "#cfcfe9" }}>Loading recent stories…</p>
          ) : (
            dreams.map((d) => (
              <article className="dream-card" key={d.id}>
                <div className="dream-left">
                  <div className="dream-avatar">{d.name ? d.name[0] : "G"}</div>
                  <div className="dream-meta">
                    <strong>{d.name || "Guest"}</strong>
                    <div className="dream-time">{d.time}</div>
                  </div>
                </div>

                <div className="dream-body">
                  <blockquote className="dream-excerpt">“{d.excerpt}”</blockquote>
                  <div className="dream-analysis">{d.analysis}</div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
