import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function CommissionChart({ data }) {
  const formatted = data.map((item) => ({
    date: item.date_.split("T")[0],
    keep: Number(item.remainder_you_keep_32pct),
  }));

  return (
    <div style={{ marginBottom: 50 }}>
      <h2 style={{ marginBottom: 10 }}>💼 Top Game Play Commissions</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: "white" }} />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip />
          <Bar dataKey="keep" fill="#f472b6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
