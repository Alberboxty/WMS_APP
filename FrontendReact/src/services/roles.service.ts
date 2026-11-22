import { http } from '@/services/http'
import type { roles } from '@/types/roles.type'

const BASE = '/admin/roles'

export const obtenerRoles = async (): Promise<roles[]> => {
  const { data } = await http.get(BASE)
  return data
}

export const crearRoles = async (payload: object): Promise<roles> => {
  const { data } = await http.post(BASE, payload)
  return data
}

export const editarRoles = async (idRolesSeleccionado: number, payload: object): Promise<roles> => {
  const { data } = await http.patch(`${BASE}/${idRolesSeleccionado}`, payload)
  return data
}

export const eliminarRoles = async (idRolesSeleccionado: number): Promise<void> => {
  await http.delete(`${BASE}/${idRolesSeleccionado}`)
}