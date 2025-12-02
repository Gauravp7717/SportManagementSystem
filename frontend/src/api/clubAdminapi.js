// src/api/clubAdminApi.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// CREATE SPORT
export const createSport = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/club-admin/create-sport`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// GET ALL SPORTS
export const getSports = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/club-admin/get-sports`, {
      method: "GET",
      credentials: "include",
    });

    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// DELETE SPORT
export const deleteSport = async (id) => {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/club-admin/delete-sport/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};
