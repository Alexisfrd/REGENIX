import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stop = () => {

  const [dataTemp, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch(`http://localhost:8001/alldata`)
        .then(response => response.json())
        .then(dataTemp => setData(dataTemp))
        .catch(error => setError(error));
    };

    fetchData(); // Fetch data initially
  }, []);
  const formatDuration = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d : ${hours}h : ${minutes}m`;
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }


  const handleStopCulture = async () => {
    try {
      const response = await axios.post('http://localhost:3000/killCulture');
      //alert('Processes deleted successfully: ' + response.data);
    } catch (error) {
      console.error('Error stopping culture:', error);
      //alert('Error stopping culture: ' + error.message);
    }
    try {
      const response = await axios.post('http://localhost:3000/updateCycle', { stop: '0' });
      //alert('Processes deleted successfully: ' + response.data);
    } catch (error) {
      console.error('Error update', error);
    }
    window.location.reload(); // Rafraîchir la page
  };

  return (
    <div className="flex justify-center items-center w-3/4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Culture in progress</h1>
        {dataTemp ? (
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Culture Name:</label>
            <p className="border border-gray-300 p-2 rounded w-full">{dataTemp.temp_name_culture}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Culture Duration:</label>
            <p className="border border-gray-300 p-2 rounded w-full">{formatDuration(dataTemp.temp_duration)}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Temperature Thresholds:</label>
              <div className="flex space-x-4">
              <p className="border border-gray-300 p-2 rounded w-full">{dataTemp.temp_smin}</p>
              <p className="border border-gray-300 p-2 rounded w-full">{dataTemp.temp_smax}</p>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">pH Thresholds:</label>
              <div className="flex space-x-4">
              <p className="border border-gray-300 p-2 rounded w-full">{dataTemp.ph_smin}</p>
              <p className="border border-gray-300 p-2 rounded w-full">{dataTemp.ph_smax}</p>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">DO Thresholds:</label>
              <div className="flex space-x-4">
              <p className="border border-gray-300 p-2 rounded w-full">{dataTemp.do_smin}</p>
              <p className="border border-gray-300 p-2 rounded w-full">{dataTemp.do_smax}</p>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Flow Thresholds:</label>
              <div className="flex space-x-4">
              <p className="border border-gray-300 p-2 rounded w-full">{dataTemp.debit_smin}</p>
              <p className="border border-gray-300 p-2 rounded w-full">{dataTemp.debit_smax}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-red-500"
            onClick={handleStopCulture}
          >
            Stop
          </button>
        </form>
      ) : (
        <p>Data not found</p>
      )}
      </div>
      </div>
  );
};

export default Stop;