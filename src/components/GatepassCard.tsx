
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

  const getStatusBadge = () => {
    switch(gatepass.approval_status.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const ticketVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: { duration: 0.2 } }
  };
  
  return (
    <motion.div 
      className="mb-3"
      variants={ticketVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <div className="relative flex rounded-lg overflow-hidden shadow-sm bg-white border border-gray-100">
        {/* Left decorative edge */}
        <div className="absolute left-0 top-0 h-full w-1 flex flex-col">
          <div className={`flex-grow ${getStatusColor()}`}></div>
        </div>

        {/* Ticket notches */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between items-center">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-gray-100"></div>
          ))}
        </div>
        
        {/* Main ticket content */}
        <div className="flex-grow pl-4 p-3">
          {/* Ticket header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="text-sm font-semibold text-gray-900">Gate Pass #{gatepass.id}</h3>
                <Badge 
                  className="ml-2 text-xs py-0" 
                  variant={getStatusBadge() as any}
                >
                  {gatepass.approval_status.toUpperCase()}
                </Badge>
              </div>
              
              {showWorkmanName && (
                <p className="text-xs text-gray-600 mt-0.5">
                  {gatepass.workman_username || "Unknown"}
                </p>
              )}
            </div>
            
            <div className="text-right">
              <p className="text-[10px] text-gray-500 flex items-center justify-end">
                <CalendarClock className="h-2.5 w-2.5 mr-1" />
                {formatDateTime(gatepass.created_at)}
              </p>
            </div>
          </div>

          {/* Ticket details */}
          <div className="grid grid-cols-2 gap-2 my-2 p-2 bg-gray-50 rounded-md text-xs">
            <div className="flex items-center">
              <Clock className="h-3 w-3 text-gray-500 mr-1" />
              <div>
                <p className="text-[10px] font-medium text-gray-500">Time Out</p>
                <p className="font-medium">{formatTime(gatepass.time_out)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-3 w-3 text-gray-500 mr-1" />
              <div>
                <p className="text-[10px] font-medium text-gray-500">Time In</p>
                <p className="font-medium">{formatTime(gatepass.time_in)}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-2 text-xs">
            <div className="flex items-start">
              <FileText className="h-3 w-3 text-gray-500 mr-1 mt-1" />
              <div>
                <p className="text-[10px] font-medium text-gray-500">Purpose</p>
                <p className="leading-tight">{gatepass.purpose || "-"}</p>
              </div>
            </div>
          </div>
          
          {gatepass.rejection_reason && (
            <div className="mb-2 p-1 bg-red-50 rounded-md border border-red-100 text-xs">
              <p className="text-[10px] font-medium text-red-700">Rejection Reason</p>
              <p className="text-red-600 leading-tight">{gatepass.rejection_reason}</p>
            </div>
          )}

          {/* Actions */}
          {actions && (
            <div className="flex items-center justify-end gap-1 mt-2">
              {actions}
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex flex-col justify-center items-center px-2 bg-gray-50 border-l">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} mb-1`}></div>
          <div className="text-[10px] font-medium uppercase text-gray-500 rotate-90 whitespace-nowrap">
            {gatepass.approval_status}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
