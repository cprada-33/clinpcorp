export interface QuoteForm {
  routeFrom: string;
  routeTo: string;
  commodity: string;
  containerType: string;
  numberOfContainers: number;
  weightPerContainer: number;
  effectiveDate: string;
  expiryDate: string;
  companyName: string;
  country: string;
  companyEmail: string;
}

export interface BookingForm {
  portOfLoading: string;
  portOfDischarge: string;
  vesselDeparture: string;
  quotationContractNumber: string;
  commodity: string;
  containerType: string;
  numberOfContainers: number;
  weightPerContainer: number;
  companyName: string;
  country: string;
  companyEmail: string;
}

export interface CreatePetitionResponse {
  success: boolean;
  id?: string;
  message: string;
}

export interface RequestState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
