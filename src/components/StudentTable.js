import React from "react";

const parseDate = (date) => {
  if (typeof date === "number") {
    // Converti il numero in una data partendo dal 1 gennaio 1900 (epoca Excel)
    const excelEpoch = new Date(1900, 0, 1); // 1 gennaio 1900
    const convertedDate = new Date(excelEpoch.setDate(excelEpoch.getDate() + date - 2)); // -2 perché Excel considera il 1900 come anno bisestile

    const day = String(convertedDate.getDate()).padStart(2, "0");
    const month = String(convertedDate.getMonth() + 1).padStart(2, "0");
    const year = convertedDate.getFullYear();
    return `${day}/${month}/${year}`;
  } else if (typeof date === "string") {
    // Se è una stringa "gg/mm/yyyy"
    return date; // La stringa è già nel formato corretto
  } else if (date instanceof Date) {
    // Se è un oggetto Date
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return ""; // Caso di errore
};


export default function StudentTable({ grades }) {
  return (
    <div className="mt-8">

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border bg-blue-600 text-white">Voto</th>
              <th className="px-4 py-2 border bg-blue-600 text-white">Data</th>
              <th className="px-4 py-2 border bg-blue-600 text-white">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(grades) ? (
              grades.map((grade, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{grade.Voto}</td>
                  <td className="px-4 py-2 border">{parseDate(grade.Data)}</td> {/* Usa parseDate per formattare la data */}
                  <td className="px-4 py-2 border">{grade.Tipo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 border text-center">
                  Nessun voto disponibile
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
