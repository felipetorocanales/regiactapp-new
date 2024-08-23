import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <p className="mx-2 mt-1">{currentUser.email}</p>
      <LogoutButton></LogoutButton>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/">
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/reportes">
              Reportes
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/registro-de-horas">
              Registro de Horas
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/configuracion">
              Configuración
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
