import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts'; // Import ApexCharts
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [stockData, setStockData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [view, setView] = useState('stock'); // Default view is 'stock'
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [searchedStock, setSearchedStock] = useState(null); // State for searched stock data
  const [duration, setDuration] = useState('1y'); // State for duration selection
  const [chartType, setChartType] = useState('line'); // State for chart type selection (line or candlestick)
  const tickerRef = useRef(null);

  useEffect(() => {
    fetchStockData();
    fetchCryptoData();
  }, []);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (ticker) {
      const tickerText = getTickerText();
      // Duplicate the ticker text to make it longer
      ticker.innerHTML = `<div style="color: white">${tickerText} | ${tickerText}</div>`;

      const tickerWidth = ticker.scrollWidth;
      const containerWidth = ticker.parentElement.offsetWidth;

      let startPosition = 0;
      let currentPosition = startPosition;
      const speed = 1; // Adjust this value for smoother or faster scrolling

      const animateTicker = () => {
        currentPosition -= speed;
        if (currentPosition <= -tickerWidth / 2) {
          currentPosition = 0; // Reset position to the start of the container
        }
        ticker.style.transform = `translateX(${currentPosition}px)`;
        requestAnimationFrame(animateTicker);
      };

      animateTicker();
    }
  }, [stockData, cryptoData, view]);

  const fetchStockData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/fetch_stocks');
      if (Array.isArray(response.data)) {
        setStockData(response.data);
      } else {
        console.error('Fetched stock data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/crypto');
      if (Array.isArray(response.data)) {
        setCryptoData(response.data);
      } else {
        console.error('Fetched crypto data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    }
  };

  const fetchSearchedStock = async (symbol, duration) => {
    try {
      const capitalizedSymbol = symbol.toUpperCase(); // Capitalize the symbol
      const response = await axios.get(`http://localhost:5000/fetch_stock/${capitalizedSymbol}/${duration}`);
      setSearchedStock({
        symbol: capitalizedSymbol,
        open: response.data.open[response.data.open.length - 1],
        close: response.data.close[response.data.close.length - 1],
        high: response.data.high[response.data.high.length - 1],
        low: response.data.low[response.data.low.length - 1],
        volume: response.data.volume[response.data.volume.length - 1],
        graphData: response.data
      });
    } catch (error) {
      console.error('Error fetching searched stock data:', error);
    }
  };

  const formatNumber = (number) => {
    return (typeof number === 'number' && isFinite(number))
      ? number.toFixed(2)
      : 'N/A';
  };

  const getTickerText = () => {
    if (view === 'stock') {
      return stockData.map(item => `${item.symbol}: Open: ${formatNumber(item.open)}, Close: ${formatNumber(item.close)}`).join(' | ') ;
    } else if (view === 'crypto') {
      return cryptoData.map(item => `${item.symbol}: Price: ${formatNumber(item.price)}`).join(' | ');
    }
    return '';
  };

  const tickerText = getTickerText();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      fetchSearchedStock(searchQuery, duration);
    }
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
    if (searchedStock) {
      fetchSearchedStock(searchedStock.symbol, e.target.value);
    }
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  const getCandleData = () => {
    return searchedStock.graphData.dates.map((date, index) => ({
      x: new Date(date),
      y: [
        searchedStock.graphData.open[index],
        searchedStock.graphData.high[index],
        searchedStock.graphData.low[index],
        searchedStock.graphData.close[index],
      ],
    }));
  };

  return (
    <div className="dashboard-container">
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for a stock symbol"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="button-container">
        <button onClick={() => setView('stock')}>Stock Data</button>
        <button onClick={() => setView('crypto')}>Crypto Data</button>
      </div>

      <div className="ticker-container">
        <div className="ticker-content" ref={tickerRef}>
          <div className="ticker-text">{tickerText}</div>
        </div>
      </div>

      {searchedStock && (
        <>
          <div className="duration-selector">
            <label htmlFor="duration">Select Duration: </label>
            <select id="duration" value={duration} onChange={handleDurationChange}>
              <option value="5d">5 Days</option>
              <option value="3m">3 Months</option>
              <option value="6m">6 Months</option>
              <option value="1y">1 Year</option>
              <option value="5y">5 Years</option>
              <option value="max">All Time</option>
            </select>
          </div>

          <div className="chart-type-selector">
            <label htmlFor="chartType">Select Chart Type: </label>
            <select id="chartType" value={chartType} onChange={handleChartTypeChange}>
              <option value="line">Line Chart</option>
              <option value="candlestick">Candlestick Chart</option>
            </select>
          </div>

          <div className="searched-stock-container">
            <h2>Searched Stock: {searchedStock.symbol}</h2>
            <div className="stocks-grid">
            <p className="item-stock-open"> Open: {formatNumber(searchedStock.open)} </p>
            <p className="item-stock-high">High: {formatNumber(searchedStock.high)}</p>
            <p className="item-stock-low">Low: {formatNumber(searchedStock.low)}</p>
            <p className="item-stock-close">Close: {formatNumber(searchedStock.close)}</p>
            <p className="item-stock-vol">Volume: {searchedStock.volume?.toLocaleString()}</p>
            </div>
            {searchedStock.graphData && chartType === 'line' && (
  <Line
    data={{
      labels: searchedStock.graphData.dates,
      datasets: [
        {
          label: `${searchedStock.symbol} Price`,
          data: searchedStock.graphData.close,
          borderColor: 'rgba(37,64,153,1)',
          fill: false,
          pointRadius: duration === '5y' || duration === 'max' ? 0 : 3, // Remove point bubbles for 5 years and all time
          borderWidth: 2,
        },
      ],
    }}
    options={{
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
          },
        },
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        tooltip: {
          mode: 'index', // Ensures the tooltip appears when the mouse is directly over the point on the x-axis
          intersect: false, // Allows the tooltip to be triggered by the x-axis intersection, not just by the point itself
          callbacks: {
            label: (tooltipItem) => {
              const index = tooltipItem.dataIndex;
              const open = searchedStock.graphData.open[index];
              const close = searchedStock.graphData.close[index];
              const high = searchedStock.graphData.high[index];
              const low = searchedStock.graphData.low[index];
              const volume = searchedStock.graphData.volume[index];

              return [
                `Open: ${formatNumber(open)}`,
                `Close: ${formatNumber(close)}`,
                `High: ${formatNumber(high)}`,
                `Low: ${formatNumber(low)}`,
                `Volume: ${volume?.toLocaleString()}`,
              ];
            },
            title: (tooltipItems) => {
              // Show the date as the title if needed, otherwise return empty to omit it
              const date = tooltipItems[0].label;
              return date ? `${date}` : '';
            },
          },
        },
      },
    }}
  />
)}


            {searchedStock.graphData && chartType === 'candlestick' && (
              <Chart
                options={{
                  chart: {
                    type: 'candlestick',
                  },
                  xaxis: {
                    type: 'datetime',
                  },
                  yaxis: {
                    tooltip: {
                      enabled: true,
                    },
                  },
                }}
                series={[{
                  data: getCandleData(),
                }]}
                type="candlestick"
                width="100%"
                height="400"
              />
            )}
          </div>
        </>
      )}

      {view === 'stock' && (
        <div className="stock-data-container">
          <h2>Indices Stocks</h2>
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Open</th>
                <th>Close</th>
                <th>High</th>
                <th>Low</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {stockData.slice(0, 10).map((item, index) => (
                <tr key={index}>
                  <td>{item.symbol}</td>
                  <td>{formatNumber(item.open)}</td>
                  <td>{formatNumber(item.close)}</td>
                  <td>{formatNumber(item.high)}</td>
                  <td>{formatNumber(item.low)}</td>
                  <td>{item.volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'crypto' && (
        <div className="crypto-data-container">
          <h2>Crypto Data</h2>
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Price</th>
                <th>Change</th>
                <th>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((item, index) => (
                <tr key={index}>
                  <td>{item.symbol}</td>
                  <td>{formatNumber(item.price)}</td>
                  <td>{formatNumber(item.change)}</td>
                  <td>{item.marketCap?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;