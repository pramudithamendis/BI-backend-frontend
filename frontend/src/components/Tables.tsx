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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Gameon BI Metrics Dashboard</h1>

      <div className="space-y-6">
        {tables.map((metric, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            {/* Metric Title */}
            <h2 className="text-xl font-semibold text-blue-400 mb-4">{metric.metric_name[0]}</h2>

            {/* Toggle SQL */}
            <button onClick={() => toggleSQL(index)} className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
              {expanded[index] ? "Hide SQL" : "Show SQL"}
            </button>

            {/* SQL Preview */}
            {expanded[index] && <pre className="bg-black/40 p-4 text-sm rounded-lg whitespace-pre-wrap overflow-x-auto mb-4">{metric.sql}</pre>}

            {/* Dynamic Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700">
                    {metric.field_names.map((field) => (
                      <th key={field} className="px-4 py-2 border border-gray-600 text-left">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {metric.data.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-700/40">
                      {metric.field_names.map((field) => (
                        <td key={field} className="px-4 py-2 border border-gray-700">
                          {String(row[field] ?? "")}
                        </td>
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
