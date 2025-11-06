import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type Auth,
  type User as FirebaseUser,
} from "firebase/auth";
import type { User, RegisterData, LoginData } from "~/src/types/auth.types";
import { getFirebaseFunctionUrl, isDevelopmentMode } from "~/src/utils/firebase-functions";

export const useAuth = () => {
  const nuxtApp = useNuxtApp();
  const isDev = isDevelopmentMode();

  const user = useState<User | null>("auth-user", () => null);
  const loading = useState<boolean>("auth-loading", () => true);
  const error = useState<string | null>("auth-error", () => null);
  const isListenerInitialized = useState<boolean>(
    "auth-listener-initialized",
    () => false
  );

  const getAuth = () => {
    if (import.meta.server) return null;
    return nuxtApp.$auth || null;
  };

  const initAuthStateListener = (authInstance?: Auth) => {
    if (isListenerInitialized.value) {
      return;
    }

    const auth = authInstance || getAuth();
    if (!auth) {
      console.error("Firebase auth not initialized");
      loading.value = false;
      return;
    }

    isListenerInitialized.value = true;

    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in
        const idToken = await firebaseUser.getIdToken();

        // Verify token with server to get custom claims
        try {
          const response = await $fetch(
            getFirebaseFunctionUrl("verify", isDev),
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );

          if (response && typeof response === "object" && "user" in response) {
            user.value = response.user as User;
          }
        } catch (err: unknown) {
          console.error("Error verifying token:", err);
          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          };
        }
      } else {
        // User is signed out
        user.value = null;
      }
      loading.value = false;
    });
  };

  async function login({ email, password }: LoginData) {
    const auth = getAuth();

    if (!auth) {
      throw new Error("Firebase auth not initialized");
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    localStorage.setItem("token", idToken);

    return user;
  }

  async function logout() {
    const auth = getAuth();

    if (!auth) {
      throw new Error("Firebase auth not initialized");
    }

    await signOut(auth);

    localStorage.removeItem("token");
    user.value = null;
    await navigateTo("/admin");
  }

  async function resetPassword(email: string) {
    const auth = getAuth();

    if (!auth) {
      throw new Error("Firebase auth not initialized");
    }

    await sendPasswordResetEmail(auth, email);

    return;
  }

  const register = async (data: RegisterData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{ success: boolean; user: User }>(
        getFirebaseFunctionUrl("register", isDev),
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.success) {
        throw new Error("Registration failed");
      }

      await login({ email: data.email, password: data.password });

      return response.user;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      error.value = message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getIdToken = async (forceRefresh = false): Promise<string | null> => {
    const auth = getAuth();
    if (!auth || !auth.currentUser) {
      return null;
    }

    try {
      return await auth.currentUser.getIdToken(forceRefresh);
    } catch (err: unknown) {
      console.error("Error getting ID token:", err);
      return null;
    }
  };

  /**
   * Forces a token refresh to get updated custom claims
   * Useful after admin role assignment or other claim changes
   */
  const refreshUserClaims = async (): Promise<void> => {
    const auth = getAuth();
    if (!auth || !auth.currentUser) {
      throw new Error("No authenticated user");
    }

    try {
      // Force token refresh to get updated claims
      const idToken = await auth.currentUser.getIdToken(true);

      // Verify token with server to get updated claims
      const response = await $fetch(
        getFirebaseFunctionUrl("verify", isDev),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (response && typeof response === "object" && "user" in response) {
        user.value = response.user as User;
      }
    } catch (err: unknown) {
      console.error("Error refreshing user claims:", err);
      throw err;
    }
  };

  const deleteAccount = async () => {
    loading.value = true;
    error.value = null;

    try {
      const idToken = await getIdToken();

      if (!idToken) {
        throw new Error("User not authenticated");
      }

      await $fetch(getFirebaseFunctionUrl("deleteAccount", isDev), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      user.value = null;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Account deletion failed";
      error.value = message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    initAuthStateListener,
    register,
    login,
    logout,
    resetPassword,
    getIdToken,
    refreshUserClaims,
    deleteAccount,
  };
};
