
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { LoginService } from "@/services/auth-service";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  actionButton?: ReactNode;
}

export const DashboardLayout = ({ title, subtitle, children, actionButton }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken") || "";
      await LoginService.logout(refreshToken);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clean up local storage and navigate away
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userType");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </motion.div>
          
          <div className="flex items-center gap-3">
            {actionButton && actionButton}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 border-gray-200 text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-2">{subtitle}</h2>
            <p className="opacity-90 text-sm">
              Efficiently manage gate passes with our streamlined system
            </p>
          </div>
        </motion.div>
        
        {children}
      </main>
    </div>
  );
};
