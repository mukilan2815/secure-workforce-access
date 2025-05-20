
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

interface LoginResponse {
  access: string;
  refresh: string;
  user_type: string;
}

interface RefreshResponse {
  access: string;
  user_type: string;
}

export const LoginService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(`${API_URL}/auth/`, {
      username,
      password,
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await axios.put(`${API_URL}/auth/`, {
      refresh: refreshToken,
    });
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await axios.delete(`${API_URL}/auth/`, {
      data: { refresh: refreshToken },
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userType");
  },
};

// Axios interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh already
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken") || "";
        const response = await LoginService.refreshToken(refreshToken);
        
        localStorage.setItem("accessToken", response.access);
        
        // Update auth header and retry request
        originalRequest.headers["Authorization"] = `Bearer ${response.access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error("Token refresh failed", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userType");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Set up axios defaults
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
