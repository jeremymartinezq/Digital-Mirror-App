"""
Transaction management and categorization routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func, extract
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from collections import defaultdict

from app.db import get_db
from app.models.user import User
from app.models.account import Account
from app.models.transaction import Transaction, TransactionCategory
from app.auth import get_current_user

router = APIRouter()


class TransactionResponse(BaseModel):
    id: int
    account_id: int
    date: datetime
    amount: float
    description: str
    merchant_name: Optional[str]
    category: TransactionCategory
    pending: bool

    class Config:
        from_attributes = True


class SpendingBreakdown(BaseModel):
    category: str
    total_amount: float
    transaction_count: int
    percentage: float


class MonthlySpendingResponse(BaseModel):
    month: str
    total_spending: float
    total_income: float
    net: float
    breakdown: List[SpendingBreakdown]


@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    account_id: Optional[int] = None,
    category: Optional[TransactionCategory] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(100, le=1000),
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get transactions with filters"""
    # Build query
    query = select(Transaction).join(Account).where(Account.user_id == current_user.id)
    
    if account_id:
        query = query.where(Transaction.account_id == account_id)
    
    if category:
        query = query.where(Transaction.category == category)
    
    if start_date:
        query = query.where(Transaction.date >= start_date)
    
    if end_date:
        query = query.where(Transaction.date <= end_date)
    
    query = query.order_by(Transaction.date.desc()).limit(limit).offset(offset)
    
    result = await db.execute(query)
    transactions = result.scalars().all()
    
    return transactions


@router.get("/spending/monthly", response_model=MonthlySpendingResponse)
async def get_monthly_spending(
    year: int = Query(datetime.now().year),
    month: int = Query(datetime.now().month),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get spending breakdown for a specific month"""
    # Get all transactions for the month
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)
    
    query = select(Transaction).join(Account).where(
        and_(
            Account.user_id == current_user.id,
            Transaction.date >= start_date,
            Transaction.date < end_date
        )
    )
    
    result = await db.execute(query)
    transactions = result.scalars().all()
    
    # Calculate spending by category
    category_totals = defaultdict(lambda: {"amount": 0.0, "count": 0})
    total_spending = 0.0
    total_income = 0.0
    
    for transaction in transactions:
        if transaction.category == TransactionCategory.INCOME:
            total_income += abs(transaction.amount)
        else:
            amount = abs(transaction.amount)
            total_spending += amount
            category_totals[transaction.category.value]["amount"] += amount
            category_totals[transaction.category.value]["count"] += 1
    
    # Create breakdown
    breakdown = []
    for category, data in category_totals.items():
        percentage = (data["amount"] / total_spending * 100) if total_spending > 0 else 0
        breakdown.append(SpendingBreakdown(
            category=category,
            total_amount=data["amount"],
            transaction_count=data["count"],
            percentage=round(percentage, 2)
        ))
    
    # Sort by amount
    breakdown.sort(key=lambda x: x.total_amount, reverse=True)
    
    return MonthlySpendingResponse(
        month=f"{year}-{month:02d}",
        total_spending=total_spending,
        total_income=total_income,
        net=total_income - total_spending,
        breakdown=breakdown
    )


@router.get("/spending/trends")
async def get_spending_trends(
    months: int = Query(6, le=24),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get spending trends over multiple months"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=months * 30)
    
    query = select(Transaction).join(Account).where(
        and_(
            Account.user_id == current_user.id,
            Transaction.date >= start_date,
            Transaction.date <= end_date
        )
    )
    
    result = await db.execute(query)
    transactions = result.scalars().all()
    
    # Group by month
    monthly_data = defaultdict(lambda: {"spending": 0.0, "income": 0.0})
    
    for transaction in transactions:
        month_key = transaction.date.strftime("%Y-%m")
        if transaction.category == TransactionCategory.INCOME:
            monthly_data[month_key]["income"] += abs(transaction.amount)
        else:
            monthly_data[month_key]["spending"] += abs(transaction.amount)
    
    # Format response
    trends = []
    for month, data in sorted(monthly_data.items()):
        trends.append({
            "month": month,
            "spending": data["spending"],
            "income": data["income"],
            "net": data["income"] - data["spending"]
        })
    
    return {"trends": trends}


@router.post("/sync")
async def sync_transactions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Sync transactions from all linked accounts (mock)"""
    from app.services.plaid_service import PlaidService
    
    # Get all user accounts
    result = await db.execute(
        select(Account).where(Account.user_id == current_user.id, Account.is_active == True)
    )
    accounts = result.scalars().all()
    
    plaid_service = PlaidService()
    total_synced = 0
    
    for account in accounts:
        # Get transactions from Plaid (mock)
        transactions_data = await plaid_service.get_transactions(account.plaid_account_id)
        
        for trans_data in transactions_data:
            # Check if transaction already exists
            result = await db.execute(
                select(Transaction).where(
                    Transaction.plaid_transaction_id == trans_data["transaction_id"]
                )
            )
            existing = result.scalar_one_or_none()
            
            if not existing:
                transaction = Transaction(
                    account_id=account.id,
                    plaid_transaction_id=trans_data["transaction_id"],
                    date=trans_data["date"],
                    amount=trans_data["amount"],
                    description=trans_data["description"],
                    merchant_name=trans_data.get("merchant"),
                    category=TransactionCategory(trans_data["category"]),
                    pending=trans_data.get("pending", False)
                )
                db.add(transaction)
                total_synced += 1
    
    await db.commit()
    
    return {
        "message": "Transactions synced successfully",
        "transactions_synced": total_synced
    }

