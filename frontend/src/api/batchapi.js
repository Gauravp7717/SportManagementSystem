// src/api/batchApi.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// CREATE BATCH
export const createBatch = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/club-admin/create-batch`, {
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

// DELETE BATCH
export const deleteBatch = async (batchId) => {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/club-admin/delete-batch/${batchId}`,
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

// GET BATCHES
export const getBatches = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/club-admin/get-batches`, {
      method: "GET",
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};
