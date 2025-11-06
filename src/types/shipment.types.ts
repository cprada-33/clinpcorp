export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Contact {
  name: string;
  address: Address;
  phone?: string;
  email?: string;
}

export interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

export interface Shipment {
  id: string;
  status: string;
  serviceType: string;
  weight: string;
  dimensions: string;
  value?: string;
  origin: Contact;
  destination: Contact;
  createdAt: string;
  estimatedDelivery?: string;
  deliveryTimeRange?: string;
  deliveryInstructions?: string;
  deliveredAt?: string;
  deliveredTo?: string;
  trackingEvents: TrackingEvent[];
}
