import React, { useState } from 'react';
import axios from 'axios';
import './Predict.css';

function Predict() {
    const [stock, setStock] = useState('');
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setStock(e.target.value.toUpperCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/predict', { stock });
            setResult(response.data);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
            setResult({ error: "There was an error fetching the data. Please try again." });
        }
    };

    return (
        <div className="predict">
            <header className="predict-header">
                <h1>Stock Market Predictor</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={stock} 
                        onChange={handleChange} 
                        placeholder="Enter stock symbol" 
                        required 
                    />
                    <button type="submit">Predict</button>
                </form>
                {result && (
                    <div className="results-container">
                        <div className="stock-data">
                            <h2>Today's Stock Data</h2>
                            <div className="stock-data-grid">
                                <div className="stock-data-item open">Open: {result.open}</div>
                                <div className="stock-data-item high">High: {result.high}</div>
                                <div className="stock-data-item low">Low: {result.low}</div>
                                <div className="stock-data-item close">Close: {result.close}</div>
                                <div className="stock-data-item adj-close">Adj Close: {result.adj_close}</div>
                                <div className="stock-data-item volume">Volume: {result.vol}</div>
                            </div>
                        </div>
                        
                        <div className="charts-container">
                            <h2>Model Accuracy & Predictions</h2>
                            <div className="chart">
                                <h3>ARIMA Model Accuracy</h3>
                                <img src="http://localhost:5000/images/ARIMA.png" alt="ARIMA Analysis" />
                            </div>
                            <div className="chart">
                                <h3>LSTM Model Accuracy</h3>
                                <img src="http://localhost:5000/images/LSTM.png" alt="LSTM Analysis" />
                            </div>
                            <div className="chart">
                                <h3>Linear Regression Model Accuracy</h3>
                                <img src="http://localhost:5000/images/Linear.png" alt="Linear Regression Analysis" />
                            </div>
                            <div className="chart">
                                <h3>Price vs Moving Averages</h3>
                                <img src="http://localhost:5000/images/moving.png" alt="Moving Averages" />
                            </div>
                        </div>

                        <div className="predictions-container">
                            <h2>Tomorrow's Predictions & Errors</h2>
                            <div className="predictions-grid">
                                <div className="lstm-pred">LSTM Prediction: {result.lstm_forecast}</div>
                                <div className="lstm-error">LSTM Error: {result.lstm_error}</div>
                                <div className="linear-pred">Linear Regression Prediction: {result.linear_pred}</div>
                                <div className="linear-error">Linear Regression Error: {result.linear_error}</div>
                                <div className="arima-pred">ARIMA Prediction: {result.arima_pred}</div>
                                <div className="arima-error">ARIMA Error: {result.arima_error}</div>
                            </div>
                        </div>

                        <div className="forecast-container">
                            <h2>Next 7 Days Prediction</h2>
                            <ul>
                                {result.forecast_results.map((val, index) => (
                                    <li key={index}>{val}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="decision-container">
                            <h2>Recommendation</h2>
                            <p>According to the Machine Learning predictions, a {result.price} in {stock} stock is expected. You should {result.decision}.</p>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}

export default Predict;
