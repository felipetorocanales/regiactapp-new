import "./ActividadesSemana.css";
import { useState } from "react";
import { useData } from "../context/DataContext";

const aggregateData = (data, selectedArea) => {
  const result = {};
  data.forEach((entry) => {
    const actividad = entry.actividad;

    if (!result[actividad]) {
      result[actividad] = {
        totalHoras: 0,
        totalDias: 0,
      };
    }

    // Sum totalHoras for each entry
    result[actividad].totalHoras += parseInt(entry.horas);

    const diasTecnologia = entry.dias?.tecnologia || 0;
    const diasOperativo = entry.dias?.operativo || 0;

    // Sum totalDias only once for each activity
    if (result[actividad].totalDias === 0) {
      if (selectedArea === "tecnologico") {
        result[actividad].totalDias += diasTecnologia;
      } else if (selectedArea === "operativo") {
        result[actividad].totalDias += diasOperativo;
      } else {
        // If no area is selected, sum both
        result[actividad].totalDias += diasTecnologia + diasOperativo;
      }
    }
  });
  return result;
};

const ActividadesPlanificacion = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedUsuario, setSelectedUsuario] = useState("");
  const { registros, onActividades, usuarios } = useData();

  const joinActividades = registros.map((itemB) => {
    const matchingItemA = onActividades.find(
      (itemA) => itemA.nombre === itemB.actividad
    );
    if (matchingItemA) {
      return {
        ...itemB,
        tipo: matchingItemA.tipo,
        estado: matchingItemA.estado,
        dias: matchingItemA.dias,
      };
    }
    return itemB;
  });

  const joinUsers = joinActividades.map((itemB) => {
    const matchingItemA = usuarios.find(
      (itemA) => itemA.key === itemB.userEmail
    );
    if (matchingItemA) {
      return {
        ...itemB,
        area: matchingItemA.area,
      };
    }
    return itemB;
  });

  const filteredData = joinUsers.filter((entry) => {
    const yearMatch = new Date(entry.fechaIni).getFullYear() === selectedYear;
    const tipoMatch = selectedTipo ? entry.tipo === selectedTipo : true;
    const areaMatch =
      selectedArea && selectedArea !== "" ? entry.area === selectedArea : true;
    const usuarioMatch = selectedUsuario
      ? entry.userEmail === selectedUsuario
      : true;
    const estadoMatch = entry.estado === true;

    return yearMatch && tipoMatch && areaMatch && usuarioMatch && estadoMatch;
  });

  const aggregatedData = aggregateData(filteredData, selectedArea);
  const actividades = Object.keys(aggregatedData);

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        {/* Filtros de selección */}
        <div className="col-md-3">
          <label className="form-label">Select Year:</label>
          <select
            className="form-select"
            value={selectedYear}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Selecciona Tipo:</label>
          <select
            className="form-select"
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="general">General</option>
            <option value="auditoria">Auditoria</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Selecciona Area:</label>
          <select
            className="form-select"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="mejora">Mejora</option>
            <option value="operativo">Operativo</option>
            <option value="tecnologico">Tecnologico</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Selecciona Usuario:</label>
          <select
            className="form-select"
            value={selectedUsuario}
            onChange={(e) => setSelectedUsuario(e.target.value)}
          >
            <option value="">Todos</option>
            {usuarios.map((usuario) => (
              <option key={usuario.key} value={usuario.key}>
                {usuario.key}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-responsive" style={{ maxHeight: "400px" }}>
        <table className="table table-bordered table-striped small-text">
          <thead className="table-light">
            <tr>
              <th>Actividad</th>
              <th>Total Horas</th>
              <th>Total Días Planificados</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((actividad) => {
              const { totalHoras, totalDias } = aggregatedData[actividad];
              return (
                <tr key={actividad}>
                  <td>{actividad}</td>
                  <td>{Math.round(totalHoras / 8)}</td>
                  <td>{totalDias}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <strong>Total General</strong>
              </td>
              <td>
                <strong>
                  {actividades.reduce((sum, actividad) => {
                    return sum + aggregatedData[actividad].totalHoras / 8;
                  }, 0)}
                </strong>
              </td>
              <td>
                <strong>
                  {actividades.reduce((sum, actividad) => {
                    return sum + aggregatedData[actividad].totalDias;
                  }, 0)}
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ActividadesPlanificacion;
