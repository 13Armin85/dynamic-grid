"use client";

import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
  ColumnDefinition,
  SortConfig,
  FilterConfig,
} from "@/types/data-grid.types";
import { DraggableColumnHeader } from "./DraggableColumnHeader";

interface DataGridHeaderProps<T> {
  columns: ColumnDefinition<T>[];
  sort: SortConfig;
  filters: FilterConfig;
  onSort: (key: string) => void;
  onFilter: (key: string, value: string | boolean | null) => void;
  hasActions: boolean;
  enableDragDrop: boolean;
  onReorderColumns: (fromIndex: number, toIndex: number) => void;
}

export function DataGridHeader<T>({
  columns,
  sort,
  filters,
  onSort,
  onFilter,
  hasActions,
  enableDragDrop,
  onReorderColumns,
}: DataGridHeaderProps<T>) {
  return (
    <thead>
      <tr>
        {columns.map((column, index) =>
          enableDragDrop ? (
            <DraggableColumnHeader
              key={column.key}
              column={column}
              index={index}
              sort={sort}
              onSort={onSort}
              onReorder={onReorderColumns}
            />
          ) : (
            <th key={column.key} style={{ width: column.width }}>
              <div className="th-content">
                <span>{column.label}</span>
                {column.sortable && (
                  <button
                    className="sort-btn"
                    onClick={() => onSort(column.key)}
                  >
                    {sort.key === column.key && sort.direction === "asc" && (
                      <ArrowUp size={16} />
                    )}
                    {sort.key === column.key && sort.direction === "desc" && (
                      <ArrowDown size={16} />
                    )}
                    {sort.key !== column.key && (
                      <ArrowUpDown size={16} className="inactive" />
                    )}
                  </button>
                )}
              </div>
            </th>
          ),
        )}
        {hasActions && <th style={{ width: "140px" }}>Actions</th>}
      </tr>

      <tr className="filter-row">
        {columns.map((column) => (
          <th key={`filter-${column.key}`}>
            {column.filterable && column.filterType === "text" && (
              <input
                type="text"
                className="filter-input"
                placeholder="Filter..."
                value={(filters[column.key] as string) || ""}
                onChange={(e) => onFilter(column.key, e.target.value)}
              />
            )}

            {column.filterable && column.filterType === "select" && (
              <select
                className="filter-input"
                value={(filters[column.key] as string) || ""}
                onChange={(e) => onFilter(column.key, e.target.value)}
              >
                <option value="">All</option>
                {column.filterOptions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {column.filterable && column.filterType === "boolean" && (
              <select
                className="filter-input"
                value={
                  filters[column.key] === null ||
                  filters[column.key] === undefined
                    ? ""
                    : String(filters[column.key])
                }
                onChange={(e) =>
                  onFilter(
                    column.key,
                    e.target.value === "" ? null : e.target.value === "true",
                  )
                }
              >
                <option value="">All</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            )}
          </th>
        ))}
        {hasActions && <th />}
      </tr>
    </thead>
  );
}
