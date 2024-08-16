import { useState,useEffect,useContext } from 'react'

//components
import SummaryTable from './components/SummaryTable';

//hooks
import useFilteredData from "./hooks/useFilteredData";
import { useData } from './context/DataContext';


import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';

function Reportes() {
  
  const { currentUser } = useContext(AuthContext);

  const {data} = useData();
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-30");
  const [selectedUser, setSelectedUser] = useState("");

  const filteredData = useFilteredData(data, startDate, endDate, selectedUser);

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

  const uniqueUsers = [...new Set(data.map(item => item.userEmail))];

  return (
    <div>
      {currentUser ? (
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
      ) : (
        <>
          <Login />
        </>
      )}
    </div>
    
  )
}

export default Reportes