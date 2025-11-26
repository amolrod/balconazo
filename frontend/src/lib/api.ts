const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

interface FetchOptions extends RequestInit {
  token?: string | null
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Merge existing headers
  if (options.headers) {
    const existingHeaders = options.headers as Record<string, string>
    Object.assign(headers, existingHeaders)
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      errorData.message || `HTTP error ${response.status}`,
      response.status,
      errorData
    )
  }

  // Handle empty responses
  const text = await response.text()
  if (!text) {
    return {} as T
  }

  return JSON.parse(text)
}

// ============ Users API ============

export interface UserProfile {
  id: string
  email: string
  name: string
  surname: string
  fullName: string
  roles: string[]
  createdAt: string
}

export interface UpdateUserRequest {
  name: string
  surname: string
}

export const usersApi = {
  getMe: (token: string) =>
    apiFetch<UserProfile>('/api/users/me', { token }),

  updateMe: (token: string, data: UpdateUserRequest) =>
    apiFetch<UserProfile>('/api/users/me', {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    }),
}

// ============ Spaces API ============

export interface Space {
  id: string
  title: string
  city: string
  capacity: number
  pricePerHour: number
  thumbnailUrl: string | null
  active: boolean
}

export interface SpaceDetail extends Space {
  hostId: string
  description: string
  address: string
  photos: string[]
  features: string[]
  createdAt: string
}

export interface CreateSpaceRequest {
  title: string
  description: string
  city: string
  address?: string
  capacity: number
  pricePerHour: number
  photoUrls?: string[]
  features?: string[]
}

export interface SpacesPage {
  content: Space[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface SpaceFilters {
  city?: string
  minPrice?: number
  maxPrice?: number
  capacity?: number
  page?: number
  size?: number
}

export const spacesApi = {
  list: (filters: SpaceFilters = {}) => {
    const params = new URLSearchParams()
    if (filters.city) params.append('city', filters.city)
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.capacity) params.append('capacity', filters.capacity.toString())
    if (filters.page !== undefined) params.append('page', filters.page.toString())
    if (filters.size) params.append('size', filters.size.toString())

    const queryString = params.toString()
    return apiFetch<SpacesPage>(`/api/spaces${queryString ? `?${queryString}` : ''}`)
  },

  getById: (id: string) =>
    apiFetch<SpaceDetail>(`/api/spaces/${id}`),

  create: (token: string, data: CreateSpaceRequest) =>
    apiFetch<SpaceDetail>('/api/spaces', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),

  update: (token: string, id: string, data: CreateSpaceRequest) =>
    apiFetch<SpaceDetail>(`/api/spaces/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    }),

  delete: (token: string, id: string) =>
    apiFetch<void>(`/api/spaces/${id}`, {
      method: 'DELETE',
      token,
    }),

  getMySpaces: (token: string, page = 0, size = 20) =>
    apiFetch<SpacesPage>(`/api/spaces/my?page=${page}&size=${size}`, { token }),
}

// ============ Bookings API ============

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface Booking {
  id: string
  spaceId: string
  guestId: string
  hostId: string
  startTime: string
  endTime: string
  totalPrice: number
  status: BookingStatus
  notes: string | null
  durationHours: number
  createdAt: string
}

export interface CreateBookingRequest {
  spaceId: string
  startTime: string
  endTime: string
  notes?: string
}

export interface BookingsPage {
  content: Booking[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface BookedSlot {
  startTime: string
  endTime: string
}

export const bookingsApi = {
  create: (token: string, data: CreateBookingRequest) =>
    apiFetch<Booking>('/api/bookings', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),

  getMyBookings: (token: string, status?: BookingStatus, page = 0, size = 20) => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    params.append('page', page.toString())
    params.append('size', size.toString())
    return apiFetch<BookingsPage>(`/api/bookings/me?${params}`, { token })
  },

  getHostBookings: (token: string, status?: BookingStatus, page = 0, size = 20) => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    params.append('page', page.toString())
    params.append('size', size.toString())
    return apiFetch<BookingsPage>(`/api/bookings/host?${params}`, { token })
  },

  getById: (token: string, id: string) =>
    apiFetch<Booking>(`/api/bookings/${id}`, { token }),

  cancel: (token: string, id: string) =>
    apiFetch<Booking>(`/api/bookings/${id}/cancel`, {
      method: 'PUT',
      token,
    }),

  getAvailability: (spaceId: string, startDate: string, endDate: string) =>
    apiFetch<BookedSlot[]>(
      `/api/bookings/space/${spaceId}/availability?startDate=${startDate}&endDate=${endDate}`
    ),
}
