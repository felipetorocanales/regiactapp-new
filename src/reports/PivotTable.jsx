import React, { useState } from "react";
import { useData } from "../context/DataContext";

const PivotTable = () => {
  const { registros } = useData();
  const fields = ["actividad", "etapa", "fechaIni", "userEmail"];
  const [rowField, setRowField] = useState(fields[0]);
  const [colField, setColField] = useState(fields[1]);

  const getPivotData = () => {
    const pivotData = {};

    registros.forEach((item) => {
      const rowValue = item[rowField];
      const colValue = item[colField];
      const hours = item.horas;

      if (!pivotData[rowValue]) {
        pivotData[rowValue] = {};
      }
      if (!pivotData[rowValue][colValue]) {
        pivotData[rowValue][colValue] = 0;
      }
      pivotData[rowValue][colValue] += parseInt(hours);
    });

    return pivotData;
  };

  const pivotData = getPivotData();
  const rowKeys = Object.keys(pivotData);
  const colKeys = [...new Set(registros.map((item) => item[colField]))];

  return (
    <div>
      <div>
        <label>
          Filas:
          <select
            value={rowField}
            onChange={(e) => setRowField(e.target.value)}
          >
            {fields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </label>
        <label>
          Columnas:
          <select
            value={colField}
            onChange={(e) => setColField(e.target.value)}
          >
            {fields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </label>
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>{rowField}</th>
            {colKeys.map((colKey) => (
              <th key={colKey}>{colKey}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowKeys.map((rowKey) => (
            <tr key={rowKey}>
              <td>{rowKey}</td>
              {colKeys.map((colKey) => (
                <td key={colKey}>{pivotData[rowKey][colKey] || 0}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PivotTable;
