const fs = require("fs");
const csv = require("csv-parser");

function transformData(data) {
  const strategies = Object.keys(Object.values(data)[0] || {});

  return strategies.map((strategy) => {
    const row = { Strategy: strategy };

    for (const metric in data) {
      const value = data[metric][strategy];
      row[metric] = value.endsWith("%")
        ? parseFloat(value.replace("%", ""))
        : parseFloat(value);
    }

    return row;
  });
}

function filterRawData(data, selectedMetrics) {
  if (!selectedMetrics?.length) return data;

  return Object.fromEntries(
    Object.entries(data).filter(([metric]) =>
      selectedMetrics.includes(metric)
    )
  );
}

function readCSV(file) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (row) => {
        const newRow = { date: new Date(row.datetime) };
        Object.keys(row).forEach(key => {
          if (key !== "datetime") {
            const value = parseFloat(row[key]);
            newRow[key] = isNaN(value) ? 0 : value;
          }
        });
        results.push(newRow);
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

module.exports = { transformData, filterRawData, readCSV };
