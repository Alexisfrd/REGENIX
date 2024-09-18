import React, { useState, useEffect } from 'react';

const Filtre = ({ parameter, onRefresh }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = () => {
            fetch(`http://localhost:8001/temp/${parameter}`)
                .then(response => response.json())
                .then(data => setData(data))
                .catch(error => setError(error));
        };

        fetchData(); // Fetch data initially

        const intervalId = setInterval(fetchData, 10000); // Fetch data every second

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [parameter]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    const getUnit = (parameter) => {
        switch (parameter) {
            case 'temp':
                return '°C';
            case 'do':
                return 'mg/L';
            case 'debit':
                return 'mL/min';
            case 'ph':
            default:
                return '';
        }
    };

    const getName = (parameter) => {
        switch (parameter) {
            case 'temp':
                return 'TEMPERATURE';
            case 'do':
                return 'DO';
            case 'debit':
                return 'FLOW RATE';
            case 'ph':
                return 'pH';
            default:
                return '';
        }
    };

    return (
        <div className="flex justify-center items-center h-full">
            <div className="bg-white text-black p-4 rounded-lg shadow-md w-full h-full max-w-full max-h-full flex flex-col">
                <div className="flex-grow h-full flex flex-col justify-start items-center">
                    <p className="text-7xl text-blue-950">{getName(parameter)}</p>
                    <div className="bg-blue-950 text-white p-4 rounded-lg shadow-md w-full mt-4 flex justify-center items-center">
                        <p className="text-5xl">{data.value} {getUnit(parameter)}</p>
                    </div>
                    <button 
                        onClick={onRefresh} 
                        className="mt-4 bg-blue-950 text-white p-2 rounded-lg shadow-md w-full hover:bg-blue-700"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Filtre;