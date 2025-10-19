# Capling - Personal Finance App with Supabase & GPT

Capling is a friendly personal finance management app featuring an animated dinosaur companion that helps you track spending, set goals, and develop better financial habits. Built with Supabase for secure data storage and OpenAI GPT for intelligent transaction analysis!

## 🌱 Features

- **🔐 User Authentication**: Secure signup/login with Supabase Auth
- **🗄️ Data Persistence**: Your data is safely stored in Supabase database
- **🤖 GPT-Powered Analysis**: OpenAI GPT integration for intelligent transaction classification
- **🦕 Animated Character**: Capling the dinosaur changes mood based on your spending patterns
- **📊 Real-time Insights**: Live spending analysis and budget tracking
- **🎯 Goal Tracking**: Set and monitor savings goals with visual progress
- **🏆 Achievement System**: Earn badges for good financial habits
- **💳 Transaction Management**: Add, view, and analyze your transactions
- **🔄 Real-time Sync**: Changes sync instantly across devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase CLI (for local development)
- OpenAI API key (for GPT analysis)

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note**: The `--legacy-peer-deps` flag is needed because some UI components haven't been updated for React 19 yet.

### 2. Set Up Environment Variables

```bash
# Set up OpenAI API key
npm run setup-openai

# Set up Supabase configuration
npm run setup-supabase
```

### 3. Start Supabase (Local Development)

```bash
# Install Supabase CLI (if not already installed)
brew install supabase/tap/supabase

# Start Supabase
supabase start

# Apply database migrations
supabase db reset
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

Capling uses Supabase with the following tables:

- **`user_profiles`**: User information and preferences
- **`accounts`**: Bank accounts with balances
- **`transactions`**: Transaction history with GPT analysis
- **`goals`**: Savings goals and progress tracking

### Key Features:
- **Row Level Security (RLS)**: Users can only access their own data
- **Automatic Timestamps**: Created/updated timestamps on all records
- **User Signup Trigger**: Automatically creates profile and account on signup

## 🤖 GPT Integration

Capling uses OpenAI's GPT-3.5-turbo to analyze transactions and provide intelligent insights.

### Features:
- **Context-Aware Analysis**: GPT understands transaction context
- **Personalized Feedback**: Tailored insights for each transaction
- **Intelligent Classification**: Responsible, Borderline, or Impulsive classifications
- **Server-Side Processing**: Secure API calls from your server

### Example Analysis:
- "Emergency vet bill - $300" → **Responsible**: "Taking care of your pet is always worth it!"
- "New gaming setup - $500" → **Impulsive**: "Big purchase! Did you really need this right now?"
- "Grocery shopping - $120" → **Responsible**: "Essential groceries - good planning!"

## 🎮 How to Use

1. **Sign Up**: Create your account with email and password
2. **Explore Dashboard**: See Capling's mood and your spending summary
3. **Add Transactions**: Click "Add Transaction" to log purchases
4. **Watch AI Analysis**: See GPT-powered insights for each transaction
5. **Track Progress**: Monitor your spending patterns and goals
6. **Earn Badges**: Unlock achievements for good financial habits

### 🧪 Try These Examples

- **Responsible**: "Whole Foods - $45" (groceries)
- **Borderline**: "Starbucks - $6.50" (coffee)
- **Impulsive**: "Amazon - $150" (shopping)
- **Context Test**: "Emergency vet bill - $300" vs "New shoes - $300"

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-3.5-turbo
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui

### Key Components

- **`AuthProvider`**: Authentication context and state management
- **`ProtectedRoute`**: Route protection for authenticated users
- **`AuthForm`**: Login/signup form with validation
- **`UserMenu`**: User profile dropdown with logout
- **`useSupabaseData`**: Custom hook for data management
- **`CaplingCharacter`**: Animated dinosaur with mood states

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT analysis | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

### Supabase Setup

1. **Local Development**:
   ```bash
   supabase start
   supabase db reset
   ```

2. **Production**: Deploy to Supabase Cloud and update environment variables

### Database Migrations

The app includes a complete database schema in `supabase/migrations/`:

- User authentication and profiles
- Account management
- Transaction storage with GPT analysis
- Goal tracking
- Row-level security policies

## 🚀 Deployment

### Vercel (Recommended)

1. **Set up Supabase Cloud**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run migrations: `supabase db push`
   - Get your project URL and anon key

2. **Deploy to Vercel**:
   - Push code to GitHub
   - Connect repository to Vercel
   - Add environment variables:
     - `OPENAI_API_KEY`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure token-based auth
- **Server-Side API Keys**: OpenAI API key never exposed to client
- **Input Validation**: Form validation and sanitization
- **HTTPS Only**: Secure connections in production

## 🎨 Design System

### Color Palette (OKLCH-based)

- **Primary**: Teal (`oklch(0.65 0.15 165)`) - Main brand color
- **Secondary**: Orange (`oklch(0.72 0.12 85)`) - Accent color  
- **Accent**: Warm orange (`oklch(0.68 0.18 45)`) - Highlights
- **Destructive**: Red (`oklch(0.62 0.22 25)`) - Warnings/errors

### Typography

- **Font**: Geist (sans) and Geist Mono
- **Design**: Modern, friendly, approachable

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Issues**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
   - Check that Supabase is running: `supabase status`
   - Ensure migrations are applied: `supabase db reset`

2. **GPT Analysis Not Working**
   - Verify `OPENAI_API_KEY` is set correctly
   - Check API key has sufficient credits
   - Review server logs for API errors

3. **Authentication Issues**
   - Clear browser storage and try again
   - Check Supabase Auth settings
   - Verify email confirmation if enabled

4. **Build Errors**
   - Run `npm install --legacy-peer-deps`
   - Check TypeScript errors: `npm run build`
   - Clear Next.js cache: `rm -rf .next`

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [OpenAI API documentation](https://platform.openai.com/docs)
- Check browser console for error messages
- Ensure all environment variables are properly set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with local Supabase instance
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [OpenAI](https://openai.com/) for GPT analysis
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for styling