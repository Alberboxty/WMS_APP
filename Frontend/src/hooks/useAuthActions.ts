import { useCallback, useState } from 'react'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  adminDataAPI,
  forgottenPassAPI,
  logearseAPI,
  registrarseAPI,
} from '@/services/auth.service'
import { getErrorMessage } from '@/utils/apiError'
import type { LoginPayload, RegisterPayload } from '@/types/auth.types'

export function useAuthActions() {
    const navigate = useNavigate()
    const { obtenerPerfil } = useAuth()

    const [errorLogin, setErrorLogin] = useState('')
    const [errorRegistro, setErrorRegistro] = useState('')
    const [errorForgotten, setErrorForgotten] = useState('')
    const [successForgotten, setSuccessForgotten] = useState('')
    const [admin, setAdmin] = useState('')

    const logearse = useCallback(
        async (payload: LoginPayload) => {
        setErrorLogin('')
        try {
            await logearseAPI(payload)
            await obtenerPerfil() // actualiza el user compartido antes de navegar
            navigate('/perfil')
        } catch (error) {
            setErrorLogin(getErrorMessage(error, 'Error inesperado al iniciar sesión.'))
        }
        },
        [navigate, obtenerPerfil],
    )

    const registrarse = useCallback(async (payload: RegisterPayload) => {
        setErrorRegistro('')
        try {
            await registrarseAPI(payload)
        } catch (error) {   
            setErrorRegistro(getErrorMessage(error, 'Error inesperado al registrarse.'))
        }
    }, [])

    const forgottenPass = useCallback(async (email: string) => {
        setErrorForgotten('')
        setSuccessForgotten('')
        try {
            const res = await forgottenPassAPI(email)
            setSuccessForgotten(res.msg)
        } catch (error) {
            setErrorForgotten(getErrorMessage(error, 'Error inesperado al enviar el email.'))
        }
    }, [])

    const adminData = useCallback(async () => {
        try {
            setAdmin(await adminDataAPI())
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.status === 401) navigate('/')
                if (error.response?.status === 403) navigate('/perfil')
            }
        }
    }, [navigate])

    return {
        errorLogin,
        errorRegistro,
        errorForgotten,
        successForgotten,
        admin,
        logearse,
        registrarse,
        forgottenPass,
        adminData,
    }
}