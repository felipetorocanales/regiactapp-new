import React, { useState, useContext } from "react";
import { db } from "../firebaseConfig"; // Adjust the path as necessary
import { collection, addDoc } from "firebase/firestore";
//context
import { useData } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";

const ActivityForm = () => {
  const { onActividades } = useData();
  const filteredActivity = onActividades.filter(
    (entry) => entry.estado === true
  );
  const { currentUser } = useContext(AuthContext);
  const [categoryOptions, setCategoryOptions] = useState([
    "General",
    "Planificación",
    "Ejecución",
    "Comunicación",
    "Revisión de calidad QA",
    "Supervisión",
  ]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("8");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fechaIni = `${date}T09:00`;
    const fechaFin = hours === "4" ? `${date}T13:00` : `${date}T18:00`;
    // Handle form submission logic here
    setError("");

    // Validate the form fields
    if (!date || !selectedActivity || !selectedCategory) {
      setError("Complete todos los campos, por favor.");
      return;
    }

    try {
      // Add a new document with a generated ID
      await addDoc(collection(db, "registros"), {
        fechaIni,
        fechaFin,
        horas: hours,
        actividad: selectedActivity,
        userEmail: currentUser.email,
        etapa: selectedCategory,
        creado: new Date(),
        modificado: new Date(),
      });

      // Clear the form after submission
      setDate("");
      setSelectedActivity("");
      setSelectedCategory("");
      setHours("8");
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Error adding document, please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div>
        <label>Fecha:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label>Nombre de Actividad:</label>
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
        >
          <option value="">Seleccione una actividad</option>
          {filteredActivity.map((activity) => (
            <option key={activity.nombre} value={activity.nombre}>
              {activity.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
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
      <div>
        <label>Selecciona las horas</label>
        <label>
          <input
            type="radio"
            value="4"
            checked={hours === "4"}
            onChange={(event) => setHours(event.target.value)}
          />
          4 horas
        </label>
        <label>
          <input
            type="radio"
            value="8"
            checked={hours === "8"}
            onChange={(event) => setHours(event.target.value)}
          />
          8 horas
        </label>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" className="submit-button">
        Enviar
      </button>
    </form>
  );
};

export default ActivityForm;
