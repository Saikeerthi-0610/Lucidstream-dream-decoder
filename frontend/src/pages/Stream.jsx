import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Users,
  History,
  Info,
  NotebookPen,
  Settings
} from "lucide-react";
import "../styles/stream.css";

const cards = [
  { icon: Brain, title: "Decode Dreams 🧠", desc: "Upload EEG signals and discover what your brain was doing last night.", to: "/decode", accent: "accent-purple" },
  { icon: Users, title: "Dream Community 🌐", desc: "Share stories and read the adventures of other explorers.", to: "/community", accent: "accent-blue" },
  { icon: History, title: "Analysis History ⏱️", desc: "Track brainwave patterns over time and see how sleep evolves.", to: "/history", accent: "accent-indigo" },
  { icon: Info, title: "Expert Insights 🔬", desc: "Read about neuroscience, sleep hygiene, and lucid dreaming.", to: "/expert-insights", accent: "accent-pink" },
  { icon: NotebookPen, title: "Dream Journal 📓", desc: "Log traditional dream memories alongside biometric data.", to: "/dream-journal", accent: "accent-violet" },
  { icon: Settings, title: "Account Settings ⚙️", desc: "Manage profile, privacy, and connected EEG devices.", to: "/account-settings", accent: "accent-teal" }
];

export default function Stream() {
  const navigate = useNavigate();
  const MotionDiv = motion.div;
  
  return (
    <section className="stream-page">
      {/* Neural Network Background */}
      <div className="neural-lines">
        <div className="neural-line"></div>
        <div className="neural-line"></div>
        <div className="neural-line"></div>
      </div>
      <div className="neural-nodes">
        <div className="neural-node"></div>
        <div className="neural-node"></div>
        <div className="neural-node"></div>
        <div className="neural-node"></div>
        <div className="neural-node"></div>
        <div className="neural-node"></div>
      </div>

      <div className="stream-hero">
        <div className="stream-kicker">Welcome back, Dreamer ✨</div>
        <h1 className="stream-title">
          Your subconscious is ready for its next exploration.
        </h1>
        <p className="stream-subtitle">
          Navigate your tools, pick up where you left off, or start a new journey.
        </p>
      </div>

      <MotionDiv
        className="card-grid"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
          }
        }}
      >
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.title}
              className={`stream-card ${c.accent}`}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => navigate(c.to)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-icon">
                <Icon size={22} />
              </div>
              <div className="card-content">
                <div className="card-title">{c.title}</div>
                <div className="card-desc">{c.desc}</div>
              </div>
            </motion.div>
          );
        })}
      </MotionDiv>

      <MotionDiv
        className="resume-banner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="resume-text">
          <div className="resume-title">Continue your current stream</div>
          <div className="resume-desc">A session from 3 hours ago is ready for final decoding.</div>
        </div>
        <button className="resume-btn" onClick={() => navigate('/decode')}>Resume Decoding ⚡</button>
      </MotionDiv>
    </section>
  );
}
