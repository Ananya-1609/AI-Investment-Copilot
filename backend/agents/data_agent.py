from services.stock_service import get_stock_data


def map_symbol(query):
    q = query.upper().strip()

    mapping = {
        "TCS": "TCS.NS",
        "INFY": "INFY.NS",
        "HDFC": "HDFCBANK.NS",
        "HDFCBANK": "HDFCBANK.NS",
        "ICICI": "ICICIBANK.NS",
        "ICICIBANK": "ICICIBANK.NS",
        "RELIANCE": "RELIANCE.NS"
    }

    # Smart matching for partial symbols.
    if "ICIC" in q:
        return "ICICIBANK.NS"
    if "HDFC" in q:
        return "HDFCBANK.NS"
    if q.startswith("INF"):
        return "INFY.NS"
    if q.startswith("RELI"):
        return "RELIANCE.NS"

    return mapping.get(q, q + ".NS")


def data_agent(query):
    cleaned_query = query.strip()
    if not cleaned_query:
        return {"error": "Please provide a stock symbol"}

    symbol = map_symbol(cleaned_query.split()[-1])
    print(f"DEBUG: Mapped Symbol: {cleaned_query.split()[-1].upper()} → {symbol}")
    
    return get_stock_data(symbol)
