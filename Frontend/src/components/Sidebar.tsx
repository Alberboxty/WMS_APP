import '../assets/scss/sidebar.scss';
import { Link } from 'react-router-dom'

import { useEffect } from 'react'

import { useAuth } from '@/hooks/useAuth'

function Sidebar () {
    const { user, logout, obtenerPerfil  } = useAuth()
    
    useEffect(() => { obtenerPerfil() }, [])

    return (
        <aside>
            <nav>
                <ul className="nav-user">
                    <Link to="/calendar"><li><i className="pi pi-check-square"></i><p>Mi Calendario</p></li></Link>
                    <Link to="/perfil"><li><i className="pi pi-user"></i><p>Mi cuenta</p></li></Link>
                </ul>

                <ul className="nav-admin">
                    <Link to="/admin"><li><i className="pi pi-th-large"></i><p>Panel Control</p></li></Link>  
                </ul>
            </nav>
        
            <div className="sidebar-user">
                <img src="" alt="avatar" />
        
                <div className="sidebar-user-info">
                    <h2>{user?.username || 'Cargando...'}</h2>
                    <p>{user?.email || 'Cargando...'}</p>
                </div>
        
                {user && <button 
                    className="sidebar-logout"
                    onClick={() => void logout()}
                    aria-label="Cerrar sesión"
                    title="Cerrar sesión"
                >
                    <i className="pi pi-sign-out"></i>
                </button>}
            </div>
        
        </aside>
    )
    
}

export default Sidebar