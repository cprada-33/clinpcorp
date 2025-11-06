import type {
  Booking,
  Quote,
  GetBookingsResponse,
  GetQuotesResponse,
  GetRecentRequestsResponse,
  PaginationFilters,
  PaginationInfo,
  RecentRequestsData,
} from "~/src/types/admin.types";
import { getFirebaseFunctionUrl, isDevelopmentMode } from "~/src/utils/firebase-functions";

interface AdminState {
  bookings: Booking[];
  quotes: Quote[];
  recentRequests: RecentRequestsData | null;
  bookingsPagination: PaginationInfo | null;
  quotesPagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
}

export const useAdmin = () => {
  const { getIdToken } = useAuth();
  const isDev = isDevelopmentMode();

  // State management
  const state = useState<AdminState>("admin-state", () => ({
    bookings: [],
    quotes: [],
    recentRequests: null,
    bookingsPagination: null,
    quotesPagination: null,
    loading: false,
    error: null,
  }));

  /**
   * Creates authorization headers with Bearer token
   * @returns {Promise<HeadersInit>} Headers object with authorization
   */
  const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("User not authenticated");
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  /**
   * Builds query string from pagination filters
   * @param {PaginationFilters} filters - Pagination filters
   * @returns {string} Query string
   */
  const buildQueryString = (filters?: PaginationFilters): string => {
    if (!filters) return "";

    const params = new URLSearchParams();

    if (filters.limit !== undefined) {
      params.append("limit", filters.limit.toString());
    }

    if (filters.startAfter) {
      params.append("startAfter", filters.startAfter);
    }

    if (filters.status) {
      params.append("status", filters.status);
    }

    if (filters.orderBy) {
      params.append("orderBy", filters.orderBy);
    }

    if (filters.orderDirection) {
      params.append("orderDirection", filters.orderDirection);
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  /**
   * Fetches bookings with optional filters
   * @param {PaginationFilters} filters - Optional pagination and filter parameters
   * @returns {Promise<GetBookingsResponse>} Bookings response
   */
  const fetchBookings = async (
    filters?: PaginationFilters
  ): Promise<GetBookingsResponse> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const headers = await getAuthHeaders();
      const queryString = buildQueryString(filters);
      const url = `${getFirebaseFunctionUrl("getBookings", isDev)}${queryString}`;

      const response = await $fetch<GetBookingsResponse>(url, {
        method: "GET",
        headers,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch bookings");
      }

      // Update state with new bookings
      // If using startAfter, append to existing bookings, otherwise replace
      if (filters?.startAfter) {
        state.value.bookings = [...state.value.bookings, ...response.data];
      } else {
        state.value.bookings = response.data;
      }

      state.value.bookingsPagination = response.pagination;

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch bookings";
      state.value.error = message;
      throw err;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Fetches quotes with optional filters
   * @param {PaginationFilters} filters - Optional pagination and filter parameters
   * @returns {Promise<GetQuotesResponse>} Quotes response
   */
  const fetchQuotes = async (
    filters?: PaginationFilters
  ): Promise<GetQuotesResponse> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const headers = await getAuthHeaders();
      const queryString = buildQueryString(filters);
      const url = `${getFirebaseFunctionUrl("getQuotes", isDev)}${queryString}`;

      const response = await $fetch<GetQuotesResponse>(url, {
        method: "GET",
        headers,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch quotes");
      }

      // Update state with new quotes
      // If using startAfter, append to existing quotes, otherwise replace
      if (filters?.startAfter) {
        state.value.quotes = [...state.value.quotes, ...response.data];
      } else {
        state.value.quotes = response.data;
      }

      state.value.quotesPagination = response.pagination;

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch quotes";
      state.value.error = message;
      throw err;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Fetches recent requests (7 bookings and 7 quotes)
   * @returns {Promise<GetRecentRequestsResponse>} Recent requests response
   */
  const fetchRecentRequests = async (): Promise<GetRecentRequestsResponse> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const headers = await getAuthHeaders();
      const url = getFirebaseFunctionUrl("getRecentRequests", isDev);

      const response = await $fetch<GetRecentRequestsResponse>(url, {
        method: "GET",
        headers,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch recent requests");
      }

      state.value.recentRequests = response.data;

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch recent requests";
      state.value.error = message;
      throw err;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Loads more bookings (pagination)
   * @returns {Promise<void>}
   */
  const loadMoreBookings = async (): Promise<void> => {
    if (!state.value.bookingsPagination?.hasMore) {
      return;
    }

    const lastDocId = state.value.bookingsPagination.lastDocId;

    if (!lastDocId) {
      return;
    }

    await fetchBookings({
      startAfter: lastDocId,
    });
  };

  /**
   * Loads more quotes (pagination)
   * @returns {Promise<void>}
   */
  const loadMoreQuotes = async (): Promise<void> => {
    if (!state.value.quotesPagination?.hasMore) {
      return;
    }

    const lastDocId = state.value.quotesPagination.lastDocId;

    if (!lastDocId) {
      return;
    }

    await fetchQuotes({
      startAfter: lastDocId,
    });
  };

  /**
   * Resets bookings state
   */
  const resetBookings = (): void => {
    state.value.bookings = [];
    state.value.bookingsPagination = null;
  };

  /**
   * Resets quotes state
   */
  const resetQuotes = (): void => {
    state.value.quotes = [];
    state.value.quotesPagination = null;
  };

  /**
   * Resets all admin state
   */
  const resetState = (): void => {
    state.value = {
      bookings: [],
      quotes: [],
      recentRequests: null,
      bookingsPagination: null,
      quotesPagination: null,
      loading: false,
      error: null,
    };
  };

  /**
   * Filters bookings by status
   * @param {string} status - Booking status to filter by
   * @returns {Promise<GetBookingsResponse>} Filtered bookings response
   */
  const filterBookingsByStatus = async (
    status: string
  ): Promise<GetBookingsResponse> => {
    return await fetchBookings({ status });
  };

  /**
   * Filters quotes by status
   * @param {string} status - Quote status to filter by
   * @returns {Promise<GetQuotesResponse>} Filtered quotes response
   */
  const filterQuotesByStatus = async (
    status: string
  ): Promise<GetQuotesResponse> => {
    return await fetchQuotes({ status });
  };

  return {
    // State (readonly)
    bookings: readonly(toRef(state.value, "bookings")),
    quotes: readonly(toRef(state.value, "quotes")),
    recentRequests: readonly(toRef(state.value, "recentRequests")),
    bookingsPagination: readonly(toRef(state.value, "bookingsPagination")),
    quotesPagination: readonly(toRef(state.value, "quotesPagination")),
    loading: readonly(toRef(state.value, "loading")),
    error: readonly(toRef(state.value, "error")),

    // Actions
    fetchBookings,
    fetchQuotes,
    fetchRecentRequests,
    loadMoreBookings,
    loadMoreQuotes,
    resetBookings,
    resetQuotes,
    resetState,
    filterBookingsByStatus,
    filterQuotesByStatus,
  };
};
