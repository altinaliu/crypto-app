import React, { useState } from 'react';
import './PortfolioTracker.scss'; 

const PortfolioTracker = ({ cryptos = [] }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [sellAmount, setSellAmount] = useState(''); 

  const addCrypto = () => {
    const crypto = cryptos.find((c) => c.id === selectedCrypto);
    if (crypto) {
      const existingCrypto = portfolio.find((item) => item.id === crypto.id);
      if (existingCrypto) {
      
        setPortfolio(
          portfolio.map((item) =>
            item.id === crypto.id
              ? { ...item, amount: item.amount + parseFloat(amount) }
              : item
          )
        );
      } else {
       
        setPortfolio([...portfolio, { ...crypto, amount: parseFloat(amount) }]);
      }
      setSelectedCrypto('');
      setAmount('');
    }
  };

  
  const sellCrypto = (cryptoId) => {
    const crypto = portfolio.find((item) => item.id === cryptoId);
    if (crypto && parseFloat(sellAmount) > 0) {
      if (crypto.amount > parseFloat(sellAmount)) {
      
        setPortfolio(
          portfolio.map((item) =>
            item.id === cryptoId
              ? { ...item, amount: item.amount - parseFloat(sellAmount) }
              : item
          )
        );
      } else {
       
        setPortfolio(portfolio.filter((item) => item.id !== cryptoId));
      }
      setSellAmount('');
    }
  };

  const portfolioValue = portfolio.reduce(
    (total, item) => total + item.current_price * item.amount,
    0
  );

  return (
    <div className="portfolio-tracker">
      <h2>My Cryptocurrency Portfolio</h2>
      <div className="portfolio-summary">
        <div className="summary-item">
          Total Portfolio Value
          <span className="summary-item-value">${portfolioValue.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          Total Coins
          <span className="summary-item-value">{portfolio.length}</span>
        </div>
      </div>
      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Coin</th>
            <th>Amount</th>
            <th>Current Price</th>
            <th>Value</th>
            <th>Change  24h</th>
            <th>Sell</th> 
          </tr>
        </thead>
        <tbody>
          {portfolio.map((item) => (
            <tr key={item.id}>
              <td className="crypto-name">
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
              </td>
              <td>{item.amount}</td>
              <td>${item.current_price.toFixed(2)}</td>
              <td>${(item.current_price * item.amount).toFixed(2)}</td>
              <td
                className={`crypto-change ${
                  item.price_change_percentage_24h > 0 ? 'positive' : 'negative'
                }`}
              >
                {item.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>
                
                <input
                  type="number"
                  placeholder="Amount to Sell"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  min="0"
                  max={item.amount}
                  style={{ width: '100px', marginRight: '10px' }} 
                />
                <button onClick={() => sellCrypto(item.id)}>Sell</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-crypto">
        <h3>Add Cryptocurrency</h3>
        <div className="crypto-form">
          <label htmlFor="crypto-select">Select Crypto:</label>
          <select
            id="crypto-select"
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
          >
            <option value="">--Select--</option>
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name}
              </option>
            ))}
          </select>
          <label htmlFor="amount-input">Amount:</label>
          <input
            type="number"
            id="amount-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
          <button onClick={addCrypto}>Add to Portfolio</button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTracker;
