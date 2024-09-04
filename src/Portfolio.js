import React, { useState, useEffect } from 'react';
import styles from './Portfolio.module.css';
import ApexCharts from 'react-apexcharts';

function PortfolioPage() {
  const [stocks, setStocks] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [currentValues, setCurrentValues] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalProfitOrLoss, setTotalProfitOrLoss] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalPercentageGainLoss, setTotalPercentageGainLoss] = useState(0);
  const [globalError, setGlobalError] = useState('');
  const [hasStocks, setHasStocks] = useState(false);
  const [colorMap, setColorMap] = useState({});

  const apiUrl = 'http://localhost:5000/stock_data';

  const handleAddStock = async () => {
    if (symbol && date && amount) {
      const amountValue = parseFloat(amount);
      if (amountValue < 0) {
        setGlobalError('Amount invested cannot be negative.');
        return;
      }

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: symbol, purchase_date: date }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          setGlobalError(data.error);
        } else {
          const newStocks = [...stocks, { symbol, date, amount: amountValue, error: '' }];
          setStocks(newStocks);
          setGlobalError('');
          setHasStocks(true);
          handleCalculate(newStocks);

          // Update colors only when a new stock is added
          updateColorMap(newStocks);
        }

        setSymbol('');
        setDate('');
        setAmount('');
      } catch (error) {
        setGlobalError(`Failed to fetch data for ${symbol}: ${error.message}`);
      }
    }
  };

  const handleRemoveStock = (index) => {
    const newStocks = stocks.filter((_, i) => i !== index);
    setStocks(newStocks);
    setHasStocks(newStocks.length > 0);
    handleCalculate(newStocks);
  };

  const handleCalculate = async (stockList = stocks) => {
    let newCurrentValues = [];
    let newTotalValue = 0;
    let newTotalProfitOrLoss = 0;
    let newTotalInvested = 0;
    setGlobalError('');

    for (let stock of stockList) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: stock.symbol, purchase_date: stock.date }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          newCurrentValues.push({
            symbol: stock.symbol,
            value: 0,
            bought: stock.amount.toFixed(2),
            boughtOn: stock.date,
            profitOrLoss: 0,
            percentageGainLoss: 0,
            error: data.error,
          });
          continue;
        }

        const purchaseClose = data.purchase_close;
        const currentClose = data.current_close;
        const currentValue = (stock.amount / purchaseClose) * currentClose;
        const profitOrLoss = currentValue - stock.amount;
        const percentageGainLoss = ((currentValue - stock.amount) / stock.amount) * 100;

        newCurrentValues.push({
          symbol: stock.symbol,
          value: currentValue.toFixed(2),
          bought: stock.amount.toFixed(2),
          boughtOn: stock.date,
          profitOrLoss: profitOrLoss.toFixed(2),
          percentageGainLoss: percentageGainLoss.toFixed(2),
          error: '',
        });
        newTotalValue += currentValue;
        newTotalProfitOrLoss += profitOrLoss;
        newTotalInvested += stock.amount;

      } catch (error) {
        newCurrentValues.push({
          symbol: stock.symbol,
          value: 0,
          bought: stock.amount.toFixed(2),
          boughtOn: stock.date,
          profitOrLoss: 0,
          percentageGainLoss: 0,
          error: `Failed to fetch data for ${stock.symbol}: ${error.message}`,
        });
      }
    }

    setCurrentValues(newCurrentValues);
    setTotalValue(newTotalValue.toFixed(2));
    setTotalProfitOrLoss(newTotalProfitOrLoss.toFixed(2));
    setTotalInvested(newTotalInvested.toFixed(2));

    const percentageGainLoss = ((newTotalValue - newTotalInvested) / newTotalInvested) * 100;
    setTotalPercentageGainLoss(percentageGainLoss.toFixed(2));
  };

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  };

  const updateColorMap = (stockList) => {
    setColorMap((prevMap) => {
      const newColorMap = { ...prevMap };
      stockList.forEach(({ symbol }) => {
        if (!newColorMap[symbol]) {
          newColorMap[symbol] = generateRandomColor();
        }
      });
      return newColorMap;
    });
  };

  const aggregateDataForPieChart = () => {
    const aggregatedData = currentValues.reduce((acc, { symbol, value }) => {
      if (acc[symbol]) {
        acc[symbol] += parseFloat(value);
      } else {
        acc[symbol] = parseFloat(value);
      }
      return acc;
    }, {});

    const labels = Object.keys(aggregatedData);
    const series = Object.values(aggregatedData);
    const colors = labels.map((label) => colorMap[label] || generateRandomColor());

    return { labels, series, colors };
  };

  const { labels: chartLabels = [], series: chartSeries = [], colors: chartColors = [] } = aggregateDataForPieChart();

  return (
    <div className={styles.portfolioPage}>
      <div>
        <input
          type="text"
          placeholder="Stock Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount Invested"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value >= 0 ? e.target.value : '')}
        />
        <br />
        <button onClick={handleAddStock}>Add Stock</button>
      </div>
      {globalError && <p style={{ color: 'red' }}>{globalError}</p>}
      {hasStocks && (
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>Bought For</th>
                <th>Bought On</th>
                <th>Current Value</th>
                <th>Profit/Loss</th>
                <th>% Gain/Loss</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentValues.map((stock, index) => (
                <tr key={index}>
                  <td>{stock.symbol}</td>
                  <td>${stock.bought}</td>
                  <td>{stock.boughtOn}</td>
                  <td>${stock.value}</td>
                  <td style={{ color: stock.profitOrLoss >= 0 ? 'green' : 'red' }}>
                    {stock.profitOrLoss >= 0 ? `Profit: $${stock.profitOrLoss}` : `Loss: $${Math.abs(stock.profitOrLoss)}`}
                  </td>
                  <td style={{ color: stock.percentageGainLoss >= 0 ? 'green' : 'red' }}>
                    {stock.percentageGainLoss >= 0 ? `Gain: ${stock.percentageGainLoss}%` : `Loss: ${Math.abs(stock.percentageGainLoss)}%`}
                  </td>
                  <td>
                    <button onClick={() => handleRemoveStock(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {hasStocks && (
        <div className={styles.portfolioContent}>
          <div className={styles.statistics}>
            <h2>Total Invested: ${totalInvested}</h2>
            <h2>Total Value: ${totalValue}</h2>
            <h2>Total Profit/Loss: {totalProfitOrLoss >= 0 ? `$${totalProfitOrLoss}` : `-${Math.abs(totalProfitOrLoss)}`}</h2>
            <h2>Total Percentage Gain/Loss: {totalPercentageGainLoss >= 0 ? `Gain: ${totalPercentageGainLoss}%` : `Loss: ${Math.abs(totalPercentageGainLoss)}%`}</h2>
          </div>
          
          <div className={styles.pieChart}>
            {chartSeries.length > 0 && (
              <ApexCharts
                type="pie"
                series={chartSeries}
                options={{
                  labels: chartLabels,
                  colors: chartColors,
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '40%',
                      },
                    },
                  },
                  legend: {
                    position: 'bottom',
                  },
                  responsive: [
                    {
                      breakpoint: 600,
                      options: {
                        chart: {
                          width: 200,
                        },
                        legend: {
                          position: 'bottom',
                        },
                      },
                    },
                  ],
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioPage;
