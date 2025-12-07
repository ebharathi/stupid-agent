# tools.py
from ddgs import DDGS
from utils.logger import log_tool_call

@log_tool_call
def web_search(query: str, max_results: int = 10):
    """
    Simple DuckDuckGo search function.
    Returns a list of text result dictionaries.
    """
    with DDGS() as ddgs:
        return ddgs.text(query, max_results=max_results)
