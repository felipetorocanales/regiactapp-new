import {  Link } from 'react-router-dom';
import './NavBar.css'

const NavBar = () =>{
    return (
        <nav className="sidebar">
        <ul>
            <li>
            <Link to="/">Inicio</Link>
            </li>
            <li>
            <Link to="/reportes">Reportes</Link>
            </li>
            <li>
            <Link to="/registro-de-horas">Registro de Horas</Link>
            </li>
            <li>
            <Link to="/configuracion">Configuración</Link>
            </li>
        </ul>
        </nav>
    )
}

export default NavBar;