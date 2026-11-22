import { useCallback, useState } from 'react'
import { isAxiosError } from 'axios'
import { recoveryPassAPI } from '@/services/recoveryPass.service'
import type { RecoveryPassPayload } from '@/types/recoveryPass.types'

interface ApiErrorBody {
    msg?: string
    errors?: { msg: string }[]
}

const getErrorMessage = (error: unknown): string => {
    if (isAxiosError<ApiErrorBody>(error)) {
        const body = error.response?.data
        if (body?.errors?.length) return body.errors.map((e) => e.msg).join(', ')
        if (body?.msg) return body.msg
    }
    return 'Error inesperado al recuperar la contraseña.'
}

export function useRecoveryPass(token: string) {
    const [errorRecovery, setErrorRecovery] = useState('')
    const [successRecovery, setSuccessRecovery] = useState('')

    const recoveryPass = useCallback(
        async (payload: RecoveryPassPayload) => {
        setErrorRecovery('')
        setSuccessRecovery('')
        try {
            const recovery = await recoveryPassAPI(token, payload)
            setSuccessRecovery(recovery.msg)
        } catch (error) {
            setErrorRecovery(getErrorMessage(error))
        }
        },
        [token],
    )

    return { recoveryPass, errorRecovery, successRecovery }
}