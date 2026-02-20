import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function BandChart({ bands }) {
  // ✅ HARD GUARD
  if (!bands || Object.keys(bands).length === 0) {
    return (
      <div className="chart-placeholder">
        Upload EEG CSV to see band analysis
      </div>
    );
  }

  const data = Object.entries(bands).map(([key, value]) => ({
    name: key.toUpperCase(),
    value
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#c7d2fe" />
        <YAxis stroke="#c7d2fe" />
        <Tooltip
          contentStyle={{
            background: "#0f172a",
            borderRadius: "12px",
            border: "none",
            color: "#fff",
            fontWeight: 600
          }}
        />
        <Bar
          dataKey="value"
          radius={[10, 10, 0, 0]}
          fill="url(#bandGradient)"
        />
        <defs>
          <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
