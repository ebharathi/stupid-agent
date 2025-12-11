from typing import Optional
from utils.logger import log_tool_call

@log_tool_call
def read_file(file_path: str, start_line: Optional[int] = None, end_line: Optional[int] = None) -> str:
    """
    Read file content, optionally only specific lines.
    
    Args:
        file_path: Path to the file to read
        start_line: Starting line number (0-indexed, inclusive)
        end_line: Ending line number (0-indexed, exclusive)
    
    Returns:
        File content as string
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        if start_line is not None or end_line is not None:
            start = start_line if start_line is not None else 0
            end = end_line if end_line is not None else len(lines)
            
            # Handle negative indices (from end)
            if start < 0:
                start = len(lines) + start
            if end < 0:
                end = len(lines) + end
            
            # Ensure bounds are valid
            start = max(0, min(start, len(lines)))
            end = max(0, min(end, len(lines)))
            
            lines = lines[start:end]
        
        return ''.join(lines)
    
    except FileNotFoundError:
        return f"Error: File '{file_path}' not found"
    except PermissionError:
        return f"Error: Permission denied for '{file_path}'"
    except Exception as e:
        return f"Error reading file: {str(e)}"
