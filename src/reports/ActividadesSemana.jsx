import "./ActividadesSemana.css";
import { useState } from "react";
import { useData } from "../context/DataContext";

const aggregateData = (data) => {
  const result = {};

  data.forEach((entry) => {
    const date = new Date(entry.fechaIni);
    const week = getWeekNumber(date);
    const actividad = entry.actividad;

    if (!result[actividad]) {
      result[actividad] = {};
    }

    if (!result[actividad][week]) {
      result[actividad][week] = 0;
    }

    result[actividad][week] += parseInt(entry.horas);
  });

  return result;
};

// Función para obtener el número de semana del año
const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startDate.getDay() + 1) / 7);
};

const ActividadesSemana = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedUsuario, setSelectedUsuario] = useState("");

  const { registros, onActividades, usuarios } = useData();

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

  const joinUsers = joinActividades.map((itemB) => {
    // Find the corresponding object in Array A
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

  const filteredData = joinUsers.filter(
    (entry) =>
      new Date(entry.fechaIni).getFullYear() === selectedYear &&
      (selectedTipo ? entry.tipo === selectedTipo : true) &&
      (selectedArea ? entry.area === selectedArea : true) &&
      (selectedUsuario ? entry.userEmail === selectedUsuario : true) &&
      entry.estado === true
  );
  const aggregatedData = aggregateData(filteredData);
  const actividades = Object.keys(aggregatedData);
  const weeks = new Set();

  Object.values(aggregatedData).forEach((activity) => {
    Object.keys(activity).forEach((week) => weeks.add(week));
  });

  const sortedWeeks = Array.from(weeks).sort((a, b) => a - b);

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  const weekTotals = sortedWeeks.reduce((totals, week) => {
    totals[week] = actividades.reduce((sum, actividad) => {
      return sum + (aggregatedData[actividad][week] || 0);
    }, 0);
    return totals;
  }, {});

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label">Select Year:</label>
          <select
            className="form-select"
            value={selectedYear}
            onChange={handleYearChange}
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
              {sortedWeeks.map((week) => (
                <th key={week}>S{week}</th>
              ))}
              <th>
                <strong>Total por Actividad</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((actividad) => {
              const total = sortedWeeks.reduce((sum, week) => {
                return sum + (aggregatedData[actividad][week] || 0);
              }, 0);
              return (
                <tr key={actividad}>
                  <td>{actividad}</td>
                  {sortedWeeks.map((week) => (
                    <td key={week}>{aggregatedData[actividad][week] || 0}</td>
                  ))}
                  <td>
                    <strong>{total}</strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <strong>Total por Semana</strong>
              </td>
              {sortedWeeks.map((week) => (
                <td key={week}>
                  <strong>{weekTotals[week] || 0}</strong>
                </td>
              ))}
              <td>
                <strong>
                  {Object.values(weekTotals).reduce(
                    (sum, total) => sum + total,
                    0
                  )}
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ActividadesSemana;
