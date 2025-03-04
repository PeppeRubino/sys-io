// Studentstats.js
export default function ClassStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-6 px-5 sm:px-10 md:px-20 lg:px-32 py-5 mt-5 text-center">
      {[ 
        "Media", 
        "Mediana", 
        "Deviazione S.", 
        "Moda"
      ].map((label, idx) => (
        <div
          key={idx}
          className="mb-4 sm:mb-6 md:mb-8 py-5 rounded-lg bg-blue-500 shadow-md w-full max-w-xs mx-auto"
        >
          <h3 className="text-sm md:text-lg font-semibold text-white text-center">{label}</h3>
          <p className="text-sm md:text-lg text-white mt-3">
            {label === "Media"
              ? stats.avg.toFixed(2)
              : label === "Mediana"
              ? stats.median
              : label === "Deviazione S."
              ? stats.stdDev.toFixed(2)
              : stats.mode}
          </p>
        </div>
      ))}

      {/* Miglior Studente */}
      <div className="mb-4 sm:mb-6 md:mb-8 py-5 p-4 rounded-lg bg-blue-500 shadow-md w-full max-w-xs mx-auto">
        <h3 className="text-sm md:text-lg font-semibold text-white">
          Miglior Studente
        </h3>
        {(stats.bestStudents ?? []).length > 0 ? (
          <p className="text-sm md:text-lg text-white mt-3">
            {stats.bestStudents[0][0]} (Media:{" "}
            {stats.bestStudents[0][1].toFixed(2)})
          </p>
        ) : (
          <p className="text-sm md:text-lg text-red-700 mt-3">
            Nessun dato disponibile
          </p>
        )}
      </div>

      {/* Peggior Studente */}
      <div className="mb-4 sm:mb-6 md:mb-8 py-5 p-4 rounded-lg bg-blue-500 shadow-md w-full max-w-xs mx-auto">
        <h3 className="text-sm md:text-lg font-semibold text-white">
          Peggior Studente
        </h3>
        {(stats.worstStudents ?? []).length > 0 ? (
          <p className="text-sm md:text-lg text-white mt-3">
            {stats.worstStudents[0][0]} (Media:{" "}
            {stats.worstStudents[0][1].toFixed(2)})
          </p>
        ) : (
          <p className="text-lg text-red-700 mt-3">
            Nessun dato disponibile
          </p>
        )}
      </div>
    </div>
  );
}
