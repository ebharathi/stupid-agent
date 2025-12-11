#!/usr/bin/env python3
"""
File reading tool with line range support.
"""

import sys
from typing import Optional

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

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python read_file.py <file_path> [start_line] [end_line]")
        sys.exit(1)
    
    file_path = sys.argv[1]
    start_line = int(sys.argv[2]) if len(sys.argv) > 2 else None
    end_line = int(sys.argv[3]) if len(sys.argv) > 3 else None
    
    result = read_file(file_path, start_line, end_line)
    print(result)
