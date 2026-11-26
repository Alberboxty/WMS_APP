import axios from 'axios'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/auth.types'

const API = `${import.meta.env.VITE_API_URL ?? 'http://lokuraplay.ddns.net:4000'}/auth`

const routes = {
  login: '/iniciar-sesion',
  register: '/registrarse',
  profile: '/perfil',
  logout: '/logout',
  adminData: '/admin/data',
  forgottenPass: '/forgottenpass',
} as const

export const logearseAPI = async ({ email, password }: LoginPayload) => {
  const { data } = await axios.post(
    `${API}${routes.login}`,
    { email, password },
    { withCredentials: true },
  )
  return data
}

export const registrarseAPI = async ({ username, email, password }: RegisterPayload) => {
  const { data } = await axios.post(`${API}${routes.register}`, { username, email, password })
  return data
}

export const obtenerPerfilAPI = async (): Promise<AuthUser> => {
  const { data } = await axios.get(`${API}${routes.profile}`, { withCredentials: true })
  // El backend devuelve el usuario dentro de `data.email` (así lo tenías en Vue)
  return {
    id: data.email.id,
    username: data.email.username,
    email: data.email.email,
  }
}

export const logoutAPI = async () => {
  return axios.post(`${API}${routes.logout}`, {}, { withCredentials: true })
}

export const adminDataAPI = async (): Promise<string> => {
  const { data } = await axios.get(`${API}${routes.adminData}`, { withCredentials: true })
  return data.secretData
}

export const forgottenPassAPI = async (emailFP: string) => {
  const { data } = await axios.post(`${API}${routes.forgottenPass}`, { emailFP })
  return data
}