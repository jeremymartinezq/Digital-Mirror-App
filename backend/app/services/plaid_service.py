"""
Plaid API integration service (Mock implementation for MVP)
In production, use actual Plaid SDK
"""
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class PlaidService:
    """
    Mock Plaid service for MVP
    Replace with actual Plaid SDK integration: pip install plaid-python
    """
    
    def __init__(self):
        """Initialize Plaid service"""
        self.mock_institutions = [
            "Chase Bank",
            "Bank of America",
            "Wells Fargo",
            "Citibank",
            "Capital One",
            "US Bank"
        ]
    
    async def exchange_public_token(self, public_token: str) -> List[Dict[str, Any]]:
        """
        Exchange public token for access token and retrieve accounts
        Mock implementation - returns fake account data
        """
        logger.info(f"Exchanging public token: {public_token[:10]}...")
        
        # Mock account data
        mock_accounts = [
            {
                "account_id": f"acc_{random.randint(10000, 99999)}",
                "item_id": f"item_{random.randint(10000, 99999)}",
                "name": "Checking Account",
                "type": "checking",
                "institution": random.choice(self.mock_institutions),
                "balance": round(random.uniform(1000, 50000), 2),
                "available": round(random.uniform(1000, 50000), 2)
            },
            {
                "account_id": f"acc_{random.randint(10000, 99999)}",
                "item_id": f"item_{random.randint(10000, 99999)}",
                "name": "Savings Account",
                "type": "savings",
                "institution": random.choice(self.mock_institutions),
                "balance": round(random.uniform(5000, 100000), 2),
                "available": round(random.uniform(5000, 100000), 2)
            },
            {
                "account_id": f"acc_{random.randint(10000, 99999)}",
                "item_id": f"item_{random.randint(10000, 99999)}",
                "name": "Credit Card",
                "type": "credit",
                "institution": random.choice(self.mock_institutions),
                "balance": round(random.uniform(-5000, -100), 2),
                "available": round(random.uniform(1000, 10000), 2)
            }
        ]
        
        return mock_accounts
    
    async def sync_account(self, account_id: str) -> Dict[str, Any]:
        """
        Sync account balance and details
        Mock implementation
        """
        logger.info(f"Syncing account: {account_id}")
        
        return {
            "account_id": account_id,
            "balance": round(random.uniform(1000, 50000), 2),
            "available": round(random.uniform(1000, 50000), 2),
            "last_synced": datetime.utcnow().isoformat()
        }
    
    async def get_transactions(
        self,
        account_id: str,
        start_date: datetime = None,
        end_date: datetime = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieve transactions for an account
        Mock implementation - generates fake transaction data
        """
        logger.info(f"Fetching transactions for account: {account_id}")
        
        if not start_date:
            start_date = datetime.now() - timedelta(days=90)
        if not end_date:
            end_date = datetime.now()
        
        # Mock transaction categories and merchants
        categories = [
            "groceries", "dining", "transportation", "utilities",
            "entertainment", "shopping", "income"
        ]
        
        merchants = {
            "groceries": ["Whole Foods", "Trader Joe's", "Safeway", "Kroger"],
            "dining": ["Chipotle", "Starbucks", "Olive Garden", "McDonald's"],
            "transportation": ["Uber", "Lyft", "Shell Gas", "Chevron"],
            "utilities": ["PG&E", "Comcast", "AT&T", "Water District"],
            "entertainment": ["Netflix", "Spotify", "AMC Theaters", "Amazon Prime"],
            "shopping": ["Amazon", "Target", "Walmart", "Best Buy"],
            "income": ["Direct Deposit - Salary", "Freelance Payment", "Interest"]
        }
        
        # Generate 20-50 random transactions
        num_transactions = random.randint(20, 50)
        transactions = []
        
        for i in range(num_transactions):
            category = random.choice(categories)
            merchant = random.choice(merchants[category])
            
            # Income is positive, expenses are negative
            if category == "income":
                amount = round(random.uniform(1000, 5000), 2)
            else:
                amount = -round(random.uniform(5, 500), 2)
            
            transaction_date = start_date + timedelta(
                days=random.randint(0, (end_date - start_date).days)
            )
            
            transactions.append({
                "transaction_id": f"trans_{random.randint(100000, 999999)}",
                "account_id": account_id,
                "date": transaction_date,
                "amount": amount,
                "description": merchant,
                "merchant": merchant,
                "category": category,
                "pending": random.choice([True, False]) if i < 3 else False
            })
        
        # Sort by date descending
        transactions.sort(key=lambda x: x["date"], reverse=True)
        
        return transactions
    
    async def create_link_token(self, user_id: int) -> str:
        """
        Create a link token for Plaid Link initialization
        Mock implementation
        """
        logger.info(f"Creating link token for user: {user_id}")
        
        return f"link-sandbox-{random.randint(10000000, 99999999)}"
    
    async def get_institution_info(self, institution_id: str) -> Dict[str, Any]:
        """
        Get institution information
        Mock implementation
        """
        return {
            "institution_id": institution_id,
            "name": random.choice(self.mock_institutions),
            "logo": None,
            "primary_color": "#" + ''.join(random.choices('0123456789ABCDEF', k=6))
        }

