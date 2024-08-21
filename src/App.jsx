import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import './App.css';
import CryptoTable from './Components/CryptoTable/CryptoTable';
import CryptoChart from './Components/CryptoChart/CryptoChart';
import Navbar from './Components/Navbar/Navbar';
import BackToTop from './Components/BackToTop/BackToTop';
import PortfolioTracker from './Components/Portfolio/PortfolioTracker';
import Login from './Components/Login/Login';
import SignUp from './Components/Login/SingUp';
import { AuthProvider } from './Context/AuthContext'; 
import ProtectedRoute from './Context/ProtectedRoute';
import About from './Components/About';

function App() {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Price (USD)',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [historicalRange, setHistoricalRange] = useState('30');
  const [alerts, setAlerts] = useState([]);
  const [alertPrice, setAlertPrice] = useState('');

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = () => {
    setLoading(true);
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
      .then(response => response.json())
      .then(data => {
        setCryptos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Error fetching cryptocurrency data');
        setLoading(false);
      });
  };

  const fetchChartData = (cryptoId, range) => {
    setLoading(true);
    fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${range}`)
      .then(response => response.json())
      .then(data => {
        if (data.prices) {
          const prices = data.prices.map(price => ({
            x: new Date(price[0]),
            y: price[1] 
          }));
          setChartData({
            labels: prices.map(price => price.x.toLocaleDateString()),
            datasets: [{
              label: 'Price (USD)',
              data: prices.map(price => price.y),
              borderColor: 'rgba(75,192,192,1)',
              fill: false,
            }]
          });
        } else {
          setChartData({
            labels: [],
            datasets: [{
              label: 'Price (USD)',
              data: [],
              borderColor: 'rgba(75,192,192,1)',
              fill: false,
            }]
          });
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching chart data:', error);
        setError('Error fetching chart data');
        setLoading(false);
      });
  };

  const handleCryptoClick = (cryptoId) => {
    setSelectedCrypto(cryptos.find(crypto => crypto.id === cryptoId));
    fetchChartData(cryptoId, historicalRange);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRangeChange = (event) => {
    setHistoricalRange(event.target.value);
    if (selectedCrypto) {
      fetchChartData(selectedCrypto.id, event.target.value);
    }
  };

  const handleAlertSubmit = (event) => {
    event.preventDefault();
    if (alertPrice && selectedCrypto) {
      setAlerts([...alerts, { id: selectedCrypto.id, name: selectedCrypto.name, price: parseFloat(alertPrice) }]);
      setAlertPrice('');
    }
  };

  useEffect(() => {
    if (cryptos.length > 0) {
      alerts.forEach(alert => {
        const crypto = cryptos.find(c => c.id === alert.id);
        if (crypto && (crypto.current_price >= alert.price)) {
          alertUser(alert);
          setAlerts(alerts.filter(a => a.id !== alert.id)); 
        }
      });
    }
  }, [cryptos, alerts]);

  const alertUser = (alert) => {
    alert(`Price Alert: ${alert.name} has reached $${alert.price}`);
  };

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <Router>
        <div className="App">
          <Navbar />
          <header className="App-header">
            <h1>Cryptocurrency Prices</h1>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <CryptoTable cryptos={filteredCryptos} onCryptoClick={handleCryptoClick} />
            {selectedCrypto && (
              <div>
                <h2>{selectedCrypto.name} Details</h2>
                <p>Symbol: {selectedCrypto.symbol.toUpperCase()}</p>
                <p>Market Cap: ${selectedCrypto.market_cap.toLocaleString()}</p>
                <p>Total Volume: ${selectedCrypto.total_volume.toLocaleString()}</p>
                <p>High 24h: ${selectedCrypto.high_24h}</p>
                <p>Low 24h: ${selectedCrypto.low_24h}</p>
                <h2>Price Chart</h2>
                <label>
                  Select Range:
                  <select value={historicalRange} onChange={handleRangeChange}>
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                  </select>
                </label>
                {chartData.labels.length > 0 ? (
                  <Line data={chartData} />
                ) : (
                  <p>No data available for the selected range.</p>
                )}
                <form onSubmit={handleAlertSubmit}>
                  <label>
                    Set Price Alert:
                    <input
                      type="number"
                      value={alertPrice}
                      onChange={(e) => setAlertPrice(e.target.value)}
                      placeholder="Enter target price"
                    />
                  </label>
                  <button type="submit">Set Alert</button>
                </form>
              </div>
            )}
          </header>
          <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <PortfolioTracker cryptos={cryptos} />
                </ProtectedRoute>
              }
            />
            <Route path="/home" element={<CryptoChart chartData={chartData} />} />
            <Route path='/about' element={<About />} > </Route>
          </Routes>
          </AuthProvider>
          <BackToTop />
        </div>
      </Router>
  );
  
}

export default App;
