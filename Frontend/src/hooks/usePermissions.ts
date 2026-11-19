import { useCallback, useState } from 'react'
import {
  obtenerPermissions,
  crearPermissions,
  editarPermission,
  eliminarPermission,
} from '@/services/permissions.service'
import type { permisos as Permiso } from '@/types/permisos.type'

export function usePermissions() {
    const [permisos, setPermisos] = useState<Permiso[]>([])
    const [nombrePermiso, setNombrePermiso] = useState('')
    const [idPermissionSeleccionado, setIdPermissionSeleccionado] = useState<number | null>(null)

    // Derivado: si hay un id seleccionado estamos editando, si no, creando
    const modoFormularioPermissions: 'crear' | 'editar' =
        idPermissionSeleccionado === null ? 'crear' : 'editar'

    const resetPermissionFormulario = useCallback(() => {
        setNombrePermiso('')
        setIdPermissionSeleccionado(null)
    }, [])

    const obtenerFPermissions = useCallback(async () => {
        try {
            setPermisos(await obtenerPermissions())
        } catch (error) {
            console.error('Error no se obtuvieron los permisos', error)
        }
    }, [])

    const creaFPermissions = useCallback(async () => {
        const payload = { nombre: nombrePermiso }
        try {
            if (idPermissionSeleccionado === null) {
                const creado = await crearPermissions(payload)
                setPermisos((prev) => [...prev, creado])
            } else {
                const editado = await editarPermission(idPermissionSeleccionado, payload)
                setPermisos((prev) =>
                prev.map((p) => (p.id_permission === idPermissionSeleccionado ? editado : p)),
                )
            }
            resetPermissionFormulario()
        } catch (error) {
            console.error('Error al guardar permiso', error)
        }
    }, [nombrePermiso, idPermissionSeleccionado, resetPermissionFormulario])

    const editarFPermissions = useCallback((permiso: Permiso) => {
        setNombrePermiso(permiso.nombre)
        setIdPermissionSeleccionado(permiso.id_permission)
    }, [])

    const eliminarFPermissions = useCallback(
        async (idPermission: number) => {
            if (!confirm('¿Seguro que quieres eliminar este permiso?')) return
            try {
                await eliminarPermission(idPermission)
                setPermisos((prev) => prev.filter((p) => p.id_permission !== idPermission))
                if (idPermission === idPermissionSeleccionado) resetPermissionFormulario()
            } catch (error) {
                console.error('Error al eliminar permiso', error)
                alert('No se pudo eliminar el permiso')
            }
        },
        [idPermissionSeleccionado, resetPermissionFormulario],
    )

    return {
        permisos,
        nombrePermiso,
        setNombrePermiso,
        modoFormularioPermissions,
        obtenerFPermissions,
        creaFPermissions,
        editarFPermissions,
        eliminarFPermissions,
        resetPermissionFormulario,
    }
}