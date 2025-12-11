from typing import Optional
import subprocess
import tempfile
import os
from utils.logger import log_tool_call

@log_tool_call
def apply_patch(diff_content: str, target_file: Optional[str] = None) -> str:
    """
    Apply unified diff patch to file.
    
    Args:
        diff_content: Unified diff content
        target_file: Optional target file path (if not specified in diff)
    
    Returns:
        Success message or error
    """
    try:
        # Create temporary file for the diff
        with tempfile.NamedTemporaryFile(mode='w', suffix='.diff', delete=False) as tmp:
            tmp.write(diff_content)
            tmp_path = tmp.name
        
        try:
            # Apply the patch
            cmd = ['patch', '-p1', '-i', tmp_path]
            if target_file:
                cmd.extend(['--input', tmp_path, target_file])
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=os.path.dirname(target_file) if target_file else None
            )
            
            if result.returncode == 0:
                return f"Patch applied successfully\n{result.stdout}"
            else:
                return f"Error applying patch:\n{result.stderr}\n{result.stdout}"
        
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
    
    except FileNotFoundError:
        return "Error: 'patch' command not found. Install patch utility: sudo apt-get install patch"
    except Exception as e:
        return f"Error applying patch: {str(e)}"
