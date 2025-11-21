import { useEffect, useState } from "react";
import axios from "axios";
import WalletBalanceChart from "./ChartminiComponents/WalletBalanceChart";
import GamePlayDaysChart from "./ChartminiComponents/GamePlayDaysChart";
import CommissionChart from "./ChartminiComponents/CommissionChart";

export default function Charts() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTables() {
      try {
        const res = await axios.get("http://localhost:3000/api/charts");
        setTables(res.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTables();
  }, []);

  if (loading) return <h1 style={{ color: "white" }}>Loading charts...</h1>;

  return (
    <div
      style={{
        padding: "30px",
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>📊 Analytics Dashboard</h1>

      {/* 🔥 LOOP THROUGH ALL TABLES AND RENDER THE CORRECT CHART */}
      {tables.map((table, index) => {
        const type = table.chart_type;
        const data = table.data ?? [];

        if (type === "bar_chart") {
          return <WalletBalanceChart key={index} data={data} />;
        }

        if (type === "line_chart") {
          return <GamePlayDaysChart key={index} data={data} />;
        }

        return null; // fallback
      })}
    </div>
  );
}
