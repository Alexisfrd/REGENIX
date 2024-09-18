import React from 'react';
import { useState, useEffect } from 'react';

const Cycle = () => {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch(`http://localhost:8001/temp/temp`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => setError(error));
    };

    fetchData(); // Fetch data initially

    const intervalId = setInterval(fetchData, 60000); // Fetch data every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const getCycle = () => {
    if (!data) {
      return 'Loading...'; // Or any other placeholder text
    }

    switch (data.cycle) {
      case "0":
        return 'No culture in progress';
      case "1":
        return 'Culture in progress';
      case "2":
        return 'Cycle 2';
      case "3":
        return 'Cycle 3';
      default:
        return '';
    }
  };
  
  const formatDuration = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d:${hours}h:${minutes}m`;
  };

  return (
    <div className="flex justify-between items-center text-xl h-full">
    {/* Section gauche */}
    <div className="flex-1 flex justify-start items-center h-full pl-4">
      <span>Culture Cycle</span>
      <span className="mx-2">|</span>
      <span className="text-blue-950 p-1 rounded">{getCycle()}</span>
    </div>
    
    {/* Section centre */}
    <div className="flex-1 flex justify-center items-center h-full ">
      {data ? (
          <span className="text-blue-950 p-1 rounded">{data.nameCulture}</span>
        ) : (
          'Loading...'
        )}
    </div>
    
    {/* Section droite */}
    <div className="flex-1 flex justify-end items-center h-full text-5xl">
    <div className="w-full h-full bg-blue-950 flex items-center justify-center rounded-tr-lg rounded-br-lg">
      <img src="/img/clock.png" alt="Clock" className="w-6 h-6 inline-block filter-white mx-1" />
        {data ? (
          <span className="text-white p-1">{formatDuration(data.duration)}</span>
        ) : (
          'Loading...'
        )}
      </div>
    </div>
  </div>
  );
};

export default Cycle;