"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DataGridProps } from "@/types/data-grid.types";
import { useDataGrid } from "@/hooks/useDataGrid";
import { useColumnManager } from "@/hooks/useColumnManager";
import { DataGridTable } from "./DataGridTable";
import { DataGridPagination } from "./DataGridPagination";
import { DataGridToolbar } from "./DataGridToolbar";
import { DataGridStates } from "./DataGridStates";
import { ExportUtils } from "@/lib/export-utils";
import "./DataGrid.css";

export function DataGrid<T extends Record<string, any>>({
  columns: initialColumns,
  fetchData,
  pageSize = 10,
  enableExport = true,
  enableColumnToggle = true,
  enableDragDrop = true,
  actions,
  rowKey = "id",
}: DataGridProps<T>) {
  const {
    data,
    state,
    pagination,
    sort,
    filters,
    handlePageChange,
    handleSort,
    handleFilter,
    handleRefresh,
  } = useDataGrid<T>({ fetchData, pageSize });

  const { columns, visibleColumns, toggleColumnVisibility, reorderColumns } =
    useColumnManager<T>(initialColumns);

  const handleExportCSV = () => {
    ExportUtils.exportToCSV(
      data,
      visibleColumns.map((col) => ({ key: col.key, label: col.label })),
      "data-export.csv",
    );
  };

  const handleExportExcel = () => {
    ExportUtils.exportToExcel(
      data,
      visibleColumns.map((col) => ({ key: col.key, label: col.label })),
      "data-export.xlsx",
    );
  };

  const content = (
    <div className="data-grid-container">
      <DataGridToolbar
        enableExport={enableExport}
        enableColumnToggle={enableColumnToggle}
        columns={columns}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        onToggleColumn={toggleColumnVisibility}
        onRefresh={handleRefresh}
      />

      <DataGridStates state={state} onRetry={handleRefresh}>
        <div className="data-grid-wrapper">
          <DataGridTable
            columns={visibleColumns}
            data={data}
            sort={sort}
            filters={filters}
            onSort={handleSort}
            onFilter={handleFilter}
            actions={actions}
            rowKey={rowKey}
            enableDragDrop={enableDragDrop}
            onReorderColumns={reorderColumns}
          />
        </div>

        <DataGridPagination
          currentPage={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={handlePageChange}
        />
      </DataGridStates>
    </div>
  );

  return enableDragDrop ? (
    <DndProvider backend={HTML5Backend}>{content}</DndProvider>
  ) : (
    content
  );
}
