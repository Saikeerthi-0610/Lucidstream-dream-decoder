export default function ResultCard({ result }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Result</h3>
      <p>Dream: <b>{result.dream}</b></p>
      <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
    </div>
  );
}
