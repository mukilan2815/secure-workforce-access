
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { GatepassService } from "@/services/gatepass-service";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GatepassCard } from "@/components/GatepassCard";
import { Check, X, Download, Filter } from "lucide-react";

const SSEDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [pendingGatepasses, setPendingGatepasses] = useState<any[]>([]);
  const [approvedGatepasses, setApprovedGatepasses] = useState<any[]>([]);
  const [rejectedGatepasses, setRejectedGatepasses] = useState<any[]>([]);
  const [selectedGatepass, setSelectedGatepass] = useState<any>(null);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is SSE
    const userType = localStorage.getItem("userType");
    if (!userType || (userType !== "SSE" && userType !== "sse")) {
      navigate("/");
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await GatepassService.getSSEDashboardData();
      
      // Process the data
      setPendingGatepasses(Array.isArray(data.pending_gatepass) ? data.pending_gatepass : []);
      setApprovedGatepasses(Array.isArray(data.approved_gatepass) ? data.approved_gatepass : []);
      setRejectedGatepasses(Array.isArray(data.rejected_gatepass) ? data.rejected_gatepass : []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        variant: "destructive",
        title: "Error loading dashboard",
        description: "Could not load dashboard data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (gatepass: any) => {
    try {
      await GatepassService.approveGatepass(gatepass.id);
      toast({
        title: "Gatepass Approved",
        description: `You have approved the gate pass for ${gatepass.workman_username}`,
      });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error approving gatepass:", error);
      toast({
        variant: "destructive",
        title: "Error approving",
        description: "Could not approve the gate pass. Please try again.",
      });
    }
  };

  const openRejectionDialog = (gatepass: any) => {
    setSelectedGatepass(gatepass);
    setRejectionReason("");
    setIsRejectionDialogOpen(true);
  };

  const handleReject = async () => {
    if (!selectedGatepass) return;

    try {
      await GatepassService.rejectGatepass(selectedGatepass.id, rejectionReason);
      toast({
        title: "Gatepass Rejected",
        description: `You have rejected the gate pass for ${selectedGatepass.workman_username}`,
      });
      setIsRejectionDialogOpen(false);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error rejecting gatepass:", error);
      toast({
        variant: "destructive",
        title: "Error rejecting",
        description: "Could not reject the gate pass. Please try again.",
      });
    }
  };

  const handleDownloadPdf = async (gatepassId: number) => {
    try {
      await GatepassService.downloadGatepass(gatepassId);
      toast({
        title: "Download started",
        description: "Your gatepass PDF is being downloaded.",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Could not download the gate pass PDF. Please try again.",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <DashboardLayout 
      title="SSE Dashboard" 
      subtitle="Welcome to the Gate Pass Management System"
      actionButton={
        <Button
          variant="outline"
          size="sm"
          className="border-gray-200 text-gray-700"
        >
          <Filter className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Filter</span>
        </Button>
      }
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
            <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full border-t-2 border-b-2 border-blue-400 animate-spin"></div>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingGatepasses.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingGatepasses.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <AnimatePresence>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {pendingGatepasses.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 text-gray-500"
                  >
                    No pending gate passes to review
                  </motion.div>
                ) : (
                  pendingGatepasses.map((gatepass) => (
                    <GatepassCard
                      key={gatepass.id}
                      gatepass={gatepass}
                      showWorkmanName={true}
                      actions={
                        <>
                          <Button
                            variant="outline"
                            size="sm" 
                            className="border-red-200 text-red-500 hover:bg-red-50"
                            onClick={() => openRejectionDialog(gatepass)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(gatepass)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </>
                      }
                    />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="approved">
            <AnimatePresence>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {approvedGatepasses.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 text-gray-500"
                  >
                    No approved gate passes
                  </motion.div>
                ) : (
                  approvedGatepasses.map((gatepass) => (
                    <GatepassCard
                      key={gatepass.id}
                      gatepass={gatepass}
                      showWorkmanName={true}
                      actions={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPdf(gatepass.id)}
                          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download PDF
                        </Button>
                      }
                    />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="rejected">
            <AnimatePresence>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {rejectedGatepasses.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 text-gray-500"
                  >
                    No rejected gate passes
                  </motion.div>
                ) : (
                  rejectedGatepasses.map((gatepass) => (
                    <GatepassCard
                      key={gatepass.id}
                      gatepass={gatepass}
                      showWorkmanName={true}
                    />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Gate Pass</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this gate pass request.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter reason for rejection..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px] resize-none focus:ring-red-500"
          />
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRejectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject} 
              disabled={!rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Gate Pass
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SSEDashboard;
