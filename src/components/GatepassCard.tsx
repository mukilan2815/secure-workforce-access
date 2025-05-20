
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, FileText, User, UserCheck } from "lucide-react";

interface GatepassCardProps {
  gatepass: any;
  actions?: React.ReactNode;
  showWorkmanName?: boolean;
}

export const GatepassCard = ({ gatepass, actions, showWorkmanName = false }: GatepassCardProps) => {
  const formatTime = (timeString: string) => {
    try {
      // Handle time format HH:MM:SS
      return timeString.substring(0, 5); // Extract HH:MM
    } catch (e) {
      return timeString;
    }
  };

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return "-";
    try {
      const date = new Date(dateTimeString);
      return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return dateTimeString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return "bg-green-100 text-green-800 border-green-300";
      case 'rejected':
        return "bg-red-100 text-red-800 border-red-300";
      case 'pending':
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="mb-4"
    >
      <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center gap-1">
                <span className="text-gray-700">Request #{gatepass.id}</span>
              </CardTitle>
              <CardDescription>
                {showWorkmanName && gatepass.workman_username && (
                  <div className="flex items-center gap-1 mt-1">
                    <User className="h-3.5 w-3.5 text-gray-400" />
                    <span>{gatepass.workman_username}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  <span>{formatDateTime(gatepass.created_at)}</span>
                </div>
              </CardDescription>
            </div>
            <div className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(gatepass.approval_status)}`}>
              {gatepass.approval_status.toUpperCase()}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Time Out</div>
                <div>{formatTime(gatepass.time_out)}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Time In</div>
                <div>{formatTime(gatepass.time_in)}</div>
              </div>
            </div>
            
            <div className="col-span-2 mt-1">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Purpose</div>
                  <div className="text-gray-700">{gatepass.purpose}</div>
                </div>
              </div>
            </div>
            
            {gatepass.approval_status !== "pending" && (
              <>
                <div className="col-span-2 mt-1">
                  <div className="flex items-start gap-2">
                    <UserCheck className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Processed by</div>
                      <div>{gatepass.approved_by_username || "N/A"}</div>
                      <div className="text-xs text-gray-500">
                        {formatDateTime(gatepass.approved_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {gatepass.approval_status === "rejected" && gatepass.rejection_reason && (
              <div className="col-span-2 mt-1 bg-red-50 p-2 rounded border border-red-100">
                <div className="text-xs text-red-800 font-medium">Reason for rejection:</div>
                <div className="text-red-700 text-sm">{gatepass.rejection_reason}</div>
              </div>
            )}
          </div>
        </CardContent>
        {actions && (
          <CardFooter className="pt-0 pb-3 flex gap-2 justify-end border-t border-gray-100 mt-3 pt-3 bg-gray-50/50">
            {actions}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};
