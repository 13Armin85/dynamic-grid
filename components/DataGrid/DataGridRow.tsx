"use client";

import React from "react";
import { ColumnDefinition } from "@/types/data-grid.types";

interface DataGridRowProps<T> {
  row: T;
  columns: ColumnDefinition<T>[];
  actions?: (row: T) => React.ReactNode;
}

export function DataGridRow<T extends Record<string, any>>({
  row,
  columns,
  actions,
}: DataGridRowProps<T>) {
  return (
    <tr className="data-row">
      {columns.map((column) => (
        <td key={column.key}>
          {column.render
            ? column.render(row[column.key], row)
            : String(row[column.key] ?? "")}
        </td>
      ))}
      {actions && <td className="actions-cell">{actions(row)}</td>}
    </tr>
  );
}
