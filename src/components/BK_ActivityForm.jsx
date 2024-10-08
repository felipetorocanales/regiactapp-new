import React, { useState ,useContext} from 'react';
import { db } from '../firebaseConfig'; // Adjust the path as necessary
import { collection, addDoc, Timestamp } from 'firebase/firestore';
//context
import { useData } from '../context/DataContext';
import {AuthContext} from '../context/AuthContext'
//components
import Slider from '@mui/material/Slider';

const ActivityForm = () => {
  const {onActividades} = useData()
  const { currentUser } = useContext(AuthContext);
  const [categoryOptions, setCategoryOptions] = useState(["General","Planificación","Ejecución","Comunicación","Revisión de calidad QA","Supervisión"]);

  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, setDate] = useState('');
  const [sliderValue, setSliderValue] = useState([9, 18]); // Default to 1 PM to 3 PM
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fechaIni = `${date}T${sliderValue[0]}:00`
    const fechaFin = `${date}T${sliderValue[1]}:00`
    // Handle form submission logic here
    setError('');

    // Validate the form fields
    if (!date || !selectedActivity || !selectedCategory || !sliderValue) {
      setError('Complete todos los campos, por favor.');
      return;
    }

    try {
      // Add a new document with a generated ID
      await addDoc(collection(db, 'registros'), {
        fechaIni,
        fechaFin,
        horas: countOfHours,
        actividad: selectedActivity,
        userEmail: currentUser.email,
        etapa: selectedCategory,
        creado: new Date(),
        modificado: new Date(),
      });

      // Clear the form after submission
      setDate('');
      setSelectedActivity('');
      setSelectedCategory('');
      setSliderValue([9,18])
      
    } catch (err) {
      console.error('Error adding document: ', err);
      setError('Error adding document, please try again.');
    }
  };

  // Define marks for the slider
  const marks = Array.from({ length: 18 }, (_, index) => ({
    value: index,
    label: index < 12 ? `${index} AM` : `${index - 12} PM`,
  }));

  const countOfHours = sliderValue[0] <= 12 && sliderValue[1] >= 13 ? sliderValue[1] - sliderValue[0] -1 : sliderValue[1] - sliderValue[0]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Fecha:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="form-group">
        <label>Nombre de Actividad:</label>
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
        >
          <option value="">Seleccione una actividad</option>
          {onActividades.map((activity) => (
            <option key={activity.nombre} value={activity.nombre}>
              {activity.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Etapa:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Seleccione una categoría</option>
          {categoryOptions.map((category, index) => (
            <option key={index} value={index}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Seleccionar Horario:</label>
        <Slider
          value={sliderValue}
          onChange={(e, newValue) => {
            setSliderValue(newValue);
          }}
          marks={marks}
          min={9}
          max={18}
          valueLabelDisplay="auto"
        />
        <div className="form-group">
          <label>Horas:</label>
          <input
            type="number"
            value={countOfHours}
            readOnly
            className="input-field"
          />
        </div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" className="submit-button">Enviar</button>
    </form>
  );
};

export default ActivityForm;