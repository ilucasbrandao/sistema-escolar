import axios from "axios";

const login = axios.create({
  baseURL: "http://localhost:3001",
});

export default login;
