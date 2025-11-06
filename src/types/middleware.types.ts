/**
 * Middleware type definitions
 */

export type UserRole = "user" | "admin" | "superadmin";

export interface RouteGuardConfig {
  requireAuth: boolean;
  requireRole?: UserRole | UserRole[];
  redirectOnFail?: string;
}
