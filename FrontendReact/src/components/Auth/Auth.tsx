import "@/assets/scss/auth/loginregister.scss"

import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuthActions } from '@/hooks/useAuthActions'

export default function Auth() {
    const { logearse, registrarse, errorLogin, errorRegistro } = useAuthActions()

    // const [isActive, setIsActive] = useState(false)

    // Login
    const [lemail, setLemail] = useState('')
    const [lpassword, setLpassword] = useState('')

    // Registro
    const [rusername, setRusername] = useState('')
    const [remail, setRemail] = useState('')
    const [rpassword, setRpassword] = useState('')

    // const toggle = () => setIsActive((v) => !v)

    const handleLogin = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        void logearse({ email: lemail, password: lpassword })
    }

    const handleRegister = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        void registrarse({ username: rusername, email: remail, password: rpassword })
    }

    return (
        <section className="auth">
            {errorLogin && (
                <span>
                    <b>Error al loguearse:</b> {errorLogin}
                </span>
            )}
            {errorRegistro && (
                <span>
                    <b>Error al registrarse:</b> {errorRegistro}
                </span>
            )}
            <article className="login">
                <form onSubmit={handleLogin}>
                    <h2>Iniciar Sesión</h2>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="text"
                            value={lemail}
                            onChange={(e) => setLemail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={lpassword}
                            onChange={(e) => setLpassword(e.target.value)}
                            placeholder="Contraseña"
                        />
                    </div>
                    
                    <button type="submit">Enviar</button>
                    <Link to="/auth/forgotten">
                        <p className="clic">¿Quieres recuperar tu contraseña?</p>
                    </Link>
                </form>
            </article>

            <article className="Registro">
                <form onSubmit={handleRegister}>
                    <h2>Crear Cuenta</h2>
                    <div>
                        <label htmlFor="username">Usuario</label>
                        <input
                            id="username"
                            type="text"
                            value={rusername}
                            onChange={(e) => setRusername(e.target.value)}
                            placeholder="Usuario"
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="text"
                            value={remail}
                            onChange={(e) => setRemail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={rpassword}
                            onChange={(e) => setRpassword(e.target.value)}
                            placeholder="Contraseña"
                        />
                    </div>
                    
                    <button type="submit">Enviar</button>
                </form>
            </article>
        </section>
    )
}