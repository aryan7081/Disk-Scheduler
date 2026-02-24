import React, { useState } from 'react';
import './InputPanel.css';

function InputPanel({ onSimulate, onCompare, loading }) {
  const [requests, setRequests] = useState('98, 183, 37, 122, 14, 124, 65, 67');
  const [initialPosition, setInitialPosition] = useState(53);
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [diskSize, setDiskSize] = useState(200);
  const [direction, setDirection] = useState('right');
  const [nStep, setNStep] = useState(4);

  const algorithmsRequiringDirection = ['SCAN', 'C-SCAN', 'LOOK', 'C-LOOK', 'N-STEP SCAN', 'FSCAN'];

  const handleSimulate = () => {
    const requestsArray = requests
      .split(',')
      .map(r => parseInt(r.trim()))
      .filter(r => !isNaN(r));

    if (requestsArray.length === 0) {
      alert('Please enter at least one valid track request');
      return;
    }

    const payload = {
      requests: requestsArray,
      initial_position: parseInt(initialPosition),
      algorithm: algorithm,
      disk_size: parseInt(diskSize),
      direction: direction
    };
    if (algorithm === 'N-STEP SCAN') payload.n_step = Math.max(1, parseInt(nStep) || 4);
    onSimulate(payload);
  };

  const handleCompare = () => {
    const requestsArray = requests
      .split(',')
      .map(r => parseInt(r.trim()))
      .filter(r => !isNaN(r));

    if (requestsArray.length === 0) {
      alert('Please enter at least one valid track request');
      return;
    }

    onCompare({
      requests: requestsArray,
      initial_position: parseInt(initialPosition),
      algorithm: 'FCFS', // Ignored in comparison
      disk_size: parseInt(diskSize),
      direction: direction,
      n_step: Math.max(1, parseInt(nStep) || 4)
    });
  };

  const loadPreset = (preset) => {
    switch(preset) {
      case 'example1':
        setRequests('98, 183, 37, 122, 14, 124, 65, 67');
        setInitialPosition(53);
        break;
      case 'example2':
        setRequests('55, 58, 39, 18, 90, 160, 150, 38, 184');
        setInitialPosition(100);
        break;
      case 'example3':
        setRequests('176, 79, 34, 60, 92, 11, 41, 114');
        setInitialPosition(50);
        break;
      default:
        break;
    }
  };

  return (
    <div className="input-panel">
      <h2>Simulation Parameters</h2>
      
      <div className="form-group">
        <label htmlFor="requests">Track Requests (comma-separated):</label>
        <input
          id="requests"
          type="text"
          value={requests}
          onChange={(e) => setRequests(e.target.value)}
          placeholder="e.g., 98, 183, 37, 122"
        />
        <div className="preset-buttons">
          <button onClick={() => loadPreset('example1')} className="preset-btn">Example 1</button>
          <button onClick={() => loadPreset('example2')} className="preset-btn">Example 2</button>
          <button onClick={() => loadPreset('example3')} className="preset-btn">Example 3</button>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="initialPosition">Initial Head Position:</label>
        <input
          id="initialPosition"
          type="number"
          value={initialPosition}
          onChange={(e) => setInitialPosition(e.target.value)}
          min="0"
          max={diskSize - 1}
        />
      </div>

      <div className="form-group">
        <label htmlFor="diskSize">Disk Size (tracks):</label>
        <input
          id="diskSize"
          type="number"
          value={diskSize}
          onChange={(e) => setDiskSize(e.target.value)}
          min="1"
        />
      </div>

      <div className="form-group">
        <label htmlFor="algorithm">Algorithm:</label>
        <select
          id="algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="FCFS">FCFS - First Come First Served</option>
          <option value="SSTF">SSTF - Shortest Seek Time First</option>
          <option value="SCAN">SCAN - Elevator Algorithm</option>
          <option value="C-SCAN">C-SCAN - Circular SCAN</option>
          <option value="LOOK">LOOK - LOOK Algorithm</option>
          <option value="C-LOOK">C-LOOK - Circular LOOK</option>
          <option value="N-STEP SCAN">N-Step SCAN</option>
          <option value="FSCAN">FSCAN</option>
        </select>
      </div>

      {algorithm === 'N-STEP SCAN' && (
        <div className="form-group">
          <label htmlFor="nStep">Batch size (N):</label>
          <input
            id="nStep"
            type="number"
            value={nStep}
            onChange={(e) => setNStep(e.target.value)}
            min="1"
          />
        </div>
      )}

      {algorithmsRequiringDirection.includes(algorithm) && (
        <div className="form-group">
          <label htmlFor="direction">Initial Direction:</label>
          <select
            id="direction"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
          >
            <option value="right">Right (→)</option>
            <option value="left">Left (←)</option>
          </select>
        </div>
      )}

      <div className="button-group">
        <button 
          onClick={handleSimulate} 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Simulating...' : 'Simulate'}
        </button>
        <button 
          onClick={handleCompare} 
          disabled={loading}
          className="btn btn-secondary"
        >
          {loading ? 'Comparing...' : 'Compare All'}
        </button>
      </div>
    </div>
  );
}

export default InputPanel;
