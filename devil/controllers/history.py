from storage import memory_store


def get_conversation_history(session_id: str, limit: int = 50) -> dict:
    """
    Get conversation history for a session.
    
    Args:
        session_id: Session identifier
        limit: Maximum number of messages to retrieve
        
    Returns:
        Dictionary with session_id, messages, and count
    """
    if not memory_store:
        raise ValueError("Redis not available")
    
    messages = memory_store.get_messages(session_id, limit=limit)
    return {
        "session_id": session_id,
        "messages": messages,
        "count": len(messages)
    }

