import React from 'react';
import { Line } from 'react-chartjs-2';
// import Chart from 'chart.js/auto';


const SmallChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.date), 
    datasets: [{
      label: 'Price',
      data: data.map(d => d.price),  
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <div style={{ width: '100px', height: '50px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SmallChart;
