import json
from datetime import datetime
from typing import List, Dict, Optional

class MemoryStore:
    """Store and retrieve conversation history and memory using Redis"""
    
    def __init__(self, redis_client):
        self.redis = redis_client
        self.conversation_key = "conversations"
        self.memory_key = "memory"
        self.max_messages = 50
    
    def add_message(self, session_id: str, role: str, content: str, metadata: Optional[Dict] = None):
        """Add a message to conversation history"""
        message = {
            "role": role,  # "user" or "assistant"
            "content": content,
            "timestamp": datetime.now().isoformat(),
            "metadata": metadata or {}
        }
        
        key = f"{self.conversation_key}:{session_id}"
        self.redis.lpush(key, json.dumps(message))
        # Set expiration (60 days)
        self.redis.expire(key, 60 * 24 * 60 * 60)
    
    def get_messages(self, session_id: str, limit: int = 50) -> List[Dict]:
        """Get last N messages from conversation history"""
        key = f"{self.conversation_key}:{session_id}"
        messages = self.redis.lrange(key, 0, limit - 1)
        return [json.loads(msg) for msg in reversed(messages)]  # Reverse to get chronological order
  
