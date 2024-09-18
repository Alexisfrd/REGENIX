import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';



function Start() {
  const [cultureName, setCultureName] = useState('');
  const [smaxValueTemp, setSmaxValueTemp] = useState('');
  const [sminValueTemp, setSminValueTemp] = useState('');
  const [smaxValuePh, setSmaxValuePh] = useState('');
  const [sminValuePh, setSminValuePh] = useState('');
  const [smaxValueDo, setSmaxValueDo] = useState('');
  const [sminValueDo, setSminValueDo] = useState('');
  const [smaxValueDebit, setSmaxValueDebit] = useState('');
  const [sminValueDebit, setSminValueDebit] = useState('');
  const [cultureDuration, setCultureDuration] = useState('');


  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const maxDO = parseFloat(smaxValueDo);
    const minDO = parseFloat(sminValueDo);
    const maxPH = parseFloat(smaxValuePh);
    const minPH = parseFloat(sminValuePh);
    const maxTemp = parseFloat(smaxValueTemp);
    const minTemp = parseFloat(sminValueTemp);
    const maxDebit = parseFloat(smaxValueDebit);
    const minDebit = parseFloat(sminValueDebit);
    const duration = parseFloat(cultureDuration);

    if (isNaN(maxDO) || isNaN(minDO) || isNaN(maxPH) || isNaN(minPH) || isNaN(maxTemp) || isNaN(minTemp) || isNaN(maxDebit) || isNaN(minDebit) || isNaN(duration)) {
      setError('Les valeurs doivent être des nombres.');
      return false;
    }

    if (maxDO < minDO || maxPH < minPH || maxTemp < minTemp || maxDebit < minDebit || duration <= 0) {
      setError('La valeur maximale ne peut pas être inférieure à la valeur minimale.');
      return false;
    }

    setError('');
    return true;
  };


  
  const executePublish = async (queueValue, smaxValue, sminValue, nameValue) => {
    // Récupérer la date actuelle au format JJ-MM-AAAA
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentDate = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
    // Convertir la durée de la culture en secondes
  const SECONDS_IN_A_DAY = 86400;
  const durationSeconds = parseFloat(cultureDuration) * SECONDS_IN_A_DAY;
  
    try {
      const response = await fetch('http://localhost:3000/startCulture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          script: '..\\..\\bin\\publishToRedis.js', 
          args: ['-q', queueValue,'-a', smaxValue, '-i', sminValue, '-n', nameValue, '-d', currentDate, '-f', durationSeconds, '-c', '1'] 
          
        }),
      });

      const result = await response.text();
      console.log('Result:', result); 
      

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const executeClient = async () => {  
    try {
      const response = await fetch('http://localhost:3000/startClient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          script: '..\\..\\bin\\client.js'          
        }),
      });

      const result = await response.text();
      console.log('Result:', result);
      
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
        console.log('Form validated successfully');
        
        try {
            console.log('Calling executeClient');
            executeClient();
        } catch (error) {
            console.error('Error in executeClient:', error);
        }

        try {
            console.log('Calling executePublish for DO');
            executePublish(0, smaxValueDo, sminValueDo, cultureName);
            console.log('Calling executeWrite for DO');
          
        } catch (error) {
            console.error('Error in executePublish/executeWrite for DO:', error);
        }

        try {
          console.log('Calling executePublish for pH');
          executePublish(1, smaxValuePh, sminValuePh, cultureName);
          console.log('Calling executeWrite for pH');
          
      } catch (error) {
          console.error('Error in executePublish/executeWrite for pH:', error);
      }
        try {
            console.log('Calling executePublish for temp');
            executePublish(2, smaxValueTemp, sminValueTemp, cultureName);
            console.log('Calling executeWrite for temp');
            
        } catch (error) {
            console.error('Error in executePublish/executeWrite for temp:', error);
        }
        try {
          console.log('Calling executePublish for temp');
          executePublish(3, smaxValueDebit, sminValueDebit, cultureName);
          console.log('Calling executeWrite for temp');
          
      } catch (error) {
          console.error('Error in executePublish/executeWrite for temp:', error);
      }

        console.log('Navigating to /dashboard');
        navigate('/dashboard');
    } else {
        console.log('Form validation failed');
    }
};

  return (
    <div>
    {/* Main Content */}
    <div className="flex justify-center items-center w-3/4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Starting a Culture</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Culture Information:</label>
            <input
              type="text"
              placeholder="Culture Name"
              className="border border-gray-300 p-2 rounded w-full"
              value={cultureName}
              onChange={(e) => setCultureName(e.target.value)}
            />
          </div>
          <div className="flex space-x-4 mb-4">
              <input 
                type="text" 
                placeholder="Culture Duration (day)" 
                className="w-full p-2 border border-gray-300 rounded" 
                value={cultureDuration} 
                onChange={(e) => setCultureDuration(e.target.value)} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Temperature Thresholds:</label>
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Min" 
                  className="w-full p-2 border border-gray-300 rounded" 
                  value={sminValueTemp} 
                  onChange={(e) => setSminValueTemp(e.target.value)} 
                />
                <input 
                  type="text" 
                  placeholder="Max" 
                  className="w-full p-2 border border-gray-300 rounded" 
                  value={smaxValueTemp} 
                  onChange={(e) => setSmaxValueTemp(e.target.value)} 
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">pH Thresholds:</label>
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Min" 
                  className="w-full p-2 border border-gray-300 rounded" 
                  value={sminValuePh} 
                  onChange={(e) => setSminValuePh(e.target.value)} 
                />
                <input 
                  type="text" 
                  placeholder="Max" 
                  className="w-full p-2 border border-gray-300 rounded" 
                  value={smaxValuePh} 
                  onChange={(e) => setSmaxValuePh(e.target.value)} 
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">DO Thresholds:</label>
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Min" 
                  className="w-full p-2 border border-gray-300 rounded" 
                  value={sminValueDo} 
                  onChange={(e) => setSminValueDo(e.target.value)} 
                />
                <input 
                  type="text" 
                  placeholder="Max" 
                  className="w-full p-2 border border-gray-300 rounded" 
                  value={smaxValueDo} 
                  onChange={(e) => setSmaxValueDo(e.target.value)} 
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Flow Thresholds:</label>
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Min" 
                  className="w-full p-2 border border-gray-300 rounded" 
                  value={sminValueDebit} 
                  onChange={(e) => setSminValueDebit(e.target.value)} 
                />
                <input 
                  type="text" 
                  placeholder="Max" 
                  className="w-full p-2 border border-gray-300 rounded" 
                  value={smaxValueDebit} 
                  onChange={(e) => setSmaxValueDebit(e.target.value)} 
                />
              </div>
            </div>
          </div>
            
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-green-500"> 
              Start
            </button>
          </form>

        {/* Section to stop the culture in progress */}
      </div>
    </div>
</div>
  );
}

export default Start;