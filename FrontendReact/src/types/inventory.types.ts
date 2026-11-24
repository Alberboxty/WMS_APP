
export interface Stock {
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

export interface CreateArticuloDTO {
    ubicacion: string;
    section?: string | null;
    codigo: string;
    cantidad?: number;
    formato?: string | null;
    estado_etiqueta?: boolean;
}

export interface FormularioArticulo {
    ubicacion: string
    section: string
    codigo: string
    cantidad: string
    formato: string
    estado_etiqueta: boolean
}

export interface InventoryFormProps {
    form: FormularioArticulo
    modo: 'Crear' | 'Editar'
    guardando: boolean
    errorForm: string | null
    handleChange: <K extends keyof FormularioArticulo>(
        campo: K,
        valor: FormularioArticulo[K]
    ) => void
    enviarFormulario: (e: React.FormEvent<HTMLFormElement>) => void
    cerrarFormulario: () => void
}

export type ModoFormulario = 'Crear' | 'Editar'