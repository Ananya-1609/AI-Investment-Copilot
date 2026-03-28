import yfinance as yf


def get_stock_data(symbol):
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1mo")

        if hist.empty:
            return {
                "error": "No data found for this stock"
            }

        return {
            "current_price": float(hist["Close"].iloc[-1]),
            "trend": "upward" if hist["Close"].iloc[-1] > hist["Close"].iloc[0] else "downward",
            "volatility": float(hist["Close"].std())
        }

    except Exception as e:
        return {
            "error": str(e)
        }
