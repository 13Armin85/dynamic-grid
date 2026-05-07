"use client";

import React from "react";
import { DataGridState } from "@/types/data-grid.types";

interface DataGridStatesProps {
  state: DataGridState;
  children: React.ReactNode;
  onRetry: () => void;
}

export function DataGridStates({
  state,
  children,
  onRetry,
}: DataGridStatesProps) {
  if (state === "loading") {
    return (
      <div className="grid-state loading-state">
        <div className="loader" />
        <p>Loading data...</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="grid-state error-state">
        <p>Something went wrong while fetching data.</p>
        <button className="retry-btn" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="grid-state empty-state">
        <p>No data found.</p>
      </div>
    );
  }

  return <>{children}</>;
}
