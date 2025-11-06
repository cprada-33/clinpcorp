// Frontend types for shipment management

export enum ShipmentStatus {
  AWAITING_SHIPPING = "awaiting_shipping",
  SHIPPED = "shipped",
  IN_TRANSIT = "in_transit",
  AWAITING_TRANSSHIPMENT = "awaiting_transshipment",
  TRANSSHIPPED = "transshipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  ON_HOLD = "on_hold",
}

export interface Location {
  port: string;
  city: string;
  country: string;
  address?: string;
}

export interface ShipmentCargo {
  commodity: string;
  containerType: string;
  numberOfContainers: number;
  weightPerContainer: number;
  totalWeight: number;
  description?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  bookingReference?: string;

  // Origin and destination
  origin: Location;
  destination: Location;

  // Cargo details
  cargo: ShipmentCargo;

  // Dates
  createdAt: string;
  updatedAt: string;
  estimatedDepartureDate?: string;
  actualDepartureDate?: string;
  estimatedArrivalDate?: string;
  actualArrivalDate?: string;

  // Status
  status: ShipmentStatus;

  // Company information
  companyName: string;
  companyEmail: string;

  // Additional info
  vesselName?: string;
  voyageNumber?: string;
  notes?: string;
}

export interface CreateShipmentRequest {
  bookingReference?: string;
  origin: Location;
  destination: Location;
  cargo: ShipmentCargo;
  companyName: string;
  companyEmail: string;
  estimatedDepartureDate?: string;
  estimatedArrivalDate?: string;
  vesselName?: string;
  voyageNumber?: string;
  notes?: string;
}

export interface CreateShipmentResponse {
  success: boolean;
  data?: Shipment;
  message?: string;
}

export interface GetShipmentsResponse {
  success: boolean;
  data: Shipment[];
  message?: string;
}

// Shipment Update types
export interface UpdateLocation {
  city: string;
  country: string;
}

export interface ShipmentUpdate {
  id: string;
  shipmentId: string;
  bookingReference: string;
  trackingNumber: string;
  status: ShipmentStatus;
  location?: UpdateLocation;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface CreateShipmentUpdateRequest {
  shipmentId: string;
  status: ShipmentStatus;
  location?: UpdateLocation;
  notes?: string;
}

export interface CreateShipmentUpdateResponse {
  success: boolean;
  data?: ShipmentUpdate;
  message?: string;
}

export interface GetShipmentUpdatesResponse {
  success: boolean;
  data: ShipmentUpdate[];
  message?: string;
}
