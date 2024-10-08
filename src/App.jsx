import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import Reportes from "./Reportes";
import RegistroDeHoras from "./RegistroDeHoras";
import Configuracion from "./Configuracion";
import Inicio from "./Inicio"

//contextos
import { useContext } from "react";
import { useData } from "./context/DataContext";
import { AuthContext } from "./context/AuthContext";
//components
import Login from "./components/Login";
import NavBar from "./components/NavBar";

function App() {
  const { currentUser } = useContext(AuthContext);
  const { loading } = useData();

  return (
    <div className="container-fluid">
      {currentUser ? (
        loading ? (
            <Router>
              <div>
                <NavBar />
                <Routes>
                  <Route path="/" element={<Inicio />} />
                  <Route path="/reportes" element={<Reportes />} />
                  <Route
                    path="/registro-de-horas"
                    element={<RegistroDeHoras />}
                  />
                  <Route path="/configuracion" element={<Configuracion />} />
                </Routes>
              </div>
            </Router>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              fontSize: "24px",
            }}
          >
            Cargando...
          </div>
        )
      ) : (
        <>
          <Login />
        </>
      )}
    </div>
  );
}

export default App;
