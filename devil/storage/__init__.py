from storage.redis_client import get_redis_client
from storage.memory import MemoryStore

# Initialize Redis client and memory store
try:
    redis_client = get_redis_client()
    memory_store = MemoryStore(redis_client)
except Exception as e:
    print(f"Warning: Redis connection failed: {e}. Memory features will be disabled.")
    redis_client = None
    memory_store = None

