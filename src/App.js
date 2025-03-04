import { useState, useRef } from "react";
import FileUploader from "./components/FileUploader";
import SearchBar from "./components/SearchBar";
import ClassIndex from "./components/ClassIndex";
import StudentChart from "./components/StudentChart";
import StudentProfile from "./components/StudentProfile";
import StudentStats from "./components/StudentStats";
import StudentTable from "./components/StudentTable"; // Assicurati che sia importato
import profiles from "./data/StudentProfiles.json";
import DownloadPDFButton from "./components/DownloadPDFButton";
import * as XLSX from "xlsx";

export default function App() {
  const [grades, setGrades] = useState({});
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const tableRef = useRef(null);

  const calculateMean = (grades) => {
    if (!grades.length) return 0;
    return (grades.reduce((acc, val) => acc + val, 0) / grades.length).toFixed(
      2
    );
  };

  const calculateMedian = (grades) => {
    if (!grades.length) return 0;
    const sorted = [...grades].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
  };

  const calculateStandardDeviation = (grades) => {
    if (!grades.length) return 0;
    const mean = calculateMean(grades);
    const variance =
      grades.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
      grades.length;
    return Math.sqrt(variance).toFixed(2);
  };

  const calculateMode = (grades) => {
    if (!grades.length) return 0;
    const frequency = {};
    let maxFreq = 0;
    let mode = null;

    grades.forEach((grade) => {
      frequency[grade] = (frequency[grade] || 0) + 1;
      if (frequency[grade] > maxFreq) {
        maxFreq = frequency[grade];
        mode = grade;
      }
    });

    return mode;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      const newGrades = {};

      parsedData.forEach((row) => {
        const { Classe, Nome, ...rest } = row;
        if (!Nome || !Classe) return;

        const fullName = Nome.trim();

        if (!newGrades[Classe]) newGrades[Classe] = {};
        if (!newGrades[Classe][fullName]) newGrades[Classe][fullName] = [];

        for (let key in rest) {
          if (key.startsWith("Voto")) {
            const index = key.replace("Voto", "");
            const voto = rest[key];
            const data = rest[`Data${index}`];
            const tipo = rest[`Tipo${index}`];

            if (voto && data && tipo) {
              newGrades[Classe][fullName].push({
                Nome: fullName,
                Voto: Number(voto),
                Data: data,
                Tipo: tipo,
              });
            }
          }
        }
      });

      setGrades(newGrades);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSearch = () => {
    const searchLower = search.trim().toLowerCase();
    let foundStudent = null;
    let foundClass = null;

    Object.entries(grades).forEach(([classe, studenti]) => {
      if (classe.toLowerCase().includes(searchLower)) {
        foundClass = classe;
      }
      Object.keys(studenti).forEach((studente) => {
        if (studente.toLowerCase().includes(searchLower)) {
          foundStudent = studente;
          foundClass = classe;
        }
      });
    });

    if (foundStudent) {
      setSelectedStudent(foundStudent);
      setSelectedClass(foundClass);
    } else if (foundClass) {
      setSelectedClass(foundClass);
      setSelectedStudent(null);
    } else {
      setSelectedClass(null);
      setSelectedStudent(null);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">📊 .(SYS-C)</h1>
        <div className="mb-4">
          <FileUploader handleFileUpload={handleFileUpload} />
        </div>
        <div className="mb-4">
          <SearchBar
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            suggestions={[
              ...Object.keys(grades),
              ...Object.values(grades).flatMap((cls) => Object.keys(cls)),
            ]}
          />
        </div>
      </div>
      <div ref={tableRef} className="p-6 bg-slate-100 rounded-lg shadow-lg shadow-slate-600">
      {selectedClass && !selectedStudent && (
        <ClassIndex grades={grades[selectedClass]} className={selectedClass} />
      )}

{selectedStudent && (
  <>
      <DownloadPDFButton
        targetRef={tableRef}
        fileName={`Statistiche_${selectedStudent}_${selectedClass}`}
      />
      <StudentChart
        grades={grades[selectedClass][selectedStudent]}
        studentName={selectedStudent}
      />
      <div className="grid grid-cols-2 gap-5">
        <StudentStats
          studentGrades={grades[selectedClass][selectedStudent]}
          classGrades={Object.values(grades[selectedClass]).flat()}
        />
        <StudentProfile
          mean={calculateMean(grades[selectedClass][selectedStudent].map((entry) => entry.Voto))}
          median={calculateMedian(grades[selectedClass][selectedStudent].map((entry) => entry.Voto))}
          standardDeviation={calculateStandardDeviation(grades[selectedClass][selectedStudent].map((entry) => entry.Voto))}
          mode={calculateMode(grades[selectedClass][selectedStudent].map((entry) => entry.Voto))}
          profiles={profiles}
        />
      </div>
      <StudentTable grades={grades[selectedClass][selectedStudent]} />
  </>
)}
 </div>

      {!selectedClass && !selectedStudent && search !== "" && (
        <p className="text-red-500 mt-4">Nessun risultato trovato.</p>
      )}
    </div>
  );
}
