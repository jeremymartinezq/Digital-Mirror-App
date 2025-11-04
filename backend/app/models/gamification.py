"""
Gamification models for engagement and financial literacy
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.db import Base


class AchievementType(str, enum.Enum):
    """Achievement type enumeration"""
    SAVINGS_MILESTONE = "savings_milestone"
    DEBT_REDUCTION = "debt_reduction"
    BUDGET_ADHERENCE = "budget_adherence"
    SIMULATION_USAGE = "simulation_usage"
    FINANCIAL_LITERACY = "financial_literacy"
    ACCOUNT_LINKING = "account_linking"
    STREAK = "streak"


class Achievement(Base):
    """User achievements for gamification"""
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Achievement details
    achievement_type = Column(Enum(AchievementType), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    icon = Column(String)
    
    # Progress tracking
    target_value = Column(Float)
    current_value = Column(Float, default=0.0)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="achievements")

    def __repr__(self):
        return f"<Achievement {self.title} - {'✅' if self.is_completed else '⏳'}>"


class Milestone(Base):
    """Financial milestones and goals"""
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Milestone details
    title = Column(String, nullable=False)
    description = Column(Text)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    target_date = Column(DateTime)
    
    # Status
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Milestone {self.title} - ${self.current_amount}/${self.target_amount}>"

