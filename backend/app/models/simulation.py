"""
Simulation model for financial "what-if" scenarios
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.db import Base


class SimulationType(str, enum.Enum):
    """Simulation type enumeration"""
    PURCHASE = "purchase"
    LOAN = "loan"
    CAREER_CHANGE = "career_change"
    INVESTMENT = "investment"
    DEBT_REPAYMENT = "debt_repayment"
    FAMILY_PLANNING = "family_planning"
    RETIREMENT = "retirement"
    EMERGENCY_FUND = "emergency_fund"
    CUSTOM = "custom"


class Simulation(Base):
    """Financial simulation model for predictive analysis"""
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Simulation metadata
    name = Column(String, nullable=False)
    simulation_type = Column(Enum(SimulationType), nullable=False)
    description = Column(Text)
    
    # Input parameters (stored as JSON)
    input_parameters = Column(JSON, nullable=False)
    
    # Simulation results (stored as JSON)
    # Contains: predictions, financial_impact, timeline_data, recommendations
    results = Column(JSON)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="simulations")

    def __repr__(self):
        return f"<Simulation {self.name} - {self.simulation_type}>"

