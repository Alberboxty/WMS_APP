import '../assets/scss/header.scss'

import { useState } from 'react'
import { Link } from 'react-router-dom'

import Sidebar from './Sidebar'

export default function Header() {
    const [menuActive, setMenuActive] = useState(false)

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <header>
            <article className="inicio">
                <Link to="/">
                    <img className="logo" src="" alt="Logo" />
                    <h1>WMS</h1>
                </Link>
                
                {menuActive ? (<i className="pi pi-chevron-up" onClick={toggleMenu}/>) : (<i className="pi pi-bars" onClick={toggleMenu}/>)}
            </article>
            <article className='menu'>
                <div className={`sidebar ${menuActive ? 'active' : ''}`}>
                    <Sidebar/>
                </div>
                
            </article>
            {/* <nav>
                <ul className={`menu ${menuActive ? 'active' : ''}`}>
                    <li>lista1</li>
                    <li>lista1</li>
                    <li>lista1</li>
                </ul>
            </nav> */}
        </header>
    )
}