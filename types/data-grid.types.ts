export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface FilterConfig {
  [key: string]: string | boolean | null;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

export interface ColumnDefinition<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "text" | "select" | "boolean";
  filterOptions?: Array<{ label: string; value: string }>;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  visible?: boolean;
}

export interface DataGridProps<T = any> {
  columns: ColumnDefinition<T>[];
  fetchData: (params: FetchDataParams) => Promise<FetchDataResponse<T>>;
  pageSize?: number;
  enableExport?: boolean;
  enableColumnToggle?: boolean;
  enableDragDrop?: boolean;
  actions?: (row: T) => React.ReactNode;
  rowKey?: string;
}

export interface FetchDataParams {
  page: number;
  pageSize: number;
  sort?: SortConfig;
  filters?: FilterConfig;
}

export interface FetchDataResponse<T> {
  data: T[];
  total: number;
}

export type DataGridState = "loading" | "success" | "error" | "empty";
