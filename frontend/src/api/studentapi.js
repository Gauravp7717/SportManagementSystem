// src/api/studentApi.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// CREATE STUDENT
export const createStudent = async (payload) => {
  try {
    console.log("📤 Creating student:", payload);
    const res = await fetch(`${API_BASE}/api/v1/club-admin/create-student`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("📥 Student response:", data);

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to create student",
      };
    }

    return data;
  } catch (err) {
    console.error("❌ Create student error:", err);
    return { success: false, message: err.message };
  }
};

// GET STUDENTS
export const getStudents = async () => {
  try {
    console.log("📤 Fetching students...");
    const res = await fetch(`${API_BASE}/api/v1/club-admin/get-students`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    console.log("📥 Students response:", data);

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch students",
      };
    }

    return data;
  } catch (err) {
    console.error("❌ Get students error:", err);
    return { success: false, message: err.message };
  }
};
