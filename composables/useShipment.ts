import type {
  Shipment,
  CreateShipmentRequest,
  CreateShipmentResponse,
  GetShipmentsResponse,
  ShipmentUpdate,
  CreateShipmentUpdateRequest,
  CreateShipmentUpdateResponse,
  GetShipmentUpdatesResponse,
} from "~/src/types/shipment-admin.types";
import { getErrorMessage } from "~/src/utils/error-handler";
import { getFirebaseFunctionUrl, isDevelopmentMode } from "~/src/utils/firebase-functions";

interface ShipmentState {
  shipments: Shipment[];
  currentShipment: Shipment | null;
  shipmentUpdates: ShipmentUpdate[];
  loading: boolean;
  error: string | null;
}

export const useShipment = () => {
  const { getIdToken } = useAuth();
  const isDev = isDevelopmentMode();

  // State management
  const state = useState<ShipmentState>("shipment-state", () => ({
    shipments: [],
    currentShipment: null,
    shipmentUpdates: [],
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
   * Creates a new shipment
   * @param {CreateShipmentRequest} shipmentData - Shipment data
   * @returns {Promise<CreateShipmentResponse>} Created shipment response
   */
  const createShipment = async (
    shipmentData: CreateShipmentRequest
  ): Promise<CreateShipmentResponse> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const url = getFirebaseFunctionUrl("createShipment", isDev);
      const headers = await getAuthHeaders();

      const response = await $fetch<CreateShipmentResponse>(url, {
        method: "POST",
        headers,
        body: JSON.stringify(shipmentData),
      });

      if (response.success && response.data) {
        state.value.currentShipment = response.data;
        // Add to shipments list
        state.value.shipments.unshift(response.data);
      }

      return response;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Failed to create shipment");
      state.value.error = errorMessage;
      throw new Error(errorMessage);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Fetches all shipments
   * @returns {Promise<GetShipmentsResponse>} Shipments response
   */
  const fetchShipments = async (): Promise<GetShipmentsResponse> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const url = getFirebaseFunctionUrl("getShipments", isDev);
      const headers = await getAuthHeaders();

      const response = await $fetch<GetShipmentsResponse>(url, {
        method: "GET",
        headers,
      });

      if (response.success) {
        state.value.shipments = response.data;
      }

      return response;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Failed to fetch shipments");
      state.value.error = errorMessage;
      throw new Error(errorMessage);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Fetches a single shipment by ID
   * @param {string} id - Shipment ID
   * @returns {Promise<Shipment | null>} Shipment data or null
   */
  const fetchShipmentById = async (id: string): Promise<Shipment | null> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      // First check if we already have it in state
      const existingShipment = state.value.shipments.find((s) => s.id === id);
      if (existingShipment) {
        state.value.currentShipment = existingShipment;
        return existingShipment;
      }

      // If not in state, fetch all shipments (since we don't have a getById endpoint yet)
      await fetchShipments();
      const shipment = state.value.shipments.find((s) => s.id === id);

      if (shipment) {
        state.value.currentShipment = shipment;
        return shipment;
      }

      return null;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Failed to fetch shipment");
      state.value.error = errorMessage;
      throw new Error(errorMessage);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Gets a shipment by ID from the current state
   * @param {string} id - Shipment ID
   * @returns {Shipment | undefined} Found shipment or undefined
   */
  const getShipmentById = (id: string): Shipment | undefined => {
    return state.value.shipments.find((s) => s.id === id);
  };

  /**
   * Fetches and validates a shipment by tracking number and booking reference
   * @param {string} trackingNumber - Tracking number
   * @param {string} bookingReference - Booking reference for validation
   * @returns {Promise<Shipment | null>} Shipment data or null if not found or invalid
   */
  const trackShipment = async (
    trackingNumber: string,
    bookingReference: string
  ): Promise<Shipment | null> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      // Fetch all shipments
      // TODO: Create a dedicated backend endpoint for public tracking with validation
      const response = await fetchShipments();

      if (response.success) {
        // Find shipment by tracking number
        const shipment = state.value.shipments.find(
          (s) => s.trackingNumber === trackingNumber
        );

        if (shipment) {
          // Validate booking reference matches
          if (shipment.bookingReference === bookingReference) {
            state.value.currentShipment = shipment;
            return shipment;
          } else {
            state.value.error = "Booking reference does not match the shipment records";
            return null;
          }
        } else {
          state.value.error = "Shipment not found";
          return null;
        }
      }

      return null;
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string }; message?: string })?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to track shipment";
      state.value.error = errorMessage;
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Clears the current shipment
   */
  const clearCurrentShipment = () => {
    state.value.currentShipment = null;
  };

  /**
   * Clears any errors
   */
  const clearError = () => {
    state.value.error = null;
  };

  /**
   * Creates a shipment status update
   * @param {CreateShipmentUpdateRequest} updateData - Update data
   * @returns {Promise<CreateShipmentUpdateResponse>} Created update response
   */
  const createShipmentUpdate = async (
    updateData: CreateShipmentUpdateRequest
  ): Promise<CreateShipmentUpdateResponse> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const url = getFirebaseFunctionUrl("createShipmentUpdate", isDev);
      const headers = await getAuthHeaders();

      const response = await $fetch<CreateShipmentUpdateResponse>(url, {
        method: "POST",
        headers,
        body: JSON.stringify(updateData),
      });

      if (response.success && response.data) {
        // Add update to state
        state.value.shipmentUpdates.unshift(response.data);

        // Update current shipment status if it's the one being updated
        if (state.value.currentShipment?.id === updateData.shipmentId) {
          state.value.currentShipment.status = updateData.status;
          state.value.currentShipment.updatedAt = response.data.createdAt;
        }

        // Update shipment in list
        const shipmentIndex = state.value.shipments.findIndex(
          (s) => s.id === updateData.shipmentId
        );
        if (shipmentIndex !== -1) {
          state.value.shipments[shipmentIndex].status = updateData.status;
          state.value.shipments[shipmentIndex].updatedAt = response.data.createdAt;
        }
      }

      return response;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Failed to create shipment update");
      state.value.error = errorMessage;
      throw new Error(errorMessage);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Fetches all updates for a shipment
   * @param {string} shipmentId - Shipment ID
   * @returns {Promise<GetShipmentUpdatesResponse>} Updates response
   */
  const fetchShipmentUpdates = async (
    shipmentId: string
  ): Promise<GetShipmentUpdatesResponse> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const url = `${getFirebaseFunctionUrl("getShipmentUpdates", isDev)}?shipmentId=${shipmentId}`;
      const headers = await getAuthHeaders();

      const response = await $fetch<GetShipmentUpdatesResponse>(url, {
        method: "GET",
        headers,
      });

      if (response.success) {
        state.value.shipmentUpdates = response.data;
      }

      return response;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Failed to fetch shipment updates");
      state.value.error = errorMessage;
      throw new Error(errorMessage);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Clears shipment updates
   */
  const clearShipmentUpdates = () => {
    state.value.shipmentUpdates = [];
  };

  /**
   * Fetches shipment updates for public tracking (no auth required)
   * @param {string} trackingNumber - Tracking number
   * @param {string} bookingReference - Booking reference for validation
   * @returns {Promise<GetShipmentUpdatesResponse>} Updates response
   */
  const trackShipmentUpdates = async (
    trackingNumber: string,
    bookingReference: string
  ): Promise<GetShipmentUpdatesResponse> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const url = `${getFirebaseFunctionUrl("trackShipmentUpdates", isDev)}?trackingNumber=${trackingNumber}&bookingReference=${encodeURIComponent(bookingReference)}`;

      const response = await $fetch<GetShipmentUpdatesResponse>(url, {
        method: "GET",
      });

      if (response.success) {
        state.value.shipmentUpdates = response.data;
      }

      return response;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Failed to fetch shipment updates");
      state.value.error = errorMessage;
      throw new Error(errorMessage);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    // State
    shipments: computed(() => state.value.shipments),
    currentShipment: computed(() => state.value.currentShipment),
    shipmentUpdates: computed(() => state.value.shipmentUpdates),
    loading: computed(() => state.value.loading),
    error: computed(() => state.value.error),

    // Actions
    createShipment,
    fetchShipments,
    fetchShipmentById,
    trackShipment,
    getShipmentById,
    clearCurrentShipment,
    clearError,
    createShipmentUpdate,
    fetchShipmentUpdates,
    trackShipmentUpdates,
    clearShipmentUpdates,
  };
};
