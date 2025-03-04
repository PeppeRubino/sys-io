import React from "react";

export default function SearchBar({ search, setSearch, handleSearch }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Attiva la ricerca quando si preme Invio
    }
  };

  return (
    <div className="my-4 flex gap-2">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown} // Ascolta il tasto Invio
        className="border p-2 text-blue-700 text-lg"
        placeholder="Es. 1A... or Mario..."
      />
      <button 
        onClick={handleSearch} 
        className="bg-blue-600 text-white p-2 ml-3 shadow-md rounded-sm hover:bg-blue-800"
      >
        Cerca
      </button>
    </div>
  );
}
