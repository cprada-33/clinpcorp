/**
 * Authentication Middleware
 * Protects routes by ensuring user is authenticated
 * Redirects to login page if not authenticated
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on server-side rendering initial load
  // This prevents issues with SSR and allows client-side auth check
  if (import.meta.server) {
    return;
  }

  const { user, loading } = useAuth();

  // Wait for auth state to be initialized
  // This prevents race conditions where middleware runs before Firebase auth initializes
  if (loading.value) {
    // Wait a bit for the auth state to load
    await new Promise((resolve) => {
      const unwatch = watch(
        () => loading.value,
        (isLoading) => {
          if (!isLoading) {
            unwatch();
            resolve(true);
          }
        }
      );

      // Timeout after 5 seconds to prevent infinite loading
      setTimeout(() => {
        unwatch();
        resolve(false);
      }, 5000);
    });
  }

  // If user is not authenticated, redirect to login
  if (!user.value) {
    // Store the original destination to redirect after login
    const returnUrl = to.fullPath;

    return navigateTo({
      path: "/admin",
      query: { redirect: returnUrl },
    });
  }

  // User is authenticated, allow access
});
