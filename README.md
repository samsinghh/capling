# Capling - AI-Powered Personal Finance Companion

**A gamified personal finance app featuring an AI-powered dinosaur companion that analyzes your spending and helps you build better financial habits.**

**Submitted to HackTX 2025** | [View on Devpost](https://devpost.com/software/capling)

## What Makes This Special

Capling combines AI-powered transaction analysis with gamification to make personal finance engaging. Every purchase is analyzed by GPT for responsible vs. irresponsible spending, while your dinosaur companion evolves based on your financial decisions. The app features automatic budget adjustments, personalized financial lessons, and a happiness streak system that rewards good behavior.

## Tech Stack

**Frontend:**
- Next.js 15.2.4 + TypeScript
- Tailwind CSS v4.1.14
- Radix UI + Lucide React

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL)
- Supabase Auth with JWT tokens

**AI:**
- OpenAI GPT-3.5-turbo
- Custom LLM analyzer

## Key Features

- **AI Transaction Analysis** - GPT classifies every purchase
- **Gamified Progress** - Level up your dinosaur companion
- **Smart Budgeting** - AI adjusts budgets based on justified spending
- **Personalized Learning** - AI-generated financial lessons
- **Achievement System** - Badges for good financial habits
- **Real-time Dashboard** - Live spending analysis and budget tracking

## Quick Start

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Set Up Environment

```bash
npm run setup
```

Edit `.env.local` and add your OpenAI API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### 3. Start Database

```bash
supabase start
supabase db reset
```

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing

Visit [http://localhost:3000/test-api](http://localhost:3000/test-api) to test transactions and check AI analysis.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run setup        # Create .env.local template
npm run db:reset     # Reset database
```

## License

MIT
