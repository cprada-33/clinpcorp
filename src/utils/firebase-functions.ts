/**
 * Firebase Functions URL mapping utility
 * Maps function names to their deployed Cloud Run URLs
 */

/**
 * Firebase function names
 */
export type FirebaseFunctionName =
  | "createShippingQuote"
  | "createBooking"
  | "getBookings"
  | "getQuotes"
  | "getRecentRequests"
  | "createShipment"
  | "getShipments"
  | "createShipmentUpdate"
  | "getShipmentUpdates"
  | "trackShipmentUpdates"
  | "verify"
  | "register"
  | "deleteAccount"
  | "assignAdminRole";

/**
 * Development URL base (used in local development)
 */
const DEV_FUNCTIONS_URL = "http://127.0.0.1:5001/nogal-3c92b/us-central1";

/**
 * Production URL mapping for Firebase Functions (Cloud Run)
 * Each function has its own dedicated URL
 */
const PRODUCTION_FUNCTION_URLS: Record<FirebaseFunctionName, string> = {
  createShippingQuote:
    "https://createshippingquote-pi5cfumx5a-uc.a.run.app",
  createBooking: "https://createbooking-pi5cfumx5a-uc.a.run.app",
  getBookings: "https://getbookings-pi5cfumx5a-uc.a.run.app",
  getQuotes: "https://getquotes-pi5cfumx5a-uc.a.run.app",
  getRecentRequests: "https://getrecentrequests-pi5cfumx5a-uc.a.run.app",
  createShipment: "https://createshipment-pi5cfumx5a-uc.a.run.app",
  getShipments: "https://getshipments-pi5cfumx5a-uc.a.run.app",
  createShipmentUpdate: "https://createshipmentupdate-pi5cfumx5a-uc.a.run.app",
  getShipmentUpdates: "https://getshipmentupdates-pi5cfumx5a-uc.a.run.app",
  trackShipmentUpdates:
    "https://trackshipmentupdates-pi5cfumx5a-uc.a.run.app",
  verify: "https://verify-pi5cfumx5a-uc.a.run.app",
  register: "https://register-pi5cfumx5a-uc.a.run.app",
  deleteAccount: "https://deleteaccount-pi5cfumx5a-uc.a.run.app",
  assignAdminRole: "https://assignadminrole-pi5cfumx5a-uc.a.run.app",
};

/**
 * Gets the URL for a Firebase Function
 * @param functionName - The name of the Firebase function
 * @param isDevelopment - Whether the app is running in development mode
 * @returns The complete URL for the function
 */
export function getFirebaseFunctionUrl(
  functionName: FirebaseFunctionName,
  isDevelopment = false
): string {
  if (isDevelopment) {
    return `${DEV_FUNCTIONS_URL}/${functionName}`;
  }

  return PRODUCTION_FUNCTION_URLS[functionName];
}

/**
 * Checks if the current environment is development
 * @returns true if running in development mode
 */
export function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === "development";
}
