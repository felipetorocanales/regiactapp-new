import { useState, useEffect } from 'react';
import {db} from "../firebaseConfig"
import { collection, getDocs } from 'firebase/firestore';

const useFetchRegistros = () => {
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    const fetchRegistros = async () => {
      const registrosCollection = collection(db, 'registros');
      const registrosSnapshot = await getDocs(registrosCollection);
      const registrosList = registrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistros(registrosList);
    };

    fetchRegistros();
  }, []);

  return registros;
};

export default useFetchRegistros;