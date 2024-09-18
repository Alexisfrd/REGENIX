import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const Statistic = ({ parameter }) => {
  const [data, setData] = useState([]);
  const [average, setAverage] = useState(0);
  const [median, setMedian] = useState(0);
  const [stdDev, setStdDev] = useState(0);

  useEffect(() => {
    const timestamp = new Date().getTime();

    const fetchParameters = async () => {
      try {
        const response = await fetch(`http://localhost:8001/temp/${parameter}`);
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const dataCulture = await response.json();
        const nameCulture = dataCulture.nameCulture;
        const dateDebut = dataCulture.dateDebut;

        console.log(`Name: ${nameCulture}, Date: ${dateDebut}`);

        const Csvresponse = await axios.get(`http://localhost:8080/brut/${parameter}/${parameter}_${nameCulture}_${dateDebut}.csv?t=${timestamp}`);
        
        const parsedData = Papa.parse(Csvresponse.data, {
          header: false,
          dynamicTyping: true,
          skipEmptyLines: true
        });
        if (parsedData.errors.length) {
          console.error('Error parsing CSV:', parsedData.errors);
        } else {
            const formattedData = parsedData.data.map(row => ({
                value: row[0],
            }));
            setData(formattedData);

            // Calculate the average
            const sum = formattedData.reduce((acc, curr) => acc + curr.value, 0);
            const avg = (sum / formattedData.length).toFixed(2);
            setAverage(avg);

            // Calculate the median
            const sortedData = formattedData.map(d => d.value).sort((a, b) => a - b);
            const mid = Math.floor(sortedData.length / 2);
            const med = (sortedData.length % 2 !== 0) ? sortedData[mid] : ((sortedData[mid - 1] + sortedData[mid]) / 2).toFixed(2);
            setMedian(med);

            // Calculate the standard deviation
            const mean = sum / formattedData.length;
            const variance = formattedData.reduce((acc, curr) => acc + Math.pow(curr.value - mean, 2), 0) / formattedData.length;
            const stdDev = Math.sqrt(variance).toFixed(2);
            setStdDev(stdDev);

            // Log formattedData, average, median, and standard deviation
            console.log('Formatted Data:', formattedData, 'Average:', avg, 'Median:', med, 'Standard Deviation:', stdDev);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchParameters();
  }, [parameter]);

  return (
    <div className="flex flex-col items-center space-y-4 text-white">
      <div className="bg-blue-500 py-4 px-14 rounded shadow-md w-full max-w-sm flex items-center justify-between">
        <h3 className="text-2xl">Average</h3>
        <p className="text-3xl">{average}</p>
      </div>
      <div className="bg-red-500 py-4 px-14 rounded shadow-md w-full max-w-sm flex items-center justify-between">
        <h3 className="text-2xl">Median</h3>
        <p className="text-3xl">{median}</p>
      </div>
      <div className="bg-green-500 py-4 px-14 rounded shadow-md w-full max-w-sm flex items-center justify-between">
        <h3 className="text-2xl">Standard Deviation</h3>
        <p className="text-3xl">{stdDev}</p>
      </div>
    </div>
  );
};

export default Statistic;