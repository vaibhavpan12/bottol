import { BASE_URL } from "../config/api";

export const getAdminDashboard = async () => {
  const token = localStorage.getItem("adminToken");
  const response = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
};
