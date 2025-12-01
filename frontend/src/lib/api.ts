// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Types
export interface Space {
  id: string;
  title: string;
  description?: string;
  city: string;
  address?: string;
  pricePerHour: number;
  capacity: number;
  category?: string;
  amenities?: string[];
  images?: string[];
  thumbnailUrl?: string; // From API
  rating?: number;
  reviewsCount?: number;
  hostId?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface SpaceFilters {
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  page?: number;
  size?: number;
  sort?: string;
}

// Generic fetch wrapper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}

// Spaces API
export const spacesApi = {
  // Get all spaces with pagination and filters
  getAll: async (filters?: SpaceFilters): Promise<PageResponse<Space>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page !== undefined) params.append("page", String(filters.page));
      if (filters.size !== undefined) params.append("size", String(filters.size));
      if (filters.city) params.append("city", filters.city);
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
      if (filters.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
      if (filters.minCapacity !== undefined) params.append("minCapacity", String(filters.minCapacity));
      if (filters.sort) params.append("sort", filters.sort);
    }

    const queryString = params.toString();
    const endpoint = `/spaces${queryString ? `?${queryString}` : ""}`;
    
    return fetchAPI<PageResponse<Space>>(endpoint);
  },

  // Get a single space by ID
  getById: async (id: string): Promise<Space> => {
    return fetchAPI<Space>(`/spaces/${id}`);
  },

  // Search spaces
  search: async (query: string, filters?: SpaceFilters): Promise<PageResponse<Space>> => {
    const params = new URLSearchParams({ q: query });
    
    if (filters) {
      if (filters.page !== undefined) params.append("page", String(filters.page));
      if (filters.size !== undefined) params.append("size", String(filters.size));
    }

    return fetchAPI<PageResponse<Space>>(`/spaces/search?${params.toString()}`);
  },
};

export default spacesApi;
