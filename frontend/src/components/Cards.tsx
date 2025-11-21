import { useEffect, useState } from "react";
import "./Cards.css";

interface ApiResponse {
  status: string;
  results: MetricResult[];
}

interface MetricResult {
  metric_name: string[];
  field_names: string[];
  data: Record<string, any>[];
}

function formatValue(key: string, value: any) {
  if (value == null) return "-";

  if (typeof value === "string" && (value.endsWith("Z") || key.toLowerCase().includes("date") || key.toLowerCase().includes("time"))) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d.toLocaleString();
  }

  if (typeof value === "number") return value;

  if (typeof value === "string" && !isNaN(Number(value))) {
    const n = Number(value);
    return n % 1 === 0 ? n : n.toFixed(2);
  }

  return String(value);
}

export default function UI() {
  const [metrics, setMetrics] = useState<MetricResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:3000/api/cards");
        const json: ApiResponse = await res.json();
        setMetrics(json.results || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-root">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="cards-grid">
        {metrics.map((metric, i) => {
          const title = metric.metric_name?.[0] || "Metric";
          const subtitle = metric.metric_name?.slice(1).join(" • ");

          const row = metric.data?.[0] || {};

          return (
            <div className="card" key={i}>
              <div className="card-header">
                <p className="card-title">{title}</p>
                {subtitle && <p className="card-subtitle">{subtitle}</p>}
              </div>

              <div className="card-body">
                {metric.field_names.map((field) => (
                  <div className="field-row" key={field}>
                    <span className="field-label">{field}</span>
                    <span className="field-value">{formatValue(field, row[field])}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
