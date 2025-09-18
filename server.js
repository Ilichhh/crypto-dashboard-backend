const express = require("express");
const cors = require("cors");
const fs = require("fs");

const { transformData, filterRawData, readCSV } = require("./utils/dataUtils");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/api/metrics", async (req, res) => {
  try {
    const rawData = await fs.promises.readFile("./data.json", "utf-8");
    const data = JSON.parse(rawData);

    let selectedMetrics = req.query.metrics;
    if (selectedMetrics && !Array.isArray(selectedMetrics)) {
      selectedMetrics = [selectedMetrics];
    }

    const filteredData = filterRawData(data, selectedMetrics);
    const transformedData = transformData(filteredData);

    res.status(200).json(transformedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read JSON file" });
  }
});

app.get("/api/metrics/schema", async (req, res) => {
  try {
    const rawData = await fs.promises.readFile("./metrics-schema.json", "utf-8");
    const data = JSON.parse(rawData);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read JSON file" });
  }
});

app.get("/api/daily-returns", async (req, res) => {
  try {
    const data = await readCSV("daily-returns.csv");
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read CSV file" });
  }
});

app.get("/health", (req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
