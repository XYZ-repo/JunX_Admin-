"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { apiget } from "../api";
import { setUser, setIsLoggedIn, resetAuth } from "../slices/authSlice";
import toast from "react-hot-toast";

export default function useAppInit() {
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const __init = async () => {
    try {
      setLoading(true);

      const access_token = localStorage.getItem("access_token");

      if (!access_token) {
        setLoading(false);
        setInitialized(true);
        return null;
      }

      const res = await apiget("api/v1/admin/auth/me");

      if (res?.data?.status && res?.data?.data) {
        dispatch(setUser(res.data.data));
        dispatch(setIsLoggedIn(true));
        return res.data;
      } else {
        throw new Error("Invalid session");
      }
    } catch (error) {
      console.error("Auth initialization error:", error);

      // localStorage.removeItem("access_token");
      // localStorage.removeItem("refresh_token");
      dispatch(resetAuth());
      dispatch(setIsLoggedIn(false));

      const publicRoutes = [
        "/signIn",
        "/forgot-password",
        "/verify-otp",
        "/new-password",
      ];
      if (!publicRoutes.includes(pathname)) {
        router.push("/signIn");
      }

      return null;
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    if (!initialized) {
      __init();
    }
  }, [initialized, pathname]);

  return { loading, initialized, __init };
}
