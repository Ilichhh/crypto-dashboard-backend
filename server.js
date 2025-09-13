const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

function transformData(data) {
  const strategies = Object.keys(Object.values(data)[0]);

  return strategies.map((strategy) => {
    const row = { strategy };

    for (const metric in data) {
      const value = data[metric][strategy];

      row[metric] = value.endsWith("%")
        ? parseFloat(value.replace("%", ""))
        : parseFloat(value);
    }

    return row;
  });
}

app.get("/api/metrics", (req, res) => {
  try {
    const rawData = fs.readFileSync("./data.json");
    const data = JSON.parse(rawData);
    const transformedData = transformData(data);
    res.status(200).json(transformedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read JSON file" });
  }
});

app.get("/health", (req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
