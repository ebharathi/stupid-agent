import os
import redis
from dotenv import load_dotenv
from utils.logger import logger
load_dotenv()

def get_redis_client():
    """Create and return a Redis client connection"""
    host = os.getenv("REDIS_HOST", "localhost")
    port = int(os.getenv("REDIS_PORT", 6379))
    
    try:
        client = redis.Redis(
            host=host,
            port=port,
            decode_responses=True,
            socket_connect_timeout=5
        )
        # Test connection
        client.ping()
        logger.info(f"Connected to Redis at {host}:{port}")
        return client
    except Exception as e:
        raise ConnectionError(f"Failed to connect to Redis: {e}")

