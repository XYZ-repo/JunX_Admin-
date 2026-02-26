"use client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { apiget, apipost } from "../api";
import { setUser, setIsLoggedIn, resetAuth } from "../slices/authSlice";
import toast from "react-hot-toast";

const useAuth = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const getLogin = async (data, successCallBack, failCallBack) => {
    try {
      const res = await apipost(`api/v1/admin/auth/login`, data);

      if (res.data?.status && res.data?.data) {
        const { access_token, refresh_token, ...userData } = res.data.data;

        // Store tokens
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        // Update Redux state
        dispatch(setUser(userData));
        dispatch(setIsLoggedIn(true));

        toast.success(res.data.message || "Login successful");
        successCallBack?.(res.data);
        return res.data;
      }
    } catch (error) {
      console.error("Login error:", error);
      failCallBack?.(error);
      throw error;
    }
  };

  // Signup (for admin creation)
  const getSignup = async (data, successCallBack, failCallBack) => {
    try {
      const res = await apipost(`api/v1/admin/auth/signup`, data);

      if (res.data?.status) {
        toast.success(res.data.message || "Signup successful");
        successCallBack?.(res.data);
        return res.data;
      }
    } catch (error) {
      console.error("Signup error:", error);
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
      failCallBack?.(error);
      throw error;
    }
  };

  // Logout
  const LogoutUser = () => {
    dispatch(resetAuth());
    dispatch(setIsLoggedIn(false));
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/signIn");
    toast.success("Logged out successfully");
  };

  // Verify email after signup
  const verifyAdminEmail = async (data, successCallBack, failCallBack) => {
    try {
      const res = await apipost(`api/v1/admin/auth/confirm-signup`, data);
      if (res.data?.status) {
        toast.success(res.data.message || "Email verified successfully");
        successCallBack?.(res.data);
        return res.data;
      }
    } catch (error) {
      console.error("Verification error:", error);
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
      failCallBack?.(error);
      throw error;
    }
  };

  const RefreshAccessToken = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) throw new Error("No refresh token found");

      const res = await apipost(`api/v1/admin/auth/refresh`, { refresh_token });

      if (res.data?.status) {
        const { access_token } = res.data.data;
        localStorage.setItem("access_token", access_token);
        return access_token;
      }
    } catch (error) {
      console.error("Refresh error:", error);
      // LogoutUser();
      throw error;
    }
  };

  // Forgot password
  const forgetPassword = async (data) => {
    try {
      const res = await apipost(`api/v1/admin/auth/forgot-password`, data);
      if (res.data?.status) {
        toast.success(res.data.message || "Code sent to email");
        return res.data;
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Failed to send code");
      throw error;
    }
  };

  // Confirm forgot password
  const ConfirmForgotPassword = async (data) => {
    try {
      const res = await apipost(
        `api/v1/admin/auth/confirm-forgot-password`,
        data,
      );
      if (res.data?.status) {
        toast.success(res.data.message || "Password reset successful");
        return res.data;
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "Failed to reset password");
      throw error;
    }
  };

  return {
    user,
    isLoggedIn,
    getLogin,
    getSignup,
    LogoutUser,
    verifyAdminEmail,
    RefreshAccessToken,
    forgetPassword,
    ConfirmForgotPassword,
  };
};

export default useAuth;
