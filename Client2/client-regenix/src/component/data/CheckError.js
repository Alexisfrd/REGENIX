import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ajoutez cette ligne en haut du fichier

//import { createClient } from 'redis';


const CheckError = ({ parameter }) => {
/*
    const REDISURL = process.env.REDISURL || "redis://127.0.0.1";
    const client = createClient({ url: REDISURL });
*/

    const navigate = useNavigate();
    const [data, setData] = useState({ value: 0, smin: 0, smax: 0 }); // Step 1: Initialize data with default values
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false); // État pour gérer le rafraîchissement

  
    useEffect(() => {
      const fetchData = () => {
        fetch('http://localhost:8001/temp/' + parameter)
          .then(response => response.json())
          .then(data => setData(data))
          .catch(error => setError(error));
      };
  
      fetchData(); // Fetch data initially
  
      const intervalId = setInterval(fetchData, 10000); // Fetch data every second
  
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [parameter, refresh]);
  
    // Fonction pour gérer le clic sur le bouton
    const handleButtonClick = () => {
        navigate(`/${parameter}`); // Étape 3
        
    };

    const handleIgnoreError= async () => {
      try {
        const response = await axios.post('http://localhost:3000/ignoreError/' + parameter, { Vmin: data.value, Vmax: data.value });
        //alert('Processes deleted successfully: ' + response.data);
        setRefresh(prev => !prev); // Met à jour l'état pour forcer le re-rendu
      } catch (error) {
        console.error('Error update', error);
      }
    };

    // Step 2: Conditional rendering to ensure data is not null
    if (!data) {
      return <div>Loading...</div>; // or any other placeholder
    }

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

    //console.log(parameter, ' => ','Vmin:', data.Vmin, 'smin:', data.smin);
    //console.log('Type of Vmin:', typeof data.Vmin, 'Type of smin:', typeof data.smin);

    const Vmin = Number(data.Vmin);
    const smin = Number(data.smin);
    const Vmax = Number(data.Vmax);
    const smax = Number(data.smax);

    //console.log('Converted Vmin:', Vmin, 'Converted smin:', smin);

  return (
    <div className={`w-full h-full bg-white border-2 ${Vmin < smin || Vmax > smax ? 'border-red-500' : 'border-green-500'} rounded-lg flex justify-center items-center p-2`}>
    <div className="flex flex-col items-center w-full">
      <img src={`${Vmin < smin || Vmax > smax ? '/img/erreur.png' : '/img/verifier.png'} `} alt="Verifier" className="w-24 h-24" /> 
      <span className="mt-1">{getName(parameter)} {Vmin < smin || Vmax > smax ? 'Error' : 'OK'}</span>      
      <div className="w-1/2 h-0.5 bg-gray-400 mx-auto my-2"></div>
      <p className=" pb-1">
        {Vmax > smax || Vmin < data.smin ? "Value out of range" : ""}
      </p>
      <div className="flex flex-col items-center space-y-1 w-full">
        <div className="flex items-center justify-center space-x-2 w-full">
          <div className={`p-1 rounded flex-1 flex items-center justify-center ${Vmin < smin ? 'bg-red-500' : 'bg-green-500'} w-1/3`}>
            <p className="text-sm font-bold text-center text-black">Vmin : {Vmin}</p>
          </div>
          
          <div className={`p-1 rounded flex-1 flex items-center justify-center ${Vmax > smax ? 'bg-red-500' : 'bg-green-500'} w-1/3`}>
            <p className="text-sm font-bold text-center text-black">Vmax : {Vmax}</p>
          </div>
        </div>
        <button onClick={handleButtonClick} className="bg-blue-950 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded w-full">
          Check {getName(parameter)}
        </button>
        {Vmin < smin || Vmax > smax ? (
          <button
            className="bg-blue-950 hover:bg-red-500 text-white font-bold mt-1 py-1 px-2 rounded w-full"
            onClick={handleIgnoreError}
          >
            Ignore error
          </button>
        ) : null}
      </div>
    </div>
  </div>
  );
};

export default CheckError;