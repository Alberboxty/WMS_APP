
import { useCallback, useState } from 'react'

import {
    obtenerInventario,
    agregarArticulo,
    actualizarArticulo,
    eliminarArticulo,
    cambiarEstadoEtiqueta
} from '@/services/inventory.service'

import type {
    InventoryItem,
    CreateInventoryItem,
    UpdateInventoryItem
} from '@/types/inventory.types'

export const useInventory = () => {
    const [articulos, setArticulos] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const obtenerArticulos = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await obtenerInventario()
            setArticulos(data)
        } catch (err) {
            console.error(err)
            setError('No se pudo cargar el inventario.')
        } finally {
            setLoading(false)
        }
    }, [])

    const crearArticulo = async (articulo: CreateInventoryItem) => {
        const response = await agregarArticulo(articulo)
        await obtenerArticulos()
        return response
    }

    const editarArticulo = async (
        id: number,
        articulo: UpdateInventoryItem
    ) => {
        const response = await actualizarArticulo(id, articulo)
        await obtenerArticulos()
        return response
    }

    const actualizarEtiqueta = async (
        id: number,
        estado: boolean
    ) => {
        const response = await cambiarEstadoEtiqueta(id, estado)
        await obtenerArticulos()
        return response
    }

    const borrarArticulo = async (id: number) => {
        const response = await eliminarArticulo(id)
        await obtenerArticulos()
        return response
    }

    return {
        articulos,
        loading,
        error,
        obtenerArticulos,
        crearArticulo,
        editarArticulo,
        actualizarEtiqueta,
        borrarArticulo
    }
}
