from services.news_service import get_news


def news_agent(query):
    return get_news(query)
