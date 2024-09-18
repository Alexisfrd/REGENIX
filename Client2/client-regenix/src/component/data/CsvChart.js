import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import Papa from 'papaparse';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

//import trendlinePlugin from 'chartjs-plugin-trendline';

Chart.register(annotationPlugin);
//Chart.register(trendlinePlugin);
Chart.register(zoomPlugin); // Enregistrez le plugin de zoom

let minThreshold = 0;
let maxThreshold = 0;

const CsvChart = ({ parameter }) => {
  
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: '',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)', // Modifie l'opacité de la courbe de valeur
      borderWidth: 2, // Augmente la largeur de la ligne
      fill: false,
      pointRadius: 1, // Désactive les points
      segment: {
        borderColor: ctx => {
          const prevValue = ctx.p0.parsed.y;
          const nextValue = ctx.p1.parsed.y;
          if (prevValue < minThreshold || prevValue > maxThreshold || nextValue < minThreshold || nextValue > maxThreshold) {
            return 'rgba(255, 0, 0, 1)'; // Couleur rouge si le segment dépasse les seuils
          }
          return 'rgba(75, 192, 192, 1)'; // Couleur par défaut avec opacité
        }
      }
    }]
  });
  const [dataName, setDataName] = useState('');

  useEffect(() => {
    
    const timestamp = new Date().getTime();

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8001/temp/${parameter}`);
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const dataCulture = await response.json();
        const nameCulture = dataCulture.nameCulture;
        const date = dataCulture.dateDebut;
        minThreshold = dataCulture.smin;
        maxThreshold = dataCulture.smax;

        console.log(`Name: ${nameCulture}, Date: ${date}`);

        setDataName(nameCulture); // Set the name to state

        const Csvresponse = await axios.get(`http://localhost:8080/brut/${parameter}/${parameter}_${nameCulture}_${date}.csv?t=${timestamp}`);

        const parsedData = Papa.parse(Csvresponse.data, { header: false });

        const labels = [];
        const data = [];
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Lors du traitement des données CSV
        parsedData.data.forEach(row => {
          if (row.length >= 2) {
            const value = parseFloat(row[0]);
            const timestamp = row[1];
            const rowDate = new Date(timestamp);

            if (rowDate >= last24Hours && rowDate <= now) {
              const formattedDate = rowDate.toLocaleString('fr-CA', { timeZone: 'America/Toronto' }).replace(' ', '-');
              const formattedTime = rowDate.toLocaleTimeString('fr-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit' });
              labels.push(formattedTime);
              
              // Ajoutez un objet avec la valeur et la couleur au tableau de données
              data.push({
                x: formattedTime,
                y: value,
              });
            }
          }
        });

        // Update your state or chart with the labels and data
        setChartData({
          labels,
          datasets: [{
            label: false,
            data,
            borderColor: 'rgba(75, 192, 192, 1)', // Modifie l'opacité de la courbe de valeur
            borderWidth: 2, // Augmente la largeur de la ligne
            fill: false,
            pointRadius: 0, // Désactive les points
            segment: {
              borderColor: ctx => {
                const prevValue = ctx.p0.parsed.y;
                const nextValue = ctx.p1.parsed.y;
                if (prevValue < minThreshold || prevValue > maxThreshold || nextValue < minThreshold || nextValue > maxThreshold) {
                  return 'rgba(255, 0, 0, 1)'; // Couleur rouge si le segment dépasse les seuils
                }
                return 'rgba(75, 192, 192, 1)'; // Couleur par défaut avec opacité
              }
            }
          }]
        });

      } catch (error) {
        console.error('Error fetching the CSV data', error);
      }
    };

    fetchData();
  }, [parameter]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: true // Cela retire les lignes verticales de la grille sur l'axe des x
        },
        title: {
          display: true,
          text: 'last 24 hours'
        },
        ticks: {
          source: 'auto',
          autoSkip: true,
          maxTicksLimit: 24 // Limite le nombre de ticks à 24 (une par heure)
        }
      },
      y: {
        title: {
          display: true,
          text: 'Values'
        }
      }
    },
    plugins: {
      title: {
        display: false,
        text: dataName // Ajout du titre ici
      },
      legend: {
        display: false // Hide the legend
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            scaleID: 'y',
            value: minThreshold,
            borderColor: 'green',
            borderWidth: 1,
            borderDash: [5, 5], // Ligne en pointillé
            label: {
              content: 'Min Threshold',
              enabled: true,
              position: 'start'
            }
          },
          {
            type: 'line',
            scaleID: 'y',
            value: maxThreshold,
            borderColor: 'red',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
              content: 'Max Threshold',
              enabled: true,
              position: 'start'
            }
          }
        ]
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy'
        },
        zoom: {
          wheel: {
            enabled: true
          },
          mode: 'xy'
        }
      }
    },
    animation: {
      duration: 3000 // Durée de l'animation en millisecondes (ici 3 secondes)
    }
  };

  return (
    <div className="flex justify-center items-center py-6">
      <div className="bg-white text-white p-4 rounded-lg shadow-md w-full max-w-full" style={{ height: '400px' }}>
        <Line data={chartData} options={options} plugins={[zoomPlugin]} />
      </div>
    </div>
  );
};

export default CsvChart;