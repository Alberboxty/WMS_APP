import { useCallback, useState } from 'react'
import type { RoutePermisos } from '@/types/routePermission.type'
import {
  obtenerRoutesPermissions,
  crearRoutePermission,
  editarRoutePermission,
  eliminarRoutePermission,
} from '@/services/routesPermissions.service'

export function useRoutesPermissions() {
    const [routesPermisos, setRoutesPermisos] = useState<RoutePermisos[]>([])
    const [inputRouteAPI, setInputRouteAPI] = useState('')
    const [inputMethod, setInputMethod] = useState('')
    const [inputRIDPermission, setInputRIDPermission] = useState<number | null>(null)
    const [inputIsPublic, setInputIsPublic] = useState(false)
    const [idSeleccionadoRoutesPermissions, setIdSeleccionadoRoutesPermissions] = useState<
        number | null
    >(null)

    // Derivado: si hay un id seleccionado estamos editando, si no, creando
    const modoFormularioRoutesPermissions: 'crear' | 'editar' =
        idSeleccionadoRoutesPermissions === null ? 'crear' : 'editar'

    const resetRoutesPermissionsFormulario = useCallback(() => {
        setInputRouteAPI('')
        setInputMethod('')
        setInputRIDPermission(null)
        setInputIsPublic(false)
        setIdSeleccionadoRoutesPermissions(null)
    }, [])

    const obtenerFRoutesPermissions = useCallback(async () => {
        try {
            setRoutesPermisos(await obtenerRoutesPermissions())
        } catch (error) {
            console.error('Error no se obtuvieron las rutas con permisos', error)
        }
    }, [])

    const creaFRoutePermission = useCallback(async () => {
        const payload = {
            route: inputRouteAPI,
            method: inputMethod,
            id_permission: inputRIDPermission,
            is_public: inputIsPublic,
        }
        try {
            if (idSeleccionadoRoutesPermissions === null) {
                const creado = await crearRoutePermission(payload)
                setRoutesPermisos((prev) => [...prev, creado])
            } else {
                const editado = await editarRoutePermission(idSeleccionadoRoutesPermissions, payload)
                setRoutesPermisos((prev) =>
                prev.map((r) =>
                    r.id_route_permission === idSeleccionadoRoutesPermissions ? editado : r,
                ),
                )
            }
            resetRoutesPermissionsFormulario()
        } catch (error) {
            console.error('Error al guardar la ruta con permiso', error)
        }
    }, [
        inputRouteAPI,
        inputMethod,
        inputRIDPermission,
        inputIsPublic,
        idSeleccionadoRoutesPermissions,
        resetRoutesPermissionsFormulario,
    ])

    const editarFRoutePermission = useCallback((routePermiso: RoutePermisos) => {
        setInputRouteAPI(routePermiso.route)
        setInputMethod(routePermiso.method)
        setInputRIDPermission(routePermiso.id_permission)
        setInputIsPublic(routePermiso.is_public)
        setIdSeleccionadoRoutesPermissions(routePermiso.id_route_permission)
    }, [])

    const eliminarFRoutePermission = useCallback(
        async (idRoutePermission: number) => {
        if (!confirm('¿Seguro que quieres eliminar esta ruta con permiso?')) return
            try {
                await eliminarRoutePermission(idRoutePermission)
                setRoutesPermisos((prev) =>
                    prev.filter((r) => r.id_route_permission !== idRoutePermission),
                )
                if (idRoutePermission === idSeleccionadoRoutesPermissions) {
                    resetRoutesPermissionsFormulario()
                }
            } catch (error) {
                console.error('Error al eliminar la ruta con permiso', error)
                alert('No se pudo eliminar la ruta con permiso')
            }
        },
        [idSeleccionadoRoutesPermissions, resetRoutesPermissionsFormulario],
    )

    return {
        routesPermisos,
        inputRouteAPI,
        setInputRouteAPI,
        inputMethod,
        setInputMethod,
        inputRIDPermission,
        setInputRIDPermission,
        inputIsPublic,
        setInputIsPublic,
        idSeleccionadoRoutesPermissions,
        modoFormularioRoutesPermissions,
        obtenerFRoutesPermissions,
        creaFRoutePermission,
        editarFRoutePermission,
        eliminarFRoutePermission,
        resetRoutesPermissionsFormulario,
    }
}