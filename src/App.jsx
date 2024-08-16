import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Reportes from './Reportes';
import {useContext } from 'react'
//components
import LogoutButton from './components/LogoutButton';
import {AuthContext } from './context/AuthContext';
import Login from './components/Login';

const Inicio = () => <h2>Inicio</h2>;
const RegistroDeHoras = () => <h2>Registro de Horas</h2>;
const Configuracion = () => <h2>Configuración</h2>;

function App() {
  
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      {currentUser ? (
        <Router>
        <div>
          <nav>
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
  
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/registro-de-horas" element={<RegistroDeHoras />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
        </div>
      </Router>
      ) : (
        <>
          <Login />
        </>
      )}
    </div>
    
  )
}

export default App
