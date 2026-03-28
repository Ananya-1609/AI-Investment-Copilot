def decision_agent(analysis, investor_mode="balanced"):

    # 🚨 HANDLE INVALID CASE
    if analysis.get("risk_score") == 100:
        return {
            "decision": "INVALID",
            "confidence": 0,
            "confidence_range": {
                "min": 0,
                "max": 0
            }
        }

    risk = analysis.get("risk_score", 0)

    if investor_mode == "conservative":
        risk += 20
    elif investor_mode == "aggressive":
        risk -= 20

    risk = max(0, min(100, risk))

    if risk < 30:
        decision = "BUY"
    elif risk < 60:
        decision = "HOLD"
    else:
        decision = "SELL"

    confidence = round(min(95, 100 - risk))
    volatility = analysis.get("volatility", 0)
    spread = 10 if volatility > 60 else 5

    confidence_range = {
        "min": round(max(0, confidence - spread)),
        "max": round(min(100, confidence + spread))
    }

    return {
        "decision": decision,
        "confidence": confidence,
        "confidence_range": confidence_range
    }
