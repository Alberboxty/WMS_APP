
import { http } from './http'

import type {
    Stock,
    CreateArticuloDTO
    
} from '@/types/inventory.types'

const INVENTORY_URL = '/admin/almacen'

export const obtenerInventario = async (): Promise<Stock[]> => {
    const { data } = await http.get<Stock[]>(INVENTORY_URL)
    return data
}

export const obtenerArticulo = async (id: number): Promise<Stock> => {
    const { data } = await http.get<Stock>(`${INVENTORY_URL}/${id}`)
    return data
}

export const agregarArticulo = async (articulo: CreateArticuloDTO) => {
    const { data } = await http.post(INVENTORY_URL, articulo)
    return data
}

export const actualizarArticulo = async ( id: number, articulo: CreateArticuloDTO) => {
    const { data } = await http.put(`${INVENTORY_URL}/${id}`, articulo)
    return data
}

export const cambiarEstadoEtiqueta = async (id: number, estado: boolean) => {
    const { data } = await http.patch(
        `${INVENTORY_URL}/${id}/etiqueta`,
        { estado_etiqueta: estado }
    )
    return data
}

export const eliminarArticulo = async (id: number) => {
    const { data } = await http.delete(`${INVENTORY_URL}/${id}`)
    return data
}
