# iui/backend/database.py

import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv() 

# Get the database URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("No DATABASE_URL set. Please set the database url in .env file.")

# Set up the core database engine
engine = create_async_engine(DATABASE_URL)

# Factory for creating new database sessions
async_session = async_sessionmaker(engine, expire_on_commit=False)

# Base class that our models will inherit from
class Base(DeclarativeBase):
    pass