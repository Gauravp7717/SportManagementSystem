import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1/admin",
});

export const createTenant = (data) => API.post("/add-tennants", data);
export const getAllTenants = () => API.get("/all-tennants");
