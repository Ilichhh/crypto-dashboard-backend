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

module.exports = { transformData, filterRawData };
