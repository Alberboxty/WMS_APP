import { useState, useEffect } from 'react'

import type { Stock, CreateArticuloDTO, FormularioArticulo, ModoFormulario } from '@/types/inventory.types'

import { 
    obtenerInventario,
    agregarArticulo,
    actualizarArticulo,
    eliminarArticulo

} from '@/services/inventory.service'

const FORMULARIO_INICIAL: FormularioArticulo = {
    ubicacion: '',
    section: '',
    codigo: '',
    cantidad: '',
    formato: '',
    estado_etiqueta: false,
}


export const useInventario = () => {
    const [inventario, setInventario] = useState<Stock[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const cargarInventario = async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await obtenerInventario()

            setInventario(data)

        } catch (error) {
            console.error(error)
            setError('No se pudo obtener el inventario')

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarInventario()
    }, [])


    // ===== FORMULARIO (nuevo) =====
    const [form, setForm] = useState<FormularioArticulo>(FORMULARIO_INICIAL)
    const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null)
    const [formAbierto, setFormAbierto] = useState<boolean>(false)
    const [guardando, setGuardando] = useState<boolean>(false)
    const [errorForm, setErrorForm] = useState<string | null>(null)

    // El "modoFormularioNews", pero calculado
    
    const modo: ModoFormulario = idSeleccionado === null ? 'Crear' : 'Editar'

    // El v-model de vue
    const handleChange = <K extends keyof FormularioArticulo>(
        campo: K,
        valor: FormularioArticulo[K]
    ) => {
        setForm(prev => ({ ...prev, [campo]: valor }))
    }

    const resetFormulario = () => {
        setForm(FORMULARIO_INICIAL)
        setIdSeleccionado(null)
        setErrorForm(null)
    }


    const abrirCrear = () => {
        resetFormulario()
        setFormAbierto(true)
    }

    // tu editarFNoticia
    const abrirEditar = (articulo: Stock) => {
        setForm({
            ubicacion: articulo.ubicacion,
            section: articulo.section ?? '',
            codigo: articulo.codigo,
            cantidad: String(articulo.cantidad),
            formato: articulo.formato ?? '',
            estado_etiqueta: articulo.estado_etiqueta
        })
        setIdSeleccionado(articulo.id)
        setErrorForm(null)
        setFormAbierto(true)
    }

    //Modo de abrir y cerrar formulario

    const cerrarFormulario = () => {
        resetFormulario()
        setFormAbierto(false)
    }

    const enviarFormulario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const ubicacion = form.ubicacion.trim()
        const codigo = form.codigo.trim()

        if (!ubicacion || !codigo) {
            setErrorForm('Código y ubicación son obligatorios')
            return
        }

        const articulo: CreateArticuloDTO = {
            ubicacion,
            codigo,
            section: form.section.trim() || null,
            formato: form.formato.trim() || null,
            estado_etiqueta: form.estado_etiqueta,
            ...(form.cantidad !== '' && { cantidad: Number(form.cantidad) })

        }

        try {
            setGuardando(true)
            setErrorForm(null)

            if (idSeleccionado === null) {
                await agregarArticulo(articulo)                       // Crear
            } else {
                await actualizarArticulo(idSeleccionado, articulo)    // Editar
            }

            cerrarFormulario()
            await cargarInventario()

        } catch (err) {
            console.error(err)
            setErrorForm(err instanceof Error ? err.message : 'No se pudo guardar el artículo')

        } finally {
            setGuardando(false)
        }
    }

    const borrarArticulo = async (articulo: Stock) => {
        if (!window.confirm(`¿Eliminar el artículo ${articulo.codigo}?`)) return

        try {
            await eliminarArticulo(articulo.id)
            await cargarInventario()
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : 'No se pudo eliminar el artículo')
        }
    }

    return {
        inventario,
        loading,
        error,
        cargarInventario,
        form,
        modo,
        formAbierto,
        guardando,
        errorForm,
        handleChange,
        abrirCrear,
        abrirEditar,
        cerrarFormulario,
        enviarFormulario,
        borrarArticulo
    }
}