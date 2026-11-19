import { http } from '@/services/http'
import type { usuarios } from '@/types/usuarios.types'

const BASE = '/admin/usuarios'

export const obtenerUsuarios = async (): Promise<usuarios[]> => {
  const { data } = await http.get(BASE)
  return data
}

export const enviarUsuarios = async (id: number, inputsData: object): Promise<usuarios> => {
  const { data } = await http.patch(`${BASE}/${id}`, inputsData)
  return data
}

export const eliminarUsuario = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`)
}