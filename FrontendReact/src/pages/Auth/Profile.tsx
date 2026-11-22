import '../../assets/scss/auth/profile.scss'

import { useEffect } from 'react'

import { useAuth } from '@/hooks/useAuth'

export default function Perfil() {
  const { user, obtenerPerfil } = useAuth()

  useEffect(() => { obtenerPerfil() }, [])

  return (
    <main className='main-Profile'>
      <div className="dashboard">
        <h1>Perfil</h1>

        <p>Usuario: {user?.username || 'Cargando...'}</p>
        <p>Email: {user?.email || 'Cargando...'}</p>
      </div>
    </main>
  )
}