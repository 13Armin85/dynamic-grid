"use client";

import React from "react";
import {
  ColumnDefinition,
  SortConfig,
  FilterConfig,
} from "@/types/data-grid.types";
import { DataGridHeader } from "./DataGridHeader";
import { DataGridRow } from "./DataGridRow";

interface DataGridTableProps<T> {
  columns: ColumnDefinition<T>[];
  data: T[];
  sort: SortConfig;
  filters: FilterConfig;
  onSort: (key: string) => void;
  onFilter: (key: string, value: string | boolean | null) => void;
  actions?: (row: T) => React.ReactNode;
  rowKey: string;
  enableDragDrop: boolean;
  onReorderColumns: (fromIndex: number, toIndex: number) => void;
}

export function DataGridTable<T extends Record<string, any>>({
  columns,
  data,
  sort,
  filters,
  onSort,
  onFilter,
  actions,
  rowKey,
  enableDragDrop,
  onReorderColumns,
}: DataGridTableProps<T>) {
  return (
    <table className="data-grid-table">
      <DataGridHeader
        columns={columns}
        sort={sort}
        filters={filters}
        onSort={onSort}
        onFilter={onFilter}
        hasActions={!!actions}
        enableDragDrop={enableDragDrop}
        onReorderColumns={onReorderColumns}
      />
      <tbody>
        {data.map((row, index) => (
          <DataGridRow
            key={row[rowKey] || index}
            row={row}
            columns={columns}
            actions={actions}
          />
        ))}
      </tbody>
    </table>
  );
}
