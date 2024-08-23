import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton"

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <LogoutButton></LogoutButton>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/reportes/reporte1">Reportes</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/registro-de-horas">Registro de Horas</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/configuracion">Configuración</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
