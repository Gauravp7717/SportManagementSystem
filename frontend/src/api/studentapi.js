const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/* ============================
   CREATE STUDENT
============================ */
export const createStudent = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/club-admin/create-student`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message };
    }

    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

/* ============================
   GET ALL STUDENTS
============================ */
export const getStudents = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/club-admin/get-students`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message };
    }

    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

/* ============================
   GET STUDENT BY ID
============================ */
export const getStudentById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/club-admin/get-student/${id}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message };
    }

    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

/* ============================
   UPDATE STUDENT
============================ */
export const updateStudent = async (id, payload) => {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/club-admin/update-student/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message };
    }

    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

/* ============================
   DELETE STUDENT
============================ */
export const deleteStudent = async (id) => {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/club-admin/delete-student/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message };
    }

    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};
