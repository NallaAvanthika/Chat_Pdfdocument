from sqlalchemy import Column, Integer, String
from .database import Base  # Make sure database.py has: Base = declarative_base()

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True)
