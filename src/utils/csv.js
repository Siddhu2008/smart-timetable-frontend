export const parseCsv = (text) => {
  if (!text) return [];
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  const pushValue = () => {
    row.push(value.trim());
    value = "";
  };

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === "\"" && next === "\"") {
      value += "\"";
      i += 1;
      continue;
    }

    if (char === "\"") {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      pushValue();
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      pushValue();
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    pushValue();
    if (row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }
  }

  if (rows.length === 0) return [];

  const normalize = (header) => header.toLowerCase().replace(/[^a-z0-9]/g, "");
  const headers = rows[0].map((h) => normalize(h));
  return rows.slice(1).map((cells) => {
    const obj = {};
    headers.forEach((key, idx) => {
      obj[key] = (cells[idx] || "").trim();
    });
    return obj;
  });
};
