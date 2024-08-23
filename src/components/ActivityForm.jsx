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
    <form onSubmit={handleSubmit} className="p-2 mt-2 border rounded bg-light">
      <div className="row mx-3 my-2">
        <div className="col-lg-2">
          <label htmlFor="dateInput" className="form-label">Fecha:</label>
          <input
            type="date"
            id="dateInput"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-lg-2">
          <label className="form-label">Selecciona las horas:</label>
          <div className="form-check">
            <input
              type="radio"
              id="hours4"
              value="4"
              checked={hours === "4"}
              onChange={(event) => setHours(event.target.value)}
              className="form-check-input"
            />
            <label htmlFor="hours4" className="form-check-label">4 horas</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              id="hours8"
              value="8"
              checked={hours === "8"}
              onChange={(event) => setHours(event.target.value)}
              className="form-check-input"
            />
            <label htmlFor="hours8" className="form-check-label">8 horas</label>
          </div>
        </div>
        <div className="col-lg-3">
          <label htmlFor="activitySelect" className="form-label">Nombre de Actividad:</label>
          <select
            id="activitySelect"
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="form-select"
          >
            <option value="">Seleccione una actividad</option>
            {filteredActivity.map((activity) => (
              <option key={activity.nombre} value={activity.nombre}>
                {activity.nombre}
              </option>
            ))}
          </select>
        </div>
      
        <div className="col-lg-3">
          <label htmlFor="categorySelect" className="form-label">Etapa:</label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            <option value="">Seleccione una categoría</option>
            {categoryOptions.map((category, index) => (
              <option key={index} value={index}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="col-lg-2">
          <button id="btnEnviar" type="submit" className="btn btn-success mt-4">Guardar</button>
        </div>
        {error && <div className="alert alert-danger my-2 p-1">{error}</div>}
      </div>
      
    </form>
  );
};

export default ActivityForm;
