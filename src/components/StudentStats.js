import React from "react";

// Funzioni per calcolare le statistiche
const calculateMean = (grades) => {
  if (!grades.length) return 0;
  return (grades.reduce((acc, val) => acc + val, 0) / grades.length).toFixed(2);
};

const calculateMedian = (grades) => {
  if (!grades.length) return 0;
  const sorted = [...grades].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
};

const calculateStandardDeviation = (grades) => {
  if (!grades.length) return 0;
  const mean = calculateMean(grades);
  const variance = grades.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / grades.length;
  return Math.sqrt(variance).toFixed(2);
};

const calculateMode = (grades) => {
  if (!grades.length) return 0;
  const frequency = {};
  let maxFreq = 0;

  grades.forEach((grade) => {
    frequency[grade] = (frequency[grade] || 0) + 1;
    maxFreq = Math.max(maxFreq, frequency[grade]);
  });

  const modes = Object.keys(frequency)
    .filter((key) => frequency[key] === maxFreq)
    .map(Number); // Converte le chiavi in numeri

  return modes.length === grades.length ? 0 : modes; // Se ogni numero è unico, non c'è moda
};


// Componente StatItem
function StatItem({ title, individualValue, classValue, tooltipText }) {
  return (
    <div className="p-3 bg-white rounded-lg shadow text-center" title={tooltipText}>
      <h3 className="text-md font-medium">{title}</h3>
      <p className="text-lg font-bold text-blue-600">{individualValue}</p>
      <p className="text-sm text-gray-500">{classValue}</p> {/* Mostra la statistica della classe in grigio e più piccola */}
    </div>
  );
}

export default function StudentStats({ studentGrades, classGrades }) {
  const studentScores = studentGrades.map((entry) => entry.Voto);
  const classScores = classGrades.map((entry) => entry.Voto);

  // Calcoli statistici per lo studente
  const mean = calculateMean(studentScores);
  const mode = calculateMode(studentScores);
  const median = calculateMedian(studentScores);
  const standardDeviation = calculateStandardDeviation(studentScores);

  // Calcoli statistici per la classe
  const classMean = calculateMean(classScores);
  const classMode = calculateMode(classScores);
  const classMedian = calculateMedian(classScores);
  const classStandardDeviation = calculateStandardDeviation(classScores);

  return (
    <div className="mt-6 p-6 bg-blue-600 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text- text-white text-center">⚙️ Stats</h2>
      <div className="grid  grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <StatItem 
          title="Media" 
          individualValue={mean} 
          classValue={`Classe: ${classMean}`} 
          tooltipText="La media dei voti dello studente e la media della classe"
        />
        <StatItem 
          title="Mediana" 
          individualValue={median} 
          classValue={`Classe: ${classMedian}`} 
          tooltipText="Il voto centrale tra i voti ordinati dello studente e della classe" 
        />
        <StatItem 
          title="Dev. Standard" 
          individualValue={standardDeviation} 
          classValue={`Classe: ${classStandardDeviation}`} 
          tooltipText="La variabilità dei voti dello studente e della classe (quanto sono altalenanti i voti). Una dev. standard sopra 1.50 può indicarci che siamo davanti a un bravo alunno che sta avendo difficoltà, o viceversa." 
        />
     <StatItem 
  title="Moda" 
  individualValue={Array.isArray(mode) ? mode.join(", ") : mode} 
  classValue={`Classe: ${Array.isArray(classMode) ? classMode.join(", ") : classMode}`} 
  tooltipText="Il voto che appare più frequentemente tra i voti dello studente e della classe" 
/>

      </div>

  
    </div>
  );
}
