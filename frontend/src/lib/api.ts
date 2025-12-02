// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Types
export interface Space {
  id: string;
  title: string;
  description?: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  pricePerHour: number;
  capacity: number;
  category?: string;
  // Backend uses 'photos' for detailed view, 'thumbnailUrl' for list view
  photos?: string[];
  features?: string[];
  // Frontend aliases for compatibility
  amenities?: string[];
  images?: string[];
  thumbnailUrl?: string; // From API list view
  rating?: number;
  reviewsCount?: number;
  hostId?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  spaceId: string;
  userId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  space?: Space;
}

export interface CreateBookingRequest {
  spaceId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
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

// Generic fetch wrapper (public endpoints)
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

// Authenticated fetch wrapper (protected endpoints)
async function fetchAuthAPI<T>(
  endpoint: string, 
  token: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...options?.headers,
      },
      ...options,
    });

    if (response.status === 401) {
      throw new Error("Unauthorized - Token expired or invalid");
    }

    if (response.status === 403) {
      throw new Error("Forbidden - Insufficient permissions");
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Auth fetch error for ${url}:`, error);
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

  // Create space (requires ROLE_HOST or ROLE_ADMIN)
  create: async (token: string, data: Partial<Space>): Promise<Space> => {
    return fetchAuthAPI<Space>("/spaces", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update space (requires ROLE_HOST or ROLE_ADMIN)
  update: async (token: string, id: string, data: Partial<Space>): Promise<Space> => {
    return fetchAuthAPI<Space>(`/spaces/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete space (requires ROLE_HOST or ROLE_ADMIN)
  delete: async (token: string, id: string): Promise<void> => {
    return fetchAuthAPI<void>(`/spaces/${id}`, token, {
      method: "DELETE",
    });
  },

  // Get my spaces (requires ROLE_HOST or ROLE_ADMIN)
  getMy: async (token: string, page = 0, size = 10): Promise<PageResponse<Space>> => {
    return fetchAuthAPI<PageResponse<Space>>(`/spaces/my?page=${page}&size=${size}`, token);
  },
};

// Bookings API (all endpoints require authentication)
export const bookingsApi = {
  // Create booking
  create: async (token: string, data: CreateBookingRequest): Promise<Booking> => {
    return fetchAuthAPI<Booking>("/bookings", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Get my bookings as guest
  getMyBookings: async (
    token: string, 
    page = 0, 
    size = 10, 
    status?: string
  ): Promise<PageResponse<Booking>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.append("status", status);
    return fetchAuthAPI<PageResponse<Booking>>(`/bookings/me?${params}`, token);
  },

  // Get bookings for my spaces as host
  getHostBookings: async (
    token: string, 
    page = 0, 
    size = 10, 
    status?: string
  ): Promise<PageResponse<Booking>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.append("status", status);
    return fetchAuthAPI<PageResponse<Booking>>(`/bookings/host?${params}`, token);
  },

  // Get booking by ID
  getById: async (token: string, id: string): Promise<Booking> => {
    return fetchAuthAPI<Booking>(`/bookings/${id}`, token);
  },

  // Cancel booking
  cancel: async (token: string, id: string): Promise<Booking> => {
    return fetchAuthAPI<Booking>(`/bookings/${id}/cancel`, token, {
      method: "PUT",
    });
  },

  // Check availability (public)
  checkAvailability: async (
    spaceId: string, 
    startDate: string, 
    endDate: string
  ): Promise<{ available: boolean; bookedSlots: string[] }> => {
    const params = new URLSearchParams({ startDate, endDate });
    return fetchAPI(`/bookings/space/${spaceId}/availability?${params}`);
  },
};

export default spacesApi;
