# Capling - AI-Powered Personal Finance Companion (HackTX 25)

**A gamified personal finance app featuring an AI-powered dinosaur companion that analyzes your spending and helps you build better financial habits.**

**Full submission on [Devpost](https://devpost.com/software/capling)**

## What Makes This Special

### **AI-Powered Financial Analysis**
- **GPT-4 Integration**: Every transaction gets analyzed by AI for responsible vs. irresponsible spending
- **Smart Insights**: Real-time feedback on your financial decisions
- **Context-Aware**: AI understands the difference between "emergency vet bill" vs "impulse shopping"

### **Gamified Experience**
- **Capling Character**: Your personal dinosaur companion that reacts to your spending
- **Happiness Streak**: Tracks consecutive days of good financial behavior
- **Level System**: Capling evolves and levels up based on your progress
- **Achievement Badges**: Unlock rewards for good financial habits

### **Smart Features**
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

**Auth/Storage:**
- Supabase Auth
- Supabase Database
- Real-time subscriptions

**AI:**
- OpenAI GPT-4
- Custom LLM analyzer

## Key Features

- **Secure Authentication** - Supabase Auth with JWT tokens
- **Real-time Dashboard** - Live spending analysis and budget tracking
- **AI Transaction Analysis** - GPT-4 classifies every purchase
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

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-3.5-turbo
- **UI**: Radix UI + Lucide Icons

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

Open [http://localhost:3000](http://localhost:3000) to see Capling in action!

## How It Works

1. **Sign up** and meet Capling, your financial companion
2. **Add transactions** and watch AI analyze your spending
3. **Build your happiness streak** by making responsible financial decisions
4. **Level up Capling** as you develop better habits
5. **Learn** from personalized AI-generated financial lessons

## Hackathon Highlights

- **AI Integration**: Seamless GPT-4 integration for intelligent financial analysis
- **Real-time Updates**: Live data synchronization across all components
- **Gamification**: Engaging user experience that makes finance fun
- **Smart Automation**: AI automatically adjusts budgets and provides insights
- **Modern Stack**: Built with latest Next.js, TypeScript, and Supabase
- **Responsive Design**: Beautiful UI that works on all devices

## Environment Setup

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT analysis | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## Demo

Try these example transactions to see AI analysis in action:

- **Responsible**: "Whole Foods - $45" (groceries)
- **Borderline**: "Starbucks - $6.50" (coffee)  
- **Impulsive**: "Amazon - $150" (shopping)
- **Context Test**: "Emergency vet bill - $300" vs "New shoes - $300"

---

**Built for better financial habits**