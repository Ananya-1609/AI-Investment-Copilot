from agents.data_agent import data_agent
from agents.news_agent import news_agent
from agents.analysis_agent import analysis_agent
from agents.decision_agent import decision_agent
from agents.explain_agent import explain_agent


def run_agents(query, mode="balanced"):
    print("RUNNING FULL AGENTS")

    data = data_agent(query)
    news = news_agent(query)
    analysis = analysis_agent(data, news)
    decision = decision_agent(analysis, mode)
    explain_output = explain_agent(data, analysis, decision, news)

    return {
        "decision": decision.get("decision", "INVALID"),
        "confidence": decision.get("confidence", 0),
        "risk_category": analysis.get("risk_category", "Unknown"),
        "data": data,
        "news": news,
        "analysis": analysis,
        "decision_details": decision,
        "explanation": explain_output.get("explanation", "No explanation available."),
        "why_not": explain_output.get("why_not", {}),
        "suggestions": explain_output.get("suggestions", []),
        "mode": mode
    }
