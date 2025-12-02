import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";

export default function useRequireAuth(redirectTo = "/(auth)/login") {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo); // tampilkan modal login
    }
  }, [isLoading, isAuthenticated]);
}
