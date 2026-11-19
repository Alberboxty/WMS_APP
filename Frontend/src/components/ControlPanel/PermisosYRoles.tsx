import { useEffect } from 'react'
import type { SubmitEvent } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { useRoles } from '@/hooks/useRoles'
import { useRolesPermissions } from '@/hooks/useRolesPermissions'

export default function PermisosYRoles() {
    const {
        permisos,
        nombrePermiso,
        setNombrePermiso,
        modoFormularioPermissions,
        obtenerFPermissions,
        creaFPermissions,
        editarFPermissions,
        eliminarFPermissions,
    } = usePermissions()

    const {
        roles,
        nombreRoles,
        setNombreRoles,
        modoFormularioRoles,
        obtenerFRoles,
        creaFRol,
        editarFRol,
        eliminarFRol,
    } = useRoles()

    const {
        rolesPermissions,
        inputIDRoles,
        setInputIDRoles,
        inputIDPermissions,
        setInputIDPermissions,
        obtenerFRolesPermissions,
        creaFRolePermission,
        eliminarFRolePermission,
    } = useRolesPermissions()

    useEffect(() => {
        void obtenerFPermissions()
        void obtenerFRoles()
        void obtenerFRolesPermissions()
    }, [obtenerFPermissions, obtenerFRoles, obtenerFRolesPermissions])

    const submit = (accion: () => Promise<void>) => (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        void accion()
    }

    const aNumeroONull = (valor: string) => (valor ? Number(valor) : null)

    return (
        <div>
            <h1>Tabla de Permisos</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID Permission</th>
                        <th>Nombre Permission</th>
                    </tr>
                </thead>
                <tbody>
                    {permisos.map((permiso) => (
                        <tr key={permiso.id_permission}>
                            <td>{permiso.id_permission}</td>
                            <td>{permiso.nombre}</td>
                            <td>
                                <button onClick={() => editarFPermissions(permiso)}>editar</button>
                            </td>
                            <td>
                                <button onClick={() => void eliminarFPermissions(permiso.id_permission)}>
                                eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={submit(creaFPermissions)}>
                <input
                    type="text"
                    value={nombrePermiso}
                    onChange={(e) => setNombrePermiso(e.target.value)}
                    placeholder="Escribe el permiso"
                />
                <button type="submit">
                    {modoFormularioPermissions === 'crear' ? 'Crear permiso' : 'Editar Permiso'}
                </button>
            </form>

            <h1>Tabla de roles</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID Rol</th>
                        <th>Nombre Rol</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((rol) => (
                        <tr key={rol.id_rol}>
                            <td>{rol.id_rol}</td>
                            <td>{rol.rol_name}</td>
                            <td>
                                <button onClick={() => editarFRol(rol)}>editar</button>
                            </td>
                            <td>
                                <button onClick={() => void eliminarFRol(rol.id_rol)}>eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={submit(creaFRol)}>
                <input
                type="text"
                value={nombreRoles}
                onChange={(e) => setNombreRoles(e.target.value)}
                placeholder="Escribe el rol"
                />
                <button type="submit">
                {modoFormularioRoles === 'crear' ? 'Crear Rol' : 'Editar Rol'}
                </button>
            </form>

            <h1>Asignación de Roles y permisos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre Rol</th>
                        <th>ID Rol</th>
                        <th>Nombre Permission</th>
                        <th>ID Permission</th>
                    </tr>
                </thead>
                <tbody>
                    {rolesPermissions.map((rp) => (
                        <tr key={`${rp.id_rol}-${rp.id_permission}`}>
                            <td>{rp.role}</td>
                            <td>{rp.id_rol}</td>
                            <td>{rp.permission}</td>
                            <td>{rp.id_permission}</td>
                            <td>
                                <button onClick={() => void eliminarFRolePermission(rp.id_rol, rp.id_permission)}>
                                eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={submit(creaFRolePermission)}>
                <input
                    type="number"
                    value={inputIDRoles ?? ''}
                    onChange={(e) => setInputIDRoles(aNumeroONull(e.target.value))}
                    placeholder="Escribe el ID del rol"
                />
                <input
                    type="number"
                    value={inputIDPermissions ?? ''}
                    onChange={(e) => setInputIDPermissions(aNumeroONull(e.target.value))}
                    placeholder="Escribe el ID del permiso"
                />
                <button type="submit">Crear</button>
            </form>
        </div>
    )
}