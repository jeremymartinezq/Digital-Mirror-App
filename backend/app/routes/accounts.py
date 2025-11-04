"""
Bank account management routes with Plaid integration
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.db import get_db
from app.models.user import User
from app.models.account import Account, AccountType
from app.auth import get_current_user
from app.services.plaid_service import PlaidService

router = APIRouter()


class PlaidLinkRequest(BaseModel):
    public_token: str


class AccountResponse(BaseModel):
    id: int
    account_name: str
    account_type: AccountType
    institution_name: Optional[str]
    current_balance: float
    available_balance: float
    currency: str
    is_active: bool
    last_synced: Optional[datetime]

    class Config:
        from_attributes = True


class NetWorthResponse(BaseModel):
    total_assets: float
    total_liabilities: float
    net_worth: float
    accounts_breakdown: List[dict]


@router.post("/plaid/link")
async def link_plaid_account(
    link_request: PlaidLinkRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Link bank account via Plaid (mock implementation)"""
    plaid_service = PlaidService()
    
    try:
        # Exchange public token for access token (mock)
        accounts_data = await plaid_service.exchange_public_token(link_request.public_token)
        
        # Create account records
        created_accounts = []
        for acc_data in accounts_data:
            account = Account(
                user_id=current_user.id,
                plaid_account_id=acc_data["account_id"],
                plaid_item_id=acc_data["item_id"],
                account_name=acc_data["name"],
                account_type=AccountType(acc_data["type"]),
                institution_name=acc_data["institution"],
                current_balance=acc_data["balance"],
                available_balance=acc_data["available"],
                last_synced=datetime.utcnow()
            )
            db.add(account)
            created_accounts.append(account)
        
        await db.commit()
        
        return {
            "message": "Accounts linked successfully",
            "accounts_count": len(created_accounts)
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to link account: {str(e)}"
        )


@router.get("/", response_model=List[AccountResponse])
async def get_user_accounts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all accounts for current user"""
    result = await db.execute(
        select(Account).where(Account.user_id == current_user.id, Account.is_active == True)
    )
    accounts = result.scalars().all()
    
    return accounts


@router.get("/{account_id}", response_model=AccountResponse)
async def get_account_detail(
    account_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific account details"""
    result = await db.execute(
        select(Account).where(Account.id == account_id, Account.user_id == current_user.id)
    )
    account = result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    return account


@router.post("/{account_id}/sync")
async def sync_account(
    account_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Sync account data with Plaid (mock)"""
    result = await db.execute(
        select(Account).where(Account.id == account_id, Account.user_id == current_user.id)
    )
    account = result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # Mock sync with Plaid
    plaid_service = PlaidService()
    updated_data = await plaid_service.sync_account(account.plaid_account_id)
    
    account.current_balance = updated_data["balance"]
    account.available_balance = updated_data["available"]
    account.last_synced = datetime.utcnow()
    
    await db.commit()
    await db.refresh(account)
    
    return {"message": "Account synced successfully", "account": account}


@router.get("/networth/calculate", response_model=NetWorthResponse)
async def calculate_net_worth(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Calculate user's net worth"""
    result = await db.execute(
        select(Account).where(Account.user_id == current_user.id, Account.is_active == True)
    )
    accounts = result.scalars().all()
    
    assets = 0.0
    liabilities = 0.0
    breakdown = []
    
    for account in accounts:
        account_data = {
            "name": account.account_name,
            "type": account.account_type.value,
            "balance": account.current_balance
        }
        
        # Asset accounts
        if account.account_type in [AccountType.CHECKING, AccountType.SAVINGS, AccountType.INVESTMENT]:
            assets += account.current_balance
            account_data["category"] = "asset"
        # Liability accounts
        elif account.account_type in [AccountType.CREDIT, AccountType.LOAN, AccountType.MORTGAGE]:
            liabilities += abs(account.current_balance)
            account_data["category"] = "liability"
        
        breakdown.append(account_data)
    
    net_worth = assets - liabilities
    
    return {
        "total_assets": assets,
        "total_liabilities": liabilities,
        "net_worth": net_worth,
        "accounts_breakdown": breakdown
    }


@router.delete("/{account_id}")
async def delete_account(
    account_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete/unlink account"""
    result = await db.execute(
        select(Account).where(Account.id == account_id, Account.user_id == current_user.id)
    )
    account = result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # Soft delete
    account.is_active = False
    await db.commit()
    
    return {"message": "Account deleted successfully"}

