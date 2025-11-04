# API Documentation - Digital Mirror

Complete REST API documentation for the Digital Mirror platform.

## Base URL

```
Development: http://localhost:8000
Production: https://api.digitalmirror.app
```

## Interactive Documentation

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI Schema**: http://localhost:8000/api/openapi.json

## Authentication

Digital Mirror uses JWT (JSON Web Token) authentication.

### Get Token

**POST** `/api/auth/login`

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=johndoe&password=secret123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Use Token

Include token in Authorization header:

```bash
Authorization: Bearer <your-access-token>
```

## Endpoints

### Authentication

#### Register User

**POST** `/api/auth/register`

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "secure123",
  "full_name": "John Doe"
}
```

Response: `201 Created`
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "role": "basic",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Login

**POST** `/api/auth/login`

Form data:
- `username`: string (email or username)
- `password`: string

Response: `200 OK`
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

#### Get Current User

**GET** `/api/auth/me`

Headers: `Authorization: Bearer <token>`

Response: `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "role": "basic",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Bank Accounts

#### Link Account (Plaid)

**POST** `/api/accounts/plaid/link`

```json
{
  "public_token": "public-sandbox-abc123"
}
```

Response: `200 OK`
```json
{
  "message": "Accounts linked successfully",
  "accounts_count": 3
}
```

#### Get Accounts

**GET** `/api/accounts/`

Response: `200 OK`
```json
[
  {
    "id": 1,
    "account_name": "Checking Account",
    "account_type": "checking",
    "institution_name": "Chase Bank",
    "current_balance": 5432.10,
    "available_balance": 5432.10,
    "currency": "USD",
    "is_active": true,
    "last_synced": "2024-01-15T10:30:00Z"
  }
]
```

#### Calculate Net Worth

**GET** `/api/accounts/networth/calculate`

Response: `200 OK`
```json
{
  "total_assets": 150000.00,
  "total_liabilities": 50000.00,
  "net_worth": 100000.00,
  "accounts_breakdown": [
    {
      "name": "Checking Account",
      "type": "checking",
      "balance": 5000.00,
      "category": "asset"
    },
    {
      "name": "Credit Card",
      "type": "credit",
      "balance": -2500.00,
      "category": "liability"
    }
  ]
}
```

#### Sync Account

**POST** `/api/accounts/{account_id}/sync`

Response: `200 OK`
```json
{
  "message": "Account synced successfully",
  "account": { /* account object */ }
}
```

### Transactions

#### Get Transactions

**GET** `/api/transactions/`

Query parameters:
- `account_id`: integer (optional)
- `category`: string (optional)
- `start_date`: datetime (optional)
- `end_date`: datetime (optional)
- `limit`: integer (default: 100, max: 1000)
- `offset`: integer (default: 0)

Response: `200 OK`
```json
[
  {
    "id": 1,
    "account_id": 1,
    "date": "2024-01-15T10:30:00Z",
    "amount": -45.67,
    "description": "Whole Foods Market",
    "merchant_name": "Whole Foods",
    "category": "groceries",
    "pending": false
  }
]
```

#### Get Monthly Spending

**GET** `/api/transactions/spending/monthly`

Query parameters:
- `year`: integer (default: current year)
- `month`: integer (default: current month)

Response: `200 OK`
```json
{
  "month": "2024-01",
  "total_spending": 3456.78,
  "total_income": 5000.00,
  "net": 1543.22,
  "breakdown": [
    {
      "category": "groceries",
      "total_amount": 678.90,
      "transaction_count": 12,
      "percentage": 19.65
    }
  ]
}
```

#### Get Spending Trends

**GET** `/api/transactions/spending/trends`

Query parameters:
- `months`: integer (default: 6, max: 24)

Response: `200 OK`
```json
{
  "trends": [
    {
      "month": "2023-12",
      "spending": 3200.00,
      "income": 5000.00,
      "net": 1800.00
    }
  ]
}
```

#### Sync Transactions

**POST** `/api/transactions/sync`

Response: `200 OK`
```json
{
  "message": "Transactions synced successfully",
  "transactions_synced": 45
}
```

### Simulations

#### Create Simulation

**POST** `/api/simulations/`

```json
{
  "name": "New Car Purchase",
  "simulation_type": "purchase",
  "description": "Simulate buying a $30,000 car",
  "input_parameters": {
    "amount": 30000,
    "payment_plan": "financed",
    "months": 60,
    "interest_rate": 5.5
  }
}
```

