import { useEffect, useState } from "react";

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

  // Basic date-ish formatting
  if (typeof value === "string" && (value.endsWith("Z") || key.toLowerCase().includes("date") || key.toLowerCase().includes("time"))) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString();
    }
  }

  // Numbers as fixed 2 decimals if they look like money
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && !isNaN(Number(value))) {
    const n = Number(value);
    return n % 1 === 0 ? n : n.toFixed(2);
  }

  return String(value);
}

function UI() {
  const [metrics, setMetrics] = useState<MetricResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/cards");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json: ApiResponse = await res.json();
        setMetrics(json.results || []);
      } catch (err: any) {
        setError(err.message || "Failed to load metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return (
      <div className="app-root">
        <div className="app-container">
          <h1 className="title">Gameon BI Cards</h1>
          <p className="muted">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-root">
        <div className="app-container">
          <h1 className="title">Gameon BI Cards</h1>
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <div className="app-container">
        <header className="header">
          <div>
            <h1 className="title">Gameon BI Cards</h1>
            <p className="subtitle">Auto-generated KPI cards from /api/cards</p>
          </div>
        </header>

        <div className="cards-grid">
          {metrics.map((metric, index) => {
            const title = metric.metric_name[0] || "Metric";
            const subtitle = metric.metric_name.length > 1 ? metric.metric_name.slice(1).join(" • ") : "";

            const firstRow = metric.data[0] || {};

            return (
              <div className="card" key={`${title}-${index}`}>
                <div className="card-header">
                  {/* Metric name */}
                  <h2 className="card-title">{title}</h2>
                  {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
                <div className="card-body">
                  {metric.field_names.length === 0 ? (
                    <p className="muted">No data</p>
                  ) : (
                    <dl className="field-list">
                      {metric.field_names.map((field) => (
                        <div className="field-row" key={field}>
                          <dt className="field-label">{field}</dt> {/* Column name */}
                          <dd className="field-value">{formatValue(field, firstRow[field])}</dd> {/*  values */}
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UI;
