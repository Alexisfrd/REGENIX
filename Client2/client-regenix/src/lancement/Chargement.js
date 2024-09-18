import React, { useEffect, useState } from 'react';

const Chargement = () => {
  const [progress, setProgress] = useState(0);
  const [imageSrc, setImageSrc] = useState('/img/loading.png');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + (100 / 30); // Incrémenter de 100/30 chaque seconde
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 1000); // Mettre à jour chaque seconde

    const timeout = setTimeout(() => {
      setImageSrc('/img/verifier.png');
    }, 30000); // Changer l'image après 30 secondes

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const getLoadingText = () => {
    if (progress >= 100) {
      return "Loading OK";
    } else if (progress < 33.33) {
      return "Starting RabbitMQ service";
    } else if (progress < 66.66) {
      return "Starting Redis service";
    } else {
      return "Starting CSV file storage server";
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-white shadow-lg z-50 flex flex-col items-center justify-center rounded-lg">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .spin {
            animation: spin 2s linear infinite;
          }
        `}
      </style>
      {progress < 100 && (
        <img src={imageSrc} alt="Loading" className={`mb-4 w-16 h-16 ${imageSrc === '/img/loading.png' ? 'spin' : ''}`} />
      )}
      <p className="mb-4 text-gray-700">{getLoadingText()}</p>
      <div className="w-2/3 bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-gray-700">Loading... {Math.round(progress)}%</p>
    </div>
  );
};

export default Chargement;