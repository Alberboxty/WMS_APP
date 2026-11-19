import '@/assets/scss/panelcontrol.scss'

import Sidebar from '@/components/Sidebar';

import { useEffect } from 'react'
import { useAuthActions } from '@/hooks/useAuthActions'
import UsuariosAPI from '@/components/ControlPanel/UsuariosAPI'
import PermisosYRoles from '@/components/ControlPanel/PermisosYRoles'
import PermisosModulares from '@/components/ControlPanel/PermisosModulares'

export default function PanelControl() {
    const { admin, adminData } = useAuthActions()

    useEffect(() => {
        void adminData()
    }, [adminData])

    return (
        <main>
            <Sidebar/>
            <div className="dashboard">
                <h1>Panel Administrador</h1>

                <p>{admin}</p>
                <UsuariosAPI />
                <PermisosYRoles />
                <PermisosModulares />           
            </div>
        </main>
    )
}