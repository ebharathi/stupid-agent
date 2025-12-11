#!/usr/bin/env python3
"""
File writing tool.
"""

import sys
import os
from typing import Optional

def write_file(file_path: str, content: str, append: bool = False) -> str:
    """
    Write content to file.
    
    Args:
        file_path: Path to the file to write
        content: Content to write
        append: If True, append to file; otherwise overwrite
    
    Returns:
        Success message or error
    """
    try:
        # Create directory if it doesn't exist
        dir_path = os.path.dirname(file_path)
        if dir_path and not os.path.exists(dir_path):
            os.makedirs(dir_path, exist_ok=True)
        
        mode = 'a' if append else 'w'
        with open(file_path, mode, encoding='utf-8') as f:
            f.write(content)
        
        return f"Successfully wrote to '{file_path}'"
    
    except PermissionError:
        return f"Error: Permission denied for '{file_path}'"
    except Exception as e:
        return f"Error writing file: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python write_file.py <file_path> <content> [--append]")
        print("Note: Content should be provided as a single argument")
        sys.exit(1)
    
    file_path = sys.argv[1]
    content = sys.argv[2]
    append = len(sys.argv) > 3 and sys.argv[3] == "--append"
    
    result = write_file(file_path, content, append)
    print(result)
