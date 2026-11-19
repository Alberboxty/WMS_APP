import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuthActions } from '@/hooks/useAuthActions'
import '@/assets/scss/forgottenPass.pc.scss'

export default function ForgottenPass() {
    const { forgottenPass, errorForgotten, successForgotten } = useAuthActions()
    const [email, setEmail] = useState('')

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        void forgottenPass(email)
    }

    return (
        <main>
            {errorForgotten && (
                <span>
                    <b>Error: </b> {errorForgotten}
                </span>
            )}
            {successForgotten && (
                <span>
                    <b>Correcto: </b> {successForgotten}
                </span>
            )}
            <article>
                <h1>He olvidado mi contraseña</h1>
                <p>Escribe tu correo y te enviaremos un mensaje por email</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email"
                    />
                    <button type="submit">Enviar</button>
                </form>
                <Link to="/auth">Quiero iniciar sesión</Link>
            </article>
        </main>
    )
}