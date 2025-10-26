# Capling

AI-powered personal finance app with a dinosaur companion that helps you track spending and build better money habits.

## Features

- **AI Transaction Analysis** - GPT analyzes every purchase
- **Gamification** - Level up your dinosaur by making good choices
- **Smart Budgeting** - Track spending and stay on budget
- **Goal Tracking** - Save money for what matters
- **Financial Lessons** - Learn about money management

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
