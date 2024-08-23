import React, { useState, useContext } from "react";
import { useData } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const TablaRegistros = () => {
  const { currentUser } = useContext(AuthContext);
  const { registros } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSortChange = (event) => {
    setSortField(event.target.value);
    setCurrentPage(1); // Reset to first page on sort
  };

  const filteredData = registros.filter((item) =>
    Object.values(item).some(
      (value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()) &&
        item.userEmail === currentUser.email
    )
  );

  const sortedData = filteredData.sort((a, b) => {
    if (a[sortField] < b[sortField]) return -1;
    if (a[sortField] > b[sortField]) return 1;
    return 0;
  });

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return "";
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, "registros", id);
    await deleteDoc(docRef);
  };

  // Calculate the current records to display
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / recordsPerPage);

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Busqueda..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="mb-4">
        <label>Ordernar por:</label>
        <select
          className="form-select"
          value={sortField}
          onChange={handleSortChange}
        >
          <option value="id">ID</option>
          <option value="actividad">Actividad</option>
          <option value="etapa">Etapa</option>
          <option value="fechaIni">Fecha Inicio</option>
          <option value="fechaFin">Fecha Fin</option>
          <option value="horas">Horas</option>
          <option value="creado">Creado</option>
          <option value="modificado">Modificado</option>
          <option value="userEmail">Email Usuario</option>
        </select>
      </div>

      <div className="table-responsive" style={{ maxHeight: "400px" }}>
        <table className="table table-bordered table-striped small-text">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Creado</th>
              <th>Actividad</th>
              <th>Etapa</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Horas</th>
              <th>Email Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{formatDate(item.creado)}</td>
                <td>{item.actividad}</td>
                <td>{item.etapa}</td>
                <td>{item.fechaIni}</td>
                <td>{item.fechaFin}</td>
                <td>{item.horas}</td>
                <td>{item.userEmail}</td>
                <td>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-danger btn-sm"
                    style={{ marginLeft: "10px" }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="btn btn-secondary"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          {" "}
          Page {currentPage} of {totalPages}{" "}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="btn btn-secondary"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TablaRegistros;
