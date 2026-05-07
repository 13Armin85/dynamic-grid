"use client";

import React from "react";
import { DataGrid } from "@/components/DataGrid/DataGrid";
import { ApiClient } from "@/lib/api-client";
import {
  ColumnDefinition,
  FetchDataParams,
  FetchDataResponse,
} from "@/types/data-grid.types";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: string;
  active: boolean;
  department: string;
}

const columns: ColumnDefinition<User>[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    width: "80px",
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
    filterable: true,
    filterType: "text",
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    filterable: true,
    filterType: "text",
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
    width: "100px",
  },
  {
    key: "role",
    label: "Role",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: [
      { label: "Developer", value: "Developer" },
      { label: "Designer", value: "Designer" },
      { label: "Manager", value: "Manager" },
    ],
  },
  {
    key: "department",
    label: "Department",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: [
      { label: "Engineering", value: "Engineering" },
      { label: "Design", value: "Design" },
      { label: "Management", value: "Management" },
    ],
  },
  {
    key: "active",
    label: "Status",
    sortable: true,
    filterable: true,
    filterType: "boolean",
    render: (value) => (
      <span
        className={`status-badge ${value ? "status-active" : "status-inactive"}`}
      >
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

async function fetchUsers(
  params: FetchDataParams,
): Promise<FetchDataResponse<User>> {
  return ApiClient.fetchData<User>("users", params);
}

export default function HomePage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <h1>dynamic grid</h1>
      </div>

      <DataGrid<User>
        columns={columns}
        fetchData={fetchUsers}
        pageSize={5}
        enableExport={true}
        enableColumnToggle={true}
        enableDragDrop={true}
        actions={(row) => (
          <>
            <button
              className="action-btn"
              onClick={() => alert(`Viewing ${row.name}`)}
            >
              View
            </button>
            <button
              className="action-btn"
              onClick={() => alert(`Editing ${row.name}`)}
            >
              Edit
            </button>
          </>
        )}
      />
    </main>
  );
}
