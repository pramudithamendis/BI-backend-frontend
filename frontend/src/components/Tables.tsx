import { useEffect, useState } from "react";

interface MetricResult {
  metric_name: string[];
  sql: string;
  field_names: string[];
  data: Record<string, any>[];
}

export default function App() {
  const [tables, setTables] = useState<MetricResult[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("http://localhost:3000/api/tables");
        const json = await res.json();
        setTables(json.results || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    }

    loadData();
  }, []);

  const toggleSQL = (index: number) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div>
      <h1>Gameon BI Metrics Dashboard</h1>

      <div>
        {tables.map((metric, index) => (
          <div key={index}>
            {/* Metric Title */}
            <h2>{metric.metric_name[0]}</h2>

            {/* Toggle SQL */}
            {/* <button onClick={() => toggleSQL(index)} className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
              {expanded[index] ? "Hide SQL" : "Show SQL"}
            </button> */}

            {/* SQL Preview */}
            {expanded[index] && <pre>{metric.sql}</pre>}

            {/* Dynamic Table */}
            <div>
              <table>
                <thead>
                  <tr>
                    {metric.field_names.map((field) => (
                      <th key={field}>{field}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {metric.data.map((row, i) => (
                    <tr key={i}>
                      {metric.field_names.map((field) => (
                        <td key={field}>{String(row[field] ?? "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
