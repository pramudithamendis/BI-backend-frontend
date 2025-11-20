import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function GamePlayDaysChart({ data }) {
  const formatted = data.map((item) => ({
    date: item.date_.split("T")[0],
    sessions: item.total_sessions,
  }));

  return (
    <div style={{ marginBottom: 50 }}>
      <h2 style={{ marginBottom: 10 }}>🎮 Top Days of Game Plays</h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: "white" }} />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip />
          <Line type="monotone" dataKey="sessions" stroke="#34d399" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
