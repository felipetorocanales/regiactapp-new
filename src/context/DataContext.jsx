import React, { createContext, useContext, useState, useEffect } from 'react';
import {db} from "../firebaseConfig"
import { collection, getDocs } from 'firebase/firestore';

   const DataContext = createContext();

   export const DataProvider = ({ children }) => {
     const [data, setData] = useState([]);

     useEffect(() => {
       // Fetch your data here
       const fetchData = async () => {
        const registrosCollection = collection(db, 'registros');
        const registrosSnapshot = await getDocs(registrosCollection);
        const registrosList = registrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(registrosList);
      };

       fetchData();
     }, []);

     return (
       <DataContext.Provider value={{ data }}>
         {children}
       </DataContext.Provider>
     );
   };

   export const useData = () => {
     return useContext(DataContext);
   };