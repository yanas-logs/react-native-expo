import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { router } from "expo-router";

export function useProtectedRoute(redirectTo: string = "/(auth)/login") {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    // Redirect if not authenticated
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to:", redirectTo);
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
}
