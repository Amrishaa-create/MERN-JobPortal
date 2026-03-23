import axios from "axios"

const API = axios.create({
  baseURL: "https://api-mern-jobportal.onrender.com/api",
  withCredentials: true,
})

export default API