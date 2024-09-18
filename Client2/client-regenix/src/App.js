import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './component/navbar/sidebar';
import TempData from './component/data/tempdata';
import CheckError from './component/data/CheckError';
import Cycle from './component/data/Cycle';
import Chargement from './lancement/Chargement';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const parameter = 'temp'; // Définir la variable parameter

  // Fonction pour entrer en mode plein écran
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
      elem.msRequestFullscreen();
    }
  };

  useEffect(() => {
    // Ajouter un écouteur d'événement de clic sur le conteneur principal
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) {
      mainContainer.addEventListener('click', enterFullScreen);
    }

    // Nettoyer les écouteurs d'événements lors du démontage du composant
    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener('click', enterFullScreen);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = () => {
      fetch(`http://localhost:8001/temp/${parameter}`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => setError(error));
    };

    fetchData(); // Fetch data initially

    return () => {}; // Cleanup interval on component unmount
  }, [parameter]);

  useEffect(() => {
      const timer = setTimeout(() => {
        navigate('/culture');
      }, 32000); // 32 secondes

      return () => clearTimeout(timer); // Cleanup timeout on component unmount or data change
  }, [navigate]);

  const blurStyle = {
    filter: 'blur(5px)',
    pointerEvents: 'none', // Empêche les interactions avec les éléments flous
  };


  return (
    <div id="main-container" className="flex h-[100vh] bg-gray-100">
      {/* Barre de navigation à gauche */}
      <div  style={blurStyle}>
        <Sidebar />
      </div>
      {/* Contenu principal */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-3 justify-items-auto"  style={blurStyle}>
        <div className="bg-white rounded-lg shadow-md w-full col-span-2 items-center justify-center">
          <Cycle />
        </div>
        {/* Colonne de gauche */}
        <div className="bg-white p-4 rounded-lg shadow-md flex space-x-4">
          <div className="w-1/2">
            <TempData parameter="temp" />
          </div>
          <div className="w-1/2">
            <CheckError parameter="temp" />
          </div>
        </div>

        {/* BarGraph */}
        <div className="bg-white p-4 rounded-lg shadow-md flex space-x-4">
          <div className="w-1/2">
            <TempData parameter="ph" />
          </div>
          <div className="w-1/2">
            <CheckError parameter="ph" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex space-x-4 ">
          <div className="w-1/2">
            <TempData parameter="do" />
          </div>
          <div className="w-1/2 h-full">
            <CheckError parameter="do" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex space-x-4 ">
          <div className="w-1/2">
            <TempData parameter="debit" />
          </div>
          <div className="w-1/2 h-full">
            <CheckError parameter="debit" />
          </div>
        </div>
      </div>
      <Chargement />
    </div>
  );
}

export default App;