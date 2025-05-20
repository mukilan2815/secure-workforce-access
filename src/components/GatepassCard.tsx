
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, CalendarClock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GatepassCardProps {
  gatepass: any;
  actions?: ReactNode;
  showWorkmanName?: boolean;
}

export const GatepassCard = ({ gatepass, actions, showWorkmanName = false }: GatepassCardProps) => {
  // Helper functions
  const formatTime = (timeString: string) => {
    try {
      return timeString?.substring(0, 5) || "-"; // Extract HH:MM
    } catch (e) {
      return timeString || "-";
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "-";
    try {
      const date = new Date(dateTimeString);
      return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateTimeString;
    }
  };

  // Get status-specific styling
  const getStatusColor = () => {
    switch(gatepass.approval_status.toLowerCase()) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const ticketVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { y: -5, transition: { duration: 0.2 } }
  };
  
  return (
    <motion.div 
      className="mb-6"
      variants={ticketVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <div className="relative flex rounded-lg overflow-hidden shadow-md bg-white">
        {/* Left decorative edge */}
        <div className="absolute left-0 top-0 h-full w-2 flex flex-col">
          <div className={`flex-grow ${getStatusColor()}`}></div>
        </div>

        {/* Ticket notches */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between items-center">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-gray-100"></div>
          ))}
        </div>
        
        {/* Main ticket content */}
        <div className="flex-grow pl-6 p-4">
          {/* Ticket header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="text-xl font-semibold text-gray-900">Gate Pass #{gatepass.id}</h3>
                <Badge 
                  className="ml-2" 
                  variant={
                    gatepass.approval_status === "approved" ? "success" : 
                    gatepass.approval_status === "rejected" ? "destructive" : 
                    "outline"
                  }
                >
                  {gatepass.approval_status.toUpperCase()}
                </Badge>
              </div>
              
              {showWorkmanName && (
                <p className="text-sm text-gray-600 mt-1">
                  Issued to: {gatepass.workman_username || "Unknown"}
                </p>
              )}
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-500 flex items-center justify-end">
                <CalendarClock className="h-3 w-3 mr-1" />
                Created: {formatDateTime(gatepass.created_at)}
              </p>
            </div>
          </div>

          {/* Ticket details */}
          <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-gray-500">Time Out</p>
                <p className="font-semibold">{formatTime(gatepass.time_out)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-gray-500">Time In</p>
                <p className="font-semibold">{formatTime(gatepass.time_in)}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-start">
              <FileText className="h-4 w-4 text-gray-500 mr-2 mt-1" />
              <div>
                <p className="text-xs font-medium text-gray-500">Purpose</p>
                <p className="text-sm">{gatepass.purpose || "-"}</p>
              </div>
            </div>
          </div>
          
          {gatepass.rejection_reason && (
            <div className="mb-4 p-3 bg-red-50 rounded-md border border-red-100">
              <p className="text-xs font-medium text-red-700">Rejection Reason</p>
              <p className="text-sm text-red-600">{gatepass.rejection_reason}</p>
            </div>
          )}

          {/* Actions */}
          {actions && (
            <div className="flex items-center justify-end gap-2 mt-4">
              {actions}
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex flex-col justify-center items-center px-4 bg-gray-50 border-l">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} mb-1`}></div>
          <div className="text-xs font-medium uppercase text-gray-500 rotate-90 whitespace-nowrap">
            {gatepass.approval_status}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
