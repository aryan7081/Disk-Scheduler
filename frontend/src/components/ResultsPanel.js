import React from 'react';
import './ResultsPanel.css';

function ResultsPanel({ data }) {
  const { result, performance_metrics } = data;
  const { algorithm, sequence, total_seek_time, average_seek_time, seek_operations } = result;

  return (
    <div className="results-panel">
      <h2>Simulation Results</h2>
      
      <div className="results-grid">
        <div className="result-card primary">
          <div className="result-label">Algorithm</div>
          <div className="result-value">{algorithm}</div>
        </div>
        
        <div className="result-card">
          <div className="result-label">Total Seek Time</div>
          <div className="result-value">{total_seek_time}</div>
        </div>
        
        <div className="result-card">
          <div className="result-label">Average Seek Time</div>
          <div className="result-value">{average_seek_time.toFixed(2)}</div>
        </div>
        
        <div className="result-card">
          <div className="result-label">Total Requests</div>
          <div className="result-value">{sequence.length}</div>
        </div>
      </div>

      <div className="performance-metrics">
        <h3>Performance Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-label">Efficiency:</span>
            <span className="metric-value">{performance_metrics.efficiency}%</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Throughput:</span>
            <span className="metric-value">{performance_metrics.throughput}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Fairness Index:</span>
            <span className="metric-value">{performance_metrics.fairness_index}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Max Seek Distance:</span>
            <span className="metric-value">{performance_metrics.max_seek_distance}</span>
          </div>
        </div>
      </div>

      <div className="sequence-section">
        <h3>Access Sequence</h3>
        <div className="sequence-container">
          {sequence.map((track, index) => (
            <div key={index} className="sequence-item">
              <span className="sequence-number">{index + 1}</span>
              <span className="sequence-track">Track {track}</span>
              {index > 0 && (
                <span className="sequence-distance">
                  (Seek: {Math.abs(track - sequence[index - 1])})
                </span>
              )}
              {index === 0 && (
                <span className="sequence-distance">
                  (Seek: {Math.abs(track - data.request.initial_position)})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="seek-operations">
        <h3>Seek Operations</h3>
        <div className="operations-table">
          <div className="table-header">
            <div>From</div>
            <div>To</div>
            <div>Distance</div>
          </div>
          {seek_operations.map(([from, to], index) => (
            <div key={index} className="table-row">
              <div>Track {from}</div>
              <div>Track {to}</div>
              <div>{Math.abs(to - from)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResultsPanel;
