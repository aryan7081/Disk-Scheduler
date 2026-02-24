import React, { useState } from 'react';
import './App.css';
import InputPanel from './components/InputPanel';
import VisualizationPanel from './components/VisualizationPanel';
import ResultsPanel from './components/ResultsPanel';
import ComparisonPanel from './components/ComparisonPanel';
import Header from './components/Header';
import { API_ENDPOINTS } from './config/api';

function App() {
  const [simulationData, setSimulationData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSimulate = async (requestData) => {
    setLoading(true);
    setError(null);
    setComparisonData(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.SIMULATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Simulation failed');
      }

      const data = await response.json();
      setSimulationData(data);
    } catch (err) {
      setError(err.message);
      setSimulationData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async (requestData) => {
    setLoading(true);
    setError(null);
    setSimulationData(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.COMPARE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Comparison failed');
      }

      const data = await response.json();
      setComparisonData(data);
    } catch (err) {
      setError(err.message);
      setComparisonData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="container">
        <div className="left-panel">
          <InputPanel 
            onSimulate={handleSimulate}
            onCompare={handleCompare}
            loading={loading}
          />
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
        
        <div className="right-panel">
          {comparisonData ? (
            <ComparisonPanel data={comparisonData} />
          ) : simulationData ? (
            <>
              <VisualizationPanel data={simulationData} />
              <ResultsPanel data={simulationData} />
            </>
          ) : (
            <div className="welcome-message">
              <h2>Welcome to Disk Scheduling Algorithm Simulator</h2>
              <p>Enter disk track requests and initial head position to start simulating.</p>
              <div className="info-box">
                <h3>Available Algorithms:</h3>
                <ul>
                  <li><strong>FCFS</strong> - First Come First Served</li>
                  <li><strong>SSTF</strong> - Shortest Seek Time First</li>
                  <li><strong>SCAN</strong> - Elevator Algorithm</li>
                  <li><strong>C-SCAN</strong> - Circular SCAN</li>
                  <li><strong>LOOK</strong> - LOOK Algorithm</li>
                  <li><strong>C-LOOK</strong> - Circular LOOK</li>
                  <li><strong>N-Step SCAN</strong> - Batched SCAN (batch size N)</li>
                  <li><strong>FSCAN</strong> - Two-queue SCAN</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
