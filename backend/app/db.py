"""
Database configuration and connection management
PostgreSQL + Redis setup
"""
import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
import redis.asyncio as aioredis
from redis.asyncio import Redis
import logging

logger = logging.getLogger(__name__)

# Database configuration from environment variables
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/digital_mirror"
)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# SQLAlchemy setup
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    future=True,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

# Redis connection
redis_client: Redis = None


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Database session dependency"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_redis() -> Redis:
    """Redis client dependency"""
    return redis_client


async def init_db():
    """Initialize database connections"""
    global redis_client
    
    # Initialize Redis
    try:
        redis_client = await aioredis.from_url(
            REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
        await redis_client.ping()
        logger.info("✅ Redis connected successfully")
    except Exception as e:
        logger.error(f"❌ Redis connection failed: {e}")
        redis_client = None
    
    # Create database tables
    try:
        async with engine.begin() as conn:
            # Import all models to register them
            from app.models import user, account, transaction, simulation, gamification
            await conn.run_sync(Base.metadata.create_all)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")


async def close_db():
    """Close database connections"""
    global redis_client
    
    if redis_client:
        await redis_client.close()
        logger.info("Redis connection closed")
    
    await engine.dispose()
    logger.info("Database connection closed")

