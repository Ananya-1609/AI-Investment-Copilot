import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("NEWS_API_KEY")


def get_news(query):
    try:
        if not API_KEY:
            return ["News service is not configured"]

        url = "https://newsapi.org/v2/everything"

        params = {
            "q": query.strip(),
            "language": "en",
            "sortBy": "publishedAt",
            "apiKey": API_KEY,
            "pageSize": 3
        }

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        if data.get("status") != "ok":
            return ["Unable to fetch news right now"]

        articles = data.get("articles", [])

        if not articles:
            return ["No recent news found"]

        headlines = [article.get("title") for article in articles if article.get("title")]
        if not headlines:
            return ["No recent news found"]

        return headlines[:3]

    except Exception as e:
        return [f"Error fetching news: {str(e)}"]