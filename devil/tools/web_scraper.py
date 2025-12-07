import random
import requests
import warnings
from typing import Dict, Any
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup
from utils.logger import log_tool_call

warnings.filterwarnings("ignore")

# Define a list of rotating user agents
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.7; rv:137.0) Gecko/20100101 Firefox/137.0",
    "Mozilla/5.0 (X11; Linux i686; rv:137.0) Gecko/20100101 Firefox/137.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.3179.54",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.3179.54"
]


def get_session():
    """
    Creates a requests Session with automatic retries and robust error handling.
    """
    session = requests.Session()
    retry = Retry(
        total=3,
        read=3,
        connect=3,
        backoff_factor=0.3,
        status_forcelist=[500, 502, 503, 504]
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


def scrape_url(url: str, timeout: int = 30) -> Dict[str, Any]:
    """
    Scrapes a single URL and returns structured data.
    
    Args:
        url: URL to scrape
        timeout: Request timeout in seconds
        
    Returns:
        Dictionary with url, title, text, status_code, and error (if any)
    """
    headers = {
        "User-Agent": random.choice(USER_AGENTS)
    }
    
    result = {
        "url": url,
        "title": "",
        "text": "",
        "status_code": None,
        "error": None
    }
    
    try:
        session = get_session()
        response = session.get(url, headers=headers, timeout=timeout)
        
        result["status_code"] = response.status_code
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Extract title
            title_tag = soup.find("title")
            result["title"] = title_tag.get_text(strip=True) if title_tag else ""
            
            # Clean up text: remove scripts/styles
            for script in soup(["script", "style", "meta", "link"]):
                script.extract()
            
            # Get text content
            text = soup.get_text(separator=' ')
            # Normalize whitespace
            text = ' '.join(text.split())
            result["text"] = text[:5000]  # Limit to 5000 chars for tool output
            
        else:
            result["error"] = f"HTTP {response.status_code}"
            
    except requests.exceptions.Timeout:
        result["error"] = "Request timeout"
    except requests.exceptions.ConnectionError:
        result["error"] = "Connection error"
    except Exception as e:
        result["error"] = str(e)
    
    return result


@log_tool_call
def web_scrape(url: str) -> str:
    """
    Web scraping tool function for LangChain agent.
    Scrapes a URL and returns formatted text.
    
    Args:
        url: URL to scrape
        
    Returns:
        Formatted string with scraped content
    """
    result = scrape_url(url)
    
    if result["error"]:
        return f"Error scraping {url}: {result['error']}"
    
    if result["status_code"] != 200:
        return f"Failed to scrape {url}: HTTP {result['status_code']}"
    
    output = f"URL: {result['url']}\n"
    if result["title"]:
        output += f"Title: {result['title']}\n"
    output += f"Content: {result['text']}\n"
    
    return output

