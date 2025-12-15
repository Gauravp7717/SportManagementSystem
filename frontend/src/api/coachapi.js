// src/api/coachapi.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// GET ALL COACHES
export const getCoaches = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/coach/get-all-coaches`, {
      method: "GET",
      credentials: "include",
    });

    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// CREATE COACH
export const createCoach = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/coach/create-coach`, {
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

// GET SINGLE COACH
export const getCoach = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/coach/get-coach/${id}`, {
      method: "GET",
      credentials: "include",
    });

    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// UPDATE COACH
export const updateCoach = async (id, payload) => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/coach/update-coach/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// DELETE COACH
export const deleteCoach = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/coach/delete-coach/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};
