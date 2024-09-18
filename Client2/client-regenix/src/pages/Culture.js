import React, { useEffect, useState } from 'react';
import Sidebar from '../component/navbar/sidebar';
import Start from '../component/culture/Start'; 
import Stop from '../component/culture/Stop'; 
import axios from 'axios';

let notfind = 0;

const Culture = () => {
  const [cycle, setCycle] = useState(null);

  useEffect(() => {
    const fetchCycle = async () => {
      try {
        const response = await axios.get('http://localhost:8001/temp/temp');
        setCycle(response.data.cycle);
        notfind = 1;
      } catch (error) {
        notfind = 0;
        console.error('Error fetching cycle:', error);
        

      }
    };

    fetchCycle();
  }, []);

  return (
    <div className="flex h-[100vh] bg-gray-100">
      <Sidebar className="w-64" /> {/* Largeur fixe pour la sidebar */}
      <div className="flex-grow flex justify-center items-center p-4 ml-32"> {/* Ajout de ml-10 pour décaler sur la droite */}
        <div className="w-3/4"> {/* Ajustez la largeur ici */}
          {cycle === '0' || notfind === 0 ? <Start /> : <Stop />}
        </div>
      </div>
    </div>
  );
};

export default Culture;