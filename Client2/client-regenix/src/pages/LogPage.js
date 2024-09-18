import React, { useEffect, useState } from 'react';
import Sidebar from '../component/navbar/sidebar';
import axios from 'axios';
import LogCsv from '../component/logError/LogCsv';
import Cycle from '../component/data/Cycle';
import ExportCsv from '../component/logError/ExportCsv';

let notfind = 0;

const LogPage = () => {
  const handleExport = () => {
    // Logique pour exporter les données en fichier CSV
    console.log('Export CSV file');
  };

  return (
    <div className="flex h-[100vh] bg-gray-100">
      <Sidebar className="w-64" /> {/* Largeur fixe pour la sidebar */}
      
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-md w-full col-span-2 items-center justify-center ">
          <Cycle />
        </div>
        
        <div className="grid grid-cols-4 gap-4 ">
          <LogCsv parameter={'temp'} />
          <LogCsv parameter={'ph'} />
          <LogCsv parameter={'do'} />
          <LogCsv parameter={'debit'} />
        </div>

        <div className="flex justify-center mt-1">
          <ExportCsv />
        </div>
      </div>
    </div>
  );
};

export default LogPage;