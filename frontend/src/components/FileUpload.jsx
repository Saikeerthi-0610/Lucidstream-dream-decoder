import { useState } from "react";
import { predictDream } from "../api/api";
import ResultCard from "./ResultCard";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a CSV file first");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await predictDream(file);
      setResult(res.data);
    } catch (err) {
      console.error("Backend error:", err.response?.data || err.message);
      alert(
        err.response?.data?.detail ||
        "Backend error. Check console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && <ResultCard result={result} />}
    </>
  );
}
