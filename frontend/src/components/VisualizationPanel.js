import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine } from 'recharts';
import './VisualizationPanel.css';

function VisualizationPanel({ data }) {
  const { result, request } = data;
  const { sequence, seek_operations, initial_position } = result;
  const { disk_size } = request;

  // Prepare data for head movement visualization
  const movementData = [];
  
  seek_operations.forEach(([from, to], index) => {
    movementData.push({
      step: index,
      position: from,
      type: 'from'
    });
    movementData.push({
      step: index + 0.5,
      position: to,
      type: 'to'
    });
  });

  // Prepare data for sequence visualization
  const sequenceData = sequence.map((track, index) => ({
    step: index + 1,
    track: track,
    seekDistance: index === 0 
      ? Math.abs(track - initial_position)
      : Math.abs(track - sequence[index - 1])
  }));

  // Prepare scatter data for disk visualization
  const scatterData = sequence.map((track, index) => ({
    x: index + 1,
    y: track,
    seekDistance: index === 0 
      ? Math.abs(track - initial_position)
      : Math.abs(track - sequence[index - 1])
  }));

  return (
    <div className="visualization-panel">
      <h2>Visualization</h2>
      
      <div className="chart-container">
        <h3>Disk Head Movement</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sequenceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="step" 
              label={{ value: 'Request Sequence', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              domain={[0, disk_size - 1]}
              label={{ value: 'Track Position', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'track') return [`Track ${value}`, 'Position'];
                return [value, name];
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="track" 
              stroke="#667eea" 
              strokeWidth={3}
              dot={{ fill: '#667eea', r: 5 }}
              activeDot={{ r: 7 }}
              name="Track Position"
            />
            <ReferenceLine 
              y={initial_position} 
              stroke="#ff9800" 
              strokeDasharray="5 5"
              label={{ value: 'Initial Position', position: 'right' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Seek Distance per Operation</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={sequenceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="step" 
              label={{ value: 'Operation Number', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Seek Distance', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="seekDistance" 
              stroke="#4caf50" 
              strokeWidth={2}
              dot={{ fill: '#4caf50', r: 4 }}
              name="Seek Distance"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Track Access Pattern</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Sequence"
              label={{ value: 'Request Order', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Track"
              domain={[0, disk_size - 1]}
              label={{ value: 'Track Number', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => {
                if (name === 'y') return [`Track ${value}`, 'Position'];
                if (name === 'x') return [`Request #${value}`, 'Sequence'];
                return [value, name];
              }}
            />
            <Scatter 
              name="Track Accesses" 
              data={scatterData} 
              fill="#667eea"
            />
            <ReferenceLine 
              y={initial_position} 
              stroke="#ff9800" 
              strokeDasharray="5 5"
              label={{ value: 'Start', position: 'right' }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default VisualizationPanel;
