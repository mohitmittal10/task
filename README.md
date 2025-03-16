# Weather Data Visualization

A simple interactive weather data visualization built with React, D3.js, and Vite. This project demonstrates the integration of D3.js with React for creating interactive data visualizations.

## Project Description

This application visualizes weather temperature data over time using a line chart. The visualization includes the following features:

1. **Interactive Line Chart**: Displays temperature trends over time
2. **Tooltips**: Shows detailed information when hovering over data points
3. **Data Labels**: Shows temperature values directly on the chart
4. **Dynamic Data Updates**: Chart updates when new data is added through the form
5. **Weather Icons**: Visual representation of weather conditions
6. **Responsive Design**: Works across different screen sizes

## Features Implemented

- **Line Chart Visualization**: Displays temperature trends with smooth curve
- **Interactive Data Points**: 
  - Color-coded by temperature range
  - Hover effects with size animation
  - Detailed tooltips showing all data properties
- **Dynamic Data Entry Form**: Add new weather data points that immediately update the visualization
- **Data Labels**: Temperature values and weather condition icons displayed on the chart
- **Data Table**: Tabular view of all weather data for reference
- **Responsive Design**: Chart and UI adapt to different screen sizes
- **Animations**: Line drawing animation and delayed appearance of data labels

## Project Setup

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/weather-visualization.git
cd weather-visualization
```

2. Install dependencies:
```bash
npm install
```

### Running the Project Locally

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:5173
```

### Building for Production

```bash
npm run build
```

The build will be generated in the `dist` directory.

## Project Structure

```
weather-visualization/
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx             # Main application component
│   ├── App.css             # Application styles
│   ├── WeatherVisualization.jsx # The visualization component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── package.json
└── README.md
```

## How to Use

1. When you first load the application, you'll see a line chart showing the initial weather data.
2. Hover over any data point to see detailed information in a tooltip.
3. To add new data:
   - Fill in the date, temperature, humidity, and weather condition in the form
   - Click "Add Data"
   - The chart and data table will automatically update with the new information

## Technologies Used

- React.js for UI components and state management
- D3.js for data visualization
- Vite for fast development and optimized builds
- CSS for styling and responsiveness