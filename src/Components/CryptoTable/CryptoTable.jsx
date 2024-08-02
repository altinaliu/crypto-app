import React from 'react';
import SmallChart from '../SmallChart/SmallChart';
import './CryptoTable.scss';

const CryptoTable = ({ cryptos, onCryptoClick }) => {
  const getMockChartData = () => {
    return Array.from({ length: 7 }, (_, i) => ({
      date: `Day ${i + 1}`,
      price: Math.random() * 1000,
    }));
  };

  return (
    <table className="crypto-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Coin</th>
          <th>Price</th>
          <th>1h</th>
          <th>24h</th>
          <th>7d</th>
          <th>24h Volume</th>
          <th>Market Cap</th>
          <th>Last 7 Days</th>
        </tr>
      </thead>
      <tbody>
        {cryptos.map((crypto, index) => (
          <tr key={crypto.id} onClick={() => onCryptoClick(crypto.id)}>
            <td>{index + 1}</td>
            <td>{crypto.name} ({crypto.symbol.toUpperCase()})</td>
            <td>${crypto.current_price ? crypto.current_price.toFixed(2) : 'N/A'}</td>
            <td>{crypto.price_change_percentage_1h ? crypto.price_change_percentage_1h.toFixed(2) : 'N/A'}%</td>
            <td>{crypto.price_change_percentage_24h ? crypto.price_change_percentage_24h.toFixed(2) : 'N/A'}%</td>
            <td>{crypto.price_change_percentage_7d ? crypto.price_change_percentage_7d.toFixed(2) : 'N/A'}%</td>
            <td>${crypto.total_volume ? crypto.total_volume.toLocaleString() : 'N/A'}</td>
            <td>${crypto.market_cap ? crypto.market_cap.toLocaleString() : 'N/A'}</td>
            <td>
              <SmallChart data={getMockChartData()} /> 
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CryptoTable;
