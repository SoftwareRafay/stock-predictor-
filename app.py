from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_squared_error
import warnings
import os
from datetime import datetime
import yfinance as yf

app = Flask(__name__)
CORS(app)
warnings.filterwarnings("ignore")

def get_data(stock_symbol):
    end = datetime.now()
    start = datetime(end.year - 2, end.month, end.day)
    data = yf.download(stock_symbol, start=start, end=end)
    return pd.DataFrame(data)

def arima_forecast(history):
    # Fit the ARIMA model on the history
    model = ARIMA(history, order=(5, 1, 0))
    model_fit = model.fit()
    
    # Make a prediction
    output = model_fit.forecast()
    yhat = output[0]
    return yhat

def ARIMA_analysis(df):
    data = df['Close'].values
    train_size = int(len(data) * 0.8)
    train, test = data[:train_size], data[train_size:]

    history = list(train)
    predictions = []
    
    for t in range(len(test)):
        yhat = arima_forecast(history)
        predictions.append(yhat)
        history.append(test[t])  # Add the observed value to history for the next step

    model = ARIMA(history, order=(5,1,0))  
    model_fit = model.fit()
    arima_fore = model_fit.forecast(steps=7)
    arima_fore = arima_fore[0]
    

    
    # Calculate the error
    error_arima = math.sqrt(mean_squared_error(test, predictions))
    
    return float(error_arima), float(arima_fore)

@app.route('/arima_predict', methods=['POST'])
def arima_predict():
    data = request.get_json()
    stock_symbol = data.get('stock')
    df = get_data(stock_symbol)
    arima_error, arima_fore = ARIMA_analysis(df)

    result = {
        'arima_error': arima_error,
        'arima_pred': arima_fore
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
