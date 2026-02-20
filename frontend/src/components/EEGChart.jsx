import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

export default function EEGChart({ data, onExpand }) {
  const formatted = data.map((row, i) => ({
    index: i,
    value: Number(row.alpha || 0)
  }));

  const MotionDiv = motion.div;

  return (
    <MotionDiv
      className="eeg-chart-wrapper"
      whileHover={{ scale: 1.02 }}
      onClick={onExpand}
    >
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={formatted}>
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip
            contentStyle={{
              background: "rgba(20,20,40,0.9)",
              borderRadius: "10px",
              border: "none",
              color: "#fff"
            }}
            cursor={{ stroke: "#5ee7ff", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#5ee7ff"
            strokeWidth={3}
            dot={false}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </MotionDiv>
  );
}
