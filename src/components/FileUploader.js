import { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Icone di successo e errore

export default function FileUploader({ handleFileUpload }) {
  const [fileStatus, setFileStatus] = useState(null); // Stato per monitorare il file

  // Gestore per il cambio file (file scelto dall'utente)
  const handleFileChange = (e) => {
    const file = e.target?.files?.[0]; // Protezione per evitare errori

    if (file) {
      const isValid = file.name.endsWith(".xlsx") || file.name.endsWith(".xls") || file.name.endsWith(".ods");

      if (isValid) {
        setFileStatus(true); // Successo
        handleFileUpload(e); // Passa l'evento alla funzione di upload
      } else {
        setFileStatus(false); // Errore
      }
    } else {
      setFileStatus(null); // Nessun file caricato
    }
  };

  // Funzione per caricare automaticamente un file di test
  const handleTestFileUpload = () => {
    const testFilePath = '/file_test.xlsx'; // Percorso al file di test nel progetto

    // Crea un oggetto FileReader per caricare il file
    fetch(testFilePath)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], 'file_test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Crea un oggetto FormData per simulare un cambio file
        const fakeEvent = {
          target: {
            files: [file],
          },
        };

        handleFileChange(fakeEvent); // Passa l'evento al gestore di cambio file
      })
      .catch((error) => {
        console.error("Errore nel caricamento del file di test:", error);
      });
  };

  return (
    <div className="my-4 flex">
      {/* Input file nascosto */}
      <input
        type="file"
        accept=".xlsx, .xls, .ods"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      
      {/* Etichetta personalizzata per l'input file */}
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-800 transition-colors"
      >
        Carica un file
      </label>

      {/* Bottone per caricare automaticamente il file di test */}
      <button
        onClick={handleTestFileUpload}
        className="ml-4 cursor-pointer bg-green-600 text-white p-2 rounded-lg shadow-md hover:bg-green-800 transition-colors"
      >
        Carica file test.xlsx
      </button>

      {/* Icona di stato del file */}
      <div className="mt-2">
        {fileStatus === true && <FaCheckCircle className="text-green-500 text-2xl absolute ml-5 shadow" />}
        {fileStatus === false && <FaTimesCircle className="text-red-500 text-2xl absolute ml-5 shadow" />}
      </div>
    </div>
  );
}
