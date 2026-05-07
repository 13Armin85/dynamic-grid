"use client";

import { useState, useCallback } from "react";
import { ColumnDefinition } from "@/types/data-grid.types";

export function useColumnManager<T>(initialColumns: ColumnDefinition<T>[]) {
  const [columns, setColumns] = useState<ColumnDefinition<T>[]>(
    initialColumns.map((col) => ({ ...col, visible: col.visible !== false })),
  );

  const toggleColumnVisibility = useCallback((key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  }, []);

  const reorderColumns = useCallback((fromIndex: number, toIndex: number) => {
    setColumns((prev) => {
      const newColumns = [...prev];
      const [removed] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, removed);
      return newColumns;
    });
  }, []);

  const visibleColumns = columns.filter((col) => col.visible !== false);

  return {
    columns,
    visibleColumns,
    toggleColumnVisibility,
    reorderColumns,
  };
}
