import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './ComparisonPanel.css';

function ComparisonPanel({ data }) {
  const { results, best_algorithm, comparison } = data;

  // Filter out errors and prepare chart data
  const validResults = results.filter(r => !r.error);
  
  const chartData = validResults.map(result => ({
    algorithm: result.algorithm,
    totalSeekTime: result.total_seek_time,
    averageSeekTime: result.average_seek_time,
    isBest: result.algorithm === best_algorithm
  }));

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b'];

  return (
    <div className="comparison-panel">
      <h2>Algorithm Comparison</h2>
      
      {best_algorithm && (
        <div className="best-algorithm-banner">
          <span className="trophy">🏆</span>
          <span><strong>Best Algorithm:</strong> {best_algorithm}</span>
          <span className="best-metric">
            Total Seek Time: {validResults.find(r => r.algorithm === best_algorithm)?.total_seek_time}
          </span>
        </div>
      )}

      <div className="comparison-summary">
        <div className="summary-card">
          <div className="summary-label">Best Total Seek Time</div>
          <div className="summary-value">{comparison.best_total_seek_time}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Worst Total Seek Time</div>
          <div className="summary-value">{comparison.worst_total_seek_time}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Average Total Seek Time</div>
          <div className="summary-value">{comparison.average_total_seek_time?.toFixed(2)}</div>
        </div>
      </div>

      <div className="chart-container">
        <h3>Total Seek Time Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="algorithm" />
            <YAxis label={{ value: 'Total Seek Time', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSeekTime" name="Total Seek Time">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isBest ? '#4caf50' : COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Average Seek Time Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="algorithm" />
            <YAxis label={{ value: 'Average Seek Time', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageSeekTime" name="Average Seek Time" fill="#667eea">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isBest ? '#4caf50' : COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="detailed-results">
        <h3>Detailed Results</h3>
        <div className="results-table">
          <div className="table-header">
            <div>Algorithm</div>
            <div>Total Seek Time</div>
            <div>Average Seek Time</div>
            <div>Total Requests</div>
          </div>
          {validResults.map((result, index) => (
            <div 
              key={index} 
              className={`table-row ${result.algorithm === best_algorithm ? 'best-row' : ''}`}
            >
              <div>
                {result.algorithm}
                {result.algorithm === best_algorithm && <span className="best-badge">Best</span>}
              </div>
              <div>{result.total_seek_time}</div>
              <div>{result.average_seek_time.toFixed(2)}</div>
              <div>{result.total_requests}</div>
            </div>
          ))}
        </div>
      </div>

      {results.some(r => r.error) && (
        <div className="errors-section">
          <h3>Errors</h3>
          {results.filter(r => r.error).map((result, index) => (
            <div key={index} className="error-item">
              <strong>{result.algorithm}:</strong> {result.error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComparisonPanel;
