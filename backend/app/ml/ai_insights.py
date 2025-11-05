"""
AI-Powered Financial Insights and Recommendations
Generates intelligent, context-aware advice based on user's financial situation
"""
from typing import Dict, Any, List
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class AIInsightsEngine:
    """
    Advanced AI engine for generating personalized financial insights
    
    Features:
    - Context-aware recommendations
    - Goal-based advice
    - Risk assessment
    - Behavioral finance insights
    - Action-oriented suggestions
    """
    
    def __init__(self):
        self.insight_categories = [
            "savings",
            "debt",
            "investment",
            "budget",
            "goals",
            "risk",
            "tax",
            "behavioral"
        ]
    
    def generate_comprehensive_insights(
        self,
        user_context: Dict[str, Any],
        simulation_results: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """
        Generate comprehensive AI-powered insights based on user's financial situation
        
        Args:
            user_context: User's financial data (income, expenses, assets, liabilities, etc.)
            simulation_results: Optional simulation results to provide context-specific advice
            
        Returns:
            List of prioritized insights with actionable recommendations
        """
        insights = []
        
        # Extract key metrics
        monthly_income = user_context.get("monthly_income", 0)
        monthly_expenses = user_context.get("monthly_expenses", 0)
        total_assets = user_context.get("total_assets", 0)
        total_liabilities = user_context.get("total_liabilities", 0)
        net_worth = total_assets - total_liabilities
        savings_rate = (monthly_income - monthly_expenses) / monthly_income if monthly_income > 0 else 0
        
        # 1. Emergency Fund Analysis
        emergency_fund_insight = self._analyze_emergency_fund(
            total_assets, monthly_expenses
        )
        if emergency_fund_insight:
            insights.append(emergency_fund_insight)
        
        # 2. Savings Rate Optimization
        savings_insight = self._analyze_savings_rate(
            savings_rate, monthly_income, monthly_expenses
        )
        if savings_insight:
            insights.append(savings_insight)
        
        # 3. Debt Management
        if total_liabilities > 0:
            debt_insight = self._analyze_debt_situation(
                total_liabilities, monthly_income, net_worth
            )
            if debt_insight:
                insights.append(debt_insight)
        
        # 4. Investment Opportunities
        if savings_rate > 0.2:  # If saving more than 20%
            investment_insight = self._suggest_investment_strategies(
                monthly_income, savings_rate, total_assets
            )
            if investment_insight:
                insights.append(investment_insight)
        
        # 5. Tax Optimization
        tax_insight = self._analyze_tax_optimization(
            monthly_income * 12, total_assets
        )
        if tax_insight:
            insights.append(tax_insight)
        
        # 6. Net Worth Growth
        net_worth_insight = self._analyze_net_worth_trajectory(
            net_worth, monthly_income, savings_rate
        )
        if net_worth_insight:
            insights.append(net_worth_insight)
        
        # 7. Behavioral Finance Insights
        behavioral_insight = self._generate_behavioral_insights(
            user_context
        )
        if behavioral_insight:
            insights.append(behavioral_insight)
        
        # 8. Simulation-Specific Insights
        if simulation_results:
            sim_insight = self._analyze_simulation_results(
                simulation_results, user_context
            )
            if sim_insight:
                insights.append(sim_insight)
        
        # Sort by priority
        insights.sort(key=lambda x: x.get("priority", 5))
        
        return insights
    
    def _analyze_emergency_fund(
        self,
        liquid_assets: float,
        monthly_expenses: float
    ) -> Dict[str, Any]:
        """Analyze emergency fund adequacy"""
        if monthly_expenses <= 0:
            return None
        
        months_covered = liquid_assets / monthly_expenses
        target_months = 6
        
        if months_covered >= target_months:
            return {
                "category": "emergency_fund",
                "priority": 5,
                "status": "excellent",
                "title": "✅ Emergency Fund: Well Protected",
                "message": f"You have {months_covered:.1f} months of expenses saved. Excellent financial cushion!",
                "insights": [
                    "Your emergency fund exceeds the recommended 6 months of expenses",
                    "Consider investing excess emergency funds for better returns",
                    "Keep 3-6 months liquid, invest the rest in low-risk assets"
                ],
                "action_items": [
                    f"Move ${(liquid_assets - monthly_expenses * 6):,.0f} to higher-yield investments",
                    "Consider a high-yield savings account or short-term bonds for emergency funds"
                ]
            }
        elif months_covered >= 3:
            return {
                "category": "emergency_fund",
                "priority": 3,
                "status": "good",
                "title": "📊 Emergency Fund: On Track",
                "message": f"You have {months_covered:.1f} months covered. Aim for 6 months to be fully protected.",
                "insights": [
                    f"You're {((months_covered / target_months) * 100):.0f}% of the way to a full emergency fund",
                    "Continue building until you reach 6 months of expenses",
                    "This protects you from job loss, medical emergencies, or unexpected expenses"
                ],
                "action_items": [
                    f"Save an additional ${(monthly_expenses * (target_months - months_covered)):,.0f}",
                    f"Automate ${(monthly_expenses * (target_months - months_covered) / 12):,.0f}/month to emergency fund"
                ]
            }
        else:
            return {
                "category": "emergency_fund",
                "priority": 1,
                "status": "critical",
                "title": "🚨 Emergency Fund: Needs Attention",
                "message": f"Only {months_covered:.1f} months of expenses saved. This is a financial vulnerability.",
                "insights": [
                    "Without adequate emergency savings, unexpected events could force you into debt",
                    "Financial experts recommend 3-6 months of expenses in liquid savings",
                    "This should be your top financial priority before investing"
                ],
                "action_items": [
                    f"Build emergency fund to ${monthly_expenses * 3:,.0f} (3 months) as first goal",
                    f"Automate ${monthly_expenses * 0.2:,.0f}/month to emergency savings",
                    "Cut discretionary spending temporarily to accelerate emergency fund growth"
                ]
            }
    
    def _analyze_savings_rate(
        self,
        savings_rate: float,
        monthly_income: float,
        monthly_expenses: float
    ) -> Dict[str, Any]:
        """Analyze and optimize savings rate"""
        if savings_rate >= 0.30:
            return {
                "category": "savings",
                "priority": 6,
                "status": "excellent",
                "title": "💰 Savings Rate: Outstanding",
                "message": f"You're saving {savings_rate * 100:.0f}% of your income. This is exceptional!",
                "insights": [
                    "Your savings rate puts you in the top 10% of savers",
                    "At this rate, you could achieve financial independence in 20-25 years",
                    "You have significant capacity for wealth building"
                ],
                "action_items": [
                    "Maximize tax-advantaged accounts (401k, IRA, HSA)",
                    "Consider aggressive investment strategies given your high savings capacity",
                    "Explore real estate or business investments for diversification"
                ]
            }
        elif savings_rate >= 0.15:
            return {
                "category": "savings",
                "priority": 4,
                "status": "good",
                "title": "📈 Savings Rate: Solid Foundation",
                "message": f"Saving {savings_rate * 100:.0f}% is above average. You're building wealth steadily.",
                "insights": [
                    "The average American saves only 5-10% of income",
                    "You're on track for comfortable retirement if maintained",
                    "Small increases in savings rate compound significantly over time"
                ],
                "action_items": [
                    f"Challenge: Increase to 20% by saving an extra ${monthly_income * 0.05:,.0f}/month",
                    "Review subscriptions and recurring expenses for optimization",
                    "Automate savings increases with each raise or bonus"
                ]
            }
        elif savings_rate >= 0.05:
            return {
                "category": "savings",
                "priority": 2,
                "status": "needs_improvement",
                "title": "⚠️ Savings Rate: Room for Growth",
                "message": f"Saving {savings_rate * 100:.0f}% is a start, but increasing this should be a priority.",
                "insights": [
                    "Financial experts recommend saving at least 15-20% of income",
                    "At current rate, retirement may require working longer than desired",
                    "Small lifestyle adjustments can significantly boost savings"
                ],
                "action_items": [
                    f"Target: Increase savings by ${monthly_income * 0.10:,.0f}/month (10% more)",
                    "Track spending for one month to identify reduction opportunities",
                    "Implement the 50/30/20 rule: 50% needs, 30% wants, 20% savings"
                ]
            }
        else:
            return {
                "category": "savings",
                "priority": 1,
                "status": "critical",
                "title": "🚨 Savings Rate: Critical Situation",
                "message": f"Saving only {savings_rate * 100:.0f}% puts your financial future at risk.",
                "insights": [
                    "Living paycheck to paycheck creates financial vulnerability",
                    "Without savings, you're one emergency away from debt",
                    "This pattern makes wealth building nearly impossible"
                ],
                "action_items": [
                    "Immediate: Create a detailed budget to understand spending",
                    f"Goal: Save at least ${monthly_income * 0.10:,.0f}/month (10%)",
                    "Consider side income or career advancement to increase earnings",
                    "Eliminate high-interest debt that's consuming income"
                ]
            }
    
    def _analyze_debt_situation(
        self,
        total_debt: float,
        monthly_income: float,
        net_worth: float
    ) -> Dict[str, Any]:
        """Analyze debt and provide payoff strategies"""
        debt_to_income_ratio = total_debt / (monthly_income * 12) if monthly_income > 0 else 0
        
        if debt_to_income_ratio > 3:
            return {
                "category": "debt",
                "priority": 1,
                "status": "critical",
                "title": "🚨 Debt Level: Requires Immediate Action",
                "message": f"Your debt of ${total_debt:,.0f} is {debt_to_income_ratio:.1f}x your annual income.",
                "insights": [
                    "High debt levels severely limit financial flexibility and wealth building",
                    "Interest payments are likely consuming a significant portion of income",
                    "This debt load could take 10+ years to pay off without aggressive action"
                ],
                "action_items": [
                    "Consider debt consolidation to lower interest rates",
                    "Use avalanche method: pay off highest interest debt first",
                    "Explore balance transfer options for credit card debt",
                    "Consider professional debt counseling if feeling overwhelmed"
                ]
            }
        elif debt_to_income_ratio > 1.5:
            return {
                "category": "debt",
                "priority": 2,
                "status": "needs_attention",
                "title": "⚠️ Debt Level: Focus on Reduction",
                "message": f"Debt of ${total_debt:,.0f} is manageable but should be prioritized.",
                "insights": [
                    "Your debt-to-income ratio is higher than ideal",
                    "Accelerating payoff will free up significant cash flow",
                    "Each dollar of debt paid saves future interest payments"
                ],
                "action_items": [
                    "Create a debt payoff plan targeting highest interest rates first",
                    f"Allocate ${monthly_income * 0.15:,.0f}/month extra to debt payoff",
                    "Avoid taking on new debt until current obligations are reduced",
                    "Consider refinancing if interest rates have dropped"
                ]
            }
        else:
            return {
                "category": "debt",
                "priority": 4,
                "status": "manageable",
                "title": "✅ Debt Level: Under Control",
                "message": f"Your debt of ${total_debt:,.0f} is manageable relative to income.",
                "insights": [
                    "Your debt-to-income ratio is within healthy limits",
                    "Focus on maintaining this level while building wealth",
                    "Consider whether accelerated payoff or investing provides better returns"
                ],
                "action_items": [
                    "If debt interest rate > 5%, prioritize payoff over investing",
                    "If debt interest rate < 5%, consider investing extra funds instead",
                    "Maintain excellent payment history to preserve credit score"
                ]
            }
    
    def _suggest_investment_strategies(
        self,
        monthly_income: float,
        savings_rate: float,
        total_assets: float
    ) -> Dict[str, Any]:
        """Suggest appropriate investment strategies"""
        monthly_savings = monthly_income * savings_rate
        
        return {
            "category": "investment",
            "priority": 3,
            "status": "opportunity",
            "title": "📈 Investment Strategy: Growth Opportunities",
            "message": f"With ${monthly_savings:,.0f}/month in savings, you have significant investment capacity.",
            "insights": [
                "Consistent investing is the most reliable path to wealth",
                "Time in the market beats timing the market",
                "Diversification reduces risk while maintaining growth potential",
                "Tax-advantaged accounts should be maximized first"
            ],
            "action_items": [
                "Max out 401(k) match (free money from employer)",
                "Contribute to Roth IRA ($7,000/year limit in 2024)",
                "Consider low-cost index funds (S&P 500, total market)",
                "Maintain 60/40 or 70/30 stock/bond allocation based on age",
                "Rebalance portfolio annually to maintain target allocation"
            ],
            "recommended_allocation": {
                "retirement_accounts": "60%",
                "taxable_brokerage": "25%",
                "real_estate_reits": "10%",
                "emergency_fund": "5%"
            }
        }
    
    def _analyze_tax_optimization(
        self,
        annual_income: float,
        total_assets: float
    ) -> Dict[str, Any]:
        """Provide tax optimization strategies"""
        return {
            "category": "tax",
            "priority": 3,
            "status": "opportunity",
            "title": "💼 Tax Optimization: Keep More of Your Money",
            "message": "Strategic tax planning can save thousands annually.",
            "insights": [
                "Tax-advantaged accounts reduce taxable income immediately",
                "Long-term capital gains taxed at lower rates than ordinary income",
                "Tax-loss harvesting can offset gains and reduce tax burden",
                "HSA is triple tax-advantaged (deductible, grows tax-free, withdraws tax-free for medical)"
            ],
            "action_items": [
                f"Max 401(k) contribution: ${min(23000, annual_income * 0.15):,.0f} (saves ~${min(23000, annual_income * 0.15) * 0.22:,.0f} in taxes)",
                "Open and fund HSA if eligible ($4,150 individual, $8,300 family limit)",
                "Consider traditional IRA for additional $7,000 deduction",
                "Use tax-loss harvesting in taxable accounts to offset gains",
                "Hold investments >1 year for long-term capital gains rates"
            ],
            "estimated_annual_savings": f"${min(annual_income * 0.15, 30000) * 0.22:,.0f}"
        }
    
    def _analyze_net_worth_trajectory(
        self,
        current_net_worth: float,
        monthly_income: float,
        savings_rate: float
    ) -> Dict[str, Any]:
        """Project net worth growth and provide insights"""
        monthly_savings = monthly_income * savings_rate
        annual_savings = monthly_savings * 12
        
        # Project 10-year net worth with 7% return
        years = 10
        future_net_worth = current_net_worth
        for _ in range(years):
            future_net_worth = future_net_worth * 1.07 + annual_savings
        
        return {
            "category": "goals",
            "priority": 5,
            "status": "projection",
            "title": "🎯 Net Worth Trajectory: Your Financial Future",
            "message": f"Current net worth: ${current_net_worth:,.0f}. Projected in 10 years: ${future_net_worth:,.0f}",
            "insights": [
                f"At current savings rate, you'll add ${annual_savings * years:,.0f} over 10 years",
                f"Investment returns could add another ${future_net_worth - current_net_worth - annual_savings * years:,.0f}",
                "Compound growth accelerates over time - stay consistent!",
                "Each 1% increase in savings rate adds significant long-term wealth"
            ],
            "milestones": {
                "5_years": f"${(current_net_worth * (1.07 ** 5) + annual_savings * 5):,.0f}",
                "10_years": f"${future_net_worth:,.0f}",
                "20_years": f"${self._project_net_worth(current_net_worth, annual_savings, 20):,.0f}",
                "30_years": f"${self._project_net_worth(current_net_worth, annual_savings, 30):,.0f}"
            },
            "action_items": [
                "Review and adjust strategy annually",
                "Increase savings rate with each raise",
                "Stay invested through market volatility"
            ]
        }
    
    def _project_net_worth(self, current: float, annual_savings: float, years: int) -> float:
        """Project future net worth with compound growth"""
        future = current
        for _ in range(years):
            future = future * 1.07 + annual_savings
        return future
    
    def _generate_behavioral_insights(
        self,
        user_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate insights based on behavioral finance principles"""
        return {
            "category": "behavioral",
            "priority": 6,
            "status": "wisdom",
            "title": "🧠 Behavioral Finance: Psychology of Money",
            "message": "Understanding your financial psychology is key to long-term success.",
            "insights": [
                "Loss aversion: We feel losses 2x more than equivalent gains. Don't panic sell in downturns.",
                "Present bias: We overvalue immediate rewards vs future benefits. Automate savings to overcome this.",
                "Anchoring: Don't fixate on purchase prices. Focus on future value and fundamentals.",
                "Herd mentality: Popular investments aren't always good investments. Stick to your plan.",
                "Recency bias: Recent events feel more important than they are. Think long-term."
            ],
            "action_items": [
                "Automate investments to remove emotional decisions",
                "Set it and forget it - check portfolio quarterly, not daily",
                "Write down your financial goals and review when tempted to deviate",
                "Celebrate small wins to maintain motivation",
                "Find an accountability partner or financial advisor"
            ]
        }
    
    def _analyze_simulation_results(
        self,
        simulation_results: Dict[str, Any],
        user_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate insights specific to simulation results"""
        summary = simulation_results.get("summary", {})
        
        # Extract relevant metrics
        if "probability_of_success" in summary:
            prob = summary["probability_of_success"]
            
            if prob > 80:
                status = "excellent"
                message = "High probability of success with your current plan!"
            elif prob > 60:
                status = "good"
                message = "Good chance of success. Small adjustments could improve odds."
            else:
                status = "needs_improvement"
                message = "Success is uncertain with current parameters. Consider adjustments."
        else:
            status = "info"
            message = "Simulation complete. Review results carefully."
        
        return {
            "category": "simulation",
            "priority": 2,
            "status": status,
            "title": "🎯 Simulation Analysis: Key Takeaways",
            "message": message,
            "insights": [
                "Simulations show probable outcomes, not guarantees",
                "Market volatility means actual results will vary",
                "Consistency matters more than perfect timing",
                "Regular reviews and adjustments keep you on track"
            ],
            "action_items": [
                "Set calendar reminder to review progress quarterly",
                "Adjust contributions with income changes",
                "Rerun simulation annually with updated data"
            ]
        }

