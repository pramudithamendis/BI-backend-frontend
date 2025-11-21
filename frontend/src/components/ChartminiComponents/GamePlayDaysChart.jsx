import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function GamePlayDaysChart({ data }) {
  return (
    <div style={{ marginBottom: 50 }}>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="_x" tick={{ fill: "white" }} />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip />
          <Line type="monotone" dataKey="_y" stroke="#34d399" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
