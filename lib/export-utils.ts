export class ExportUtils {
  static exportToCSV<T extends Record<string, any>>(
    data: T[],
    columns: Array<{ key: string; label: string }>,
    filename: string = "export.csv",
  ): void {
    const headers = columns.map((col) => col.label).join(",");
    const rows = data.map((row) =>
      columns
        .map((col) => {
          const value = row[col.key];
          const stringValue = value?.toString() || "";
          return stringValue.includes(",") ? `"${stringValue}"` : stringValue;
        })
        .join(","),
    );

    const csv = [headers, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  static exportToExcel<T extends Record<string, any>>(
    data: T[],
    columns: Array<{ key: string; label: string }>,
    filename: string = "export.xlsx",
  ): void {
    const headers = columns
      .map((col) => `<Cell><Data ss:Type="String">${col.label}</Data></Cell>`)
      .join("");
    const rows = data
      .map(
        (row) =>
          `<Row>${columns
            .map((col) => {
              const value = row[col.key];
              return `<Cell><Data ss:Type="String">${value || ""}</Data></Cell>`;
            })
            .join("")}</Row>`,
      )
      .join("");

    const xml = `<?xml version="1.0"?>
      <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">
        <Worksheet ss:Name="Sheet1">
          <Table>
            <Row>${headers}</Row>
            ${rows}
          </Table>
        </Worksheet>
      </Workbook>`;

    const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}
