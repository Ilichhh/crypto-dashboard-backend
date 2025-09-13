const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/api/metrics", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(raw);
    res.status(200).json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read JSON file" });
  }
});

app.get("/health", (req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
