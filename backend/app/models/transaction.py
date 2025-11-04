"""
Transaction model for financial data tracking
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.db import Base


class TransactionCategory(str, enum.Enum):
    """Transaction category enumeration"""
    INCOME = "income"
    GROCERIES = "groceries"
    DINING = "dining"
    TRANSPORTATION = "transportation"
    UTILITIES = "utilities"
    RENT_MORTGAGE = "rent_mortgage"
    ENTERTAINMENT = "entertainment"
    SHOPPING = "shopping"
    HEALTHCARE = "healthcare"
    EDUCATION = "education"
    TRAVEL = "travel"
    INSURANCE = "insurance"
    SAVINGS = "savings"
    INVESTMENT = "investment"
    DEBT_PAYMENT = "debt_payment"
    OTHER = "other"


class Transaction(Base):
    """Transaction model for tracking financial movements"""
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    plaid_transaction_id = Column(String, unique=True, index=True)
    
    # Transaction details
    date = Column(DateTime, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=False)
    merchant_name = Column(String)
    
    # Categorization
    category = Column(Enum(TransactionCategory), default=TransactionCategory.OTHER)
    subcategory = Column(String)
    
    # Additional metadata
    pending = Column(Boolean, default=False)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    account = relationship("Account", back_populates="transactions")

    def __repr__(self):
        return f"<Transaction {self.description} - ${self.amount}>"

