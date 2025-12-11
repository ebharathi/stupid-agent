from langchain_core.tools import Tool
from tools.search_web import web_search
from tools.run_shell import run_shell
from tools.web_scraper import web_scrape
from tools.search_memory import search_memory
from tools.get_tool_calls import get_tool_calls
from tools.read_file import read_file
from tools.write_file import write_file
from tools.apply_patch import apply_patch

tools = [
    Tool(
        name="duckduckgo_search",
        func=web_search,
        description="Use DuckDuckGo to search recent information on the internet"
    ),
    Tool(
        name="run_shell",
        func=run_shell,
        description="Execute shell commands on the system. Use this to run terminal commands, check system status, list files, etc. Be careful with destructive commands."
    ),
    Tool(
        name="web_page_scraper",
        func=web_scrape,
        description="Scrape content from any website URL. Returns the page title and text content. Use this to extract information from web pages."
    ),
    Tool(
        name="search_memory",
        func=search_memory,
        description="Search conversation memory/history. IMPORTANT: You already have direct access to the last 50 messages in the current conversation automatically. Only use this tool when you urgently need to recall specific past conversations beyond the last 50 messages, or when you need to recall specific messages beyond the last 50 messages. Parameters: session_id (default: 'default'), offset (for pagination, ignored if keyword used), limit (max: 50), keyword (optional - searches message content, when used offset is ignored and limit applies to search results)."
    ),
    Tool(
        name="get_tool_calls",
        func=get_tool_calls,
        description="Get all tool calls (input/output) for a specific request ID. Use this to see what tools were executed and their results for a particular request. Parameter: request_id (the request ID to fetch tool calls for)."
    ),
    Tool(
        name="read_file",
        func=read_file,
        description="Read file content. Can read entire file or specific line ranges. Parameters: file_path (path to file), start_line (optional, 0-indexed), end_line (optional, 0-indexed)."
    ),
    Tool(
        name="write_file",
        func=write_file,
        description="Write content to a file. Creates directories if needed. Parameters: file_path (path to file), content (content to write), append (optional, default False - if True appends instead of overwriting)."
    ),
    Tool(
        name="apply_patch",
        func=apply_patch,
        description="Apply a unified diff patch to a file. Parameters: diff_content (unified diff format), target_file (optional - file to patch, if not specified in diff)."
    )
]
