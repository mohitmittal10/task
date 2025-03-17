import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const WeatherVisualization = () => {
  const initialData = [
    { date: '2025-03-10', temperature: 62, humidity: 65, condition: 'Sunny' },
    { date: '2025-03-11', temperature: 58, humidity: 70, condition: 'Partly Cloudy' },
    { date: '2025-03-12', temperature: 65, humidity: 55, condition: 'Sunny' },
    { date: '2025-03-13', temperature: 60, humidity: 75, condition: 'Cloudy' },
    { date: '2025-03-14', temperature: 55, humidity: 80, condition: 'Rainy' },
    { date: '2025-03-15', temperature: 53, humidity: 82, condition: 'Rainy' },
    { date: '2025-03-16', temperature: 57, humidity: 75, condition: 'Cloudy' },
  ];

  const [weatherData, setWeatherData] = useState(initialData);
  
  const [newDate, setNewDate] = useState('2025-03-17');
  const [newTemp, setNewTemp] = useState(60);
  const [newHumidity, setNewHumidity] = useState(70);
  const [newCondition, setNewCondition] = useState('Sunny');

  const svgRef = useRef();
  
  const addNewData = () => {
    const newDataPoint = {
      date: newDate,
      temperature: parseInt(newTemp),
      humidity: parseInt(newHumidity),
      condition: newCondition
    };
    
    setWeatherData([...weatherData, newDataPoint]);
    
    setNewDate(d3.timeFormat('%Y-%m-%d')(d3.timeDay.offset(d3.timeParse('%Y-%m-%d')(newDate), 1)));
    setNewTemp(60);
    setNewHumidity(70);
    setNewCondition('Sunny');
  };

  useEffect(() => {
    if (!weatherData.length) return;

    d3.select(svgRef.current).selectAll("*").remove();
    
    const margin = { top: 40, right: 80, bottom: 60, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseDate = d3.timeParse("%Y-%m-%d");
    
    const x = d3.scaleTime()
      .domain(d3.extent(weatherData, d => parseDate(d.date)))
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([d3.min(weatherData, d => d.temperature) - 5, d3.max(weatherData, d => d.temperature) + 5])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text("Date");

    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis);

    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .text("Temperature (°F)");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Weekly Temperature Trends");

    const line = d3.line()
      .x(d => x(parseDate(d.date)))
      .y(d => y(d.temperature))
      .curve(d3.curveMonotoneX);

    const path = svg.append("path")
      .datum(weatherData)
      .attr("fill", "none")
      .attr("stroke", "#4682b4")
      .attr("stroke-width", 2)
      .attr("d", line);
    
    const pathLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);

    const dots = svg.selectAll(".dot")
      .data(weatherData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(parseDate(d.date)))
      .attr("cy", d => y(d.temperature))
      .attr("r", 5)
      .attr("fill", d => {
        if (d.temperature > 60) return "#ff9900";
        if (d.temperature < 55) return "#3399ff";
        return "#66cc66";
      });

    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "10px")
      .style("pointer-events", "none");

    dots
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(
          `<strong>Date:</strong> ${d.date}<br/>
           <strong>Temperature:</strong> ${d.temperature}°F<br/>
           <strong>Humidity:</strong> ${d.humidity}%<br/>
           <strong>Condition:</strong> ${d.condition}`
        )
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
        
        d3.select(event.currentTarget)
          .attr("r", 8)
          .attr("stroke", "black")
          .attr("stroke-width", 2);
      })
      .on("mouseout", (event) => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
        
        d3.select(event.currentTarget)
          .attr("r", 5)
          .attr("stroke", "none");
      });
    
    svg.selectAll(".text-label")
      .data(weatherData)
      .enter()
      .append("text")
      .attr("class", "text-label")
      .attr("x", d => x(parseDate(d.date)))
      .attr("y", d => y(d.temperature) - 15)
      .attr("text-anchor", "middle")
      .text(d => `${d.temperature}°F`)
      .style("font-size", "12px")
      .style("opacity", 0)
      .transition()
      .delay((d, i) => i * 100)
      .duration(500)
      .style("opacity", 1);
    
    const weatherIcons = {
      "Sunny": "☀️",
      "Partly Cloudy": "⛅",
      "Cloudy": "☁️",
      "Rainy": "🌧️",
      "Snowy": "❄️"
    };
    
    svg.selectAll(".condition-icon")
      .data(weatherData)
      .enter()
      .append("text")
      .attr("class", "condition-icon")
      .attr("x", d => x(parseDate(d.date)))
      .attr("y", d => y(d.temperature) - 30)
      .attr("text-anchor", "middle")
      .text(d => weatherIcons[d.condition] || "")
      .style("font-size", "16px");

    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [weatherData]);

  useEffect(() => {
    const handleResize = () => {
      if (weatherData.length) {
        d3.select(svgRef.current).selectAll("*").remove();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [weatherData]);

  return (
    <div className="weather-visualization p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Weather Data Visualization</h1>
        <p className="mb-4">Interactive visualization of weekly temperature trends with D3.js and React</p>
      </div>
      
      <div 
        ref={svgRef} 
        className="chart-container border border-gray-300 rounded-lg p-2 mb-4"
        style={{ width: '100%', height: '400px' }}
      ></div>
      
      <div className="form-container border border-gray-300 rounded-lg p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">Add New Weather Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Date:</label>
            <input 
              type="date" 
              value={newDate} 
              onChange={(e) => setNewDate(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Temperature (°F):</label>
            <input 
              type="number" 
              value={newTemp} 
              onChange={(e) => setNewTemp(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Humidity (%):</label>
            <input 
              type="number" 
              value={newHumidity} 
              onChange={(e) => setNewHumidity(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Weather Condition:</label>
            <select 
              value={newCondition} 
              onChange={(e) => setNewCondition(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Sunny">Sunny</option>
              <option value="Partly Cloudy">Partly Cloudy</option>
              <option value="Cloudy">Cloudy</option>
              <option value="Rainy">Rainy</option>
              <option value="Snowy">Snowy</option>
            </select>
          </div>
        </div>
        <button 
          onClick={addNewData} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Data
        </button>
      </div>
      
      <div className="table-container border border-gray-300 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-2">Weather Data Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Temperature (°F)</th>
                <th className="p-2 text-left">Humidity (%)</th>
                <th className="p-2 text-left">Condition</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.map((data, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="p-2">{data.date}</td>
                  <td className="p-2">{data.temperature}</td>
                  <td className="p-2">{data.humidity}</td>
                  <td className="p-2">{data.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeatherVisualization;