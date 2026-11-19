import { useCallback, useState } from 'react'
import {
    obtenerRoles,
    crearRoles,
    editarRoles,
    eliminarRoles,
} from '@/services/roles.service'
import type { roles as Rol } from '@/types/roles.type'

export function useRoles() {
    const [roles, setRoles] = useState<Rol[]>([])
    const [nombreRoles, setNombreRoles] = useState('')
    const [idRolesSeleccionado, setIdRolesSeleccionado] = useState<number | null>(null)

    // Derivado: si hay un id seleccionado estamos editando, si no, creando
    const modoFormularioRoles: 'crear' | 'editar' =
        idRolesSeleccionado === null ? 'crear' : 'editar'

    const resetRolesFormulario = useCallback(() => {
        setNombreRoles('')
        setIdRolesSeleccionado(null)
    }, [])

    const obtenerFRoles = useCallback(async () => {
        try {
            setRoles(await obtenerRoles())
        } catch (error) {
            console.error('Error no se obtuvieron los roles', error)
        }
    }, [])

    const creaFRol = useCallback(async () => {
        const payload = { rol_name: nombreRoles }
        try {
            if (idRolesSeleccionado === null) {
                const creado = await crearRoles(payload)
                setRoles((prev) => [...prev, creado])
            } else {
                const editado = await editarRoles(idRolesSeleccionado, payload)
                setRoles((prev) => prev.map((r) => (r.id_rol === idRolesSeleccionado ? editado : r)))
            }
            resetRolesFormulario()
        } catch (error) {
            console.error('Error al guardar rol', error)
        }
    }, [nombreRoles, idRolesSeleccionado, resetRolesFormulario])

    const editarFRol = useCallback((rol: Rol) => {
        setNombreRoles(rol.rol_name)
        setIdRolesSeleccionado(rol.id_rol)
    }, [])

    const eliminarFRol = useCallback(
        async (idRol: number) => {
            if (!confirm('¿Seguro que quieres eliminar este rol?')) return
            try {
                await eliminarRoles(idRol)
                setRoles((prev) => prev.filter((r) => r.id_rol !== idRol))
                if (idRol === idRolesSeleccionado) resetRolesFormulario()
            } catch (error) {
                console.error('Error al eliminar rol', error)
                alert('No se pudo eliminar el rol')
            }
        },
        [idRolesSeleccionado, resetRolesFormulario],
    )

    return {
        roles,
        nombreRoles,
        setNombreRoles,
        modoFormularioRoles,
        obtenerFRoles,
        creaFRol,
        editarFRol,
        eliminarFRol,
        resetRolesFormulario,
    }
}