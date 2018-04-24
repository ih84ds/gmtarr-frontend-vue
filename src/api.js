import axios from 'axios'

const axiosConfig = {
  baseURL: process.env.API_BASE_URL
}

const api = axios.create(axiosConfig)

export default api