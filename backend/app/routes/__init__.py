"""
Routes package initialization
"""
from app.routes import auth, users, accounts, transactions, simulations, gamification, admin

__all__ = [
    "auth",
    "users",
    "accounts",
    "transactions",
    "simulations",
    "gamification",
    "admin",
]

