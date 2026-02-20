import { useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, Tooltip,
  BarChart, Bar,
  PieChart, Pie, Cell
} from "recharts";
import "./Dashboard.css";

import BackendHealth from "../components/BackendHealth";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);

  const analyzeEEG = async () => {
    if (!file) return alert("Upload EEG CSV file");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/predict",
        form
      );
      setData(res.data);
    } catch {
      alert("Backend error. Check FastAPI.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>🧠 AI Dream Decoder</h1>
        <div className="header-right"><BackendHealth /></div>
      </div>

      <div className="upload-box">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={analyzeEEG}>Analyze</button>
      </div>

      {data && (
        <>
          <div className="result-card">
            <h2>Result</h2>
            <p><b>Dream:</b> {data.dream}</p>
            <p><b>Confidence:</b> {data.confidence}%</p>
          </div>

          {/* EEG WAVEFORM */}
          <section>
            <h3>📈 EEG Waveform</h3>
            <LineChart width={700} height={220}
              data={data.signal.map((v, i) => ({ x: i, y: v }))}>
              <XAxis dataKey="x" />
              <Tooltip />
              <Line dataKey="y" stroke="#4cc9f0" dot={false} />
            </LineChart>
          </section>

          {/* BRAIN BANDS */}
          <section>
            <h3>📊 Brainwave Bands</h3>
            <BarChart width={500} height={250}
              data={Object.keys(data.bands).map(k => ({
                name: k.toUpperCase(),
                value: data.bands[k]
              }))}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" fill="#7b2ff7" />
            </BarChart>
          </section>

          {/* PROBABILITY */}
          <section>
            <h3>🧠 Dream Probabilities</h3>
            <PieChart width={300} height={300}>
              <Pie dataKey="value" outerRadius={100}
                data={Object.keys(data.probabilities).map(k => ({
                  name: k,
                  value: data.probabilities[k]
                }))}>
                {Object.keys(data.probabilities).map((_, i) => (
                  <Cell
                    key={i}
                    fill={["#4cc9f0","#7b2ff7","#ffbe0b","#ff006e"][i]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </section>
        </>
      )}
    </div>
  );
}
