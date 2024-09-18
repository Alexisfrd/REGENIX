import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../component/navbar/sidebar';
import TempData from '../component/data/tempdata';
import CheckError from '../component/data/CheckError';
import Cycle from '../component/data/Cycle';

function Dashboard() {
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

  return (
    <div id="main-container" className="flex h-[100vh] bg-gray-100">
      {/* Barre de navigation à gauche */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-3 justify-items-auto">
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
    </div>
  );
}

export default Dashboard;