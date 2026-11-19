// import { useState } from 'react'
import { Outlet, useMatches } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthProvider'
import Header from '@/components/Header'
// import '@/assets/scss/body.scss'
import 'primeicons/primeicons.css'

//Crea el tipo para ocultar el header
type RouteHandle = { hideHeader?: boolean }

export default function App() {
  //crea el match para ocultar el header
  const matches = useMatches()
  const hideHeader = matches.some(
    (m) => (m.handle as RouteHandle | undefined)?.hideHeader,
  )
  return (
    <>
      <AuthProvider>
        {/* usa el match para definir si se oculta o no en rutas */}
        {!hideHeader && <Header />}
        <Outlet />
      </AuthProvider>
    </>
  )
}
