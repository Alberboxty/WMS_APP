import { useState, useMemo } from 'react'

import type { Stock } from '@/types/inventory.types'

const normalizar = (texto: string) =>
    texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const useInventarioFiltros = (inventario: Stock[]) => {
    const [busqueda, setBusqueda] = useState('')

    const inventarioFiltrado = useMemo(() => {
        const terminos = normalizar(busqueda).split(' ').filter(Boolean)
        if (terminos.length === 0) return inventario

        return inventario.filter(articulo => {
            const textoBuscable = normalizar([
                articulo.codigo,
                articulo.ubicacion,
                articulo.section,
                articulo.formato,
                String(articulo.cantidad),
                articulo.estado_etiqueta ? 'buen estado' : 'mal estado'
            ].filter(Boolean).join(' '))

            return terminos.every(t => textoBuscable.includes(t))
        })
    }, [inventario, busqueda])

    return { busqueda, setBusqueda, inventarioFiltrado }
}