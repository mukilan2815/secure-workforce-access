
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface GatePass {
  id: number;
  workman: number;
  workman_username?: string;
  time_out: string;
  time_in: string;
  purpose: string;
  approval_status: string;
  rejection_reason: string | null;
  approved_by: number | null;
  approved_by_username?: string;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

// Create an axios instance with auth header
const authAxios = () => {
  const token = localStorage.getItem('accessToken');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    }
  });
};

export const GatepassService = {
  // SSE methods
  getSSEDashboardData: async () => {
    const response = await authAxios().get(`${API_URL}/home/`);
    return response.data;
  },

  approveGatepass: async (gatepassId: number) => {
    const response = await authAxios().post(`${API_URL}/home/`, {
      gatepass_id: gatepassId,
      action: "approve",
    });
    return response.data;
  },

  rejectGatepass: async (gatepassId: number, reason: string) => {
    const response = await authAxios().post(`${API_URL}/home/`, {
      gatepass_id: gatepassId,
      action: "reject",
      rejection_reason: reason,
    });
    return response.data;
  },

  // Workman methods
  getWorkmanDashboardData: async () => {
    const response = await authAxios().get(`${API_URL}/home/`);
    return response.data;
  },

  createGatepass: async (timeIn: string, timeOut: string, purpose: string) => {
    const response = await authAxios().post(`${API_URL}/home/`, {
      time_in: timeIn,
      time_out: timeOut,
      purpose: purpose,
    });
    return response.data;
  },

  updateGatepass: async (gatepassId: number, timeIn: string, timeOut: string, purpose: string) => {
    const response = await authAxios().put(`${API_URL}/home/`, {
      gatepass_id: gatepassId,
      time_in: timeIn,
      time_out: timeOut,
      purpose: purpose,
    });
    return response.data;
  },

  downloadGatepass: async (gatepassId: number) => {
    const response = await authAxios().get(`${API_URL}/home/gatepass/${gatepassId}/pdf/`, {
      responseType: "blob",
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `gatepass_${gatepassId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
