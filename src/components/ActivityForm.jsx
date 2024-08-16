import React, { useState, useEffect } from 'react';
//import Slider from 'react-slider'; // Import the slider component
import { useData } from '../context/DataContext';

const ActivityForm = () => {
  const {actividades} = useData()
  
  const [categoryOptions, setCategoryOptions] = useState(["General","Planificación","Ejecución","Comunicación"]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [hours, setHours] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, setDate] = useState('');
  const [sliderValue, setSliderValue] = useState([0, 1]); // Start and end positions

  const handleIncrement = () => {
    setHours(hours + 1);
  };

  const handleDecrement = () => {
    if (hours > 0) {
      setHours(hours - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      selectedActivity,
      hours,
      selectedCategory,
      date,
      sliderValue,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre de Actividad:</label>
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
        >
          <option value="">Seleccione una actividad</option>
          {actividades.map((activity) => (
            <option key={activity.nombre} value={activity.nombre}>
              {activity.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Horas:</label>
        <button type="button" onClick={handleDecrement}>-</button>
        <input
          type="number"
          value={hours}
          readOnly
        />
        <button type="button" onClick={handleIncrement}>+</button>
      </div>

      <div>
        <label>Categoría:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Seleccione una categoría</option>
          {categoryOptions.map((category,index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Fecha:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label>Seleccionar Horario (0 a 7):</label>
        <input
      type="range"
      min={0}
      max={7}
      value={sliderValue}
      onChange={(e) => setSliderValue([parseInt(e.target.value), parseInt(e.target.value) + 1])} // Example for start and end
    />
        <div>
          <span>Inicio: {sliderValue[0]}</span>
          <span>Fin: {sliderValue[1]}</span>
        </div>
      </div>

      <button type="submit">Enviar</button>
    </form>
  );
};

export default ActivityForm;