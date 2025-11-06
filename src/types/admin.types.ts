// Booking types
export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Booking {
  id: string;
  portOfLoading: string;
  portOfLoadingCity: string;
  portOfDischarge: string;
  portOfDischargeCity: string;
  vesselDeparture: string;
  quotationContractNumber: string;
  commodity: string;
  containerType: string;
  numberOfContainers: number;
  weightPerContainer: number;
  companyName: string;
  country: string;
  companyEmail: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

// Quote types
export enum QuoteStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface Quote {
  id: string;
  routeFrom: string;
  routeFromCity: string;
  routeTo: string;
  routeToCity: string;
  commodity: string;
  containerType: string;
  numberOfContainers: number;
  weightPerContainer: number;
  effectiveDate: string;
  expiryDate: string;
  companyName: string;
  country: string;
  companyEmail: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
}

// Pagination types
export interface PaginationFilters {
  limit?: number;
  startAfter?: string;
  status?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export interface PaginationInfo {
  hasMore: boolean;
  lastDocId: string | null;
  total: number;
}

// API Response types
export interface GetBookingsResponse {
  success: boolean;
  data: Booking[];
  pagination: PaginationInfo;
  message?: string;
}

export interface GetQuotesResponse {
  success: boolean;
  data: Quote[];
  pagination: PaginationInfo;
  message?: string;
}

export interface RecentRequestsData {
  bookings: Booking[];
  quotes: Quote[];
}

export interface GetRecentRequestsResponse {
  success: boolean;
  data: RecentRequestsData;
  message?: string;
}
