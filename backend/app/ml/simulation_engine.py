"""
AI/ML Simulation Engine for financial predictions
Uses scikit-learn for basic models, extensible to PyTorch/TensorFlow
"""
import numpy as np
from typing import Dict, Any, List
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

from app.models.simulation import SimulationType
from app.models.account import Account
from app.models.transaction import Transaction

logger = logging.getLogger(__name__)


class SimulationEngine:
    """
    Financial simulation engine with AI/ML predictions
    Currently uses rule-based models with statistical methods
    Extensible to deep learning models (LSTM, etc.)
    """
    
    def __init__(self):
        """Initialize simulation engine"""
        self.prediction_months = 24  # Default prediction horizon
    
    async def run_simulation(
        self,
        simulation_type: SimulationType,
        parameters: Dict[str, Any],
        user_id: int,
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Run simulation based on type
        """
        logger.info(f"Running {simulation_type} simulation for user {user_id}")
        
        # Get user's financial context
        context = await self._get_user_financial_context(user_id, db)
        
        # Route to specific simulation
        if simulation_type == SimulationType.PURCHASE:
            return await self._simulate_purchase(parameters, context)
        elif simulation_type == SimulationType.LOAN:
            return await self._simulate_loan(parameters, context)
        elif simulation_type == SimulationType.CAREER_CHANGE:
            return await self._simulate_career_change(parameters, context)
        elif simulation_type == SimulationType.INVESTMENT:
            return await self._simulate_investment(parameters, context)
        elif simulation_type == SimulationType.DEBT_REPAYMENT:
            return await self._simulate_debt_repayment(parameters, context)
        else:
            return await self._simulate_generic(parameters, context)
    
    async def _get_user_financial_context(
        self,
        user_id: int,
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Get user's current financial state
        """
        # Get accounts
        result = await db.execute(
            select(Account).where(Account.user_id == user_id, Account.is_active == True)
        )
        accounts = result.scalars().all()
        
        total_assets = sum(
            acc.current_balance for acc in accounts
            if acc.account_type.value in ["checking", "savings", "investment"]
        )
        
        total_liabilities = sum(
            abs(acc.current_balance) for acc in accounts
            if acc.account_type.value in ["credit", "loan", "mortgage"]
        )
        
        # Get recent transactions for income/expense estimation
        three_months_ago = datetime.utcnow() - timedelta(days=90)
        trans_result = await db.execute(
            select(Transaction)
            .join(Account)
            .where(Account.user_id == user_id, Transaction.date >= three_months_ago)
        )
        transactions = trans_result.scalars().all()
        
        monthly_income = 0
        monthly_expenses = 0
        
        for trans in transactions:
            if trans.amount > 0:
                monthly_income += trans.amount
            else:
                monthly_expenses += abs(trans.amount)
        
        # Average over 3 months
        monthly_income /= 3
        monthly_expenses /= 3
        
        return {
            "total_assets": total_assets,
            "total_liabilities": total_liabilities,
            "net_worth": total_assets - total_liabilities,
            "monthly_income": monthly_income,
            "monthly_expenses": monthly_expenses,
            "monthly_cashflow": monthly_income - monthly_expenses
        }
    
    async def _simulate_purchase(
        self,
        parameters: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Simulate major purchase impact
        Parameters: amount, payment_plan (cash/financed), months
        """
        amount = parameters.get("amount", 0)
        payment_plan = parameters.get("payment_plan", "cash")
        months = parameters.get("months", 12)
        interest_rate = parameters.get("interest_rate", 5.0) / 100
        
        timeline = []
        current_balance = context["total_assets"]
        monthly_payment = 0
        
        if payment_plan == "cash":
            # One-time payment
            current_balance -= amount
            monthly_payment = 0
        else:
            # Financed - calculate monthly payment
            if interest_rate > 0:
                monthly_payment = amount * (interest_rate / 12) * (1 + interest_rate / 12) ** months / \
                                  ((1 + interest_rate / 12) ** months - 1)
            else:
                monthly_payment = amount / months
        
        # Project future months
        for month in range(months + 1):
            if payment_plan == "financed" and month > 0:
                current_balance += context["monthly_cashflow"] - monthly_payment
            else:
                current_balance += context["monthly_cashflow"]
            
            timeline.append({
                "month": month,
                "balance": round(current_balance, 2),
                "monthly_payment": round(monthly_payment, 2),
                "cumulative_cost": round(monthly_payment * month, 2) if payment_plan == "financed" else amount
            })
        
        total_cost = amount if payment_plan == "cash" else monthly_payment * months
        
        return {
            "summary": {
                "purchase_amount": amount,
                "payment_plan": payment_plan,
                "monthly_payment": round(monthly_payment, 2),
                "total_cost": round(total_cost, 2),
                "interest_paid": round(total_cost - amount, 2),
                "final_balance": round(current_balance, 2)
            },
            "timeline": timeline,
            "recommendations": self._generate_purchase_recommendations(
                amount, current_balance, context
            )
        }
    
    async def _simulate_loan(
        self,
        parameters: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Simulate loan repayment strategies
        Parameters: principal, interest_rate, term_months, extra_payment
        """
        principal = parameters.get("principal", 0)
        annual_rate = parameters.get("interest_rate", 5.0) / 100
        term_months = parameters.get("term_months", 60)
        extra_payment = parameters.get("extra_payment", 0)
        
        monthly_rate = annual_rate / 12
        
        # Calculate standard monthly payment
        if monthly_rate > 0:
            base_payment = principal * monthly_rate * (1 + monthly_rate) ** term_months / \
                          ((1 + monthly_rate) ** term_months - 1)
        else:
            base_payment = principal / term_months
        
        total_payment = base_payment + extra_payment
        
        # Amortization schedule
        balance = principal
        timeline = []
        total_interest = 0
        month = 0
        
        while balance > 0 and month < term_months:
            interest_payment = balance * monthly_rate
            principal_payment = min(total_payment - interest_payment, balance)
            balance -= principal_payment
            total_interest += interest_payment
            month += 1
            
            timeline.append({
                "month": month,
                "balance": round(max(balance, 0), 2),
                "principal_payment": round(principal_payment, 2),
                "interest_payment": round(interest_payment, 2),
                "total_payment": round(principal_payment + interest_payment, 2)
            })
        
        months_saved = term_months - month
        interest_saved = (base_payment * term_months - principal) - total_interest
        
        return {
            "summary": {
                "original_principal": principal,
                "monthly_payment": round(total_payment, 2),
                "total_interest": round(total_interest, 2),
                "total_paid": round(principal + total_interest, 2),
                "months_to_payoff": month,
                "months_saved": months_saved,
                "interest_saved": round(max(interest_saved, 0), 2)
            },
            "timeline": timeline,
            "recommendations": self._generate_loan_recommendations(
                principal, total_payment, context
            )
        }
    
    async def _simulate_career_change(
        self,
        parameters: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Simulate career change income impact
        Parameters: current_income, new_income, transition_months
        """
        current_income = parameters.get("current_income", context["monthly_income"])
        new_income = parameters.get("new_income", 0)
        transition_months = parameters.get("transition_months", 0)
        
        timeline = []
        cumulative_income = 0
        current_balance = context["total_assets"]
        
        for month in range(25):  # 2 years projection
            if month < transition_months:
                monthly_income = 0  # No income during transition
            else:
                monthly_income = new_income
            
            cumulative_income += monthly_income
            net_change = monthly_income - context["monthly_expenses"]
            current_balance += net_change
            
            timeline.append({
                "month": month,
                "income": round(monthly_income, 2),
                "expenses": round(context["monthly_expenses"], 2),
                "net": round(net_change, 2),
                "balance": round(current_balance, 2),
                "cumulative_income": round(cumulative_income, 2)
            })
        
        income_difference = new_income - current_income
        annual_impact = income_difference * 12
        
        return {
            "summary": {
                "current_monthly_income": round(current_income, 2),
                "new_monthly_income": round(new_income, 2),
                "monthly_difference": round(income_difference, 2),
                "annual_impact": round(annual_impact, 2),
                "transition_cost": round(context["monthly_expenses"] * transition_months, 2),
                "breakeven_month": transition_months + (context["monthly_expenses"] * transition_months) / income_difference if income_difference > 0 else None
            },
            "timeline": timeline,
            "recommendations": self._generate_career_recommendations(
                income_difference, transition_months, context
            )
        }
    
    async def _simulate_investment(
        self,
        parameters: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Simulate investment growth
        Parameters: initial_amount, monthly_contribution, expected_return, years
        """
        initial = parameters.get("initial_amount", 0)
        monthly = parameters.get("monthly_contribution", 0)
        annual_return = parameters.get("expected_return", 7.0) / 100
        years = parameters.get("years", 10)
        
        monthly_return = annual_return / 12
        months = years * 12
        
        timeline = []
        balance = initial
        total_contributed = initial
        
        for month in range(months + 1):
            if month > 0:
                balance = balance * (1 + monthly_return) + monthly
                total_contributed += monthly
            
            timeline.append({
                "month": month,
                "balance": round(balance, 2),
                "contributed": round(total_contributed, 2),
                "earnings": round(balance - total_contributed, 2)
            })
        
        total_earnings = balance - total_contributed
        
        return {
            "summary": {
                "initial_investment": initial,
                "monthly_contribution": monthly,
                "total_contributed": round(total_contributed, 2),
                "final_value": round(balance, 2),
                "total_earnings": round(total_earnings, 2),
                "return_percentage": round((total_earnings / total_contributed * 100), 2) if total_contributed > 0 else 0
            },
            "timeline": timeline,
            "recommendations": self._generate_investment_recommendations(
                balance, annual_return, context
            )
        }
    
    async def _simulate_debt_repayment(
        self,
        parameters: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Simulate debt repayment strategies (snowball vs avalanche)
        Parameters: debts (list), monthly_payment, strategy
        """
        debts = parameters.get("debts", [])
        monthly_payment = parameters.get("monthly_payment", 0)
        strategy = parameters.get("strategy", "avalanche")  # avalanche or snowball
        
        # Sort debts based on strategy
        if strategy == "avalanche":
            # Highest interest rate first
            debts.sort(key=lambda x: x.get("interest_rate", 0), reverse=True)
        else:
            # Lowest balance first (snowball)
            debts.sort(key=lambda x: x.get("balance", 0))
        
        # Simulate repayment
        timeline = []
        remaining_debts = [dict(d) for d in debts]
        month = 0
        total_interest = 0
        
        while any(d["balance"] > 0 for d in remaining_debts) and month < 360:
            month += 1
            remaining_payment = monthly_payment
            
            # Pay minimum on all debts first
            for debt in remaining_debts:
                if debt["balance"] > 0:
                    min_payment = debt.get("min_payment", 0)
                    interest = debt["balance"] * (debt.get("interest_rate", 0) / 100 / 12)
                    total_interest += interest
                    
                    payment = min(min_payment, debt["balance"] + interest, remaining_payment)
                    principal_paid = payment - interest
                    debt["balance"] = max(0, debt["balance"] - principal_paid)
                    remaining_payment -= payment
            
            # Apply extra payment to first debt with balance
            if remaining_payment > 0:
                for debt in remaining_debts:
                    if debt["balance"] > 0:
                        payment = min(remaining_payment, debt["balance"])
                        debt["balance"] -= payment
                        remaining_payment -= payment
                        break
            
            timeline.append({
                "month": month,
                "total_remaining": round(sum(d["balance"] for d in remaining_debts), 2),
                "debts": [{"name": d.get("name"), "balance": round(d["balance"], 2)} for d in remaining_debts]
            })
        
        return {
            "summary": {
                "strategy": strategy,
                "monthly_payment": monthly_payment,
                "months_to_debt_free": month,
                "total_interest_paid": round(total_interest, 2),
                "total_paid": round(sum(d.get("balance", 0) for d in debts) + total_interest, 2)
            },
            "timeline": timeline[:24],  # Return first 2 years
            "recommendations": self._generate_debt_recommendations(month, total_interest, context)
        }
    
    async def _simulate_generic(
        self,
        parameters: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generic simulation for custom scenarios
        """
        return {
            "summary": {
                "message": "Custom simulation",
                "current_net_worth": context["net_worth"]
            },
            "timeline": [],
            "recommendations": ["Configure a specific simulation type for detailed predictions"]
        }
    
    def _generate_purchase_recommendations(
        self,
        amount: float,
        final_balance: float,
        context: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations for purchase simulation"""
        recommendations = []
        
        if final_balance < context["monthly_expenses"] * 3:
            recommendations.append("⚠️ This purchase may deplete your emergency fund. Consider saving more first.")
        
        if amount > context["monthly_income"] * 6:
            recommendations.append("💡 This is a significant purchase. Consider financing options to maintain liquidity.")
        
        recommendations.append("✅ Review your budget to ensure you can maintain savings goals after this purchase.")
        
        return recommendations
    
    def _generate_loan_recommendations(
        self,
        principal: float,
        monthly_payment: float,
        context: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations for loan simulation"""
        recommendations = []
        
        payment_ratio = monthly_payment / context["monthly_income"]
        
        if payment_ratio > 0.3:
            recommendations.append("⚠️ This loan payment exceeds 30% of your monthly income. Consider a longer term or smaller loan.")
        
        recommendations.append("💡 Making extra payments can save significant interest over the loan term.")
        recommendations.append("✅ Set up automatic payments to avoid late fees and maintain good credit.")
        
        return recommendations
    
    def _generate_career_recommendations(
        self,
        income_difference: float,
        transition_months: int,
        context: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations for career change simulation"""
        recommendations = []
        
        if income_difference > 0:
            recommendations.append(f"✅ This career change could increase your annual income by ${income_difference * 12:,.2f}")
        else:
            recommendations.append(f"⚠️ This change reduces income by ${abs(income_difference) * 12:,.2f} annually. Ensure this aligns with your goals.")
        
        if transition_months > 0:
            emergency_fund_needed = context["monthly_expenses"] * transition_months
            recommendations.append(f"💡 Build an emergency fund of ${emergency_fund_needed:,.2f} to cover the transition period.")
        
        return recommendations
    
    def _generate_investment_recommendations(
        self,
        final_value: float,
        return_rate: float,
        context: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations for investment simulation"""
        recommendations = []
        
        recommendations.append(f"✅ Consistent investing can grow your wealth to ${final_value:,.2f}")
        recommendations.append("💡 Diversify across asset classes to manage risk")
        recommendations.append("📈 Consider tax-advantaged accounts (401k, IRA) for additional benefits")
        
        if return_rate > 0.10:
            recommendations.append("⚠️ High expected returns come with higher risk. Ensure your risk tolerance aligns.")
        
        return recommendations
    
    def _generate_debt_recommendations(
        self,
        months: int,
        total_interest: float,
        context: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations for debt repayment simulation"""
        recommendations = []
        
        years = months / 12
        recommendations.append(f"✅ You can be debt-free in {years:.1f} years with consistent payments")
        recommendations.append(f"💰 Total interest paid: ${total_interest:,.2f}")
        
        if months > 60:
            recommendations.append("💡 Consider increasing monthly payment to reduce interest and payoff time")
        
        recommendations.append("📊 Avalanche method (highest interest first) typically saves more money")
        recommendations.append("🎯 Snowball method (lowest balance first) provides psychological wins")
        
        return recommendations

