import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { GatepassService } from "@/services/gatepass-service";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GatepassCard } from "@/components/GatepassCard";
import { DashboardAnalytics } from "@/components/DashboardAnalytics";
import { PlusCircle, Clock, ClipboardEdit, FileText, Download } from "lucide-react";

const WorkmanDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [pendingGatepasses, setPendingGatepasses] = useState<any[]>([]);
  const [approvedGatepasses, setApprovedGatepasses] = useState<any[]>([]);
  const [rejectedGatepasses, setRejectedGatepasses] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGatepass, setSelectedGatepass] = useState<any>(null);
  const [formData, setFormData] = useState({
    timeOut: "",
    timeIn: "",
    purpose: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is Workman
    const userType = localStorage.getItem("userType");
    if (!userType || (userType !== "WorkMen" && userType !== "workman")) {
      navigate("/");
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await GatepassService.getWorkmanDashboardData();
      
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

  const handleOpenNewGatepassDialog = () => {
    setIsEditMode(false);
    setSelectedGatepass(null);
    setFormData({
      timeOut: getCurrentTime(),
      timeIn: "",
      purpose: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (gatepass: any) => {
    setIsEditMode(true);
    setSelectedGatepass(gatepass);
    setFormData({
      timeOut: formatTimeForInput(gatepass.time_out),
      timeIn: formatTimeForInput(gatepass.time_in),
      purpose: gatepass.purpose,
    });
    setIsDialogOpen(true);
  };

  const formatTimeForInput = (timeString: string) => {
    try {
      return timeString.substring(0, 5); // Extract HH:MM for input
    } catch (e) {
      return timeString || "";
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (!formData.timeIn || !formData.timeOut || !formData.purpose) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all the fields",
      });
      return;
    }
    
    try {
      if (isEditMode && selectedGatepass) {
        // Update existing gatepass
        await GatepassService.updateGatepass(
          selectedGatepass.id,
          formData.timeIn,
          formData.timeOut,
          formData.purpose
        );
        toast({
          title: "Gate Pass Updated",
          description: "Your gate pass request has been updated and is pending approval.",
        });
      } else {
        // Create new gatepass
        await GatepassService.createGatepass(
          formData.timeIn,
          formData.timeOut,
          formData.purpose
        );
        toast({
          title: "Gate Pass Created",
          description: "Your gate pass request has been submitted and is pending approval.",
        });
      }
      setIsDialogOpen(false);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error submitting gatepass:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Could not submit your gate pass request. Please try again.",
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

  const actionButton = (
    <Button
      onClick={handleOpenNewGatepassDialog}
      size="sm"
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
    >
      <PlusCircle className="h-4 w-4 mr-1" />
      New Gate Pass
    </Button>
  );

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
      title="Workmen Dashboard" 
      subtitle="Welcome to the Man Gate Pass Management System" 
      actionButton={actionButton}
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
        <>
          {/* Analytics Section */}
          <DashboardAnalytics 
            pendingCount={pendingGatepasses.length} 
            approvedCount={approvedGatepasses.length}
            rejectedCount={rejectedGatepasses.length}
          />
          
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                >
                  {pendingGatepasses.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="col-span-full text-center py-12 text-gray-500"
                    >
                      No pending gate passes
                    </motion.div>
                  ) : (
                    pendingGatepasses.map((gatepass) => (
                      <GatepassCard 
                        key={gatepass.id}
                        gatepass={gatepass}
                        actions={
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs py-0 px-2 h-6"
                            onClick={() => handleOpenEditDialog(gatepass)}
                          >
                            <ClipboardEdit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                >
                  {approvedGatepasses.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="col-span-full text-center py-12 text-gray-500"
                    >
                      No approved gate passes
                    </motion.div>
                  ) : (
                    approvedGatepasses.map((gatepass) => (
                      <GatepassCard 
                        key={gatepass.id}
                        gatepass={gatepass}
                        actions={
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPdf(gatepass.id)}
                            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 text-xs py-0 px-2 h-6"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            PDF
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                >
                  {rejectedGatepasses.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="col-span-full text-center py-12 text-gray-500"
                    >
                      No rejected gate passes
                    </motion.div>
                  ) : (
                    rejectedGatepasses.map((gatepass) => (
                      <GatepassCard 
                        key={gatepass.id}
                        gatepass={gatepass}
                        actions={
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs py-0 px-2 h-6"
                            onClick={() => handleOpenEditDialog(gatepass)}
                          >
                            <ClipboardEdit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        }
                      />
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Gate Pass Request" : "New Gate Pass Request"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {isEditMode ? "update your" : "submit a new"} gate pass request
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time-out" className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Time Out
                </Label>
                <Input
                  id="time-out"
                  type="time"
                  value={formData.timeOut}
                  onChange={(e) =>
                    setFormData({ ...formData, timeOut: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-in" className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Time In
                </Label>
                <Input
                  id="time-in"
                  type="time"
                  value={formData.timeIn}
                  onChange={(e) =>
                    setFormData({ ...formData, timeIn: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose" className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-gray-500" />
                Purpose
              </Label>
              <Textarea
                id="purpose"
                placeholder="Enter the purpose of your gate pass"
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                className="min-h-20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isEditMode ? "Update" : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default WorkmanDashboard;
