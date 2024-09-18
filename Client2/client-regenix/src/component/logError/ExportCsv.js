import React from 'react';
import axios from 'axios';

const ExportCsv = () => {

    const handleExportCsv= async () => {
        try {
          const response = await axios.post('http://localhost:3000/exportCsv');
          //alert('Processes deleted successfully: ' + response.data);
          //setRefresh(prev => !prev); // Met à jour l'état pour forcer le re-rendu
        } catch (error) {
          console.error('Error update', error);
        }
      };

  return (
    <button 
        onClick={handleExportCsv}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
    >
      Export CSV file
    </button>
  );
};

export default ExportCsv;