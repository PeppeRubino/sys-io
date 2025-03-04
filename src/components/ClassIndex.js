// ClassTable.js
import { useEffect, useState, useRef } from "react";
import DownloadPDFButton from "./DownloadPDFButton";
import ClassCharts from "./ClassCharts";
import StudentStatistics from "./ClassStats"; // Importiamo il nuovo componente

export default function ClassTable({ grades, className }) {
  const [stats, setStats] = useState({
    avg: 0,
    median: 0,
    stdDev: 0,
    mode: 0,
    gradeDist: [],
    oralVsWritten: { oral: 0, written: 0 },
    maxGrade: 0,
    minGrade: 0,
    maxDetails: null,
    minDetails: null,
    bestStudents: [],
    worstStudents: [],
  });

  const [allGrades, setAllGrades] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    const gradesArray = Object.values(grades)
      .flat()
      .map((g) => ({
        name: g.Nome,
        grade: g.Voto,
        type: g.Tipo,
        date: g.Data,
      }));

    setAllGrades(gradesArray);

    // Calcolo delle statistiche
    const avg =
      gradesArray.reduce((sum, g) => sum + g.grade, 0) / gradesArray.length ||
      0;
    const sorted = [...gradesArray].sort((a, b) => a.grade - b.grade);
    const median =
      sorted.length % 2 === 0
        ? (sorted[Math.floor(sorted.length / 2) - 1].grade +
            sorted[Math.floor(sorted.length / 2)].grade) /
          2
        : sorted[Math.floor(sorted.length / 2)].grade;

        const stdDev = gradesArray.length
        ? Math.sqrt(
            gradesArray.reduce((sum, g) => sum + Math.pow(g.grade - avg, 2), 0) /
            gradesArray.length
          )
        : 0;
     
        const freqMap = gradesArray.reduce((acc, g) => {
          acc[g.grade] = (acc[g.grade] || 0) + 1;
          return acc;
        }, {});
        
        const maxFreq = Math.max(...Object.values(freqMap), 0);
        const mode = Object.keys(freqMap)
          .filter((key) => freqMap[key] === maxFreq)
          .map(Number); // Converte in numeri
        

    const dist = new Array(10).fill(0);
    gradesArray.forEach((g) => {
      if (g.grade >= 1 && g.grade <= 10) dist[g.grade - 1]++;
    });

    const oral = gradesArray.filter((g) => g.type === "Orale").length;
    const written = gradesArray.filter((g) => g.type === "Scritto").length;

    const maxGrade = Math.max(...gradesArray.map((g) => g.grade));
    const minGrade = Math.min(...gradesArray.map((g) => g.grade));
    const maxDetails = gradesArray.find((g) => g.grade === maxGrade);
    const minDetails = gradesArray.find((g) => g.grade === minGrade);

    // Calcolo dei migliori e peggiori studenti
    const studentAverages = gradesArray.reduce((acc, g) => {
      if (!acc[g.name]) acc[g.name] = { sum: 0, count: 0 };
      acc[g.name].sum += g.grade;
      acc[g.name].count += 1;
      return acc;
    }, {});

    const studentAvgArray = Object.entries(studentAverages).map(
      ([name, data]) => [name, data.sum / data.count]
    );
    studentAvgArray.sort((a, b) => b[1] - a[1]);

    const bestStudents = studentAvgArray.slice(0, 3);
    const worstStudents = studentAvgArray.slice(-3);

    setStats({
      avg,
      median,
      stdDev,
      mode,
      gradeDist: dist,
      oralVsWritten: { oral, written },
      maxGrade,
      minGrade,
      maxDetails,
      minDetails,
      bestStudents,
      worstStudents,
    });
  }, [grades]);
  

  const gradeDistData = {
    labels: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: "Distribuzione dei Voti",
        data: stats.gradeDist,
        backgroundColor: "rgba(50, 150, 255, 0.5)",
        borderColor: "rgba(50, 150, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const oralVsWrittenData = {
    labels: ["Orale", "Scritto"],
    datasets: [
      {
        label: "Tipologia Esame",
        data: [stats.oralVsWritten.oral, stats.oralVsWritten.written],
        backgroundColor: ["rgba(255, 159, 64, 0.5)", "rgba(75, 192, 192, 0.5)"],
        borderColor: ["rgba(255, 159, 64, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const maxMinGradeData = {
    labels: ["Voto Massimo", "Voto Minimo"],
    datasets: [
      {
        label: "Estremo",
        data: [stats.maxGrade, stats.minGrade],
        backgroundColor: ["rgba(75, 182, 70, 0.5)", "rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(75, 182, 70, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const gaussianData = {
    labels: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: "Voti della Classe",
        data: stats.gradeDist,
        backgroundColor: "rgba(50, 150, 255, 0.5)",
        borderColor: "rgba(50, 150, 255, 1)",
        borderWidth: 1,
        fill: false,
        tension: 0.4,
      },
      {
        label: "Curva Gaussiana",
        data: stats.gradeDist.map(
          (_, i) =>
            Math.exp(-0.5 * Math.pow((i + 1 - stats.avg) / stats.stdDev, 2)) /
            (stats.stdDev * Math.sqrt(2 * Math.PI))
        ),
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const gradeDistDonutData = {
    labels: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: "Distribuzione dei Voti (%)",
        data: stats.gradeDist.map(
          (value) => (value / stats.gradeDist.reduce((a, b) => a + b, 0)) * 100
        ),
        backgroundColor: [
          // Rosso per i voti bassi (1-4), più scuro man mano che scende
          "rgba(220, 30, 30, 0.5)", // 1
          "rgba(240, 69, 69, 0.5)", // 2
          "rgba(255, 99, 132, 0.5)", // 3
          "rgba(255, 151, 87, 0.5)", // 4

          // Giallo per i voti medi (7-4), con sfumature
          "rgba(255, 193, 7, 0.5)", // 5
          "rgba(34, 139, 34, 0.5)", // 6
          "rgba(0, 100, 0, 0.5)", // 7

          // Blu per i voti alti (10-8), più scuro man mano che scende
          "rgba(53, 162, 235, 0.5)", // 8
          "rgba(38, 139, 227, 0.5)", // 9
          "rgba(23, 116, 220, 0.5)", // 10
        ],
        borderColor: [
          // Rosso per i voti bassi (3-1), più scuro man mano che scende
          "rgba(220, 30, 30, 1)", // 1
          "rgba(240, 69, 69, 1)", // 2
          "rgba(255, 99, 132, 1)", // 3
          "rgba(255, 151, 87, 1)", // 4

          // Giallo per i voti medi (7-4), con sfumature
          "rgba(255, 193, 7, 1)",  // 5
          "rgba(34, 139, 34, 0.1)", // 6
          "rgba(0, 100, 0, 0.1)", // 7

          // Blu per i voti alti (10-8), più scuro man mano che scende
          "rgba(53, 162, 235, 1)", // 8
          "rgba(38, 139, 227, 1)", // 9
          "rgba(23, 116, 220, 1)", // 10
        ],
        borderWidth: 1,
      },
    ],
  };


  const formatDate = (input) => {
    let date;
  
    if (typeof input === 'number') {
      // Gestisce il formato numerico di Excel
      const excelBaseDate = new Date(1900, 0, 1);
      const correctedTimestamp = new Date(excelBaseDate.getTime() + (input - 2) * 86400000);
      date = correctedTimestamp;
    } else if (typeof input === 'string') {
      // Gestisce il formato 'dd/MM/yyyy'
      const parts = input.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        date = new Date(year, month, day);
      } else {
        date = new Date(input);
      }
    } else if (input instanceof Date) {
      date = input;
    } else {
      return null; // Restituisce null se la data è invalida
    }
  
    if (isNaN(date.getTime())) {
      console.log("Data non valida per:", input);
      return null; // Data non valida
    }
  
    return date; // Restituisce un oggetto Date
  };
  
  const scatterPlotData = {
    datasets: [
      {
        label: "Profilo",
        data: [
          // Punto fittizio all'inizio (settembre 2024)
          { x: new Date('2024-09-01T00:00:00'), y: null, hidden: true },
          // Punto fittizio alla fine (giugno 2025)
          { x: new Date('2025-06-30T23:59:59'), y: null, hidden: true },
          // Dati reali
          ...allGrades.map((g) => {
            const date = formatDate(g.date);
            
            if (!date) {
              return { x: null, y: g.grade, tooltipData: `Nome: ${g.name} - Data: Non valida - Voto: ${g.grade}` };
            }
  
            return {
              x: date,
              y: g.grade,
              tooltipData: `Nome: ${g.name} - Data: ${date.toLocaleDateString('it-IT')} - Voto: ${g.grade}`,
            };
          }),
        ],
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderColor: "rgba(75, 192, 192, 1)",
        pointRadius: 4,
        pointHoverRadius: 7,
      },
    ],
  };
  
  
  
  
  

  return (
    
    <div
      ref={tableRef}
      className="p-6 bg-slate-100 rounded-lg shadow-lg shadow-slate-600"
    >
      <div className="flex justify-center">
        <h1 className="text-3xl bg-blue-700 font-bold mb-6 text-white text-center rounded-md p-2 md:p-6 shadow-md">
          Classe: "{className}"
        </h1>
        <DownloadPDFButton
          targetRef={tableRef}
          fileName={`Statistiche_${className}`}
        />
      </div>
      {/* Statistiche */}
      <StudentStatistics stats={stats} />{" "}
      {/* Passiamo le statistiche a StudentStatistics */}
      {/* Grafici */}
      <ClassCharts
        gaussianData={gaussianData}
        gradeDistData={gradeDistData}
        oralVsWrittenData={oralVsWrittenData}
        gradeDistDonutData={gradeDistDonutData}
        scatterPlotData={scatterPlotData}
        maxMinGradeData={maxMinGradeData}
        stats={stats}
      />
    </div>
  );
}
