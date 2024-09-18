import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ parameter }) => {
    const [chartData, setChartData] = useState({
        labels: ['valeur OK', 'valeur < seuil', 'valeur > seuil'],
        datasets: [
            {
                
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    });
    
    

    useEffect(() => {
        
        const fetchData = async () => {
            try {
                const timestamp = new Date().getTime();
                const response = await fetch(`http://localhost:8001/temp/${parameter}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const dataCulture = await response.json();
                const nameCulture = dataCulture.nameCulture;
                const date = dataCulture.dateDebut;
    
                const Csvresponse = await axios.get(`http://localhost:8080/brut/${parameter}/${parameter}_${nameCulture}_${date}.csv?t=${timestamp}`);
                const parsedData = Papa.parse(Csvresponse.data, { header: false });
    
                let okCount = 0;
                let belowThresholdCount = 0;
                let aboveThresholdCount = 0;
    
                parsedData.data.forEach(row => {
                    if (row.length >= 5) {
                        const errorCode = parseInt(row[4], 10);
                        if (errorCode === 0) {
                            okCount++;
                        } else if (errorCode === 1) {
                            aboveThresholdCount++;
                        } else if (errorCode === 2) {
                            belowThresholdCount++;
                        }
                    }
                });
    
                setChartData({
                    labels: ['Values OK', 'Values < threshold', 'Values > threshold'],
                    datasets: [
                        {
                            
                            data: [okCount, belowThresholdCount, aboveThresholdCount],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 206, 86, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [parameter]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                
                display: false,
            },
            title: {
                display: true,
                text: `Log errors`,
            },
        },
    };

    return (
        <div className="flex justify-center items-center h-full">
            <div className="bg-white text-black p-4 rounded-lg shadow-md w-full h-full max-w-full max-h-full flex flex-col">
                <div className="flex-grow h-full">
                    <Bar data={chartData} options={options} height={null} />
                </div>
            </div>
        </div>
    );
};

export default BarChart;