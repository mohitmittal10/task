import React from 'react';
import WeatherVisualization from './WeatherVisualization';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container mx-auto px-4 py-8">
        <WeatherVisualization />
      </div>
    </div>
  );
}

export default App;