/**
 * Extracts error message with proper TypeScript typing
 * @param {unknown} error - Error object
 * @param {string} fallback - Fallback message
 * @returns {string} Error message
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
};
