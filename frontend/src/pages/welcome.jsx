import "..styles/welcome.css";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <span className="hero-badge">ADVANCED AI MODEL FOR DREAMS</span>

      <h1 className="hero-title">
        Decode the <span>Language</span> of <br /> Your Dreams
      </h1>

      <p className="hero-subtitle">
        Uncover hidden meanings, track recurring patterns, and gain
        deep psychological insights into your subconscious mind.
      </p>

      <div className="hero-actions">
        <button className="primary-btn" onClick={() => navigate("/login")}>
          Start Decoding →
        </button>
        <button className="secondary-btn">
          View Recent Dreams
        </button>
      </div>
    </section>
  );
}
