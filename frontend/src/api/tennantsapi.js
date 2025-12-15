import axios from "axios";

// Use same base API origin as backend admin routes
const API = axios.create({
  baseURL: "http://localhost:3000/api/v1/admin",
  withCredentials: true, // <-- important: send cookies on every request
});

// No Authorization header interceptor; cookies handle auth

export const createTenant = (data) => API.post("/add-tennants", data);
export const getAllTenants = () => API.get("/all-tennants");
export const createClubAdmin = (data) => API.post("/create-club-admin", data);
export const getAllClubAdmins = () => API.get("/all-admins");
