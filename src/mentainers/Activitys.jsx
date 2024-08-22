// EditableTable.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import {collection,addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';

import {useData} from '../context/DataContext'

const Activitys = () => {
  const {onActividades} = useData();

  const [editedData, setEditedData] = useState({});
  const [changedRows, setChangedRows] = useState(new Set());
  
  const [searchText, setSearchText] = useState('');

  const filteredData = onActividades.filter(item =>
    item.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleEdit = (id, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
    setChangedRows(prev => new Set(prev).add(id));
  };

  const handleDaysEdit = (id, dayField, value) => {
    setEditedData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        dias: {
          ...prev[id]?.dias,
          [dayField]: value,
        },
      },
    }));
    setChangedRows(prev => new Set(prev).add(id));
  };

  const handleSave = async (id) => {
    const docRef = doc(db, 'actividades', id);
    await updateDoc(docRef, editedData[id]);
    setEditedData(prev => ({ ...prev, [id]: undefined })); // Clear edited data
    setChangedRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(id); // Remove row from changed set
        return newSet;
      });
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, 'actividades', id);
    await deleteDoc(docRef);
  };

  const handleAddNewActivity = async () => {
    // Create a new document with empty fields
    const newActivity = {
      estado: false,
      dias: { tecnologia: 0, operativo: 0 },
      nombre: '',
      tipo: '',
      userEmail: 'ftoro@servipag.cl'
    };

    // Add new activity to Firestore
    await addDoc(collection(db, 'actividades'), newActivity);
  };

  return (
    <>
    <button onClick={handleAddNewActivity}>Agregar nueva actividad</button>
    <input
        type="text"
        placeholder="Buscar..."
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '300px' }}
      />
    <table>
      <thead>
        <tr>
          <th>Estado</th>
          <th>Días - Tecnología</th>
          <th>Días - Operativo</th>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>User Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map(item => (
          <tr key={item.id} style={{ backgroundColor: changedRows.has(item.id) ? 'red' : 'white' }}>
            <td>
              <input
                type="checkbox"
                checked={editedData[item.id]?.estado ?? item.estado}
                onChange={(e) => handleEdit(item.id, 'estado', e.target.checked)}
              />
            </td>
            <td>
              <input
                type="number"
                value={editedData[item.id]?.dias?.tecnologia ?? item.dias?.tecnologia ?? 0} // Default to 0 if undefined
                onChange={(e) => handleDaysEdit(item.id, 'tecnologia', Number(e.target.value))}
              />
            </td>
            <td>
              <input
                type="number"
                value={editedData[item.id]?.dias?.operativo ?? item.dias?.operativo ?? 0} // Default to 0 if undefined
                onChange={(e) => handleDaysEdit(item.id, 'operativo', Number(e.target.value))}
              />
            </td>
            <td>
              <input
                type="text"
                value={editedData[item.id]?.nombre ?? item.nombre}
                onChange={(e) => handleEdit(item.id, 'nombre', e.target.value)}
              />
            </td>
            <td>
                <select
                  value={editedData[item.id]?.tipo ?? item.tipo}
                  onChange={(e) => handleEdit(item.id, 'tipo', e.target.value)}
                >
                  <option value="">Select Tipo</option>
                  <option value="general">General</option>
                  <option value="auditoria">Auditoria</option>
                </select>
              </td>
            <td>
              <input
                type="email"
                value={editedData[item.id]?.userEmail ?? item.userEmail}
                disabled="disabled"
              />
            </td>
            <td>
              <button onClick={() => handleSave(item.id)}>Save</button>
              {/* <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '10px', color: 'red' }}>
                Delete
              </button> */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
};

export default Activitys;