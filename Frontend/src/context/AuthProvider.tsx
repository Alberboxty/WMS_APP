import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '@/context/auth.context'
import { logoutAPI, obtenerPerfilAPI } from '@/services/auth.service'
import type { AuthUser } from '@/types/auth.types'

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate()
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)

    const obtenerPerfil = useCallback(async () => {
        try {
            setUser(await obtenerPerfilAPI())
        } catch {
            setUser(null) // sin sesión válida
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            await logoutAPI()
            setUser(null)
            navigate('/')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
    }, [navigate])

    // Se carga el perfil una sola vez al arrancar la app
    useEffect(() => {
        void obtenerPerfil()
    }, [obtenerPerfil])

    const value = useMemo(
        () => ({ user, loading, obtenerPerfil, logout }),
        [user, loading, obtenerPerfil, logout],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}