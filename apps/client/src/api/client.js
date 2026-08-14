import axios from "axios";

import env from "../config/env";

const client = axios.create({
  baseURL: env.API_URL,

  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;
