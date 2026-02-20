import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#8b5cf6", "#22d3ee", "#facc15", "#f43f5e"];

export default function DreamPie({ probabilities }) {
  // ✅ HARD GUARD
  if (!probabilities || Object.keys(probabilities).length === 0) {
    return (
      <div className="chart-placeholder">
        Upload EEG CSV to see dream probability
      </div>
    );
  }

  const data = Object.entries(probabilities).map(([key, value]) => ({
    name: key,
    value
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={4}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#020617",
            borderRadius: "12px",
            border: "none",
            color: "#fff",
            fontWeight: 600
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
