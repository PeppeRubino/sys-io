import React from "react";

// Funzione per determinare il profilo basato sulle statistiche calcolate
const determineProfile = (mean, median, standardDeviation, mode, profiles) => {
  const compareCategory = (value, category) => {
    switch (category) {
      case "high":
        return value >= 7;
      case "medium":
        return value >= 4 && value < 7;
      case "low":
        return value < 4;
      default:
        return false;
    }
  };

  for (const profileKey in profiles) {
    const profile = profiles[profileKey];

    const isMeanMatch = compareCategory(mean, profile.criteria.mean);
    const isMedianMatch = compareCategory(median, profile.criteria.median);
    const isStdDevMatch = compareCategory(standardDeviation, profile.criteria.std_dev);
    const isModeMatch = compareCategory(mode, profile.criteria.mode);

    if (isMeanMatch && isMedianMatch && isStdDevMatch && isModeMatch) {
      return profile.description;
    }
  }

  return "Descrizione non disponibile per questo profilo.";
};

const StudentProfile = ({ mean, median, standardDeviation, mode, profiles }) => {
  const studentProfileDescription = determineProfile(mean, median, standardDeviation, mode, profiles);

  return (
    <div className="mt-6 p-6 bg-blue-600 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-center text-white">📝 Profile</h3>
      <p className="bg-white p-3 shadow-sm rounded-lg">{studentProfileDescription}</p>
    </div>
  );
};

export default StudentProfile;
