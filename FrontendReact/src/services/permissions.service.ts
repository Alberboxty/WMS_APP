import { http } from '@/services/http'
import type { permisos } from '@/types/permisos.type'

const BASE = '/admin/permisos'

export const obtenerPermissions = async (): Promise<permisos[]> => {
    const { data } = await http.get(BASE)
    return data
}

export const crearPermissions = async (payload: object): Promise<permisos> => {
    const { data } = await http.post(BASE, payload)
    return data
}

export const editarPermission = async (
    idPermissionSeleccionado: number,
    payload: object,
): Promise<permisos> => {
    const { data } = await http.patch(`${BASE}/${idPermissionSeleccionado}`, payload)
    return data
}

export const eliminarPermission = async (idPermissionSeleccionado: number): Promise<void> => {
    await http.delete(`${BASE}/${idPermissionSeleccionado}`)
}