import subprocess
from utils.logger import log_tool_call

@log_tool_call
def run_shell(command: str):
    """Run a safe shell command and return output."""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True,
            timeout=300  # 5 minutes timeout
        )
        return result.stdout or result.stderr
    except Exception as e:
        return str(e)
