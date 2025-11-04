"""
Bank account model for Plaid integration
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.db import Base


class AccountType(str, enum.Enum):
    """Bank account type enumeration"""
    CHECKING = "checking"
    SAVINGS = "savings"
    CREDIT = "credit"
    INVESTMENT = "investment"
    LOAN = "loan"
    MORTGAGE = "mortgage"


class Account(Base):
    """Bank account model linked to Plaid"""
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plaid_account_id = Column(String, unique=True, index=True)
    plaid_item_id = Column(String, index=True)
    
    # Account details
    account_name = Column(String, nullable=False)
    account_type = Column(Enum(AccountType), nullable=False)
    account_subtype = Column(String)
    institution_name = Column(String)
    
    # Financial data
    current_balance = Column(Float, default=0.0)
    available_balance = Column(Float, default=0.0)
    currency = Column(String, default="USD")
    
    # Metadata
    is_active = Column(Boolean, default=True)
    last_synced = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Account {self.account_name} - {self.account_type}>"

