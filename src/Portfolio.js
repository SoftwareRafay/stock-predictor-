import React, { useState } from 'react';
import styles from './Portfolio.module.css';

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
          setHasStocks(true); // Update state to show table
          handleCalculate(newStocks); // Calculate portfolio value immediately after adding a stock
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
    setHasStocks(newStocks.length > 0); // Update state to hide table if no stocks remain
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
        <br/>
        <button onClick={handleAddStock}>Add Stock</button>
      </div>
      {globalError && <p style={{ color: 'red' }}>{globalError}</p>}
      {hasStocks && (
        <div>
          <table>
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>Bought For</th>
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
          <h2>Total Invested: ${totalInvested}</h2>
          <h2>Total Value: ${totalValue}</h2>
          <h2>Total Profit/Loss: ${totalProfitOrLoss >= 0 ? totalProfitOrLoss : `-${Math.abs(totalProfitOrLoss)}`}</h2>
          <h2>Total Percentage Gain/Loss: {totalPercentageGainLoss >= 0 ? `Gain: ${totalPercentageGainLoss}%` : `Loss: ${Math.abs(totalPercentageGainLoss)}%`}</h2>
        </div>
      )}
    </div>
  );
}

export default PortfolioPage;
