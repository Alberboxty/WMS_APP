import { http } from '@/services/http'
import type { rolesPermissions } from '@/types/rolesPermissions.type'

const BASE = '/admin/rolespermissions'

export const obtenerRolesPermissions = async (): Promise<rolesPermissions[]> => {
  const { data } = await http.get(BASE)
  return data
}

export const crearRolePermission = async (payload: object): Promise<rolesPermissions> => {
  const { data } = await http.post(BASE, payload)
  return data
}

export const eliminarRolePermission = async (
  idRol: number,
  idPermission: number,
): Promise<void> => {
  await http.delete(`${BASE}/${idRol}/${idPermission}`)
}