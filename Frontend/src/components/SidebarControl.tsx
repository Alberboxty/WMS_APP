import '../assets/scss/sidebar.scss';
import { Link } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

function SidebarControl () {
    const { user, logout } = useAuth()

    return (
        <aside className="sidebar">
        
            <nav className="sidebar-nav">
                <ul>
                    <li className="lista"><Link to="/admin"><p>Panel Control</p></Link></li>
                    <li className="lista"><Link to="/auth"><p>Auth</p></Link></li>
                </ul>
            </nav>
        
            <div className="sidebar-user">
                <div className="sidebar-avatar"></div>
        
                <div className="sidebar-user-info">
                    <strong></strong>
                    <span>Administrador</span>
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

export default SidebarControl