Response: `201 Created`
```json
{
  "id": 1,
  "name": "New Car Purchase",
  "simulation_type": "purchase",
  "description": "Simulate buying a $30,000 car",
  "input_parameters": { /* same as input */ },
  "results": {
    "summary": {
      "purchase_amount": 30000,
      "payment_plan": "financed",
      "monthly_payment": 567.79,
      "total_cost": 34067.40,
      "interest_paid": 4067.40,
      "final_balance": 25000.00
    },
    "timeline": [ /* monthly projections */ ],
    "recommendations": [
      "✅ Review your budget...",
      "💡 Consider financing options..."
    ]
  },
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Get Simulations

**GET** `/api/simulations/`

Query parameters:
- `limit`: integer (default: 50)
- `offset`: integer (default: 0)

Response: `200 OK`
```json
[
  {
    "id": 1,
    "name": "New Car Purchase",
    "simulation_type": "purchase",
    "description": "Simulate buying a $30,000 car",
    "input_parameters": { /* parameters */ },
    "results": { /* results */ },
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Simulation Templates

**GET** `/api/simulations/templates/list`

Response: `200 OK`
```json
{
  "templates": [
    {
      "type": "purchase",
      "name": "Major Purchase",
      "description": "Simulate the impact of a major purchase",
      "required_fields": ["amount", "payment_plan", "months"]
    },
    {
      "type": "loan",
      "name": "Loan Repayment",
      "description": "Simulate different loan repayment strategies",
      "required_fields": ["principal", "interest_rate", "term_months", "extra_payment"]
    }
  ]
}
```

### Gamification

#### Get Achievements

**GET** `/api/gamification/achievements`

Response: `200 OK`
```json
[
  {
    "id": 1,
    "achievement_type": "savings_milestone",
    "title": "Savings Champion",
    "description": "Reached $10,000 in savings",
    "icon": "🎯",
    "target_value": 10000,
    "current_value": 10500,
    "is_completed": true,
    "completed_at": "2024-01-10T10:30:00Z"
  }
]
```

#### Get Milestones

**GET** `/api/gamification/milestones`

Response: `200 OK`
```json
[
  {
    "id": 1,
    "title": "Emergency Fund",
    "description": "Build 6 months of expenses",
    "target_amount": 30000,
    "current_amount": 15000,
    "target_date": "2024-12-31T00:00:00Z",
    "is_completed": false,
    "progress_percentage": 50.0
  }
]
```

#### Create Milestone

**POST** `/api/gamification/milestones`

```json
{
  "title": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "target_amount": 30000,
  "target_date": "2024-12-31"
}
```

Response: `201 Created`

#### Update Milestone Progress

**PUT** `/api/gamification/milestones/{milestone_id}?current_amount=15000`

Response: `200 OK`

### Admin (Admin Role Required)

#### Get System Stats

**GET** `/api/admin/stats`

Response: `200 OK`
```json
{
  "total_users": 1500,
  "active_users": 1200,
  "total_accounts": 4500,
  "total_transactions": 125000,
  "total_simulations": 8500,
  "users_last_30_days": 150
}
```

#### List Users

**GET** `/api/admin/users`

Query parameters:
- `skip`: integer (default: 0)
- `limit`: integer (default: 100)

Response: `200 OK`

#### Update User Role

**PUT** `/api/admin/users/{user_id}/role`

```json
{
  "role": "premium"
}
```

Response: `200 OK`

## Error Responses

### 400 Bad Request

```json
{
  "detail": "Invalid input data"
}
```

### 401 Unauthorized

```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden

```json
{
  "detail": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email address",
      "type": "value_error.email"
    }
  ]
}
```

### 500 Internal Server Error

```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

*To be implemented in production*

- Rate limit: 100 requests per minute per IP
- Burst limit: 200 requests per minute

## Pagination

List endpoints support pagination:
- `limit`: Number of items (max: 1000)
- `offset`: Number of items to skip

## Filtering

Transaction endpoints support filtering:
- `account_id`: Filter by account
- `category`: Filter by category
- `start_date`: Filter by date range
- `end_date`: Filter by date range

## Webhooks

*To be implemented*

Webhooks for:
- New transaction detected
- Milestone completed
- Achievement unlocked

## SDKs

*Coming soon*

- Python SDK
- JavaScript/TypeScript SDK
- React hooks library

## Support

For API issues:
- GitHub: https://github.com/jeremymartinezq/Digital-Mirror-App/issues
- Email: api@digitalmirror.app

