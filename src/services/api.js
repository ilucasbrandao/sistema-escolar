import axios from "axios";

const api = axios.create({
  baseURL: "https://back-end-reforco-production.up.railway.app",
});

export default api;
