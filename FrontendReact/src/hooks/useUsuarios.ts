import { useCallback, useState } from 'react'
import {
    eliminarUsuario,
    obtenerUsuarios,
    enviarUsuarios,
} from '@/services/usuarios.service'
import type { usuarios as Usuario } from '@/types/usuarios.types'

export function useUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [idUsuarioSel, setIdUsuarioSel] = useState<number | null>(null)

    const [inputUsuario, setInputUsuario] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputIdRol, setInputIdRol] = useState<number | null>(null)
    const [inputVerified, setInputVerified] = useState(false)

    const resetUsuarioFormulario = useCallback(() => {
        setIdUsuarioSel(null)
        setInputUsuario('')
        setInputEmail('')
        setInputIdRol(null)
        setInputVerified(false)
    }, [])

    const obtenerFUsuarios = useCallback(async () => {
        try {
            setUsuarios(await obtenerUsuarios())
        } catch (error) {
            console.error('Error no se obtuvieron los usuarios', error)
        }
    }, [])

    const enviarFUsuarios = useCallback(async () => {
        if (idUsuarioSel === null) {
            console.error('No hay ID seleccionada')
            return
        }
        const payload = {
            username: inputUsuario,
            email: inputEmail,
            id_rol: inputIdRol,
            verified: inputVerified,
        }
        try {
            const editado = await enviarUsuarios(idUsuarioSel, payload)
            setUsuarios((prev) => prev.map((u) => (u.id === idUsuarioSel ? editado : u)))
            resetUsuarioFormulario()
        } catch (error) {
            console.error('Error al editar usuario', error)
        }
    }, [idUsuarioSel, inputUsuario, inputEmail, inputIdRol, inputVerified, resetUsuarioFormulario])

    const editarFUsuario = useCallback((usuario: Usuario) => {
        setInputUsuario(usuario.username)
        setInputEmail(usuario.email)
        setInputIdRol(usuario.id_rol)
        setInputVerified(usuario.verified)
        setIdUsuarioSel(usuario.id)
    }, [])

    const eliminarFUsuario = useCallback(
        async (id: number) => {
        if (!confirm('¿Seguro que quieres eliminar este usuario?')) return
            try {
                await eliminarUsuario(id)
                setUsuarios((prev) => prev.filter((u) => u.id !== id))
                if (id === idUsuarioSel) resetUsuarioFormulario()
            } catch (error) {
                console.error('Error al eliminar el usuario', error)
                alert('No se pudo eliminar el usuario')
            }
        },
        [idUsuarioSel, resetUsuarioFormulario],
    )

    return {
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
    }
}