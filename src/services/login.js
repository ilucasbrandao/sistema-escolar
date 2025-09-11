import axios from "axios";

const login = axios.create({
  baseURL: "https://api-backend-usuarios-production.up.railway.app",
});

export default login;
