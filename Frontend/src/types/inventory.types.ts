
export interface InventoryItem {
    id: number
    ubicacion: string
    codigo: string
    cantidad: number
    formato: string | null
    etiqueta: string | null
    estado_etiqueta: boolean
    autor_id: number | null
    created_at: string
    section: string | null
}

export interface CreateInventoryItem {
    ubicacion: string
    codigo: string
    cantidad?: number
    formato?: string | null
    estado_etiqueta?: boolean
    section?: string | null
}

export interface UpdateInventoryItem {
    ubicacion?: string
    codigo?: string
    cantidad?: number
    formato?: string | null
    estado_etiqueta?: boolean
    section?: string | null
}

export type InventoryFilter = {
    search: string
    section: string
    etiqueta: 'all' | 'pending' | 'completed'
}
