"""
Admin panel routes for user management and system monitoring
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta

from app.db import get_db
from app.models.user import User, UserRole
from app.auth import get_current_user, require_role

router = APIRouter()


class UserListResponse(BaseModel):
    id: int
    email: str
    username: str
    role: UserRole
    is_active: bool
    created_at: datetime
    last_login: datetime = None

    class Config:
        from_attributes = True


class SystemStatsResponse(BaseModel):
    total_users: int
    active_users: int
    total_accounts: int
    total_transactions: int
    total_simulations: int
    users_last_30_days: int


class UserRoleUpdate(BaseModel):
    role: UserRole


@router.get("/users", response_model=List[UserListResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """List all users (admin only)"""
    result = await db.execute(
        select(User).order_by(User.created_at.desc()).limit(limit).offset(skip)
    )
    users = result.scalars().all()
    
    return users


@router.get("/stats", response_model=SystemStatsResponse)
async def get_system_stats(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Get system statistics (admin only)"""
    from app.models.account import Account
    from app.models.transaction import Transaction
    from app.models.simulation import Simulation
    
    # Total users
    total_users_result = await db.execute(select(func.count(User.id)))
    total_users = total_users_result.scalar()
    
    # Active users
    active_users_result = await db.execute(
        select(func.count(User.id)).where(User.is_active == True)
    )
    active_users = active_users_result.scalar()
    
    # Total accounts
    total_accounts_result = await db.execute(select(func.count(Account.id)))
    total_accounts = total_accounts_result.scalar()
    
    # Total transactions
    total_transactions_result = await db.execute(select(func.count(Transaction.id)))
    total_transactions = total_transactions_result.scalar()
    
    # Total simulations
    total_simulations_result = await db.execute(select(func.count(Simulation.id)))
    total_simulations = total_simulations_result.scalar()
    
    # New users last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    new_users_result = await db.execute(
        select(func.count(User.id)).where(User.created_at >= thirty_days_ago)
    )
    users_last_30_days = new_users_result.scalar()
    
    return SystemStatsResponse(
        total_users=total_users,
        active_users=active_users,
        total_accounts=total_accounts,
        total_transactions=total_transactions,
        total_simulations=total_simulations,
        users_last_30_days=users_last_30_days
    )


@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    role_update: UserRoleUpdate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Update user role (admin only)"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.role = role_update.role
    await db.commit()
    await db.refresh(user)
    
    return {"message": "User role updated successfully", "user": user}


@router.put("/users/{user_id}/toggle-status")
async def toggle_user_status(
    user_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Activate/deactivate user account (admin only)"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_active = not user.is_active
    await db.commit()
    await db.refresh(user)
    
    status_text = "activated" if user.is_active else "deactivated"
    return {"message": f"User {status_text} successfully", "is_active": user.is_active}

