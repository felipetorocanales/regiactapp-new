import { useState,useEffect,useContext } from 'react'
//components
import SummaryTable from './components/SummaryTable';
//hooks
import useFilteredData from "./hooks/useFilteredData";

//context
import { useData } from './context/DataContext';

function Reportes() {
  
  const {registros} = useData();
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-30");
  const [selectedUser, setSelectedUser] = useState("");

  const filteredData = useFilteredData(registros, startDate, endDate, selectedUser);

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

  const uniqueUsers = [...new Set(registros.map(item => item.userEmail))];

  return (
    <div>
        <div>
        <h1>Resumen de horas por actividad</h1>
        <label>
          Fecha de Inicio:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Fecha de Termino:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label>
          Seleccione usuario:
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Todos</option>
            {uniqueUsers.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </label>
        <SummaryTable summary={summary} etapas={etapas} />
        <footer>© 2024 PAG</footer>
      </div>
    </div>
  )
}

export default Reportes