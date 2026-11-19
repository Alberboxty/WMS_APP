import { useEffect } from 'react'
import type { SubmitEvent } from 'react'
import { useUsuarios } from '@/hooks/useUsuarios'

export default function UsuariosAPI() {
    const {
        usuarios,
        idUsuarioSel,
        inputUsuario,
        setInputUsuario,
        inputEmail,
        setInputEmail,
        inputIdRol,
        setInputIdRol,
        inputVerified,
        setInputVerified,
        obtenerFUsuarios,
        enviarFUsuarios,
        editarFUsuario,
        eliminarFUsuario,
        resetUsuarioFormulario,
    } = useUsuarios()

    useEffect(() => {
        void obtenerFUsuarios()
    }, [obtenerFUsuarios])

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        void enviarFUsuarios()
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Editar</h1>

                <label htmlFor="usuario">Usuario</label>
                <input
                    id="usuario"
                    type="text"
                    value={inputUsuario}
                    onChange={(e) => setInputUsuario(e.target.value)}
                    placeholder="Usuario"
                />

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="text"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="Email"
                />

                <label htmlFor="id_rol">id_rol</label>
                <input
                    id="id_rol"
                    type="number"
                    value={inputIdRol ?? ''}
                    onChange={(e) => setInputIdRol(e.target.value ? Number(e.target.value) : null)}
                    placeholder="id_rol"
                />

                <label htmlFor="verified">Verified</label>
                <input
                    id="verified"
                    type="checkbox"
                    checked={inputVerified}
                    onChange={(e) => setInputVerified(e.target.checked)}
                />

                <button type="submit" disabled={idUsuarioSel === null}>
                    Enviar
                </button>
                {idUsuarioSel !== null && (
                    <button type="button" onClick={resetUsuarioFormulario}>
                        Cancelar
                    </button>
                )}
            </form>

            <h1>Lista de usuarios</h1>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>username</th>
                        <th>email</th>
                        <th>create_at</th>
                        <th>id_rol</th>
                        <th>verified</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.username}</td>
                            <td>{usuario.email}</td>
                            <td>{String(usuario.create_at)}</td>
                            <td>{usuario.id_rol}</td>
                            <td>{String(usuario.verified)}</td>
                            <td>
                                <button onClick={() => editarFUsuario(usuario)}>Editar</button>
                            </td>
                            <td>
                                <button onClick={() => void eliminarFUsuario(usuario.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}