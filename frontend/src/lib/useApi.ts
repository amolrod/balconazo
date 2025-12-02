"use client";

import { useCallback } from "react";
import { useAuth } from "./auth";
import { 
  spacesApi, 
  bookingsApi, 
  Space, 
  Booking, 
  CreateBookingRequest, 
  PageResponse, 
  SpaceFilters 
} from "./api";

/**
 * Hook for making authenticated API calls.
 * Automatically handles token refresh and auth errors.
 * 
 * Usage:
 * ```tsx
 * const { bookings, spaces } = useApi();
 * 
 * // Create a booking
 * const newBooking = await bookings.create({
 *   spaceId: "123",
 *   startDate: "2025-01-15",
 *   endDate: "2025-01-15",
 *   startTime: "10:00",
 *   endTime: "14:00"
 * });
 * 
 * // Get my bookings
 * const myBookings = await bookings.getMyBookings(0, 10);
 * ```
 */
export function useApi() {
  const { getToken, isAuthenticated, login } = useAuth();

  /**
   * Wrapper that handles authentication automatically.
   * Gets fresh token and redirects to login on auth errors.
   */
  const withAuth = useCallback(async <T>(
    apiCall: (token: string) => Promise<T>
  ): Promise<T> => {
    if (!isAuthenticated) {
      login();
      throw new Error("Not authenticated");
    }

    const token = await getToken();
    if (!token) {
      login();
      throw new Error("Failed to get token");
    }

    try {
      return await apiCall(token);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        // Token expired or invalid, redirect to login
        login();
      }
      throw error;
    }
  }, [getToken, isAuthenticated, login]);

  return {
    // ========== SPACES (Authenticated Operations) ==========
    spaces: {
      /** Create a new space (requires HOST or ADMIN role) */
      create: useCallback(
        (data: Partial<Space>) => withAuth(token => spacesApi.create(token, data)), 
        [withAuth]
      ),
      
      /** Update an existing space */
      update: useCallback(
        (id: string, data: Partial<Space>) => withAuth(token => spacesApi.update(token, id, data)), 
        [withAuth]
      ),
      
      /** Delete a space */
      delete: useCallback(
        (id: string) => withAuth(token => spacesApi.delete(token, id)), 
        [withAuth]
      ),
      
      /** Get spaces owned by the current user */
      getMy: useCallback(
        (page = 0, size = 10) => withAuth(token => spacesApi.getMy(token, page, size)), 
        [withAuth]
      ),
    },

    // ========== BOOKINGS ==========
    bookings: {
      /** Create a new booking */
      create: useCallback(
        (data: CreateBookingRequest) => withAuth(token => bookingsApi.create(token, data)), 
        [withAuth]
      ),
      
      /** Get bookings made by the current user (as guest) */
      getMyBookings: useCallback(
        (page = 0, size = 10, status?: string) => 
          withAuth(token => bookingsApi.getMyBookings(token, page, size, status)), 
        [withAuth]
      ),
      
      /** Get bookings for spaces owned by the current user (as host) */
      getHostBookings: useCallback(
        (page = 0, size = 10, status?: string) => 
          withAuth(token => bookingsApi.getHostBookings(token, page, size, status)), 
        [withAuth]
      ),
      
      /** Get a specific booking by ID */
      getById: useCallback(
        (id: string) => withAuth(token => bookingsApi.getById(token, id)), 
        [withAuth]
      ),
      
      /** Cancel a booking */
      cancel: useCallback(
        (id: string) => withAuth(token => bookingsApi.cancel(token, id)), 
        [withAuth]
      ),
    },

    /** Check if user is authenticated */
    isAuthenticated,
    
    /** Redirect to login */
    login,
  };
}

// Re-export public API methods for direct use (no auth required)
export { spacesApi, bookingsApi };
export type { Space, Booking, CreateBookingRequest, PageResponse, SpaceFilters };
