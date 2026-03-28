def explain_agent(data, analysis, decision, news):

    if "error" in data:
        return {
            "explanation": "Invalid stock symbol. Try: TCS, INFY, HDFCBANK, ICICIBANK",
            "why_not": {
                "BUY": ["Stock data is unavailable or invalid."],
                "HOLD": ["A hold call is unreliable without valid market data."],
                "SELL": ["A sell call is unreliable without valid market data."]
            },
            "suggestions": ["INFY", "HDFCBANK", "ICICIBANK"]
        }

    trend = data.get("trend", "unknown")
    volatility = data.get("volatility", 0)
    risk_score = analysis.get("risk_score", 0)
    decision_value = (decision.get("decision") or "INVALID").upper()
    confidence = decision.get("confidence", 0)

    negative_words = ["fall", "loss", "drop"]
    negative_news_count = 0
    for item in news or []:
        text = str(item).lower()
        if any(word in text for word in negative_words):
            negative_news_count += 1

    def collect_reasons(target_decision):
        reasons = []
        if target_decision == "SELL":
            if trend == "downward":
                reasons.append("Downward trend")
            if volatility > 50:
                reasons.append("High volatility")
            if risk_score >= 67:
                reasons.append("Risk is high")
            if negative_news_count > 0:
                reasons.append("Negative market sentiment in recent news")
            if not reasons:
                reasons.append("Multiple caution signals suggest downside pressure")
        elif target_decision == "BUY":
            if trend == "upward":
                reasons.append("Upward trend")
            if volatility <= 50:
                reasons.append("Volatility is manageable")
            if risk_score < 34:
                reasons.append("Risk is low")
            if negative_news_count == 0:
                reasons.append("No major negative news detected")
            if not reasons:
                reasons.append("Conditions are not strong enough for a confident buy")
        elif target_decision == "HOLD":
            if 34 <= risk_score < 67:
                reasons.append("Moderate risk profile")
            if trend not in ["upward", "downward"]:
                reasons.append("Trend direction is uncertain")
            if 0 < negative_news_count < 2:
                reasons.append("Mixed news signals")
            if not reasons:
                reasons.append("Signals are mixed, suggesting patience")
        else:
            reasons.append("Insufficient or invalid data for a reliable action")
        return reasons[:3]

    all_decision_reasons = {
        "BUY": collect_reasons("BUY"),
        "HOLD": collect_reasons("HOLD"),
        "SELL": collect_reasons("SELL")
    }

    confidence_reasons = []
    if volatility > 50:
        confidence_reasons.append("High volatility lowers confidence")
    if negative_news_count > 0:
        confidence_reasons.append("Negative news reduces certainty")
    if not confidence_reasons:
        confidence_reasons.append("Price action and sentiment are relatively stable")

    selected_reasons = all_decision_reasons.get(decision_value, ["Insufficient or invalid data for a reliable action"])
    selected_block = "\n".join(f"- {reason}" for reason in selected_reasons)
    confidence_block = "\n".join(f"- {reason}" for reason in confidence_reasons)
    alternative_decisions = [
        option for option in ["BUY", "HOLD", "SELL"] if option != decision_value
    ]
    why_not = {option: all_decision_reasons[option] for option in alternative_decisions}

    suggestions = ["INFY", "HDFC", "ICICI"] if decision_value in ["SELL", "INVALID"] else []
    suggestion_block = "\n".join(f"- {symbol}" for symbol in suggestions)

    if volatility <= 60 and negative_news_count == 0:
        stable_signal = "Stable market signals"
    elif volatility > 60:
        stable_signal = "High market volatility"
    else:
        stable_signal = "Mixed market signals"

    explanation_lines = [
        "🧠 AI Decision Summary",
        "",
        f"Decision: {decision_value}",
        "",
        "Reason:",
        *[f"- {reason}" for reason in selected_reasons],
        f"- {stable_signal}",
        "",
        f"Confidence: {confidence}%"
    ]

    for alt in alternative_decisions:
        explanation_lines.extend([
            "",
            f"Why not {alt}?",
            "\n".join(f"- {reason}" for reason in all_decision_reasons[alt])
        ])

    if suggestions:
        explanation_lines.extend([
            "",
            "Suggested Alternatives:",
            suggestion_block
        ])

    return {
        "explanation": "\n".join(explanation_lines),
        "why_not": why_not,
        "suggestions": suggestions
    }
