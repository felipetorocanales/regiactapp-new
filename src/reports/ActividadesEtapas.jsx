import { useState } from "react";
//context
import { useData } from "../context/DataContext";

const ActividadesEtapas = () => {
  const { registros, onActividades } = useData();
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-30");
  const [selectedUser, setSelectedUser] = useState("");
  const etapasNombre = [
    "General",
    "Planificación",
    "Ejecución",
    "Comunicación",
    "Revisión de calidad QA",
    "Supervisión",
  ];

  const joinActividades = registros.map((itemB) => {
    // Find the corresponding object in Array A
    const matchingItemA = onActividades.find(
      (itemA) => itemA.nombre === itemB.actividad
    );
    if (matchingItemA) {
      return {
        ...itemB,
        tipo: matchingItemA.tipo,
        estado: matchingItemA.estado,
      };
    }
    return itemB;
  });

  const filteredData = joinActividades.filter(
    (item) =>
      item.fechaIni.split("T")[0] >= startDate.split("T")[0] &&
      item.fechaIni.split("T")[0] <= endDate.split("T")[0] &&
      (selectedUser ? item.userEmail === selectedUser : true) &&
      item.estado === true
  );

  const summary = {};
  filteredData.forEach(({ actividad, etapa, horas }) => {
    if (!summary[actividad]) {
      summary[actividad] = {};
    }
    if (!summary[actividad][etapa]) {
      summary[actividad][etapa] = 0;
    }
    summary[actividad][etapa] += parseInt(horas);
  });

  // Get unique categories
  const etapas = new Set();
  for (const actividad in summary) {
    for (const etapa in summary[actividad]) {
      etapas.add(etapa);
    }
  }

  const uniqueUsers = [...new Set(registros.map((item) => item.userEmail))];

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Fecha de Inicio:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Fecha de Término:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Seleccione usuario:</label>
        <select
          className="form-select"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Todos</option>
          {uniqueUsers.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="table-responsive" style={{ maxHeight: "400px" }}>
        <table className="table table-bordered table-striped small-text">
          <thead className="table-light">
            <tr>
              <th>Actividad</th>
              {[...etapas].map((etapa) => (
                <th key={etapa}>{etapasNombre[etapa]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(summary).map((actividad) => (
              <tr key={actividad}>
                <td>{actividad}</td>
                {[...etapas].map((etapa) => (
                  <td key={etapa}>{summary[actividad][etapa] || 0}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="text-center mt-4">© 2024 PAG</footer>
    </div>
  );
};

export default ActividadesEtapas;
