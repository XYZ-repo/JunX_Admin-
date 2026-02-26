"use client";

import axios from "axios";
import { setUser, setIsLoggedIn, resetAuth } from "../slices/authSlice";
import toast from "react-hot-toast";
import { constant } from "../api";

export const _getLogin = (data, successCallBack, failCallBack) => {
  return async (dispatch, getState) => {
    try {
      const req = await axios.post(
        constant().baseUrl + "api/v1/admin/auth/login",
        data,
      );
      if (req.data) {
        successCallBack?.(req?.data);
        localStorage.setItem("token", req?.data?.token);
        document.cookie = `token=${req?.data?.token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }; sameSite=lax`;
        dispatch(setUser(req?.data?.user));
        dispatch(setIsLoggedIn(true));
        toast.success("Login Successfully");
      }
    } catch (error) {
      console.log({ error });
      failCallBack?.(error);
      toast.error(error?.response?.data?.message || "Server error");
    }
  };
};

export const _getSignup = (data, successCallBack, failCallBack) => {
  return async (dispatch, getState) => {
    try {
      const req = await axios.post(
        constant().baseUrl + "api/v1/admin/auth/signup",
        data,
      );
      if (req.data) {
        successCallBack?.(req?.data);
        localStorage.setItem("token", req?.data?.token);
        document.cookie = `token=${req?.data?.token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }; sameSite=lax`;
        dispatch(setUser(req?.data?.user));
        dispatch(setIsLoggedIn(true));
        toast.success(req?.message || "Signup Successfully");
      }
    } catch (error) {
      console.log({ error });
      failCallBack?.(error);
    }
  };
};
