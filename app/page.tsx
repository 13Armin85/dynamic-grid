"use client";

import React, { useCallback, useEffect, useState } from "react";
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

const LOCAL_STORAGE_KEY = "users";

export default function HomePage() {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [gridKey, setGridKey] = useState(0);

  // بار اول: اگر localStorage داده داشت، لود کن
  useEffect(() => {
    const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (storedUsers) {
      try {
        const parsedUsers: User[] = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error("خطا در خواندن localStorage:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, []);

  const saveUsersToLocalStorage = (updatedUsers: User[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const applyFilters = (data: User[], params: FetchDataParams) => {
    let filteredData = [...data];

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;

        filteredData = filteredData.filter((item) => {
          const itemValue = item[key as keyof User];

          if (typeof itemValue === "string") {
            return itemValue
              .toLowerCase()
              .includes(String(value).toLowerCase());
          }

          if (typeof itemValue === "boolean") {
            return String(itemValue) === String(value);
          }

          return String(itemValue) === String(value);
        });
      });
    }

    return filteredData;
  };

  const applySorting = (data: User[], params: FetchDataParams) => {
    const sortedData = [...data];

    if (params.sortBy && params.sortOrder) {
      sortedData.sort((a, b) => {
        const aValue = a[params.sortBy as keyof User];
        const bValue = b[params.sortBy as keyof User];

        if (aValue < bValue) return params.sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return params.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortedData;
  };

  const fetchUsers = useCallback(
    async (params: FetchDataParams): Promise<FetchDataResponse<User>> => {
      let sourceData = users;

      // اگر هنوز داخل state داده نداریم، اول localStorage را چک کن
      if (sourceData.length === 0) {
        const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (storedUsers) {
          try {
            sourceData = JSON.parse(storedUsers);
            setUsers(sourceData);
          } catch (error) {
            console.error("خطا در parse کردن localStorage:", error);
          }
        }
      }

      // اگر هنوز هم داده‌ای نبود، از API بگیر
      if (sourceData.length === 0) {
        const apiResponse = await ApiClient.fetchData<User>("users", params);

        // فرض بر این است که apiResponse.data کل داده‌ها را دارد
        // اگر API شما server-side pagination واقعی دارد، باید ساختار را کمی متفاوت کنیم
        sourceData = apiResponse.data;
        saveUsersToLocalStorage(sourceData);

        // بعد فیلتر/سورت/پیجینیشن را روی همین داده محلی انجام بده
      }

      let processedData = [...sourceData];

      processedData = applyFilters(processedData, params);
      processedData = applySorting(processedData, params);

      const page = params.page || 1;
      const pageSize = params.pageSize || 5;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      const paginatedData = processedData.slice(start, end);

      return {
        data: paginatedData,
        total: processedData.length,
      };
    },
    [users],
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUsers = users.map((user) =>
      user.id === editingUser.id ? editingUser : user,
    );

    saveUsersToLocalStorage(updatedUsers);
    setEditingUser(null);

    // برای اینکه DataGrid دوباره fetch کند
    setGridKey((prev) => prev + 1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (!editingUser) return;

    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setEditingUser({
        ...editingUser,
        [name]: checked,
      });
    } else if (name === "age") {
      setEditingUser({
        ...editingUser,
        [name]: Number(value),
      });
    } else {
      setEditingUser({
        ...editingUser,
        [name]: value,
      });
    }
  };

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Dynamic Grid</h1>
      </div>

      <DataGrid<User>
        key={gridKey}
        columns={columns}
        fetchData={fetchUsers}
        pageSize={5}
        enableExport={true}
        enableColumnToggle={true}
        enableDragDrop={true}
        actions={(row) => (
          <button className="edit-button" onClick={() => setEditingUser(row)}>
            Edit
          </button>
        )}
      />

      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">Edit User</h2>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingUser.name}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group form-group-half">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={editingUser.age}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group form-group-half">
                  <label>Role</label>
                  <select
                    name="role"
                    value={editingUser.role}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={editingUser.department}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Management">Management</option>
                </select>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="active"
                  id="active-checkbox"
                  checked={editingUser.active}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <label htmlFor="active-checkbox" className="checkbox-label">
                  Active Status
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
