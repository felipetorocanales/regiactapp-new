import React from 'react';

const etapasNombre = ["General","Planificación","Ejecución","Comunicación","Revisión de calidad QA","Supervisión"]

const SummaryTable = ({ summary, etapas }) => {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Actividad</th>
          {[...etapas].map((etapa) => (
            <th key={etapa}>{etapasNombre[etapa]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.keys(summary).map((actividad) => (
          <tr key={actividad}>
            <td>{actividad}</td>
            {[...etapas].map((etapa) => (
              <td key={etapa}>
                {summary[actividad][etapa] || 0}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SummaryTable;