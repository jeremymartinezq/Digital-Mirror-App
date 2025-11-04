"""
Gamification routes for achievements and milestones
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.db import get_db
from app.models.user import User
from app.models.gamification import Achievement, AchievementType, Milestone
from app.auth import get_current_user

router = APIRouter()


class AchievementResponse(BaseModel):
    id: int
    achievement_type: AchievementType
    title: str
    description: Optional[str]
    icon: Optional[str]
    target_value: Optional[float]
    current_value: float
    is_completed: bool
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class MilestoneCreate(BaseModel):
    title: str
    description: Optional[str] = None
    target_amount: float
    target_date: Optional[datetime] = None


class MilestoneResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    target_amount: float
    current_amount: float
    target_date: Optional[datetime]
    is_completed: bool
    progress_percentage: float

    class Config:
        from_attributes = True


@router.get("/achievements", response_model=List[AchievementResponse])
async def get_achievements(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all achievements for current user"""
    result = await db.execute(
        select(Achievement)
        .where(Achievement.user_id == current_user.id)
        .order_by(Achievement.is_completed.desc(), Achievement.created_at.desc())
    )
    achievements = result.scalars().all()
    
    return achievements


@router.get("/milestones", response_model=List[MilestoneResponse])
async def get_milestones(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all milestones for current user"""
    result = await db.execute(
        select(Milestone)
        .where(Milestone.user_id == current_user.id)
        .order_by(Milestone.is_completed.asc(), Milestone.target_date.asc())
    )
    milestones = result.scalars().all()
    
    # Calculate progress percentage
    milestones_response = []
    for milestone in milestones:
        progress = (milestone.current_amount / milestone.target_amount * 100) if milestone.target_amount > 0 else 0
        milestone_dict = {
            "id": milestone.id,
            "title": milestone.title,
            "description": milestone.description,
            "target_amount": milestone.target_amount,
            "current_amount": milestone.current_amount,
            "target_date": milestone.target_date,
            "is_completed": milestone.is_completed,
            "progress_percentage": round(min(progress, 100), 2)
        }
        milestones_response.append(MilestoneResponse(**milestone_dict))
    
    return milestones_response


@router.post("/milestones", response_model=MilestoneResponse, status_code=status.HTTP_201_CREATED)
async def create_milestone(
    milestone_data: MilestoneCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new financial milestone"""
    milestone = Milestone(
        user_id=current_user.id,
        title=milestone_data.title,
        description=milestone_data.description,
        target_amount=milestone_data.target_amount,
        target_date=milestone_data.target_date
    )
    
    db.add(milestone)
    await db.commit()
    await db.refresh(milestone)
    
    progress = 0.0
    
    return MilestoneResponse(
        id=milestone.id,
        title=milestone.title,
        description=milestone.description,
        target_amount=milestone.target_amount,
        current_amount=milestone.current_amount,
        target_date=milestone.target_date,
        is_completed=milestone.is_completed,
        progress_percentage=progress
    )


@router.put("/milestones/{milestone_id}")
async def update_milestone_progress(
    milestone_id: int,
    current_amount: float,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update milestone progress"""
    result = await db.execute(
        select(Milestone).where(
            Milestone.id == milestone_id,
            Milestone.user_id == current_user.id
        )
    )
    milestone = result.scalar_one_or_none()
    
    if not milestone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Milestone not found"
        )
    
    milestone.current_amount = current_amount
    
    # Check if completed
    if current_amount >= milestone.target_amount and not milestone.is_completed:
        milestone.is_completed = True
        milestone.completed_at = datetime.utcnow()
        
        # Create achievement for completing milestone
        achievement = Achievement(
            user_id=current_user.id,
            achievement_type=AchievementType.SAVINGS_MILESTONE,
            title=f"Completed: {milestone.title}",
            description=f"Reached savings goal of ${milestone.target_amount}",
            icon="🎯",
            is_completed=True,
            completed_at=datetime.utcnow()
        )
        db.add(achievement)
    
    await db.commit()
    await db.refresh(milestone)
    
    return {"message": "Milestone updated successfully", "milestone": milestone}


@router.delete("/milestones/{milestone_id}")
async def delete_milestone(
    milestone_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a milestone"""
    result = await db.execute(
        select(Milestone).where(
            Milestone.id == milestone_id,
            Milestone.user_id == current_user.id
        )
    )
    milestone = result.scalar_one_or_none()
    
    if not milestone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Milestone not found"
        )
    
    await db.delete(milestone)
    await db.commit()
    
    return {"message": "Milestone deleted successfully"}

