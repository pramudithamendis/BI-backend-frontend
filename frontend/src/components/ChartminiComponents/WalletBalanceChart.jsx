import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function WalletBalanceChart({ data }) {
  // const formatted = data.map((item) => ({
  //   name: item.first_name || "Unknown",
  //   total: item.total_balance,
  // }));

  return (
    <div style={{ marginBottom: 50 }}>
      <h2 style={{ marginBottom: 10 }}>💰 Top 50 Wallet Balance Holders</h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={{ fill: "white" }} />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip />
          <Bar dataKey="total" fill="#38bdf8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
