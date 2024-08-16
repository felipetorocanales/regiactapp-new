import {db} from "./firebaseConfig"
import { useState,useEffect,useContext } from 'react'
import { collection, getDocs } from 'firebase/firestore';

//components
import LogoutButton from './components/LogoutButton';
import SummaryTable from './components/SummaryTable';

//hooks
import useFetchRegistros from "./hooks/useFetchRegistros";
import useFilteredData from "./hooks/useFilteredData";


import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';

function App() {
  
  const { currentUser } = useContext(AuthContext);

  const [registros, setRegistros] = useState([]);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-30");
  const [selectedUser, setSelectedUser] = useState("");

  // useEffect(() => {
  //   const fetchRegistros = async () => {
  //     const registrosCollection = collection(db, 'registros');
  //     const registrosSnapshot = await getDocs(registrosCollection);
  //     const registrosList = registrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //     setRegistros(registrosList);
  //   };

  //   fetchRegistros();
  // }, []);

  const data = useFetchRegistros()
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

  const uniqueUsers = [...new Set(registros.map(item => item.userEmail))];

  return (
    <div>
      {currentUser ? (
        <div>
        <LogoutButton />
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

export default App
