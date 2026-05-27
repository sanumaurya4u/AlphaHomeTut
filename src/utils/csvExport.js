/**
 * Export data to CSV and trigger download
 * @param {Array<Object>} data - Array of row objects
 * @param {Array<{key: string, label: string}>} columns - Column definitions
 * @param {string} filename - Filename without extension
 */
export function exportToCSV(data, columns, filename = 'export') {
  if (!data || data.length === 0) return;

  const headers = columns.map((col) => col.label);
  const rows = data.map((row) =>
    columns.map((col) => {
      let value = row[col.key];
      if (value == null) value = '';
      // Escape double quotes and wrap in quotes if contains comma, newline, or quote
      value = String(value);
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    })
  );

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
