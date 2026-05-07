import { FetchDataParams, FetchDataResponse } from "@/types/data-grid.types";

const API_BASE_URL = "http://localhost:3001";

export class ApiClient {
  static async fetchData<T>(
    endpoint: string,
    params: FetchDataParams,
  ): Promise<FetchDataResponse<T>> {
    const { page, pageSize, sort, filters } = params;

    const queryParams = new URLSearchParams({
      _page: page.toString(),
      _limit: pageSize.toString(),
    });

    if (sort && sort.direction) {
      queryParams.append("_sort", sort.key);
      queryParams.append("_order", sort.direction);
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          if (typeof value === "boolean") {
            queryParams.append(key, value.toString());
          } else {
            queryParams.append(key, value);
          }
        }
      });
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/${endpoint}?${queryParams.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      const total = parseInt(response.headers.get("X-Total-Count") || "0", 10);

      return { data, total };
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
}
