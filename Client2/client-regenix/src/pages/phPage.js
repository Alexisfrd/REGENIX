
import Sidebar from '../component/navbar/sidebar';
import CsvChart from '../component/data/CsvChart';
import BarChart from '../component/data/BarChart';
import Cycle from '../component/data/Cycle';
import Statistic from '../component/data/Statistic';
import Filtre from '../component/data/Filtre';
import React, { useState } from 'react';


function PhPage() {
  const [refreshKey, setRefreshKey] = useState(0); // État pour gérer le rafraîchissement de CsvChart

  const handleRefresh = () => {
      setRefreshKey(oldKey => oldKey + 1); // Incrémente la clé pour forcer le re-rendu de CsvChart
  };
  return (
    <div className="flex h-[100vh] bg-gray-100">
      {/* Barre de navigation à gauche */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 p-4 grid grid-cols-4 gap-2 justify-items-auto">
        <div className="bg-white rounded-lg shadow-md w-full col-span-4 items-center justify-center">
          <Cycle />
        </div>
        <div className="space-y-4 col-span-4">
          <CsvChart parameter="ph" key={refreshKey}/>
          {/* Bouton pour vider le cache */}
        </div>
        <div className="flex space-x-4 col-span-4">
          <div className="w-1/3">
            <BarChart parameter="ph" key={refreshKey}/>
          </div>
          <div className="w-1/3">
            <Statistic parameter="ph" key={refreshKey}/>
          </div>
          <div className="w-1/3">
            <Filtre parameter="ph"onRefresh={handleRefresh}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhPage;