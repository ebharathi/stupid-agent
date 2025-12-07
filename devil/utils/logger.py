import logging
import functools
from datetime import datetime
from typing import Optional, Callable, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


def log_tool_call(func: Callable) -> Callable:
    """
    Decorator to automatically log tool calls.
    Logs [TOOL START], [TOOL END], and [TOOL ERROR] for all tool functions.
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        tool_name = func.__name__
        
        # Format arguments for logging
        args_str = ", ".join([str(arg) for arg in args])
        kwargs_str = ", ".join([f"{k}={v}" for k, v in kwargs.items()])
        all_args = ", ".join(filter(None, [args_str, kwargs_str]))
        
        # Log tool start
        logger.info(f"[TOOL START] {tool_name}: {all_args}")
        
        try:
            # Execute the tool function
            result = func(*args, **kwargs)
            
            # Truncate result for logging if too long
            result_str = str(result)
            if len(result_str) > 500:
                result_str = result_str[:500] + "... (truncated)"
            
            # Log tool end
            logger.info(f"[TOOL END] {tool_name}: {result_str}")
            
            return result
            
        except Exception as e:
            # Log tool error
            logger.error(f"[TOOL ERROR] {tool_name}: {str(e)}")
            raise
    
    return wrapper


def log_conversation(session_id: str, query: str, response: str, error: Optional[str] = None):
    """Log conversation for debugging and context"""
    log_entry = {
        "session_id": session_id,
        "timestamp": datetime.now().isoformat(),
        "query": query,
        "response": response,
        "error": error
    }
    
    if error:
        logger.error(f"Session {session_id}: Error - {error}")
        logger.error(f"Query: {query}")
    else:
        logger.info(f"Session {session_id}: Query - {query[:100]}...")
        logger.info(f"Session {session_id}: Response - {response[:100]}...")
    
    return log_entry

