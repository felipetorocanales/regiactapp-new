import React, { createContext, useContext, useState, useEffect } from 'react';
import {db} from "../firebaseConfig"
import { orderBy, query,collection, getDocs, onSnapshot } from 'firebase/firestore';

   const DataContext = createContext();

   export const DataProvider = ({ children }) => {
     const [registros,setRegistros] = useState([])
     const [onActividades, setOnActividades] = useState([])

     const [loading, setLoading] = useState(false); // General loading state

    useEffect(() => {
        const fetchData = async () => {
          try{
            onSnapshot(collection(db, 'registros'), (snapshot) => {
              const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              setRegistros(docs);
              setLoading(true);
            });
            onSnapshot(query(collection(db,'actividades'), orderBy("nombre", "asc")), (snapshot) => {
              const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              setOnActividades(docs);
            });
            setLoading(false)
          }catch(err){
            console.log("error fetching data....",error)
          }
        }
        fetchData();
      }, []);

     return (
       <DataContext.Provider value={{ loading,registros,onActividades }}>
         {children}
       </DataContext.Provider>
     );
   };

   export const useData = () => {
     return useContext(DataContext);
   };