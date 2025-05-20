
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { motion } from "framer-motion";

interface AnalyticsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export const DashboardAnalytics = ({ pendingCount, approvedCount, rejectedCount }: AnalyticsProps) => {
  const barData = [
    { name: 'Pending', count: pendingCount, color: '#3b82f6' },
    { name: 'Approved', count: approvedCount, color: '#22c55e' },
    { name: 'Rejected', count: rejectedCount, color: '#ef4444' },
  ];
  
  const pieData = [
    { name: 'Pending', value: pendingCount, color: '#3b82f6' },
    { name: 'Approved', value: approvedCount, color: '#22c55e' },
    { name: 'Rejected', value: rejectedCount, color: '#ef4444' },
  ];
  
  const total = pendingCount + approvedCount + rejectedCount;

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Quick Stats Cards */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Gatepasses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-2xl font-bold">{total}</div>
          </div>
        </CardContent>
      </Card>
      
      {/* Bar Chart Card */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Gatepass Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};
