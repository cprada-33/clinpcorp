export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  role?: string;
  admin?: boolean; // Custom claim set by assignAdminRole
}

export interface RegisterData {
  email: string;
  password: string;
  displayName?: string;
  phoneNumber?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
