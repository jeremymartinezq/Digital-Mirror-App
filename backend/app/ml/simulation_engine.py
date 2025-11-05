"""
AI/ML Simulation Engine for financial predictions
Advanced models including Monte Carlo simulations, stochastic processes,
and machine learning for personalized financial predictions
"""
import numpy as np
from typing import Dict, Any, List, Tuple
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging
from scipy import stats
from dataclasses import dataclass

from app.models.simulation import SimulationType
from app.models.account import Account
from app.models.transaction import Transaction

logger = logging.getLogger(__name__)


@dataclass
class SimulationScenario:
    """Container for multiple scenario results"""
    optimistic: Dict[str, Any]
    expected: Dict[str, Any]
    pessimistic: Dict[str, Any]
    confidence_interval_95: Tuple[float, float]
    probability_of_success: float


class SimulationEngine:
    """
    Advanced financial simulation engine with AI/ML predictions
    
    Features:
    - Monte Carlo simulations for probabilistic outcomes
    - Stochastic modeling for market volatility
    - Inflation and tax adjustments
    - Risk analysis and confidence intervals
    - Machine learning for personalized predictions
    - Scenario analysis (best/worst/expected cases)
    """
    
    def __init__(self):
        """Initialize simulation engine"""
        self.prediction_months = 24  # Default prediction horizon
        self.monte_carlo_iterations = 10000  # Simulations for probabilistic analysis
        self.inflation_rate = 0.03  # Default 3% annual inflation
        self.risk_free_rate = 0.04  # Default 4% risk-free rate
        
    def _run_monte_carlo_simulation(
        self,
        initial_value: float,
        monthly_contribution: float,
        expected_return: float,
        volatility: float,
        months: int,
        iterations: int = 1000
    ) -> Dict[str, Any]:
        """
        Run Monte Carlo simulation for investment scenarios
        
        Args:
            initial_value: Starting balance
            monthly_contribution: Regular monthly addition
            expected_return: Annual expected return (e.g., 0.07 for 7%)
            volatility: Annual volatility/standard deviation (e.g., 0.15 for 15%)
            months: Number of months to simulate
            iterations: Number of Monte Carlo iterations
            
        Returns:
            Dictionary with percentile outcomes and statistics
        """
        monthly_return = expected_return / 12
        monthly_volatility = volatility / np.sqrt(12)
        
        final_values = np.zeros(iterations)
        
        for i in range(iterations):
            balance = initial_value
            for month in range(months):
                # Generate random return based on normal distribution
                random_return = np.random.normal(monthly_return, monthly_volatility)
                balance = balance * (1 + random_return) + monthly_contribution
            final_values[i] = balance
        
        # Calculate percentiles and statistics
        return {
            "median": float(np.median(final_values)),
            "mean": float(np.mean(final_values)),
            "std": float(np.std(final_values)),
            "min": float(np.min(final_values)),
            "max": float(np.max(final_values)),
            "percentile_5": float(np.percentile(final_values, 5)),
            "percentile_25": float(np.percentile(final_values, 25)),
            "percentile_75": float(np.percentile(final_values, 75)),
            "percentile_95": float(np.percentile(final_values, 95)),
            "confidence_interval_95": (
                float(np.percentile(final_values, 2.5)),
                float(np.percentile(final_values, 97.5))
            )
        }
    
    def _adjust_for_inflation(self, amount: float, years: float) -> float:
        """Adjust amount for inflation to get real (inflation-adjusted) value"""
        return amount / ((1 + self.inflation_rate) ** years)
    
    def _calculate_tax_adjusted_return(
        self,
        return_rate: float,
        tax_rate: float = 0.15
    ) -> float:
        """Calculate after-tax return rate"""
        return return_rate * (1 - tax_rate)
    
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
        Advanced loan repayment simulation with detailed amortization
        Parameters: principal, interest_rate, term_months, extra_payment, loan_type
        """
        principal = parameters.get("principal", 0)
        annual_rate = parameters.get("interest_rate", 5.0) / 100
        term_months = parameters.get("term_months", 60)
        extra_payment = parameters.get("extra_payment", 0)
        loan_type = parameters.get("loan_type", "standard")  # standard, accelerated, biweekly
        
        monthly_rate = annual_rate / 12
        
        # Calculate standard monthly payment
        if monthly_rate > 0:
            base_payment = principal * monthly_rate * (1 + monthly_rate) ** term_months / \
                          ((1 + monthly_rate) ** term_months - 1)
        else:
            base_payment = principal / term_months
        
        # Standard repayment schedule
        standard_schedule = self._generate_amortization_schedule(
            principal, monthly_rate, base_payment, term_months
        )
        
        # Accelerated repayment with extra payments
        total_payment = base_payment + extra_payment
        accelerated_schedule = self._generate_amortization_schedule(
            principal, monthly_rate, total_payment, term_months
        )
        
        # Calculate biweekly payment advantage
        biweekly_payment = base_payment / 2
        biweekly_schedule = self._simulate_biweekly_payments(
            principal, annual_rate, biweekly_payment, term_months
        )
        
        # Extract key metrics
        standard_total_interest = sum(payment["interest_payment"] for payment in standard_schedule)
        accelerated_total_interest = sum(payment["interest_payment"] for payment in accelerated_schedule)
        months_to_payoff = len(accelerated_schedule)
        months_saved = len(standard_schedule) - months_to_payoff
        interest_saved = standard_total_interest - accelerated_total_interest
        
        # Calculate debt-to-income ratio
        monthly_income = context.get("monthly_income", 0)
        debt_to_income = (total_payment / monthly_income * 100) if monthly_income > 0 else 0
        
        # Calculate opportunity cost
        opportunity_cost = self._calculate_opportunity_cost(
            extra_payment, months_to_payoff, 0.07  # Assume 7% alternative investment return
        )
        
        return {
            "summary": {
                "original_principal": principal,
                "base_monthly_payment": round(base_payment, 2),
                "accelerated_payment": round(total_payment, 2),
                "extra_payment": round(extra_payment, 2),
                "total_interest_standard": round(standard_total_interest, 2),
                "total_interest_accelerated": round(accelerated_total_interest, 2),
                "interest_saved": round(interest_saved, 2),
                "total_paid": round(principal + accelerated_total_interest, 2),
                "months_to_payoff": months_to_payoff,
                "months_saved": months_saved,
                "years_saved": round(months_saved / 12, 1),
                "debt_to_income_ratio": round(debt_to_income, 1),
                "apr": round(annual_rate * 100, 2)
            },
            "amortization": {
                "standard": standard_schedule[:24],  # First 2 years
                "accelerated": accelerated_schedule[:24],
                "biweekly_total_interest": round(biweekly_schedule["total_interest"], 2),
                "biweekly_months_saved": biweekly_schedule["months_saved"]
            },
            "analysis": {
                "interest_savings_percentage": round((interest_saved / standard_total_interest * 100), 1) if standard_total_interest > 0 else 0,
                "time_savings_percentage": round((months_saved / len(standard_schedule) * 100), 1) if len(standard_schedule) > 0 else 0,
                "opportunity_cost": round(opportunity_cost, 2),
                "net_benefit": round(interest_saved - opportunity_cost, 2),
                "breakeven_return": round(self._calculate_breakeven_return(interest_saved, extra_payment, months_to_payoff) * 100, 2)
            },
            "timeline": accelerated_schedule,
            "recommendations": self._generate_advanced_loan_recommendations(
                principal, total_payment, debt_to_income, interest_saved, context
            )
        }
    
    def _generate_amortization_schedule(
        self,
        principal: float,
        monthly_rate: float,
        monthly_payment: float,
        max_months: int
    ) -> List[Dict[str, float]]:
        """Generate detailed amortization schedule"""
        schedule = []
        balance = principal
        month = 0
        
        while balance > 0.01 and month < max_months:
            interest_payment = balance * monthly_rate
            principal_payment = min(monthly_payment - interest_payment, balance)
            
            if principal_payment <= 0:
                # Payment is too low
                break
                
            balance -= principal_payment
            month += 1
            
            schedule.append({
                "month": month,
                "payment": round(monthly_payment, 2),
                "principal_payment": round(principal_payment, 2),
                "interest_payment": round(interest_payment, 2),
                "balance": round(max(balance, 0), 2),
                "cumulative_interest": round(sum(p["interest_payment"] for p in schedule) + interest_payment, 2),
                "cumulative_principal": round(principal - balance, 2)
            })
        
        return schedule
    
    def _simulate_biweekly_payments(
        self,
        principal: float,
        annual_rate: float,
        biweekly_payment: float,
        max_months: int
    ) -> Dict[str, Any]:
        """Simulate biweekly payment schedule (26 payments/year = 13 monthly payments)"""
        balance = principal
        total_interest = 0
        periods = 0
        max_periods = max_months * 2.17  # ~26 biweekly periods per year
        
        biweekly_rate = annual_rate / 26
        
        while balance > 0 and periods < max_periods:
            interest = balance * biweekly_rate
            principal_payment = min(biweekly_payment - interest, balance)
            balance -= principal_payment
            total_interest += interest
            periods += 1
        
        months = periods / 2.17
        standard_months = max_months
        
        return {
            "total_interest": total_interest,
            "months_to_payoff": round(months, 0),
            "months_saved": round(standard_months - months, 0)
        }
    
    def _calculate_opportunity_cost(
        self,
        extra_payment: float,
        months: int,
        alternative_return: float
    ) -> float:
        """Calculate what extra payments could have earned if invested instead"""
        if extra_payment <= 0:
            return 0
            
        monthly_return = alternative_return / 12
        future_value = 0
        
        for _ in range(months):
            future_value = (future_value + extra_payment) * (1 + monthly_return)
        
        return future_value - (extra_payment * months)
    
    def _calculate_breakeven_return(
        self,
        interest_saved: float,
        extra_payment: float,
        months: int
    ) -> float:
        """Calculate the investment return needed to match loan payoff benefits"""
        if extra_payment <= 0 or months <= 0:
            return 0
            
        total_extra_payments = extra_payment * months
        if total_extra_payments <= 0:
            return 0
            
        # Simple approximation of breakeven return
        return (interest_saved / total_extra_payments) * (12 / months)
    
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
        Advanced investment simulation with Monte Carlo analysis
        Parameters: initial_amount, monthly_contribution, expected_return, years, volatility, tax_rate
        """
        initial = parameters.get("initial_amount", 0)
        monthly = parameters.get("monthly_contribution", 0)
        annual_return = parameters.get("expected_return", 7.0) / 100
        years = parameters.get("years", 10)
        volatility = parameters.get("volatility", 15.0) / 100  # Default 15% volatility
        tax_rate = parameters.get("tax_rate", 15.0) / 100  # Capital gains tax
        
        monthly_return = annual_return / 12
        months = years * 12
        
        # Deterministic timeline (expected case)
        timeline = []
        balance = initial
        total_contributed = initial
        
        for month in range(months + 1):
            if month > 0:
                balance = balance * (1 + monthly_return) + monthly
                total_contributed += monthly
            
            # Calculate real value (inflation-adjusted)
            real_value = self._adjust_for_inflation(balance, month / 12)
            
            timeline.append({
                "month": month,
                "balance": round(balance, 2),
                "real_value": round(real_value, 2),
                "contributed": round(total_contributed, 2),
                "earnings": round(balance - total_contributed, 2)
            })
        
        total_earnings = balance - total_contributed
        
        # Run Monte Carlo simulation for probabilistic outcomes
        mc_results = self._run_monte_carlo_simulation(
            initial_value=initial,
            monthly_contribution=monthly,
            expected_return=annual_return,
            volatility=volatility,
            months=months,
            iterations=1000
        )
        
        # Calculate after-tax values
        after_tax_earnings = total_earnings * (1 - tax_rate)
        after_tax_final = total_contributed + after_tax_earnings
        
        # Calculate Sharpe ratio (risk-adjusted return)
        excess_return = annual_return - self.risk_free_rate
        sharpe_ratio = excess_return / volatility if volatility > 0 else 0
        
        # Probability of reaching various goals
        probability_double = self._calculate_probability_of_goal(
            initial, monthly, annual_return, volatility, months, total_contributed * 2
        )
        
        return {
            "summary": {
                "initial_investment": initial,
                "monthly_contribution": monthly,
                "total_contributed": round(total_contributed, 2),
                "expected_value": round(balance, 2),
                "real_value": round(self._adjust_for_inflation(balance, years), 2),
                "after_tax_value": round(after_tax_final, 2),
                "total_earnings": round(total_earnings, 2),
                "after_tax_earnings": round(after_tax_earnings, 2),
                "return_percentage": round((total_earnings / total_contributed * 100), 2) if total_contributed > 0 else 0,
                "sharpe_ratio": round(sharpe_ratio, 3),
                "volatility": round(volatility * 100, 2)
            },
            "monte_carlo": {
                "median_outcome": round(mc_results["median"], 2),
                "mean_outcome": round(mc_results["mean"], 2),
                "best_case_5pct": round(mc_results["percentile_95"], 2),
                "worst_case_5pct": round(mc_results["percentile_5"], 2),
                "confidence_interval_95": (
                    round(mc_results["confidence_interval_95"][0], 2),
                    round(mc_results["confidence_interval_95"][1], 2)
                ),
                "probability_of_doubling": round(probability_double * 100, 1)
            },
            "scenarios": {
                "optimistic": {
                    "description": "95th percentile outcome",
                    "final_value": round(mc_results["percentile_95"], 2),
                    "total_return": round(((mc_results["percentile_95"] / total_contributed) - 1) * 100, 1)
                },
                "expected": {
                    "description": "Median outcome (50th percentile)",
                    "final_value": round(mc_results["median"], 2),
                    "total_return": round(((mc_results["median"] / total_contributed) - 1) * 100, 1)
                },
                "pessimistic": {
                    "description": "5th percentile outcome",
                    "final_value": round(mc_results["percentile_5"], 2),
                    "total_return": round(((mc_results["percentile_5"] / total_contributed) - 1) * 100, 1)
                }
            },
            "timeline": timeline,
            "recommendations": self._generate_advanced_investment_recommendations(
                balance, annual_return, volatility, sharpe_ratio, context
            )
        }
    
    def _calculate_probability_of_goal(
        self,
        initial: float,
        monthly: float,
        annual_return: float,
        volatility: float,
        months: int,
        goal: float
    ) -> float:
        """Calculate probability of reaching a financial goal using Monte Carlo"""
        iterations = 1000
        successes = 0
        
        monthly_return = annual_return / 12
        monthly_volatility = volatility / np.sqrt(12)
        
        for _ in range(iterations):
            balance = initial
            for _ in range(months):
                random_return = np.random.normal(monthly_return, monthly_volatility)
                balance = balance * (1 + random_return) + monthly
            if balance >= goal:
                successes += 1
        
        return successes / iterations
    
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
        """Generate basic recommendations for loan simulation"""
        recommendations = []
        
        payment_ratio = monthly_payment / context["monthly_income"] if context["monthly_income"] > 0 else 0
        
        if payment_ratio > 0.3:
            recommendations.append("⚠️ This loan payment exceeds 30% of your monthly income. Consider a longer term or smaller loan.")
        
        recommendations.append("💡 Making extra payments can save significant interest over the loan term.")
        recommendations.append("✅ Set up automatic payments to avoid late fees and maintain good credit.")
        
        return recommendations
    
    def _generate_advanced_loan_recommendations(
        self,
        principal: float,
        monthly_payment: float,
        debt_to_income: float,
        interest_saved: float,
        context: Dict[str, Any]
    ) -> List[str]:
        """Generate advanced AI-powered loan recommendations"""
        recommendations = []
        
        # Debt-to-income analysis
        if debt_to_income > 43:
            recommendations.append(f"🚨 Critical: Your debt-to-income ratio is {debt_to_income:.1f}%, exceeding the 43% threshold. This may affect loan approvals.")
            recommendations.append("💡 Focus on paying down this debt before taking on additional obligations.")
        elif debt_to_income > 30:
            recommendations.append(f"⚠️ Your debt-to-income ratio is {debt_to_income:.1f}%. Aim to keep it below 30% for financial flexibility.")
        else:
            recommendations.append(f"✅ Excellent: Your debt-to-income ratio is {debt_to_income:.1f}%, well within healthy limits.")
        
        # Extra payment benefits
        if interest_saved > 1000:
            recommendations.append(f"💰 Extra payments save you ${interest_saved:,.0f} in interest. Even small extra payments make a big difference!")
            recommendations.append("🎯 Consider rounding up payments or adding windfalls (tax refunds, bonuses) to principal.")
        
        # Payment strategies
        recommendations.append("📅 Biweekly payments (26 per year vs 12 monthly) create an extra payment annually, reducing loan term significantly.")
        recommendations.append("💡 Refinancing may lower your rate if market rates have dropped or your credit has improved.")
        
        # Opportunity cost consideration
        monthly_income = context.get("monthly_income", 0)
        if monthly_payment / monthly_income < 0.15 if monthly_income > 0 else False:
            recommendations.append("📈 With your low payment-to-income ratio, consider investing extra funds instead of accelerating payoff.")
            recommendations.append("🎯 If your loan rate is below 5%, investing extra money may yield better long-term returns.")
        
        # Credit score impact
        recommendations.append("📊 Consistent on-time payments improve your credit score, potentially qualifying you for better rates in the future.")
        recommendations.append("✅ Set up autopay to never miss a payment and maintain excellent credit history.")
        
        # Tax considerations
        if principal > 100000:
            recommendations.append("🏠 If this is a mortgage, remember that interest may be tax-deductible, effectively lowering your cost.")
        
        # Accelerated payoff strategy
        recommendations.append("⚡ Apply raises, bonuses, or tax refunds directly to principal for maximum interest savings.")
        recommendations.append("🔍 Review your loan annually—refinancing opportunities or extra payment strategies may have changed.")
        
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
        """Generate basic recommendations for investment simulation"""
        recommendations = []
        
        recommendations.append(f"✅ Consistent investing can grow your wealth to ${final_value:,.2f}")
        recommendations.append("💡 Diversify across asset classes to manage risk")
        recommendations.append("📈 Consider tax-advantaged accounts (401k, IRA) for additional benefits")
        
        if return_rate > 0.10:
            recommendations.append("⚠️ High expected returns come with higher risk. Ensure your risk tolerance aligns.")
        
        return recommendations
    
    def _generate_advanced_investment_recommendations(
        self,
        expected_value: float,
        return_rate: float,
        volatility: float,
        sharpe_ratio: float,
        context: Dict[str, Any]
    ) -> List[str]:
        """Generate advanced AI-powered recommendations with risk analysis"""
        recommendations = []
        
        # Risk assessment
        if sharpe_ratio > 1.0:
            recommendations.append(f"✅ Excellent risk-adjusted returns (Sharpe Ratio: {sharpe_ratio:.2f}). This is a strong investment strategy.")
        elif sharpe_ratio > 0.5:
            recommendations.append(f"📊 Good risk-adjusted returns (Sharpe Ratio: {sharpe_ratio:.2f}). Consider maintaining this allocation.")
        else:
            recommendations.append(f"⚠️ Low risk-adjusted returns (Sharpe Ratio: {sharpe_ratio:.2f}). Consider strategies to improve returns or reduce volatility.")
        
        # Volatility guidance
        if volatility > 0.20:
            recommendations.append(f"🎢 High volatility ({volatility*100:.1f}%) detected. Consider diversifying into bonds or lower-risk assets.")
            recommendations.append("💡 Dollar-cost averaging (regular contributions) helps smooth out volatility over time.")
        elif volatility < 0.10:
            recommendations.append(f"🛡️ Low volatility ({volatility*100:.1f}%). You might consider increasing equity allocation for higher growth potential.")
        
        # Tax optimization
        recommendations.append("💰 Tax-loss harvesting can reduce your tax burden in taxable accounts.")
        recommendations.append("🎯 Max out tax-advantaged accounts (401k: $23,000, IRA: $7,000 in 2024) to keep more of your gains.")
        
        # Rebalancing
        recommendations.append("⚖️ Rebalance your portfolio annually to maintain target asset allocation and manage risk.")
        
        # Inflation protection
        recommendations.append(f"📉 With {self.inflation_rate*100:.1f}% inflation, your real purchasing power grows at {(return_rate - self.inflation_rate)*100:.1f}%.")
        recommendations.append("🏠 Consider inflation-protected securities (TIPS) or real assets for additional protection.")
        
        # Behavioral finance
        recommendations.append("🧠 Stay the course during market downturns. Historically, markets recover and reward patient investors.")
        recommendations.append("📅 Review and adjust your strategy annually, but avoid making emotional decisions based on short-term market movements.")
        
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

