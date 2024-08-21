import './ActividadesSemana.css'
import { useState } from 'react';
import { useData } from '../context/DataContext';

const aggregateData = (data) => {
    const result = {};

    data.forEach(entry => {
        const date = new Date(entry.fechaIni);
        const week = getWeekNumber(date);
        const actividad = entry.actividad;

        if (!result[actividad]) {
        result[actividad] = {};
        }

        if (!result[actividad][week]) {
        result[actividad][week] = 0;
        }

        result[actividad][week] += Math.round(parseInt(entry.horas)/8);
    });

    return result;
};

// Función para obtener el número de semana del año
const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
  };

const ActividadesSemana = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const {registros} = useData();
    const filteredData = registros.filter(entry => new Date(entry.fechaIni).getFullYear() === selectedYear);
    const aggregatedData = aggregateData(filteredData);
    const actividades = Object.keys(aggregatedData);
    const weeks = new Set();
   

   
    Object.values(aggregatedData).forEach(activity => {
        Object.keys(activity).forEach(week => weeks.add(week));
    });

    const sortedWeeks = Array.from(weeks).sort((a, b) => a - b);

    const handleYearChange = (event) => {
        setSelectedYear(Number(event.target.value));
    };

    return (
        <>
        <h1>Sumatoria de Días por Actividad por Semana</h1>
        <label>
            Select Year:
            <select value={selectedYear} onChange={handleYearChange}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            {/* Add more years as needed */}
            </select>
        </label>
        <table>
            <thead>
                <tr>
                <th>Actividad</th>
                {sortedWeeks.map(week => (
                    <th key={week}>{week}</th>
                ))}
                </tr>
            </thead>
            <tbody>
                {actividades.map(actividad => (
                <tr key={actividad}>
                    <td>{actividad}</td>
                    {sortedWeeks.map(week => (
                    <td key={week}>
                        {aggregatedData[actividad][week] || 0}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
        </table>
        </>
    )
}

export default ActividadesSemana;