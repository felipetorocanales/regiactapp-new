import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import Reportes from "./Reportes";
import RegistroDeHoras from "./RegistroDeHoras";
import Configuracion from "./Configuracion";

//contextos
import { useContext } from "react";
import { useData } from "./context/DataContext";
import { AuthContext } from "./context/AuthContext";
//components
import LogoutButton from "./components/LogoutButton";
import Login from "./components/Login";
import NavBar from "./components/NavBar";

const Inicio = () => <h2>Inicio</h2>;

function App() {
  const { currentUser } = useContext(AuthContext);
  const { loading } = useData();

  return (
    <div className="container-fluid">
      {currentUser ? (
        loading ? (
            <Router>
              <div className="container">
                <LogoutButton />
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
            Loading...
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
