"""
Financial simulation routes with AI/ML predictions
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

from app.db import get_db
from app.models.user import User
from app.models.simulation import Simulation, SimulationType
from app.auth import get_current_user
from app.ml.simulation_engine import SimulationEngine

router = APIRouter()


class SimulationRequest(BaseModel):
    name: str
    simulation_type: SimulationType
    description: Optional[str] = None
    input_parameters: Dict[str, Any]


class SimulationResponse(BaseModel):
    id: int
    name: str
    simulation_type: SimulationType
    description: Optional[str]
    input_parameters: Dict[str, Any]
    results: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True


@router.post("/", response_model=SimulationResponse, status_code=status.HTTP_201_CREATED)
async def create_simulation(
    simulation_request: SimulationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create and run a new financial simulation"""
    # Initialize simulation engine
    engine = SimulationEngine()
    
    # Run simulation based on type
    try:
        results = await engine.run_simulation(
            simulation_type=simulation_request.simulation_type,
            parameters=simulation_request.input_parameters,
            user_id=current_user.id,
            db=db
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Simulation failed: {str(e)}"
        )
    
    # Save simulation
    simulation = Simulation(
        user_id=current_user.id,
        name=simulation_request.name,
        simulation_type=simulation_request.simulation_type,
        description=simulation_request.description,
        input_parameters=simulation_request.input_parameters,
        results=results
    )
    
    db.add(simulation)
    await db.commit()
    await db.refresh(simulation)
    
    return simulation


@router.get("/", response_model=List[SimulationResponse])
async def get_user_simulations(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all simulations for current user"""
    result = await db.execute(
        select(Simulation)
        .where(Simulation.user_id == current_user.id)
        .order_by(Simulation.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    simulations = result.scalars().all()
    
    return simulations


@router.get("/{simulation_id}", response_model=SimulationResponse)
async def get_simulation(
    simulation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific simulation details"""
    result = await db.execute(
        select(Simulation).where(
            Simulation.id == simulation_id,
            Simulation.user_id == current_user.id
        )
    )
    simulation = result.scalar_one_or_none()
    
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    
    return simulation


@router.delete("/{simulation_id}")
async def delete_simulation(
    simulation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a simulation"""
    result = await db.execute(
        select(Simulation).where(
            Simulation.id == simulation_id,
            Simulation.user_id == current_user.id
        )
    )
    simulation = result.scalar_one_or_none()
    
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    
    await db.delete(simulation)
    await db.commit()
    
    return {"message": "Simulation deleted successfully"}


@router.get("/templates/list")
async def get_simulation_templates():
    """Get available simulation templates"""
    templates = [
        {
            "type": "purchase",
            "name": "Major Purchase",
            "description": "Simulate the impact of a major purchase (car, house, etc.)",
            "required_fields": ["amount", "payment_plan", "months"]
        },
        {
            "type": "loan",
            "name": "Loan Repayment",
            "description": "Simulate different loan repayment strategies",
            "required_fields": ["principal", "interest_rate", "term_months", "extra_payment"]
        },
        {
            "type": "career_change",
            "name": "Career Change",
            "description": "Simulate income changes from career transitions",
            "required_fields": ["current_income", "new_income", "transition_months"]
        },
        {
            "type": "investment",
            "name": "Investment Growth",
            "description": "Simulate investment returns over time",
            "required_fields": ["initial_amount", "monthly_contribution", "expected_return", "years"]
        },
        {
            "type": "debt_repayment",
            "name": "Debt Payoff Strategy",
            "description": "Compare debt repayment strategies",
            "required_fields": ["debts", "monthly_payment", "strategy"]
        }
    ]
    
    return {"templates": templates}

