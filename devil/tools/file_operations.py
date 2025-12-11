#!/usr/bin/env python3
"""
Unified interface for file operations.
"""

import sys
from typing import Optional
from .read_file import read_file
from .write_file import write_file
from .apply_patch import apply_patch

def file_operation(operation: str, **kwargs) -> str:
    """
    Unified interface for file operations.
    
    Args:
        operation: 'read', 'write', or 'patch'
        **kwargs: Operation-specific arguments
    
    Returns:
        Operation result as string
    """
    try:
        if operation == 'read':
            file_path = kwargs.get('file_path')
            start_line = kwargs.get('start_line')
            end_line = kwargs.get('end_line')
            
            if not file_path:
                return "Error: file_path is required for read operation"
            
            return read_file(file_path, start_line, end_line)
        
        elif operation == 'write':
            file_path = kwargs.get('file_path')
            content = kwargs.get('content')
            append = kwargs.get('append', False)
            
            if not file_path or content is None:
                return "Error: file_path and content are required for write operation"
            
            return write_file(file_path, content, append)
        
        elif operation == 'patch':
            diff_content = kwargs.get('diff_content')
            target_file = kwargs.get('target_file')
            
            if not diff_content:
                return "Error: diff_content is required for patch operation"
            
            return apply_patch(diff_content, target_file)
        
        else:
            return f"Error: Unknown operation '{operation}'. Use 'read', 'write', or 'patch'."
    
    except Exception as e:
        return f"Error in file_operation: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python file_operations.py <operation> [args...]")
        print("Operations:")
        print("  read <file_path> [start_line] [end_line]")
        print("  write <file_path> <content> [--append]")
        print("  patch <diff_content> [target_file]")
        sys.exit(1)
    
    operation = sys.argv[1]
    
    if operation == 'read':
        if len(sys.argv) < 3:
            print("Error: file_path required for read")
            sys.exit(1)
        file_path = sys.argv[2]
        start_line = int(sys.argv[3]) if len(sys.argv) > 3 else None
        end_line = int(sys.argv[4]) if len(sys.argv) > 4 else None
        result = file_operation('read', file_path=file_path, start_line=start_line, end_line=end_line)
    
    elif operation == 'write':
        if len(sys.argv) < 4:
            print("Error: file_path and content required for write")
            sys.exit(1)
        file_path = sys.argv[2]
        content = sys.argv[3]
        append = len(sys.argv) > 4 and sys.argv[4] == "--append"
        result = file_operation('write', file_path=file_path, content=content, append=append)
    
    elif operation == 'patch':
        if len(sys.argv) < 3:
            print("Error: diff_content required for patch")
            sys.exit(1)
        diff_content = sys.argv[2]
        target_file = sys.argv[3] if len(sys.argv) > 3 else None
        result = file_operation('patch', diff_content=diff_content, target_file=target_file)
    
    else:
        result = f"Error: Unknown operation '{operation}'"
    
    print(result)
