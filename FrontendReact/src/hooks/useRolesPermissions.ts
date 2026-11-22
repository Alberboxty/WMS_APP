import { useCallback, useState } from 'react'
import {
    obtenerRolesPermissions,
    crearRolePermission,
    eliminarRolePermission,
} from '@/services/rolesPermissions.service'
import type { rolesPermissions as RolPermiso } from '@/types/rolesPermissions.type'

export function useRolesPermissions() {
    const [rolesPermissions, setRolesPermissions] = useState<RolPermiso[]>([])
    const [inputIDRoles, setInputIDRoles] = useState<number | null>(null)
    const [inputIDPermissions, setInputIDPermissions] = useState<number | null>(null)

    const resetRolesPermissionsFormulario = useCallback(() => {
        setInputIDRoles(null)
        setInputIDPermissions(null)
    }, [])

    const obtenerFRolesPermissions = useCallback(async () => {
        try {
            setRolesPermissions(await obtenerRolesPermissions())
        } catch (error) {
            console.error('Error no se obtuvieron las relaciones rol-permiso', error)
        }
    }, [])

    const creaFRolePermission = useCallback(async () => {
        if (inputIDRoles === null || inputIDPermissions === null) {
            console.error('Falta seleccionar rol o permiso')
            return
        }
        try {
            const creado = await crearRolePermission({
                idRol: inputIDRoles,
                idPermission: inputIDPermissions,
            })
            setRolesPermissions((prev) => [...prev, creado])
            resetRolesPermissionsFormulario()
        } catch (error) {
            console.error('Error al crear la relación rol-permiso', error)
        }
    }, [inputIDRoles, inputIDPermissions, resetRolesPermissionsFormulario])

    const eliminarFRolePermission = useCallback(async (idRol: number, idPermission: number) => {
        if (!confirm('¿Seguro que quieres eliminar este permiso del rol?')) return
        try {
            await eliminarRolePermission(idRol, idPermission)
            setRolesPermissions((prev) =>
                prev.filter((rp) => !(rp.id_rol === idRol && rp.id_permission === idPermission)),
            )
        } catch (error) {
            console.error('Error al eliminar la relación rol-permiso', error)
            alert('No se pudo eliminar el permiso del rol')
        }
    }, [])

    return {
        rolesPermissions,
        inputIDRoles,
        setInputIDRoles,
        inputIDPermissions,
        setInputIDPermissions,
        obtenerFRolesPermissions,
        creaFRolePermission,
        eliminarFRolePermission,
        resetRolesPermissionsFormulario,
    }
}