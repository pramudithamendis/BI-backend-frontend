import { useEffect, useState } from "react";
import axios from "axios";
import WalletBalanceChart from "./miniComponents/WalletBalanceChart";
import GamePlayDaysChart from "./miniComponents/GamePlayDaysChart";
import CommissionChart from "./miniComponents/CommissionChart";

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

  const walletData = tables[0]?.data ?? [];
  const gamePlayDays = tables[1]?.data ?? [];
  const commissions = tables[2]?.data ?? [];

  return (
    <div style={{ padding: "30px", background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>📊 Analytics Dashboard</h1>

      <WalletBalanceChart data={walletData} />
      <GamePlayDaysChart data={gamePlayDays} />
      <CommissionChart data={commissions} />
    </div>
  );
}
