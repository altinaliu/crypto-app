import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; 
import './CryptoChart.css';


function CryptoChart({ chartData }) {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartContainerRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [chartData]); 
  
  return (
    <div className='chart-container'>
  <canvas ref={chartContainerRef} />
    </div>
  )
}


export default CryptoChart;
