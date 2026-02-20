import { useEffect, useState } from "react";
import axios from "axios";
import "./BackendHealth.css";

export default function BackendHealth({ interval = 10000 }) {
  const [status, setStatus] = useState({ status: "unknown", db: false, model: false });

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/health/");
        if (mounted) setStatus(res.data);
      } catch {
        if (mounted) setStatus({ status: "down", db: false, model: false });
      }
    };

    check();
    const id = setInterval(check, interval);
    return () => { mounted = false; clearInterval(id); };
  }, [interval]);

  const color = status.status === "ok" ? "#2ecc71" : (status.status === "degraded" ? "#f39c12" : "#e74c3c");

  return (
    <div className="backend-health" aria-hidden={status.status === 'ok' ? 'true' : 'false'}>
      <span className="dot" style={{ background: color }} />
      {/* optional small details on hover (no explicit status text shown) */}
      <div className="details">
        <div>DB: {status.db ? "OK" : "NO"}</div>
        <div>Model: {status.model ? "OK" : "NO"}</div>
      </div>
    </div>
  );
}
