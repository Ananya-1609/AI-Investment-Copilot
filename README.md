# 🚀 AI Investment Copilot

AI-powered multi-agent system for smart investment decisions for Indian retail investors.

---

## 🧠 Overview

Retail investors in India often rely on guesswork, tips, and incomplete information.
Our solution transforms financial data into **clear, explainable, and actionable decisions**.

AI Investment Copilot uses a **multi-agent architecture** to analyze stock data, news, and risk — and provides **BUY / HOLD / SELL recommendations with full reasoning**.

---

## ✨ Key Features

- 🤖 Multi-Agent System (Data, News, Analysis, Decision, Explainability)
- 📊 Stock Analysis using real-time market data
- 📰 News Sentiment Integration
- 📉 Risk Score + Risk Category
- 📍 Market Sentiment (Bullish / Bearish / Neutral)
- 🎯 BUY / HOLD / SELL Recommendations
- 📈 Confidence Score + Uncertainty Range
- 💡 Explainable AI (Why + Why Not reasoning)
- ⚠️ Warning System (risk & volatility alerts)
- 🧠 Smart Input Handling (auto-correct + invalid detection)
- 👤 Investor Mode (Conservative / Balanced / Aggressive)

---

## 🏗️ System Architecture

```text
User Input
  ↓
Data Agent → Stock API (yfinance)
News Agent → News API
  ↓
Analysis Agent (Risk + Sentiment + Warnings)
  ↓
Decision Agent (BUY / HOLD / SELL)
  ↓
Explainability Agent (Reasoning + Why Not)
  ↓
Frontend Dashboard (React)
```

---

## 🛠️ Tech Stack

### Frontend
- React.js

### Backend
- FastAPI
- Python

### APIs
- Yahoo Finance (Stock Data)
- NewsAPI (Financial News)

---

## ⚙️ Setup Instructions

### 🔹 Clone Repository

```bash
git clone https://github.com/Ananya-1609/AI-Investment-Copilot.git
cd AI-Investment-Copilot
```

### 🔹 Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:

`http://127.0.0.1:8000`

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

`http://localhost:3000`

---

## 🎯 How It Works

1. User enters a stock (e.g., TCS, INFY)
2. Data Agent fetches stock data
3. News Agent fetches latest news
4. Analysis Agent calculates risk and sentiment
5. Decision Agent gives BUY / HOLD / SELL
6. Explainability Agent explains the reasoning

---

## 🧪 Example Use Cases

- Analyze a stock before investing
- Understand risk and market sentiment
- Avoid invalid or risky investments
- Get explainable financial insights

---

## ⚠️ Error Handling

- Invalid stock inputs are safely handled
- No-data scenarios return fallback responses
- Confidence and uncertainty are always shown
- No misleading recommendations are generated

---

## 📊 Impact

- Helps retail investors make informed decisions
- Reduces reliance on guesswork and tips
- Improves confidence with explainable AI
- Potential to scale to millions of users in India
