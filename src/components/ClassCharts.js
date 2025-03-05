import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  BarController,
  LineController,
  ScatterController,
  PieController,
  DoughnutController,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  BarController, // <- Aggiunto
  LineController, // <- Aggiunto
  ScatterController, // <- Aggiunto
  PieController, // <- Aggiunto
  DoughnutController, // <- Aggiunto
  ChartDataLabels
);


const formatDate = (input) => {
  let date;
  
  if (typeof input === 'number') {
    // Handle Excel date format (numeric)
    const excelBaseDate = new Date(1900, 0, 1);
    const correctedTimestamp = new Date(excelBaseDate.getTime() + (input - 2) * 86400000);
    date = correctedTimestamp;
  } else if (typeof input === 'string') {
    // Handle date format 'dd/MM/yyyy'
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
    return "Data non valida"; // Invalid data
  }

  if (isNaN(date.getTime())) {
    return "Data non valida"; // Invalid date
  }

  return date.toLocaleDateString('it-IT'); // Return formatted date in Italian
};




// Componente per i vari grafici
export default function ClassCharts({
  gaussianData,
  gradeDistData,
  oralVsWrittenData,
  gradeDistDonutData,
  scatterPlotData,
  maxMinGradeData,
  stats,
})




{
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-12 lg:gap-x-32 gap-y-10 w-full px-4 sm:px-8 md:px-16 lg:px-32 mt-10">
  
      {/* Grafico Distribuzione Normale */}
      <div className="flex flex-col items-center w-full">
        <h1 className="text-lg md:text-2xl font-bold mb-4 text-center">
          Distribuzione Normale (Gaussiana)
        </h1>
        <div className="w-full flex justify-center">
          <Chart type="line" data={gaussianData} className="w-full h-auto" options={{ plugins: { datalabels: { display: false } } }} />
        </div>
      </div>
  
      {/* Istogramma a barre */}
      <div className="flex flex-col items-center w-full">
        <h1 className="text-lg md:text-2xl font-bold mb-4 text-center">Istogramma</h1>
        <div className="w-full flex justify-center">
          <Chart type="bar" data={gradeDistData} className="w-full h-auto" />
        </div>
      </div>
  
{/* Grafico a Dispersione Temporale */}
<div className="flex flex-col items-center w-full">
  <h1 className="text-lg md:text-2xl font-bold mb-4 text-center">
    Grafico a Dispersione Temporale
  </h1>
  <div className="w-full flex justify-center mb-6">
  <Chart
    type="scatter"
    data={scatterPlotData}
    className="w-full h-auto"
    options={{
      responsive: true,
      plugins: {
        datalabels: { display: false },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => tooltipItem.raw.tooltipData || "",
          },
        },
      },
      scales: {
        x: {
          display: true,
          type: "time",
          time: { 
            unit: "month", // Mostra i mesi
            tooltipFormat: "dd/MM/yyyy",
          },
          suggestedMin: new Date('2024-09-01T00:00:00'), // Aiuta la scala a rimanere ampia
          suggestedMax: new Date('2025-06-30T23:59:59'),
          ticks: {
            maxRotation: 0,
            source: "auto",
          },
        },
        y: {
          display: true,
          min: 0,
          max: 11,
        },
      },
    }}
  />
  </div>
</div>


  
      {/* Grafico Min / Max Voto */}
      <div className="flex flex-col items-center w-full">
        <h1 className="text-lg md:text-2xl font-bold text-center">
          Grafico Minimo-Massimo
        </h1>
        <div className="w-full flex justify-center">
          <Chart type="bar" data={maxMinGradeData} className="w-full h-auto" />
        </div>
        <div className="hidden md:flex opacity-80 bg-blue-500 shadow-md p-3 items-center text-sm sm:text-base rounded-lg">
          <p className="text-white text-center">
            Max: {stats.maxDetails?.name} ({formatDate(stats.maxDetails?.date)}) <br />
            Min: {stats.minDetails?.name} ({formatDate(stats.minDetails?.date)})
          </p>
        </div>
      </div>
  
      {/* Grafico a Torta */}
      <div className="flex flex-col items-center w-full">
        <h1 className="text-lg md:text-2xl font-bold mb-4 text-center">
          Grafico a Torta
        </h1>
        <div className="w-full flex justify-center lg:px-10">
          <Chart type="pie" data={oralVsWrittenData} className="w-full h-auto" options={{ responsive: true, plugins: { tooltip: { enabled: false }, legend: { position: "right", labels: { boxWidth: 10, padding: 15 } } } }} />
        </div>
      </div>
  
      {/* Grafico a Ciambella */}
      <div className="flex flex-col items-center w-full lg:px-10">
        <h1 className="text-lg md:text-2xl font-bold mb-4">Grafico a Ciambella</h1>
        <div className="w-full flex justify-center">
          <Chart type="doughnut" data={gradeDistDonutData} className="w-full h-auto" options={{ responsive: true, plugins: { datalabels: { display: true, color: "white", font: { size: 10 }, formatter: (value, ctx) => { let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0); return ((value / sum) * 100).toFixed(2) + "%"; } }, legend: { position: "left", labels: { boxWidth: 10, padding: 10 } } } }} />
        </div>
      </div>
    </div>
  );
  
}
