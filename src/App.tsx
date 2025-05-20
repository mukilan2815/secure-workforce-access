
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import Index from "./pages/Index";
import SSEDashboard from "./pages/SSEDashboard";
import WorkmanDashboard from "./pages/WorkmanDashboard";
import NotFound from "./pages/NotFound";

// Set up axios interceptors for authentication
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const queryClient = new QueryClient();

const App = () => {
  // Clear any stale tokens on application reload if needed
  useEffect(() => {
    const handleTokenRefresh = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken && refreshToken) {
        // Here you could add logic to refresh the token if needed
        // using refreshToken
      }
    };
    
    handleTokenRefresh();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sse-dashboard" element={<SSEDashboard />} />
            <Route path="/workman-dashboard" element={<WorkmanDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
