import React, { useState } from "react";
import ActivityForm from "./components/ActivityForm";
import ActividadesEtapas from "./reports/ActividadesEtapas";
import ActividadesSemana from "./reports/ActividadesSemana";
import TablaRegistros from "./reports/TablaRegistros";

function Inicio() {
  const [selectedReport, setSelectedReport] = useState("home");

  const handleTabClick = (tab) => {
    setSelectedReport(tab);
  };

  return (
    <>
      <div className="row m-1">
        <ActivityForm />
      </div>
      <div className="row m-1 mt-5">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <a
              className={`nav-item nav-link ${
                selectedReport === "home" ? "active" : ""
              }`}
              onClick={() => handleTabClick("home")}
              role="tab"
              aria-controls="nav-home"
              aria-selected={selectedReport === "home"}
            >
              Actividades por día por semana
            </a>
            <a
              className={`nav-item nav-link ${
                selectedReport === "profile" ? "active" : ""
              }`}
              onClick={() => handleTabClick("profile")}
              role="tab"
              aria-controls="nav-profile"
              aria-selected={selectedReport === "profile"}
            >
              Actividades por etapa
            </a>
            <a
              className={`nav-item nav-link ${
                selectedReport === "contact" ? "active" : ""
              }`}
              onClick={() => handleTabClick("contact")}
              role="tab"
              aria-controls="nav-contact"
              aria-selected={selectedReport === "contact"}
            >
              Todos los registros ingresados
            </a>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className={`tab-pane fade ${
              selectedReport === "home" ? "show active" : ""
            }`}
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
          >
            <ActividadesSemana />
          </div>
          <div
            className={`tab-pane fade ${
              selectedReport === "profile" ? "show active" : ""
            }`}
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
          >
            <ActividadesEtapas />
          </div>
          <div
            className={`tab-pane fade ${
              selectedReport === "contact" ? "show active" : ""
            }`}
            id="nav-contact"
            role="tabpanel"
            aria-labelledby="nav-contact-tab"
          >
            <TablaRegistros />
          </div>
        </div>
      </div>
    </>
  );
}

export default Inicio;
