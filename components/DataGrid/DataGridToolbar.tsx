"use client";

import React, { useState } from "react";
import { Download, Settings, RefreshCw } from "lucide-react";
import { ColumnDefinition } from "@/types/data-grid.types";

interface DataGridToolbarProps {
  enableExport: boolean;
  enableColumnToggle: boolean;
  columns: ColumnDefinition[];
  onExportCSV: () => void;
  onExportExcel: () => void;
  onToggleColumn: (key: string) => void;
  onRefresh: () => void;
}

export function DataGridToolbar({
  enableExport,
  enableColumnToggle,
  columns,
  onExportCSV,
  onExportExcel,
  onToggleColumn,
  onRefresh,
}: DataGridToolbarProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  return (
    <div className="data-grid-toolbar">
      <div className="toolbar-actions">
        <button className="toolbar-btn" onClick={onRefresh} title="Refresh">
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>

        {enableExport && (
          <div className="toolbar-dropdown">
            <button
              className="toolbar-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download size={18} />
              <span>Export</span>
            </button>
            {showExportMenu && (
              <div className="dropdown-menu">
                <button
                  onClick={() => {
                    onExportCSV();
                    setShowExportMenu(false);
                  }}
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => {
                    onExportExcel();
                    setShowExportMenu(false);
                  }}
                >
                  Export as Excel
                </button>
              </div>
            )}
          </div>
        )}

        {enableColumnToggle && (
          <div className="toolbar-dropdown">
            <button
              className="toolbar-btn"
              onClick={() => setShowColumnMenu(!showColumnMenu)}
            >
              <Settings size={18} />
              <span>Columns</span>
            </button>
            {showColumnMenu && (
              <div className="dropdown-menu column-menu">
                {columns.map((col) => (
                  <label key={col.key} className="column-toggle">
                    <input
                      type="checkbox"
                      checked={col.visible !== false}
                      onChange={() => onToggleColumn(col.key)}
                    />
                    <span>{col.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
