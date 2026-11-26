// import '@/assets/scss/recoveryPass.pc.scss'

import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoveryPass } from '@/hooks/useRecoveryPass'


export default function RecoveryAuth() {
    const { token = '' } = useParams<{ token: string }>()
    const { recoveryPass, errorRecovery, successRecovery } = useRecoveryPass(token)

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        void recoveryPass({ newPassword, confirmPassword })
    }

    return (
        <main>
            {errorRecovery && (
                <span>
                    <b>Error:</b> {errorRecovery}
                </span>
            )}
            {successRecovery && (
                <span>
                    <b>Correcto:</b> {successRecovery}
                </span>
            )}
            <article>
                <h1>Recupera la contraseña</h1>
                <p>Token: {token}</p>
                <p>Email: </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Contraseña"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repite contraseña"
                    />
                    <button type="submit">Nueva contraseña</button>
                </form>
            </article>
        </main>
    )
}