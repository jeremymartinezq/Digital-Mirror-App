"""
Machine Learning Models for Personalized Financial Predictions
Uses historical user data to train models for better forecasting
"""
import numpy as np
from typing import Dict, Any, List, Tuple
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import logging

logger = logging.getLogger(__name__)


class PersonalizedPredictionEngine:
    """
    Machine learning engine for personalized financial predictions
    
    Features:
    - Income prediction based on historical patterns
    - Expense forecasting with seasonality
    - Savings rate optimization
    - Cash flow predictions
    - Anomaly detection for unusual transactions
    """
    
    def __init__(self):
        self.income_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        self.expense_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.savings_model = Ridge(alpha=1.0)
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def train_from_user_data(
        self,
        transactions: List[Dict[str, Any]],
        accounts: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Train models on user's historical financial data
        
        Args:
            transactions: List of user transactions with date, amount, category
            accounts: List of user accounts with balances over time
            
        Returns:
            Training metrics and model performance
        """
        if len(transactions) < 30:
            logger.warning("Insufficient data for training. Need at least 30 transactions.")
            return {
                "status": "insufficient_data",
                "message": "Need more transaction history for personalized predictions"
            }
        
        try:
            # Prepare features from transactions
            features, income_targets, expense_targets = self._prepare_features(transactions)
            
            if len(features) < 10:
                return {
                    "status": "insufficient_data",
                    "message": "Need more data points for training"
                }
            
            # Split data for training (use 80% for training)
            split_idx = int(len(features) * 0.8)
            X_train = features[:split_idx]
            y_income_train = income_targets[:split_idx]
            y_expense_train = expense_targets[:split_idx]
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            
            # Train models
            self.income_model.fit(X_train_scaled, y_income_train)
            self.expense_model.fit(X_train_scaled, y_expense_train)
            
            # Calculate training metrics
            income_score = self.income_model.score(X_train_scaled, y_income_train)
            expense_score = self.expense_model.score(X_train_scaled, y_expense_train)
            
            self.is_trained = True
            
            return {
                "status": "success",
                "income_model_r2": round(income_score, 3),
                "expense_model_r2": round(expense_score, 3),
                "training_samples": len(X_train),
                "message": "Models trained successfully on your financial history"
            }
            
        except Exception as e:
            logger.error(f"Error training models: {str(e)}")
            return {
                "status": "error",
                "message": f"Training failed: {str(e)}"
            }
    
    def _prepare_features(
        self,
        transactions: List[Dict[str, Any]]
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Extract features from transaction data for ML models
        
        Features include:
        - Day of month
        - Month of year
        - Day of week
        - Rolling averages
        - Trend indicators
        """
        # Sort transactions by date
        sorted_trans = sorted(transactions, key=lambda x: x.get('date', datetime.now()))
        
        features = []
        income_targets = []
        expense_targets = []
        
        # Group by month for aggregation
        monthly_data = {}
        for trans in sorted_trans:
            date = trans.get('date', datetime.now())
            if isinstance(date, str):
                date = datetime.fromisoformat(date.replace('Z', '+00:00'))
            
            month_key = (date.year, date.month)
            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    'income': 0,
                    'expenses': 0,
                    'transactions': 0,
                    'date': date
                }
            
            amount = trans.get('amount', 0)
            if amount > 0:
                monthly_data[month_key]['income'] += amount
            else:
                monthly_data[month_key]['expenses'] += abs(amount)
            monthly_data[month_key]['transactions'] += 1
        
        # Convert to feature vectors
        months = sorted(monthly_data.keys())
        for i, month_key in enumerate(months):
            data = monthly_data[month_key]
            date = data['date']
            
            # Time-based features
            month_of_year = date.month
            day_of_week = date.weekday()
            
            # Historical averages (if enough data)
            if i >= 3:
                prev_3_income = np.mean([monthly_data[months[j]]['income'] for j in range(i-3, i)])
                prev_3_expenses = np.mean([monthly_data[months[j]]['expenses'] for j in range(i-3, i)])
            else:
                prev_3_income = data['income']
                prev_3_expenses = data['expenses']
            
            # Trend indicator
            if i >= 6:
                income_trend = (data['income'] - monthly_data[months[i-6]]['income']) / 6
                expense_trend = (data['expenses'] - monthly_data[months[i-6]]['expenses']) / 6
            else:
                income_trend = 0
                expense_trend = 0
            
            feature_vector = [
                month_of_year,
                day_of_week,
                prev_3_income,
                prev_3_expenses,
                income_trend,
                expense_trend,
                data['transactions']
            ]
            
            features.append(feature_vector)
            income_targets.append(data['income'])
            expense_targets.append(data['expenses'])
        
        return (
            np.array(features),
            np.array(income_targets),
            np.array(expense_targets)
        )
    
    def predict_future_cashflow(
        self,
        months_ahead: int = 12,
        current_month: int = None
    ) -> Dict[str, Any]:
        """
        Predict future income and expenses using trained models
        
        Args:
            months_ahead: Number of months to predict
            current_month: Current month (1-12), defaults to current
            
        Returns:
            Predictions with confidence intervals
        """
        if not self.is_trained:
            return {
                "status": "not_trained",
                "message": "Models need to be trained first",
                "predictions": []
            }
        
        if current_month is None:
            current_month = datetime.now().month
        
        predictions = []
        
        for i in range(months_ahead):
            month = ((current_month - 1 + i) % 12) + 1
            
            # Create feature vector for prediction
            # Use average values for historical features (simplified)
            feature_vector = np.array([[
                month,
                0,  # day of week (average)
                0,  # prev_3_income (will use running average)
                0,  # prev_3_expenses
                0,  # income_trend
                0,  # expense_trend
                20  # average transactions per month
            ]])
            
            # Scale features
            feature_scaled = self.scaler.transform(feature_vector)
            
            # Predict
            income_pred = self.income_model.predict(feature_scaled)[0]
            expense_pred = self.expense_model.predict(feature_scaled)[0]
            
            # Add uncertainty (simplified confidence interval)
            income_std = income_pred * 0.15  # 15% uncertainty
            expense_std = expense_pred * 0.10  # 10% uncertainty
            
            predictions.append({
                "month": i + 1,
                "month_name": datetime(2024, month, 1).strftime("%B"),
                "predicted_income": round(income_pred, 2),
                "predicted_expenses": round(expense_pred, 2),
                "predicted_savings": round(income_pred - expense_pred, 2),
                "income_confidence_low": round(income_pred - 1.96 * income_std, 2),
                "income_confidence_high": round(income_pred + 1.96 * income_std, 2),
                "expense_confidence_low": round(expense_pred - 1.96 * expense_std, 2),
                "expense_confidence_high": round(expense_pred + 1.96 * expense_std, 2)
            })
        
        return {
            "status": "success",
            "predictions": predictions,
            "model_confidence": "moderate" if len(predictions) > 0 else "low"
        }
    
    def detect_anomalies(
        self,
        transactions: List[Dict[str, Any]],
        threshold: float = 2.5
    ) -> List[Dict[str, Any]]:
        """
        Detect unusual transactions that deviate from normal patterns
        
        Args:
            transactions: List of transactions to analyze
            threshold: Number of standard deviations for anomaly detection
            
        Returns:
            List of anomalous transactions with explanations
        """
        if len(transactions) < 10:
            return []
        
        # Extract amounts
        amounts = [abs(t.get('amount', 0)) for t in transactions]
        
        # Calculate statistics
        mean_amount = np.mean(amounts)
        std_amount = np.std(amounts)
        
        anomalies = []
        for trans in transactions:
            amount = abs(trans.get('amount', 0))
            z_score = (amount - mean_amount) / std_amount if std_amount > 0 else 0
            
            if abs(z_score) > threshold:
                anomalies.append({
                    "transaction": trans,
                    "z_score": round(z_score, 2),
                    "deviation": round((amount - mean_amount) / mean_amount * 100, 1),
                    "explanation": f"This transaction is {abs(z_score):.1f}x standard deviations from your average",
                    "severity": "high" if abs(z_score) > 3 else "moderate"
                })
        
        return anomalies
    
    def optimize_savings_rate(
        self,
        current_income: float,
        current_expenses: float,
        savings_goal: float,
        months_to_goal: int
    ) -> Dict[str, Any]:
        """
        Calculate optimal savings rate to reach goal
        
        Args:
            current_income: Monthly income
            current_expenses: Monthly expenses
            savings_goal: Target savings amount
            months_to_goal: Time horizon in months
            
        Returns:
            Optimization recommendations
        """
        current_savings_rate = (current_income - current_expenses) / current_income if current_income > 0 else 0
        required_monthly_savings = savings_goal / months_to_goal if months_to_goal > 0 else savings_goal
        required_savings_rate = required_monthly_savings / current_income if current_income > 0 else 1
        
        # Calculate expense categories that could be reduced
        discretionary_estimate = current_expenses * 0.30  # Assume 30% is discretionary
        
        recommendations = []
        
        if required_savings_rate > current_savings_rate:
            gap = required_savings_rate - current_savings_rate
            gap_amount = gap * current_income
            
            recommendations.append({
                "type": "increase_savings",
                "message": f"You need to save an additional ${gap_amount:.2f}/month to reach your goal",
                "current_rate": f"{current_savings_rate * 100:.1f}%",
                "required_rate": f"{required_savings_rate * 100:.1f}%"
            })
            
            if gap_amount <= discretionary_estimate:
                recommendations.append({
                    "type": "reduce_discretionary",
                    "message": f"Reducing discretionary spending by ${gap_amount:.2f}/month could help you reach your goal",
                    "feasibility": "achievable"
                })
            else:
                recommendations.append({
                    "type": "increase_income",
                    "message": "Consider ways to increase income, as expense reduction alone may not be sufficient",
                    "feasibility": "challenging"
                })
        else:
            recommendations.append({
                "type": "on_track",
                "message": f"You're on track! Your current savings rate of {current_savings_rate * 100:.1f}% is sufficient",
                "extra_capacity": f"${(current_savings_rate - required_savings_rate) * current_income:.2f}/month"
            })
        
        return {
            "current_savings_rate": round(current_savings_rate * 100, 1),
            "required_savings_rate": round(required_savings_rate * 100, 1),
            "monthly_savings_needed": round(required_monthly_savings, 2),
            "current_monthly_savings": round(current_income - current_expenses, 2),
            "gap": round((required_savings_rate - current_savings_rate) * current_income, 2),
            "recommendations": recommendations,
            "difficulty": "easy" if required_savings_rate < 0.3 else "moderate" if required_savings_rate < 0.5 else "challenging"
        }
    
    def predict_goal_achievement(
        self,
        current_balance: float,
        monthly_contribution: float,
        goal_amount: float,
        expected_return: float = 0.07,
        volatility: float = 0.15
    ) -> Dict[str, Any]:
        """
        Use ML to predict probability of achieving financial goal
        
        Args:
            current_balance: Starting balance
            monthly_contribution: Regular monthly addition
            goal_amount: Target amount
            expected_return: Annual expected return
            volatility: Annual volatility
            
        Returns:
            Probability analysis and timeline predictions
        """
        # Monte Carlo simulation for probability
        iterations = 1000
        monthly_return = expected_return / 12
        monthly_volatility = volatility / np.sqrt(12)
        
        # Estimate months needed (deterministic)
        if monthly_return > 0:
            # Use compound interest formula
            if current_balance > 0:
                months_estimate = np.log((goal_amount * monthly_return + monthly_contribution) / 
                                        (current_balance * monthly_return + monthly_contribution)) / np.log(1 + monthly_return)
            else:
                months_estimate = goal_amount / monthly_contribution if monthly_contribution > 0 else float('inf')
        else:
            months_estimate = (goal_amount - current_balance) / monthly_contribution if monthly_contribution > 0 else float('inf')
        
        if not np.isfinite(months_estimate) or months_estimate < 0:
            months_estimate = 120  # Default to 10 years
        
        months_estimate = int(min(months_estimate, 600))  # Cap at 50 years
        
        # Run Monte Carlo
        successes = 0
        times_to_goal = []
        
        for _ in range(iterations):
            balance = current_balance
            for month in range(months_estimate + 60):  # Add buffer
                random_return = np.random.normal(monthly_return, monthly_volatility)
                balance = balance * (1 + random_return) + monthly_contribution
                
                if balance >= goal_amount:
                    times_to_goal.append(month)
                    successes += 1
                    break
        
        probability = successes / iterations
        
        # Calculate percentiles of time to goal
        if len(times_to_goal) > 0:
            median_months = int(np.median(times_to_goal))
            percentile_25 = int(np.percentile(times_to_goal, 25))
            percentile_75 = int(np.percentile(times_to_goal, 75))
        else:
            median_months = int(months_estimate)
            percentile_25 = int(months_estimate * 0.8)
            percentile_75 = int(months_estimate * 1.2)
        
        return {
            "probability_of_success": round(probability * 100, 1),
            "expected_months": median_months,
            "best_case_months": percentile_25,
            "worst_case_months": percentile_75,
            "confidence": "high" if probability > 0.8 else "moderate" if probability > 0.5 else "low",
            "recommendation": self._get_goal_recommendation(probability, monthly_contribution, goal_amount)
        }
    
    def _get_goal_recommendation(
        self,
        probability: float,
        monthly_contribution: float,
        goal_amount: float
    ) -> str:
        """Generate recommendation based on goal achievement probability"""
        if probability > 0.9:
            return "Excellent! You're very likely to achieve this goal with your current plan."
        elif probability > 0.7:
            return "Good probability of success. Stay consistent with your contributions."
        elif probability > 0.5:
            return f"Moderate chance of success. Consider increasing monthly contributions by ${(goal_amount * 0.1):.0f} to improve odds."
        else:
            return f"Low probability with current plan. Recommend increasing contributions by ${(goal_amount * 0.2):.0f}/month or extending timeline."

