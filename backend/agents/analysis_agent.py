def analysis_agent(data, news):

    # 🚨 HANDLE ERROR FIRST
    if "error" in data:
        return {
            "risk_score": 100,
            "risk_category": "High",
            "warnings": ["⚠️ High risk detected"],
            "market_sentiment": "Bearish",
            "volatility": data.get("volatility", 0),
            "summary": "Invalid stock symbol"
        }

    volatility = data.get("volatility", 0)
    trend = data.get("trend", "unknown")
    risk = 0
    risk += 25 if trend == "downward" else 0
    risk += min(40, volatility * 0.5)

    negative_words = ["fall", "loss", "drop"]
    negative_news_hits = 0

    for n in news:
        if any(word in n.lower() for word in negative_words):
            negative_news_hits += 1

    # Cap news-driven penalty to avoid overreacting to repetitive headlines.
    risk += min(negative_news_hits * 10, 20)

    risk_score = round(min(risk, 100))

    if risk_score <= 30:
        risk_category = "Low"
    elif risk_score <= 60:
        risk_category = "Medium"
    else:
        risk_category = "High"

    warnings = []
    if volatility > 60 and risk_score > 70:
        warnings.append("⚠️ High risk and volatility detected")
    else:
        if volatility > 60:
            warnings.append("⚠️ High volatility detected")
        if risk_score > 70:
            warnings.append("⚠️ High risk detected")
    if risk_score < 20:
        warnings.append("Low risk — relatively safe")

    sentiment_score = 0
    if trend == "upward":
        sentiment_score += 1
    else:
        sentiment_score -= 1

    if risk_score < 30:
        sentiment_score += 1
    elif risk_score > 70:
        sentiment_score -= 1

    if sentiment_score >= 1:
        market_sentiment = "Bullish"
    elif sentiment_score <= -1:
        market_sentiment = "Bearish"
    else:
        market_sentiment = "Neutral"

    summary = f"Stock shows {trend} trend with {risk_category.lower()} risk."

    return {
        "risk_score": risk_score,
        "risk_category": risk_category,
        "warnings": warnings,
        "market_sentiment": market_sentiment,
        "volatility": volatility,
        "summary": summary
    }
