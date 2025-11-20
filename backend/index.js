// index.js
import express from "express";
const app = express();
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "password", // your MySQL password
  database: "gaming_app_bi",
  port: 3306,
  connectionLimit: 10,
});

import { loadMetricConfig } from "./configLoader.js";

const config = loadMetricConfig();

function buildQuery(block) {
  let columns = block.columns.join(", ");
  let distinct_col = block.distinct_col;

  return `
    SELECT ${columns}
    FROM ${block.table_name}
    ORDER BY ${block.order_by_column} ${block.order_by}
    LIMIT ${block.record_count};
  `;
}

app.get("/api/cards", async (req, res) => {
  try {
    const results = [];
    const { table_name } = req.query;
    console.log(table_name);

    if (table_name == undefined) {
      //means we need all
      for (const card of config.Cards) {
        const sql = buildQuery(card);

        const [rows] = await pool.query(sql);

        results.push({
          metric_name: card.metric_name,
          sql,
          field_names: card.columns,
          data: rows,
        });
      }
    } else {
      //means we need specific table
      for (const card of config.Cards) {
        if (card.table_name == table_name) {
          const sql = buildQuery(card);

          const [rows] = await pool.query(sql);

          results.push({
            metric_name: card.metric_name,
            sql,
            field_names: card.columns,
            data: rows,
          });
        }
      }
    }

    res.json({ status: "success", results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

function buildQuery_cumulative(block) {
  let columns = block.columns.join(", ");
  let distinct_col = block.distinct_col;

  return `
    WITH ranked AS (
      SELECT 
        ${columns},
        ROW_NUMBER() OVER (
          PARTITION BY ${distinct_col}
          ORDER BY ${block.order_by_column} ${block.order_by}
        ) AS rn
      FROM ${block.table_name}
    )
    SELECT ${columns}
    FROM ranked
    WHERE rn = 1
    ORDER BY ${block.order_by_column} ${block.order_by}
    LIMIT ${block.record_count};
  `;
}

app.get("/api/tables", async (req, res) => {
  try {
    const results = [];
    const { table_name } = req.query;
    console.log(table_name);

    if (table_name == undefined) {
      //means we need all
      for (const card of config.Tables) {
        let sql = "";
        if (card.is_cumulative == 1) {
          sql = buildQuery_cumulative(card);
        } else {
          sql = buildQuery(card);
        }
        const [rows] = await pool.query(sql);

        results.push({
          metric_name: card.metric_name,
          sql,
          field_names: card.columns,
          data: rows,
        });
      }
    } else {
      //means we need specific table
      for (const card of config.Tables) {
        if (card.table_name == table_name) {
          let sql = "";
          if (card.is_cumulative == 1) {
            sql = buildQuery_cumulative(card);
          } else {
            sql = buildQuery(card);
          }
          const [rows] = await pool.query(sql);
          results.push({
            metric_name: card.metric_name,
            sql,
            field_names: card.columns,
            data: rows,
          });
        }
      }
    }

    res.json({ status: "success", results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/charts", async (req, res) => {
  try {
    const results = [];
    const { table_name } = req.query;
    console.log(table_name);

    if (table_name == undefined) {
      //means we need all
      for (const card of config.Charts) {
        let sql = "";
        if (card.is_cumulative == 1) {
          sql = buildQuery_cumulative(card);
        } else {
          sql = buildQuery(card);
        }
        const [rows] = await pool.query(sql);

        results.push({
          metric_name: card.metric_name,
          sql,
          field_names: card.columns,
          data: rows,
        });
      }
    } else {
      //means we need specific table
      for (const card of config.Charts) {
        if (card.table_name == table_name) {
          let sql = "";
          if (card.is_cumulative == 1) {
            sql = buildQuery_cumulative(card);
          } else {
            sql = buildQuery(card);
          }
          const [rows] = await pool.query(sql);

          results.push({
            metric_name: card.metric_name,
            chart_type: card.chart_type,
            sql,
            field_names: card.columns,
            data: rows,
          });
        }
      }
    }

    res.json({ status: "success", results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
