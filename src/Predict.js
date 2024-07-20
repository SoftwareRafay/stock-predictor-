import React from "react";

function HomePage({ stock, handleChange, handleSubmit, result }) {
	return (
		<div>
			<h1>Stock Market Predictor</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={stock}
					onChange={handleChange}
					placeholder="Enter a stock symbol"
					required
				/>
				<button type="submit">Predict</button>
			</form>
			{result && (
				<div>
					<h2>Results</h2>
					<p>
						Todays stock price: Open {result.open} High {result.high} low{" "}
						{result.low} Close {result.close} Adj Close {result.adj_close}{" "}
						Volume {result.vol}{" "}
					</p>
					<p>LSTM Forecast: {result.lstm_forecast}</p>
					<p>LSTM error: {result.lstm_error}</p>
					<p>Liner Regression Forecast: {result.linear_pred}</p>
					<p>Liner Regression error: {result.linear_error}</p>
					<p>ARIMA Forecast: {result.arima_pred}</p>
					<p>ARIMA error: {result.error_arima}</p>
					<p>
						According to the Machine learning Predictions, a {result.price} in{" "}
						{stock} stock is expected you should {result.decision}
					</p>
					<p>Next 7 days prediction:</p>
					<ul>
						{result.forecast_results.map((val, index) => (
							<li key={index}>{val}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default HomePage;
