"use client";
import axios from "axios";
import toast from "react-hot-toast";

export const constant = () => {
  // Fixed: removed trailing spaces
  if (window.location.hostname === "localhost") {
    return { baseUrl: "https://stagingapi.junxyz.com/" };
  }
  return { baseUrl: "https://stagingapi.junxyz.com/" };
};

const api = axios.create();

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_data");
  setTimeout(() => {
    window.location.href = "/signIn";
  }, 1500);
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isGetRequest = originalRequest.method?.toLowerCase() === "get";

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        if (!isGetRequest) {
          toast.error("Session expired. Please login again.");
        }
        return Promise.reject(error);
      }

      try {
        const rs = await axios.post(
          `${constant().baseUrl}api/v1/admin/auth/refresh`,
          { refresh_token: refreshToken },
        );
        console.log(rs);

        const { access_token } = rs.data.data;

        localStorage.setItem("access_token", access_token);
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;

        processQueue(null, access_token);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        // Only show toast for non-GET requests
        if (!isGetRequest) {
          toast.error("Session expired. Please login again.");
        }
        // logoutUser();
        return Promise.reject(refreshError);
      }
    }

    // Only show 401 toast for non-GET requests
    if (error.response?.status === 401 && !isGetRequest) {
      const isLoggedIn = localStorage.getItem("access_token");
      if (isLoggedIn) {
        toast.error("Session expired. Please login again.");
        // logoutUser();
      }
    }

    return Promise.reject(error);
  },
);

// GET - NO toasts at all (success or error)
export const apiget = async (path) => {
  try {
    const response = await api.get(constant().baseUrl + path);
    return response;
  } catch (error) {
    // Silent error for GET requests
    console.error("GET Error:", path, error);
    throw error;
  }
};

// POST - Success toast only for non-auth endpoints
export const apipost = async (path, data) => {
  try {
    const response = await api.post(constant().baseUrl + path, data);

    if (response?.data?.message && !path.includes("/auth/")) {
      toast.success(response.data.message);
    }
    return response;
  } catch (error) {
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    throw error;
  }
};

// PUT - Success toast
export const apiput = async (path, data) => {
  try {
    const response = await api.put(constant().baseUrl + path, data);
    if (response?.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  } catch (error) {
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    throw error;
  }
};

// PATCH - Success toast
export const apipatch = async (path, data) => {
  try {
    const response = await api.patch(constant().baseUrl + path, data);
    if (response?.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  } catch (error) {
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    throw error;
  }
};

// DELETE - Success toast
export const apidelete = async (path) => {
  try {
    const response = await api.delete(constant().baseUrl + path);
    if (response?.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  } catch (error) {
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    throw error;
  }
};

export default api;
