import type { QuoteForm, BookingForm } from "./forms.types";

export type QuoteStatus = "pending" | "reviewed" | "approved" | "rejected";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface QuoteItem extends QuoteForm {
  id: string;
  status: QuoteStatus;
  createdAt: string;
}

export interface BookingItem extends BookingForm {
  id: string;
  status: BookingStatus;
  createdAt: string;
}
