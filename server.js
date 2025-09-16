const express = require("express");
const cors = require("cors");
const fs = require("fs");

const { transformData, filterRawData } = require("./utils/dataUtils");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/api/metrics", (req, res) => {
  try {
    const rawData = fs.readFileSync("./data.json");
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

app.get("/api/metrics/schema", (req, res) => {
  try {
    const rawData = fs.readFileSync("./metrics-schema.json");
    const data = JSON.parse(rawData);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read JSON file" });
  }
});

app.get("/health", (req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
