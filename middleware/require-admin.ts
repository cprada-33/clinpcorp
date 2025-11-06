/**
 * Admin Role Middleware
 * Ensures user has admin role before accessing admin-only routes
 * Must be used in combination with auth middleware
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Skip on server-side
  if (import.meta.server) {
    return;
  }

  // Skip for public admin routes (login, register, etc.)
  const publicAdminRoutes = ["/admin", "/admin/", "/admin/registro"];
  if (publicAdminRoutes.includes(to.path)) {
    return;
  }

  const { user, loading } = useAuth();

  // Wait for auth state to be initialized
  if (loading.value) {
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

      setTimeout(() => {
        unwatch();
        resolve(false);
      }, 5000);
    });
  }

  // If no user, redirect to login (this should be caught by auth middleware first)
  if (!user.value) {
    return navigateTo({
      path: "/admin",
      query: { redirect: to.fullPath },
    });
  }

  // Check if user has admin role from Custom Claims
  const isAdmin = user.value.admin === true || user.value.role === "admin";

  if (!isAdmin) {
    // User is authenticated but not an admin
    console.warn(
      "Unauthorized access attempt to admin route:",
      to.fullPath,
      "by user:",
      user.value.email
    );
    return navigateTo({
      path: "/",
      query: { error: "unauthorized" },
    });
  }

  // User is admin, allow access
});
