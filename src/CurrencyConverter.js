import React, { useState, useEffect } from 'react';
import currencyList from './Currencies.js';
import './CurrencyConverter.css';

function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(response => response.json())
      .then(data => {
        const fetchedCurrencies = Object.keys(data.rates);
        const updatedCurrencyOptions = currencyList.filter(currency =>
          fetchedCurrencies.includes(currency.code)
        );
        setCurrencyOptions(updatedCurrencyOptions);
        setExchangeRate(data.rates[toCurrency]);
      });
  }, [toCurrency]);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(response => response.json())
        .then(data => {
          setExchangeRate(data.rates[toCurrency]);
        });
    }
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (event) => {
    const value = parseFloat(event.target.value);
    if (value >= 0) {
      setAmount(value);
    } else {
      setAmount('');
    }
  };

  const handleFromCurrencyChange = (event) => {
    setFromCurrency(event.target.value);
  };

  const handleToCurrencyChange = (event) => {
    setToCurrency(event.target.value);
  };

  return (
    <div className="currency-converter">
      <h1>Currency Converter</h1>
      <div>
        <input 
          type="number"
          value={amount}
          onChange={handleAmountChange}
          min="0"
          placeholder='Amount'
        />

        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          {currencyOptions.map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))}
        </select>

        <span>to</span>

        <select value={toCurrency} onChange={handleToCurrencyChange}>
          {currencyOptions.map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))}
        </select>
      </div>

      {amount !== '' && (
        <h2>
          {amount} {fromCurrency} = {(amount * exchangeRate)} {toCurrency}
        </h2>
      )}
    </div>
  );
}

export default CurrencyConverter;
