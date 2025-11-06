import type {
  QuoteForm,
  BookingForm,
  CreatePetitionResponse,
  RequestState,
} from "~/src/types";
import { getErrorMessage } from "~/src/utils/error-handler";
import { getFirebaseFunctionUrl, isDevelopmentMode } from "~/src/utils/firebase-functions";

export const useRequests = () => {
  const isDev = isDevelopmentMode();

  const state = useState<RequestState>("requests-state", () => ({
    loading: false,
    error: null,
    successMessage: null,
  }));

  const submitShippingQuote = async (
    quoteData: QuoteForm
  ): Promise<CreatePetitionResponse> => {
    state.value.loading = true;
    state.value.error = null;
    state.value.successMessage = null;

    try {
      const endpoint = getFirebaseFunctionUrl("createShippingQuote", isDev);

      const response = await $fetch<CreatePetitionResponse>(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quoteData),
      });

      if (response.success) {
        state.value.successMessage =
          response.message || "Quote submitted successfully";
      } else {
        state.value.error =
          response.message || "Failed to submit quote request";
      }

      return response;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        "Network error. Please check your connection and try again."
      );

      state.value.error = errorMessage;

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      state.value.loading = false;
    }
  };

  const submitBooking = async (
    bookingData: BookingForm
  ): Promise<CreatePetitionResponse> => {
    state.value.loading = true;
    state.value.error = null;
    state.value.successMessage = null;

    try {
      const endpoint = getFirebaseFunctionUrl("createBooking", isDev);

      const response = await $fetch<CreatePetitionResponse>(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.success) {
        state.value.successMessage =
          response.message || "Booking submitted successfully";
      } else {
        state.value.error =
          response.message || "Failed to submit booking request";
      }

      return response;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        "Network error. Please check your connection and try again."
      );

      state.value.error = errorMessage;

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      state.value.loading = false;
    }
  };

  const clearMessages = () => {
    state.value.error = null;
    state.value.successMessage = null;
  };

  return {
    loading: computed(() => state.value.loading),
    error: computed(() => state.value.error),
    successMessage: computed(() => state.value.successMessage),

    submitShippingQuote,
    submitBooking,
    clearMessages,
  };
};
