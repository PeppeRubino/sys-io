import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
  ReferenceLine,
} from "recharts";

// Funzione per generare i mesi da settembre a giugno
function generateSchoolYearDates() {
  const months = ["09", "10", "11", "12", "01", "02", "03", "04", "05", "06"];
  const currentYear = new Date().getFullYear();
  console.log('Anno corrente:', currentYear); // Log per l'anno corrente
  return months.map((month, index) => {
    const year = index < 4 ? currentYear - 1 : currentYear;
    const monthYear = `${month}/${year}`; // Formato mm/yyyy
    console.log('Generato mese:', monthYear); // Log per ogni mese generato
    return monthYear;
  });
}


function convertExcelDate(excelSerial) {
  const baseDate = new Date(1899, 11, 30); // Excel inizia dal 30 dicembre 1899
  const date = new Date(baseDate.getTime() + excelSerial * 86400000);
  
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Mesi da 0 a 11
  const year = date.getFullYear();

  return { fullDate: `${day}/${month}/${year}`, monthYear: `${month}/${year}` };
}


export default function StudentChart({ grades, studentName }) {
  const schoolYearDates = generateSchoolYearDates();
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Mappiamo i voti in un dataset per tutti gli esami
  const data = grades.map((grade) => {
    const { fullDate, monthYear } = convertExcelDate(grade.Data);
    return {
      Voto: grade.Voto,
      Tipo: grade.Tipo,
      monthYear: monthYear, // mm/yyyy
      Data: fullDate, // dd/mm/yyyy
    };
  });
  
  console.log('Dati dei voti:', data); // Log per verificare i dati di input

  const getMonthData = (monthYear) => {
    console.log('Parsing per mese:', monthYear); // Verifica il mese selezionato
    const [month, year] = monthYear.split("/");
    const daysInMonth = new Date(year, month, 0).getDate();
    console.log(`Giorni nel mese ${monthYear}:`, daysInMonth); // Verifica quanti giorni ha il mese

    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = (index + 1).toString().padStart(2, "0");
      const fullDate = `${day}/${month}/${year}`;
      console.log('Controllo data:', fullDate); // Verifica la data formattata

      // Confronta la data del file Excel con la data del giorno corrente
      const gradeOrale = data.find((grade) => 
        grade.Data === fullDate && grade.Tipo === "Orale"
      );
      
      const gradeScritto = data.find((grade) => 
        grade.Data === fullDate && grade.Tipo === "Scritto"
      );
      
      

      console.log('Voti trovati per data:', fullDate, 'Orale:', gradeOrale, 'Scritto:', gradeScritto); // Log per i voti trovati

      return {
        Data: fullDate,
        VotoOrale: gradeOrale ? gradeOrale.Voto : null,
        VotoScritto: gradeScritto ? gradeScritto.Voto : null,
      };
    });
  };

  const fullYearData = schoolYearDates.map((date) => {
    const orale = data.find(
      (grade) => grade.monthYear === date && grade.Tipo === "Orale"
    );
    const scritto = data.find(
      (grade) => grade.monthYear === date && grade.Tipo === "Scritto"
    );

    console.log(`Mese: ${date}, Orale: ${orale ? orale.Voto : "N/A"}, Scritto: ${scritto ? scritto.Voto : "N/A"}`); // Log per i voti mensili

    return {
      Data: date,
      VotoOrale: orale ? orale.Voto : null,
      VotoScritto: scritto ? scritto.Voto : null,
    };
  });

  const getDotColor = (voto) => {
    if (voto >= 1 && voto <= 3) return "red";
    if (voto >= 4 && voto <= 5) return "orange";
    if (voto >= 6 && voto <= 10) return "green";
  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <h2 className="text-lg md:text-xl font-bold mb-16 bg-blue-700 text-white px-4 py-4 rounded-md">PROFILO: {studentName}</h2>
      </div>
  
      <div className="mb-4 flex items-center justify-end flex-wrap">
        {schoolYearDates.map((month) => (
          <button
            key={month}
            onClick={() => {
              console.log("Mese selezionato:", month);  // Aggiungi questa riga
              setSelectedMonth(month);
            }}
            className={`w-10 sm:w-20 md:w-24 lg:w-32 px-4 py-2 ml-2 md:m-2 rounded-lg ${
              selectedMonth === month ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {month.split("/")[0]}
          </button>
        ))}
        <button
          onClick={() => setSelectedMonth(null)}
          className="px-4 py-2 m-2 rounded-lg bg-gray-300"
        >
          Anno scolastico
        </button>
      </div>
  
      <ResponsiveContainer width="99%" height={400}>
        <LineChart
          data={selectedMonth ? getMonthData(selectedMonth) : fullYearData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="Data"
            tickFormatter={(tick) => {
              if (selectedMonth) {
                // Quando è selezionato un mese, mostriamo giorno e mese (dd/mm/yyyy)
                const [day, month] = tick.split("/");
                return `${day}/${month}`;
              } else {
                // Se non è selezionato un mese, mostriamo solo mese e anno (mm/yyyy)
                const [month, year] = tick.split("/");
                return `${month}/${year}`;
              }
            }}
            interval={0} // Mostra ogni tick senza saltare nessuno
            angle={-15} // Inclina le etichette per evitare sovrapposizioni (opzionale)
            textAnchor="end" // Allinea meglio le etichette inclinate
            fontSize="13"
          />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="VotoOrale"
            stroke="#8884d8"
            strokeWidth={2}
            connectNulls={true}
            dot={({ cx, cy, payload }) =>
              payload.VotoOrale !== null && payload.Data ? (
                <Dot
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill={getDotColor(payload.VotoOrale)}
                />
              ) : null
            }
          />
          <Line
            type="monotone"
            dataKey="VotoScritto"
            stroke="#82ca9d"
            strokeWidth={2}
            connectNulls={true}
            dot={({ cx, cy, payload }) =>
              payload.VotoScritto !== null && payload.Data ? (
                <Dot
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill={getDotColor(payload.VotoScritto)}
                />
              ) : null
            }
          />
          <ReferenceLine
            y={6}
            stroke="#82ca9d"
            strokeWidth={2}
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>
  
      {/* Leggenda */}
      <div className="mt-8 text-sm">
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-red-500"></span>
            <span>Voti bassi (1-3)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-orange-500"></span>
            <span>Voti medi (4-5)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-green-500"></span>
            <span>Voti alti (6-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-6 h-1 bg-[#8884d8]"></span>
            <span>Voto Orale (linea violetta)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-6 h-1 bg-[#82ca9d]"></span>
            <span>Voto Scritto (linea verde)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-6 h-1 border-t-2 border-dashed border-[#82ca9d]"></span>
            <span>Riferimento: Voto 6</span>
          </div>
        </div>
      </div>
    </div>
  );
  
}
