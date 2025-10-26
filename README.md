# Capling - AI-Powered Personal Finance Companion

**A gamified personal finance app featuring an AI-powered dinosaur companion that analyzes your spending and helps you build better financial habits.**

**Submitted to HackTX 2025** | [View on Devpost](https://devpost.com/software/capling)

## What Makes This Special

### AI-Powered Financial Analysis
- **GPT Integration**: Every transaction gets analyzed by AI for responsible vs. irresponsible spending
- **Smart Insights**: Real-time feedback on your financial decisions
- **Context-Aware**: AI understands the difference between "emergency vet bill" vs "impulse shopping"

### Gamified Experience
- **Capling Character**: Your personal dinosaur companion that reacts to your spending
- **Happiness Streak**: Tracks consecutive days of good financial behavior
- **Level System**: Capling evolves and levels up based on your progress
- **Achievement Badges**: Unlock rewards for good financial habits

### Smart Features
- **Automatic Budget Adjustment**: AI adjusts your budget when you justify overspending
- **Real-time Mood Tracking**: Capling's mood reflects your financial health
- **Personalized Lessons**: AI-generated daily financial education
- **Transaction Justification**: Explain questionable purchases to AI

## Tech Stack

**Frontend:**
- Next.js 15.2.4 + TypeScript
- Tailwind CSS v4.1.14
- Radix UI + Lucide React

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL)
- Supabase Auth with JWT tokens
- Real-time subscriptions

**AI:**
- OpenAI GPT-3.5-turbo
- Custom LLM analyzer

## Key Features

- **Secure Authentication** - Supabase Auth with JWT tokens
- **Real-time Dashboard** - Live spending analysis and budget tracking
- **AI Transaction Analysis** - GPT classifies every purchase
- **Gamified Progress** - Happiness streaks and level progression
- **Smart Budgeting** - AI adjusts budgets based on justified spending
- **Personalized Learning** - AI-generated financial lessons
- **Achievement System** - Badges for good financial habits

## Quick Start

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Set Up Environment

```bash
# Create .env.local
npm run setup

# Add your OpenAI API key
# Get it from: https://platform.openai.com/api-keys
```

Edit `.env.local` and replace `your_openai_api_key_here` with your actual key.

### 3. Start Database

```bash
# Start Supabase
supabase start

# Set up tables
supabase db reset
```

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Sign up** - Create an account
2. **Set budget** - Enter your weekly spending limit
3. **Add transactions** - Track your purchases
4. **Get AI feedback** - See if your spending is responsible
5. **Watch Capling grow** - Your dinosaur evolves as you improve

## Testing

Visit [http://localhost:3000/test-api](http://localhost:3000/test-api) to:
- Test transactions
- Simulate purchases
- Make deposits
- Check AI analysis

## Troubleshooting

### "Invalid Refresh Token" Error
Refresh the page - the app will clear it automatically.

### Database Not Running
```bash
supabase start
```

### Port Already in Use
Next.js will try port 3001 automatically.

### Start Fresh
```bash
supabase stop
supabase start
supabase db reset
npm run dev
```

## Project Structure

```
capling-app/
├── app/                    # Pages and API routes
│   ├── api/               # Backend endpoints
│   ├── page.tsx           # Main dashboard
│   └── test-api/          # Testing interface
├── components/            # React components
├── lib/                   # Utilities and helpers
├── types/                 # TypeScript definitions
└── supabase/             # Database schema
```

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run setup        # Create .env.local template
npm run db:reset     # Reset database
```

## License

MIT
