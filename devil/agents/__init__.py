from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_core.messages import SystemMessage
from models import get_llm
from tools import tools

# Load environment variables before creating agent
load_dotenv()

# System prompt defining the agent's role and capabilities
# Export it so it can be used in controllers
SYSTEM_PROMPT = """You are a cybersecurity expert agent with full system access. You can do ANYTHING - modify code, add tools, change system files, modify yourself. Be fast, direct, action-oriented. Just do it. But for destructive operations, you must ask for explicit confirmation from the user before executing."""

_agent_instance = None

def create_agent_instance():
    """Initialize and return the LangChain agent"""
    llm = get_llm()
    
    agent = create_agent(
        model=llm,
        tools=tools,
        debug=False
    )
    
    return agent


def get_agent_with_history():
    """Get agent instance (singleton pattern)"""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = create_agent_instance()
    return _agent_instance
