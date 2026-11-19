import { isAxiosError } from 'axios'

interface ApiErrorBody {
    msg?: string
    errors?: { msg: string }[]
}

export const getErrorMessage = (error: unknown, fallback: string): string => {
    if (isAxiosError<ApiErrorBody>(error)) {
        const body = error.response?.data
        if (body?.errors?.length) return body.errors.map((e) => e.msg).join(', ')
        if (body?.msg) return body.msg
    }
    return fallback
}