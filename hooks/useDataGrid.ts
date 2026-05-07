"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SortConfig,
  FilterConfig,
  PaginationConfig,
  FetchDataParams,
  FetchDataResponse,
  DataGridState,
} from "@/types/data-grid.types";

interface UseDataGridProps<T> {
  fetchData: (params: FetchDataParams) => Promise<FetchDataResponse<T>>;
  pageSize?: number;
}

export function useDataGrid<T>({
  fetchData,
  pageSize = 10,
}: UseDataGridProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<T[]>([]);
  const [state, setState] = useState<DataGridState>("loading");
  const [pagination, setPagination] = useState<PaginationConfig>({
    page: parseInt(searchParams.get("page") || "1", 10),
    pageSize,
    total: 0,
  });
  const [sort, setSort] = useState<SortConfig>({
    key: searchParams.get("sortKey") || "",
    direction: (searchParams.get("sortDir") as "asc" | "desc") || null,
  });
  const [filters, setFilters] = useState<FilterConfig>(() => {
    const filterParams: FilterConfig = {};
    searchParams.forEach((value, key) => {
      if (!["page", "sortKey", "sortDir"].includes(key)) {
        filterParams[key] =
          value === "true" ? true : value === "false" ? false : value;
      }
    });
    return filterParams;
  });

  const updateURL = useCallback(
    (newPage: number, newSort: SortConfig, newFilters: FilterConfig) => {
      const params = new URLSearchParams();
      params.set("page", newPage.toString());
      if (newSort.key && newSort.direction) {
        params.set("sortKey", newSort.key);
        params.set("sortDir", newSort.direction);
      }
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          params.set(key, value.toString());
        }
      });
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  const loadData = useCallback(async () => {
    setState("loading");
    try {
      const response = await fetchData({
        page: pagination.page,
        pageSize: pagination.pageSize,
        sort: sort.direction ? sort : undefined,
        filters,
      });

      setData(response.data);
      setPagination((prev) => ({ ...prev, total: response.total }));
      setState(response.data.length === 0 ? "empty" : "success");
    } catch (error) {
      setState("error");
      console.error("Failed to load data:", error);
    }
  }, [fetchData, pagination.page, pagination.pageSize, sort, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    updateURL(newPage, sort, filters);
  };

  const handleSort = (key: string) => {
    const newSort: SortConfig = {
      key,
      direction: sort.key === key && sort.direction === "asc" ? "desc" : "asc",
    };
    setSort(newSort);
    setPagination((prev) => ({ ...prev, page: 1 }));
    updateURL(1, newSort, filters);
  };

  const handleFilter = (key: string, value: string | boolean | null) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
    updateURL(1, sort, newFilters);
  };

  const handleRefresh = () => {
    loadData();
  };

  return {
    data,
    state,
    pagination,
    sort,
    filters,
    handlePageChange,
    handleSort,
    handleFilter,
    handleRefresh,
  };
}
