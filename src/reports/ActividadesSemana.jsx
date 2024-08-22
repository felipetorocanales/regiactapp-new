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
  const [selectedTipo, setSelectedTipo] = useState("")
  const [selectedArea, setSelectedArea] = useState("")
  const [selectedUsuario, setSelectedUsuario] = useState("")

  const { registros, onActividades,usuarios } = useData();

  const joinActividades = registros.map((itemB) => {
    // Find the corresponding object in Array A
    const matchingItemA = onActividades.find(
      (itemA) => itemA.nombre === itemB.actividad
    );
    if (matchingItemA) {
      return {
        ...itemB,
        tipo: matchingItemA.tipo,
        estado: matchingItemA.estado
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
      (selectedUsuario ? entry.userEmail === selectedUsuario : true ) &&
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
    <>
      <h1>Sumatoria de Días por Actividad por Semana</h1>
      <label>
        Select Year:
        <select value={selectedYear} onChange={handleYearChange}>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </label>
      <label>
        Selecciona Tipo:
        <select value={selectedTipo} onChange={(e) => setSelectedTipo(e.target.value)}>
          <option value="">Todos</option>
          <option value="general">General</option>
          <option value="auditoria">Auditoria</option>
        </select>
      </label>
      <label>
        Selecciona Area:
        <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
          <option value="">Todos</option>
          <option value="mejora">Mejora</option>
          <option value="operativo">Operativo</option>
          <option value="tecnologico">Tecnologico</option>
        </select>
      </label>
      <label>
        Selecciona Usuario:
        <select value={selectedUsuario} onChange={(e) => setSelectedUsuario(e.target.value)}>
          <option value="">Todos</option>
          {usuarios.map((usuario) => 
              <option key={usuario.key} value={usuario.key}>{usuario.key}</option>
            )
          }
        </select>
      </label>
      <table>
        <thead>
          <tr>
            <th>Actividad</th>
            {sortedWeeks.map((week) => (
              <th key={week}>S{week}</th>
            ))}
            <th><strong>Total por Actividad</strong></th>
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
                <td><strong>{Math.round(total/8)}</strong></td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td><strong>Total por Semana</strong></td>
            {sortedWeeks.map((week) => (
              <td key={week}><strong>{weekTotals[week] || 0}</strong></td>
            ))}
            <td><strong>{Math.round(Object.values(weekTotals).reduce((sum, total) => sum + total, 0) / 8)}</strong></td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default ActividadesSemana;
