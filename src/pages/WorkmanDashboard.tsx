
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { LoginService } from "@/services/auth-service";
import { GatepassService, GatePass } from "@/services/gatepass-service";
import { motion, AnimatePresence } from "framer-motion";

const WorkmanDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [pendingGatepasses, setPendingGatepasses] = useState<GatePass[]>([]);
  const [approvedGatepasses, setApprovedGatepasses] = useState<GatePass[]>([]);
  const [rejectedGatepasses, setRejectedGatepasses] = useState<GatePass[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGatepass, setSelectedGatepass] = useState<GatePass | null>(null);
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
    if (!userType || userType !== "WorkMen") {
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

  const handleOpenEditDialog = (gatepass: GatePass) => {
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
      // Handle time format HH:MM:SS
      return timeString.substring(0, 5); // Extract HH:MM for input
    } catch (e) {
      return timeString;
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
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

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken") || "";
      await LoginService.logout(refreshToken);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout anyway
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userType");
      navigate("/");
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

  const renderGatepassCard = (gatepass: GatePass, actions: React.ReactNode) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Request #{gatepass.id}</CardTitle>
              <CardDescription>Created: {formatDateTime(gatepass.created_at)}</CardDescription>
            </div>
            <Badge variant={
              gatepass.approval_status === "approved" ? "success" :
              gatepass.approval_status === "rejected" ? "destructive" :
              "outline"
            }>
              {gatepass.approval_status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Time Out:</span>
              <div>{formatTime(gatepass.time_out)}</div>
            </div>
            <div>
              <span className="font-medium">Time In:</span>
              <div>{formatTime(gatepass.time_in)}</div>
            </div>
            <div className="col-span-2">
              <span className="font-medium">Purpose:</span>
              <div className="mt-1 text-muted-foreground">{gatepass.purpose}</div>
            </div>
            
            {gatepass.approval_status !== "pending" && (
              <>
                <div className="col-span-2">
                  <span className="font-medium">Processed by:</span>
                  <div>{gatepass.approved_by_username || "N/A"}</div>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Processed at:</span>
                  <div>{formatDateTime(gatepass.approved_at)}</div>
                </div>
              </>
            )}
            
            {gatepass.approval_status === "rejected" && (
              <div className="col-span-2">
                <span className="font-medium">Rejection reason:</span>
                <div className="text-red-500">{gatepass.rejection_reason || "No reason provided"}</div>
              </div>
            )}
          </div>
        </CardContent>
        {actions && (
          <CardFooter className="pt-2 flex gap-2 justify-end">
            {actions}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Workman Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold mb-2">Welcome to the Gate Pass Management System</h2>
                <p className="opacity-90">
                  Request, view and manage your gate passes.
                </p>
              </div>
              <Button 
                onClick={handleOpenNewGatepassDialog}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                New Gate Pass
              </Button>
            </div>
          </div>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="pending">
                Pending
                {pendingGatepasses.length > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingGatepasses.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <AnimatePresence>
                {pendingGatepasses.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 text-gray-500"
                  >
                    No pending gate passes
                  </motion.div>
                ) : (
                  pendingGatepasses.map(gatepass => (
                    <div key={gatepass.id}>
                      {renderGatepassCard(gatepass, (
                        <Button 
                          variant="outline"
                          onClick={() => handleOpenEditDialog(gatepass)}
                        >
                          Edit Request
                        </Button>
                      ))}
                    </div>
                  ))
                )}
              </AnimatePresence>
            </TabsContent>
            
            <TabsContent value="approved">
              <AnimatePresence>
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
                  approvedGatepasses.map(gatepass => (
                    <div key={gatepass.id}>
                      {renderGatepassCard(gatepass, (
                        <Button
                          variant="outline"
                          onClick={() => handleDownloadPdf(gatepass.id)}
                        >
                          Download PDF
                        </Button>
                      ))}
                    </div>
                  ))
                )}
              </AnimatePresence>
            </TabsContent>
            
            <TabsContent value="rejected">
              <AnimatePresence>
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
                  rejectedGatepasses.map(gatepass => (
                    <div key={gatepass.id}>
                      {renderGatepassCard(gatepass, (
                        <Button 
                          variant="outline"
                          onClick={() => handleOpenEditDialog(gatepass)}
                        >
                          Update & Reapply
                        </Button>
                      ))}
                    </div>
                  ))
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        )}
      </main>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Gate Pass" : "New Gate Pass Request"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update your gate pass request details below."
                : "Fill in the details for your gate pass request."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeOut">Time Out</Label>
                <Input
                  id="timeOut"
                  type="time"
                  value={formData.timeOut}
                  onChange={(e) => setFormData({...formData, timeOut: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeIn">Time In</Label>
                <Input
                  id="timeIn"
                  type="time"
                  value={formData.timeIn}
                  onChange={(e) => setFormData({...formData, timeIn: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                placeholder="Enter the purpose of your visit..."
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.timeIn || !formData.purpose}
            >
              {isEditMode ? "Update & Reapply" : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkmanDashboard;
