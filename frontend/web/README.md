# Digital Mirror - Web Frontend

Next.js 14 web application for the Digital Mirror platform.

## Features

- **Next.js 14**: Latest React framework with App Router
- **TailwindCSS**: Utility-first styling
- **TypeScript**: Type-safe development
- **Recharts**: Financial data visualization
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Beautiful dark theme

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Configuration

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Run Development Server

```bash
npm run dev
```

Application will be available at: http://localhost:3000

## Project Structure

```
frontend/web/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # Landing page
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── simulations/
│   └── globals.css
├── components/            # React components
│   ├── DashboardLayout.tsx
│   ├── NetWorthCard.tsx
│   ├── SpendingChart.tsx
│   └── RecentTransactions.tsx
├── services/             # API client
│   └── api.ts
├── package.json
└── tsconfig.json
```

## Pages

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard
- `/accounts` - Account management
- `/transactions` - Transaction history
- `/simulations` - Financial simulations
- `/gamification` - Goals & achievements
- `/settings` - User settings

## Components

### DashboardLayout
Main layout with sidebar navigation and user menu.

### NetWorthCard
Displays assets, liabilities, and net worth with pie charts.

### SpendingChart
Monthly spending breakdown with bar chart.

### RecentTransactions
List of recent transactions with categories.

## API Integration

The `api.ts` service handles all backend communication:

```typescript
import { api } from '@/services/api'

// Example usage
const user = await api.getCurrentUser()
const accounts = await api.getAccounts()
const simulations = await api.getSimulations()
```

## Styling

Using TailwindCSS with custom color scheme:

- Primary: Blue (500-700)
- Background: Slate (800-900)
- Text: White/Gray
- Gradients: Blue to Cyan

## Development

### Add New Page

1. Create folder in `app/`
2. Add `page.tsx` file
3. Implement component
4. Add to navigation

### Add New Component

1. Create file in `components/`
2. Import and use in pages
3. Style with TailwindCSS

## Build

```bash
# Production build
npm run build

# Start production server
npm start
```

## Docker

```bash
docker build -t digital-mirror-frontend .
docker run -p 3000:3000 digital-mirror-frontend
```

