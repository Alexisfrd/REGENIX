import React, { useState, useEffect } from 'react';

const TempData = ({ parameter }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch(`http://localhost:8001/temp/${parameter}`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => setError(error));
    };

    fetchData(); // Fetch data initially

    const intervalId = setInterval(fetchData, 10000); // Fetch data every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [parameter]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  // Détermine l'unité en fonction du paramètre
const getUnit = (parameter) => {
  switch (parameter) {
    case 'temp':
      return '°C';
    case 'do':
      return 'mg/L';
    case 'debit':
      return 'mL/min';
    case 'ph':
    default:
      return '';
  }
};

  return (
    <div className="flex justify-center items-center h-full">
    <div className=" bg-blue-950 text-white p-4 rounded-lg shadow-md w-full h-full max-w-full max-h-full grid grid-cols-1 gap-2">
      <div className="justify-self-center">
        <img src={`img/${parameter}.png`} alt={`${parameter} Logo`} className="w-24 h-24 mb-2 filter-white" />
      </div>
      <div className="flex space-x-2">
        <div className="bg-white p-2 rounded flex items-center justify-center w-1/2">
          <p className="text-sm font-bold text-center text-black">Min threshold : {data.smin}</p>
        </div>
        <div className="bg-white p-2 rounded flex items-center justify-center w-1/2">
          <p className="text-sm font-bold text-center text-black">Max threshold : {data.smax}</p>
        </div>
      </div>
      <div className="bg-white p-2 rounded flex items-center justify-center">
        <p className="text-2xl font-bold text-center text-black">
          {data.value} {getUnit(parameter)}
        </p>
      </div>
    </div>
  </div>
  );
};

export default TempData;