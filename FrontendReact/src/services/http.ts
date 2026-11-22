import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  withCredentials: true,
})

http.interceptors.response.use(
  response => response,
  error => {
    const mensaje = axios.isAxiosError(error)
      ? error.response?.data?.error
      : undefined

    // Se rechaza con un Error normal que lleva el mensaje del backend
    return Promise.reject(new Error(mensaje ?? 'Error de conexión'))
  }
)