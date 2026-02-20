import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchStories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/stories/");
      setStories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch stories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleShare = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      author: form.get("author"),
      title: form.get("title"),
      content: form.get("content"),
    };

    try {
      await axios.post("http://127.0.0.1:8000/stories/", payload);
      setShowForm(false);
      fetchStories();
    } catch (err) {
      alert("Failed to submit story");
      console.error(err);
    }
  };

  return (
    <section className="stories">
      <div className="stories-inner">
        <div className="stories-header">
          <h2>Stories</h2>
          <p className="stories-sub">Longer dream narratives shared by the community</p>
          <div style={{ marginTop: 8 }}>
            <button className="primary" onClick={() => setShowForm((s) => !s)}>
              {showForm ? "Close" : "Share your story"}
            </button>
          </div>
        </div>

        {showForm && (
          <form className="story-form" onSubmit={handleShare} style={{ marginBottom: 16 }}>
            <input name="author" placeholder="Your name (optional)" />
            <input name="title" placeholder="Story title" required />
            <textarea name="content" placeholder="Write your dream story here..." required rows={6} />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="primary">Share</button>
              <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        <div className="stories-list">
          {loading ? (
            <p style={{ color: "#cfcfe9" }}>Loading stories…</p>
          ) : stories.length === 0 ? (
            <p style={{ color: "#cfcfe9" }}>No stories yet — be the first to share.</p>
          ) : (
            stories.map((s) => (
              <article className="story-card" key={s.id}>
                <div className="story-meta">
                  <strong className="story-title">{s.title}</strong>
                  <div className="story-author">by {s.author || "Guest"}</div>
                </div>

                <p className="story-excerpt">{s.excerpt}</p>

                <div className="story-actions">
                  <a className="read-more" onClick={() => navigate(`/story/${s.id}`)}>Read more →</a>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
