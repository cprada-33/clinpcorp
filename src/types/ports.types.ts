/**
 * Port location data types for shipping and logistics
 */

export interface Port {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface PortOption {
  label: string;
  value: string;
  city: string;
  country: string;
  state?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PortSearchResult extends PortOption {
  relevance?: number;
}
