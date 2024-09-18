import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const CsvList = ({ parameter }) => {
  const [dataName, setDataName] = useState('');
  const [date, setDate] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const VALUES_PER_PAGE = 360; // Définir le nombre de valeurs par page

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

        setDataName(nameCulture); // Set the name to state
        setDate(dateDebut); // Set the date to state

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
                date: row[1],
                value: row[0],
                errorDescription: row[5] // Sixième colonne
            }));
            setData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchParameters();
  }, [parameter]);

    // Calculer les index de début et de fin pour la pagination
    const indexOfLastRow = currentPage * VALUES_PER_PAGE;
    const indexOfFirstRow = indexOfLastRow - VALUES_PER_PAGE;
    const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getName = (parameter) => {
    switch (parameter) {
      case 'temp':
        return 'Temperature';
      case 'do':
        return 'DO';
      case 'debit':
        return 'Flow rate';
      case 'ph':
        return 'pH';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white p-5 rounded shadow w-full mx-auto my-5">
      {data.length > 0 && (
        <div className="overflow-y-scroll" style={{ maxHeight: '600px' }}> {/* Définir une hauteur fixe et activer le défilement */}
          <table className="min-w-full bg-white text-sm text-center">
          <thead>
            <tr>
                <th colSpan="3" className="py-2 sticky top-0 bg-blue-950 text-center text-white">{getName(parameter)}</th>
            </tr>
            <tr>
                <th className="p-1 sticky top-9 bg-gray-200 w-10">Date</th>
                <th className="p-1 sticky top-9 bg-gray-200 w-10">Value</th>
                <th className="p-1 sticky top-9 bg-gray-200 w-20">Log errors</th>
            </tr>
            </thead>
            <tbody>
            {data.map((row, index) => {
                const [date, time] = row.date.split('T'); // Séparer la date et l'heure
                return (
                <tr key={index} className={row.errorDescription !== 'valeur ok' ? 'bg-red-200' : ''}>
                    <td className="border p-1"> 
                        <div>{date}</div>
                        <div>{time}</div>
                    </td>
                    <td className="border p-1">{row.value}</td>
                    <td className="border p-1">{row.errorDescription}</td>
                </tr>
                );
            })}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          className="bg-gray-200 text-black px-4 py-2 rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          className="bg-gray-200 text-blask px-4 py-2 rounded"
          disabled={currentPage === Math.ceil(data.length / VALUES_PER_PAGE)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CsvList;