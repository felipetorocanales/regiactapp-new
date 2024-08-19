import React, { createContext, useContext, useState, useEffect } from 'react';
import {db} from "../firebaseConfig"
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

   const DataContext = createContext();

   export const DataProvider = ({ children }) => {
     const [data, setData] = useState([]);
     const [actividades, setActividades] = useState([])
     const [registros,setRegistros] = useState([])

     const [loading, setLoading] = useState(true); // General loading state

     useEffect(() => {
       // Fetch your data here
       const fetchData = async () => {
        try{
          setLoading(false); // Start loading

          const registrosCollection = collection(db, 'registros');
          const actividadesCollection = collection(db, 'actividades');
          const [registrosSnapshot,actividadesSnapshot] = await Promise.all([
            getDocs(registrosCollection),
            getDocs(actividadesCollection),
          ])
          const registrosList = await registrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const actividadesList = await actividadesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          setData(registrosList);
          setActividades(actividadesList);
        }catch(error){
          console.log("error fetching data....",error)
        }finally{
          setLoading(true); // Stop loading after all fetches
        }
      };
      fetchData();
     }, []);

     useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, 'registros'), (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRegistros(docs);
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);

     return (
       <DataContext.Provider value={{ data , actividades,loading,registros }}>
         {children}
       </DataContext.Provider>
     );
   };

   export const useData = () => {
     return useContext(DataContext);
   };