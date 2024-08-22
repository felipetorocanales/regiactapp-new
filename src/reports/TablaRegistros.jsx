import React, { useState } from 'react';
import {useData} from '../context/DataContext'

const TablaRegistros = () => {
    const {registros} = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('id');
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

    const filteredData = registros.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedData = filteredData.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1;
        if (a[sortField] > b[sortField]) return 1;
        return 0;
    });

    // Calculate the current records to display
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

    // Calculate total pages
    const totalPages = Math.ceil(sortedData.length / recordsPerPage);

    return (
        <div>
            <input
                type="text"
                placeholder="Busqueda..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <select value={sortField} onChange={handleSortChange}>
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
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Actividad</th>
                        <th>Etapa</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Horas</th>
                        <th>Email Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.actividad}</td>
                            <td>{item.etapa}</td>
                            <td>{item.fechaIni}</td>
                            <td>{item.fechaFin}</td>
                            <td>{item.horas}</td>
                            <td>{item.userEmail}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default TablaRegistros;