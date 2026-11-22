import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import HomeView from '@/pages/HomeView'

// Atajo para carga diferida (equivale al () => import() de Vue)
const lazyPage = (loader: () => Promise<{ default: ComponentType }>) => async () => {
  const m = await loader()
  return { Component: m.default }
}

export const router = createBrowserRouter(
  [
    {
        path: '/',
        element: <App />,
        children: [
          // oculta el header en homeview con: "handle: { hideHeader: true }"
          { index: true, element: <HomeView />, handle: { hideHeader: true } },
          { path: '/pruebas', lazy: lazyPage(() => import('@/pages/Pruebas')) },
          { path: '/perfil', lazy: lazyPage(() => import('@/pages/Auth/Profile')) },
          // { path: '/calendar', lazy: lazyPage(() => import('@/pages/Auth/calendar')) },
          { path: '/admin', lazy: lazyPage(() => import('@/pages/Auth/PanelControl')) },
          { path: '/auth/forgotten', lazy: lazyPage(() => import('@/pages/Auth/ForgottenPass')) },
          { path: '/auth/recovery/:token', lazy: lazyPage(() => import('@/pages/Auth/RecoveryAuth')) },
          { path: '/inventario', lazy: lazyPage(() => import('@/pages/Inventory.tsx')) },
          // { path: '/inventario/:id', lazy: lazyPage(() => import('@/pages/Inventory/InventoryDetail')) },
        ]
    }
  ],
  { basename: import.meta.env.BASE_URL },
)