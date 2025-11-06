import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    // storageBucket: config.public.firebaseStorageBucket,
    // messagingSenderId: config.public.firebaseMessagingSenderId,
    // appId: config.public.firebaseAppId,
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Connect to emulator BEFORE initializing auth state listener
  if (process.env.NODE_ENV === "development") {
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
    });
  }

  // Initialize auth state listener - pass auth instance directly
  const { initAuthStateListener } = useAuth();
  initAuthStateListener(auth);

  return {
    provide: {
      firebase: app,
      auth,
    },
  };
});
