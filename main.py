from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import pandas as pd
import numpy as np
import yfinance as yf
from datetime import datetime
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from keras.layers import Dense, Dropout, LSTM
from keras.models import Sequential
import matplotlib.pyplot as plt
import warnings
import os
import requests
from requests_html import HTMLSession
from statsmodels.tsa.arima.model import ARIMA
from flask import send_from_directory

app = Flask(__name__)
CORS(app)
warnings.filterwarnings("ignore")
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

def get_data(stock_symbol):
    end = datetime.now()
    start = datetime(end.year - 2, end.month, end.day)
    data = yf.download(stock_symbol, start=start, end=end)
    return pd.DataFrame(data)

def LSTM_analysis(df):
    data_train = df.iloc[0:int(len(df) * 0.8), :]
    data_test = df.iloc[int(len(df) * 0.8):, :]

    scaler = MinMaxScaler(feature_range=(0, 1))
    data_train_scale = scaler.fit_transform(df[['Close']])
    x_train, y_train = [], []
    for i in range(7, len(data_train_scale)):
        x_train.append(data_train_scale[i - 7:i, 0])
        y_train.append(data_train_scale[i, 0])
    x_train, y_train = np.array(x_train), np.array(y_train)

    x_forecast = np.append(np.array(x_train[-1, 1:]), y_train[-1])
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
    x_forecast = np.reshape(x_forecast, (1, x_forecast.shape[0], 1))

    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))
    model.add(Dropout(0.1))
    model.add(LSTM(units=50, return_sequences=True))
    model.add(Dropout(0.1))
    model.add(LSTM(units=50, return_sequences=True))
    model.add(Dropout(0.1))
    model.add(LSTM(units=50))
    model.add(Dropout(0.1))
    model.add(Dense(units=1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(x_train, y_train, epochs=30, batch_size=32)

    real_price = data_test[['Close']].values
    dataset = pd.concat((data_train['Close'], data_test['Close']), axis=0)
    testing_set = dataset[len(dataset) - len(data_test) - 7:].values.reshape(-1, 1)
    testing_set = scaler.transform(testing_set)
    x_test = [testing_set[i - 7:i, 0] for i in range(7, len(testing_set))]
    x_test = np.reshape(np.array(x_test), (len(x_test), 7, 1))

    predicted_price = model.predict(x_test)
    predicted_price = scaler.inverse_transform(predicted_price)

    fig = plt.figure(figsize=(7, 5))
    plt.plot(real_price, label="Real price")
    plt.plot(predicted_price, label='Predicted price')
    plt.legend()
    plt.savefig('LSTM.png')
    plt.close(fig)

    lstm_error = math.sqrt(mean_squared_error(real_price, predicted_price))
    forecast_price = scaler.inverse_transform(model.predict(x_forecast))
    lstm_forecast = forecast_price[0, 0]

    return float(lstm_error), float(lstm_forecast)

def linear_regression_analysis(df):
    forecast = 7
    df['Close after 7 days'] = df['Close'].shift(-forecast)
    new_df = df[['Close', 'Close after 7 days']]
    y = new_df.iloc[:-forecast, -1].values.reshape(-1, 1)
    x = new_df.iloc[:-forecast, :-1]
    forcast_x = new_df.iloc[-forecast:, :-1]

    x_train, x_test = x[:int(len(df) * 0.8)], x[int(len(df) * 0.8):]
    y_train, y_test = y[:int(len(df) * 0.8)], y[int(len(df) * 0.8):]

    scalar = StandardScaler()
    x_train, x_test, forcast_x = scalar.fit_transform(x_train), scalar.transform(x_test), scalar.transform(forcast_x)
    model = LinearRegression(n_jobs=-1)
    model.fit(x_train, y_train)

    y_pred = model.predict(x_test) * 1.04
    fig = plt.figure(figsize=(7, 5))
    plt.plot(y_test, label="Real price")
    plt.plot(y_pred, label='Predicted price')
    plt.legend()
    plt.savefig('Linear.png')
    plt.close(fig)

    linear_error = math.sqrt(mean_squared_error(y_test, y_pred))
    forecast_results = model.predict(forcast_x) * 1.04
    mean = forecast_results.mean()
    linear_pred = forecast_results[0, 0]

    return float(linear_pred), float(mean), float(linear_error), forecast_results.flatten().tolist()

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
    # Plotting the results
    fig = plt.figure(figsize=(7, 5))
    plt.plot(test, label="Real price")
    plt.plot(predictions, label='Predicted price (ARIMA)')
    plt.legend()
    plt.savefig('ARIMA.png')  # Save the plot as an image file
    plt.close(fig)

    
    # Calculate the error
    error_arima = math.sqrt(mean_squared_error(test, predictions))
    
    return float(error_arima), float(arima_fore)


def recommendation(today_price,mean):
    if today_price.iloc[-1]['Close'] < mean:
        price = 'RISE' 
        decision="BUY"
        
    else:
        price = 'FALL' 
        decision="SELL"
        
    
    return price, decision
def plot_price_vs_moving_averages(df):
    # Calculate 100-day and 200-day moving averages
    df['MA100'] = df['Close'].rolling(window=100).mean()
    df['MA200'] = df['Close'].rolling(window=200).mean()

    # Plot the price and moving averages
    fig = plt.figure(figsize=(10, 7))
    plt.plot(df['Close'], label="Close Price")
    plt.plot(df['MA100'], label="100-Day MA")
    plt.plot(df['MA200'], label="200-Day MA")
    plt.title('Price vs 100 & 200 Day Moving Averages')
    plt.legend()
    plt.savefig('Moving.png')  # Save the plot as an image file
    plt.close(fig)



@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    stock_symbol = data.get('stock')
    df = get_data(stock_symbol)

    lstm_error, lstm_forecast = LSTM_analysis(df)
    linear_pred, mean, linear_error, forecast_results = linear_regression_analysis(df)
    arima_error, arima_pred = ARIMA_analysis(df)



    today_price = df.iloc[-1:]
    price, decision = recommendation(today_price, mean)
    plot_price_vs_moving_averages(df)

    image_urls = {
        'lstm': '/static/LSTM.png',
        'linear': '/static/Linear.png',
        'arima': '/static/ARIMA.png',
        'ma': '/static/Moving.png'
    }

    result = {
    'open': round(float(df['Open'].iloc[-1]), 2),
    'high': round(float(df['High'].iloc[-1]), 2),
    'low': round(float(df['Low'].iloc[-1]), 2),
    'close': round(float(df['Close'].iloc[-1]), 2),
    'adj_close': round(float(df['Adj Close'].iloc[-1]), 2),
    'vol': round(float(df['Volume'].iloc[-1]), 2),
    'lstm_forecast': round(lstm_forecast, 2),
    'lstm_error': round(lstm_error, 2),
    'linear_pred': round(linear_pred, 2),
    'linear_error': round(linear_error, 2),
    'price': price,
    'decision': decision,  
    'forecast_results': [round(f, 2) for f in forecast_results],  
    'arima_error': round(arima_error, 2),
    'arima_pred': round(arima_pred, 2),
    'image_urls': image_urls
    }
    return jsonify(result)

@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory('.', filename)



def find_nearest_date(dates, target_date):
    if target_date in dates:
        return target_date
    else:
        return None
    
@app.route('/stock_data', methods=['POST'])
def stock_data():
    data = request.json
    stock_symbol = data['stock']
    purchase_date = datetime.strptime(data['purchase_date'], '%Y-%m-%d').date()

    # Fetch stock data
    stock = yf.Ticker(stock_symbol)
    stock_data = stock.history(period="max")

    # Ensure the DataFrame index is in datetime format
    stock_data.index = pd.to_datetime(stock_data.index).date

    # Find the nearest date
    closest_date = find_nearest_date(stock_data.index, purchase_date)
    if closest_date is None:
        return jsonify({'error': 'Stock market was closed on this date. Please use another date.'})

    try:
        purchase_close = stock_data.loc[closest_date, 'Close']
        current_close = stock_data['Close'].iloc[-1]
        
        return jsonify({
            'purchase_close': purchase_close,
            'current_close': current_close
        })
    except Exception as e:
        return jsonify({'error': str(e)})
    

@app.route('/fetch_stocks', methods=['GET'])
def fetch_stocks():
    try:
        stock_symbols = ['AAPL', 'GOOG', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA', 'NFLX', 'ADBE', 'PYPL']
        stocks_data = []
        
        for symbol in stock_symbols:
            stock = yf.Ticker(symbol)
            stock_info = stock.history(period="1d")
            
            # Convert NumPy types to native Python types
            stock_data = {
                'symbol': symbol,
                'open': float(stock_info['Open'].values[0]),
                'close': float(stock_info['Close'].values[0]),
                'high': float(stock_info['High'].values[0]),
                'low': float(stock_info['Low'].values[0]),
                'volume': int(stock_info['Volume'].values[0]),
                
            }
            
            stocks_data.append(stock_data)
        
        return jsonify(stocks_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



def fetch_crypto_data():
    session = HTMLSession()
    num_currencies = 10  # Fetch data for 10 cryptocurrencies
    resp = session.get(f"https://finance.yahoo.com/crypto?offset=0&count={num_currencies}")
    tables = pd.read_html(resp.html.raw_html)
    df = tables[0].copy()

    crypto_data = []
    for index, row in df.iterrows():
        crypto_data.append({
            'symbol': row['Symbol'],
            'price': row['Price (Intraday)'],
            'change': row['Change'],
            'marketCap': row['Market Cap']
        })

    return crypto_data

@app.route('/api/crypto', methods=['GET'])
def get_crypto_data():
    try:
        data = fetch_crypto_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/fetch_stock/<symbol>/<duration>', methods=['GET'])
def fetch_stock(symbol, duration):
    stock = yf.Ticker(symbol)
    
    # Define the period based on the duration
    period_mapping = {
        '5d': '5d',
        '3m': '3mo',
        '6m': '6mo',
        '1y': '1y',
        '5y': '5y',
        'max': 'max'
    }
    
    period = period_mapping.get(duration, None)
    if period is None:
        return jsonify({'error': 'Invalid duration'}), 400

    try:
        # Fetch the historical data
        data = stock.history(period=period)

        if data.empty:
            return jsonify({'error': 'No data found for this symbol'}), 404

        response = {
            'symbol': symbol,
            'dates': data.index.strftime('%Y-%m-%d').tolist(),
            'open': data['Open'].tolist(),
            'close': data['Close'].tolist(),
            'high': data['High'].tolist(),
            'low': data['Low'].tolist(),
            'volume': data['Volume'].tolist(),
        }
        
        return jsonify(response)

    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({'error': 'Error fetching stock data'}), 500

if __name__ == '__main__':
    app.run(debug=True)






# input = 'GOOG'
# df = get_data(input)

# print("Today's",input,"Stock Data: ")
# today_price = df.iloc[-1:]
# print(today_price)
# lstm_error, lstm_forecast=LSTM_analysis(df)
# df, linear_pred,mean,linear_error, forecast_results=linear_regression_analysis(df)
# error_arima, arima_forecast = ARIMA_analysis(df)
# print("Forecasted Prices for Next 7 days:")
# print(forecast_results)
# print(linear_pred)
# print(lstm_forecast)
# price, decision = recommendation(today_price,mean)
# print(price)
# print(decision)
# print(mean)
# print(arima_forecast)
# print(error_arima)