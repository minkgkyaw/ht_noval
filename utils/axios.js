import axios from "axios";

const instant = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    Accepted: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default instant;
