import axios from "axios";

export const api = axios.create({
    withCredentials: false,
    baseURL: "http://localhost:3001",
})