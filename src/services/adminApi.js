const API_URL = "http://127.0.0.1:8000";

export const getAdminDashboard = async () => {
  const response = await fetch(`${API_URL}/api/admin/dashboard`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
};