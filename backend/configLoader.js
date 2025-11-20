import fs from "fs";
import path from "path";

export function loadMetricConfig() {
  const filePath = path.join(process.cwd(), "config", "metrics.config.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}
