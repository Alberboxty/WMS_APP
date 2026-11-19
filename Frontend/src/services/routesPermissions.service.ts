import { http } from '@/services/http'
import type { RoutePermisos } from '@/types/routePermission.type'

const BASE = '/admin/routespermissions'

// MySQL devuelve TINYINT(1): 1 / 0. Lo convertimos a boolean.
const normalizar = (r: RoutePermisos): RoutePermisos => ({
  ...r,
  is_public: Boolean(r.is_public),
})

export const obtenerRoutesPermissions = async (): Promise<RoutePermisos[]> => {
  const { data } = await http.get<RoutePermisos[]>(BASE)
  return data.map(normalizar)
}

export const crearRoutePermission = async (payload: object): Promise<RoutePermisos> => {
  const { data } = await http.post<RoutePermisos>(BASE, payload)
  return normalizar(data)
}

export const editarRoutePermission = async (
  idRoutePermission: number,
  payload: object,
): Promise<RoutePermisos> => {
  const { data } = await http.patch<RoutePermisos>(`${BASE}/${idRoutePermission}`, payload)
  return normalizar(data)
}

export const eliminarRoutePermission = async (idRoutePermission: number): Promise<void> => {
  await http.delete(`${BASE}/${idRoutePermission}`)
}