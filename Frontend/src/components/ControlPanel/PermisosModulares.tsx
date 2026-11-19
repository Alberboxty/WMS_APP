import { useEffect } from 'react'
import type { SubmitEvent } from 'react'
import { useRoutesPermissions } from '@/hooks/useRoutesPermissions'

export default function PermisosModulares() {
    const {
        routesPermisos,
        inputRouteAPI,
        setInputRouteAPI,
        inputMethod,
        setInputMethod,
        inputRIDPermission,
        setInputRIDPermission,
        inputIsPublic,
        setInputIsPublic,
        modoFormularioRoutesPermissions,
        obtenerFRoutesPermissions,
        creaFRoutePermission,
        editarFRoutePermission,
        eliminarFRoutePermission,
    } = useRoutesPermissions()

    useEffect(() => {
        void obtenerFRoutesPermissions()
    }, [obtenerFRoutesPermissions])

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        void creaFRoutePermission()
    }

    const textoBoton = modoFormularioRoutesPermissions === 'crear' ? 'Crear Ruta' : 'Editar Ruta'

    return (
        <div>
            <h1>Crear Rutas API</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputRouteAPI}
                    onChange={(e) => setInputRouteAPI(e.target.value)}
                    placeholder="Ruta de la api"
                />
                <input
                    type="text"
                    value={inputMethod}
                    onChange={(e) => setInputMethod(e.target.value)}
                    placeholder="Metodo"
                />
                <input
                    type="number"
                    value={inputRIDPermission ?? ''}
                    onChange={(e) =>
                        setInputRIDPermission(e.target.value ? Number(e.target.value) : null)
                    }
                    placeholder="ID permiso"
                />
                <select
                    value={String(inputIsPublic)}
                    onChange={(e) => setInputIsPublic(e.target.value === 'true')}
                >
                    <option value="true">Pública</option>
                    <option value="false">Privada</option>
                </select>
                <button type="submit">{textoBoton}</button>
            </form>

            <h1>Tabla de Rutas API</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID Ruta API</th>
                        <th>Ruta API</th>
                        <th>Method</th>
                        <th>ID Permiso</th>
                        <th>Es Publico</th>
                    </tr>
                </thead>
                <tbody>
                    {routesPermisos.map((routePermiso) => (
                        <tr key={routePermiso.id_route_permission}>
                            <td>{routePermiso.id_route_permission}</td>
                            <td>{routePermiso.route}</td>
                            <td>{routePermiso.method}</td>
                            <td>{routePermiso.id_permission}</td>
                            <td>{String(routePermiso.is_public)}</td>
                            <td>
                                <button onClick={() => editarFRoutePermission(routePermiso)}>editar</button>
                            </td>
                            <td>
                                <button
                                onClick={() => void eliminarFRoutePermission(routePermiso.id_route_permission)}
                                >
                                eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}