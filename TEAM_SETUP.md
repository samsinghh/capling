# 👥 Team Setup Guide - Capling App

Welcome to the Capling team! This guide will help you get up and running with the codebase quickly and efficiently.

## 🚀 Quick Start for New Team Members

### 1. Clone the Repository

```bash
git clone https://github.com/samsinghh/capling.git
cd capling
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note**: The `--legacy-peer-deps` flag is required due to React 19 compatibility with some UI components.

### 3. Set Up Environment Variables

The project includes automated setup scripts to make this easy:

```bash
# Set up OpenAI API key (for GPT analysis)
npm run setup-openai

# Set up Supabase configuration
npm run setup-supabase
```

These scripts will:
- Create `.env.local` file
- Prompt you for required API keys
- Set up proper environment variable structure

### 4. Start Local Development Environment

#### Option A: Local Supabase (Recommended for Development)

```bash
# Install Supabase CLI (if not already installed)
# On macOS:
brew install supabase/tap/supabase

# On other platforms, see: https://supabase.com/docs/guides/cli/getting-started

# Start Supabase locally
supabase start

# Apply database migrations
supabase db reset
```

#### Option B: Supabase Cloud (Alternative)

If you prefer using Supabase Cloud:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key
4. Update `.env.local` with your cloud credentials
5. Run the SQL migrations in your Supabase dashboard

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Required API Keys

### OpenAI API Key
- **Purpose**: GPT-powered transaction analysis
- **Get it**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: Pay-per-use (very affordable for development)
- **Environment Variable**: `OPENAI_API_KEY`

### Supabase Credentials
- **Purpose**: Database and authentication
- **Get it**: [Supabase Dashboard](https://supabase.com/dashboard)
- **Environment Variables**: 
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🏗️ Project Structure

```
capling/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── demo/              # Demo pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   └── ...                # Feature-specific components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
├── supabase/              # Database schema and migrations
└── scripts/               # Setup and utility scripts
```

## 🛠️ Development Workflow

### Branch Strategy

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code changes ...

# Commit your changes
git add .
git commit -m "feat: add your feature description"

# Push to your branch
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

### Code Style Guidelines

- **TypeScript**: Use TypeScript for all new code
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes
- **UI Components**: Use shadcn/ui components when possible
- **File Naming**: Use kebab-case for files, PascalCase for components

### Testing Your Changes

1. **Local Testing**: Always test locally before pushing
2. **Database Changes**: Test with local Supabase instance
3. **API Changes**: Test API endpoints with Postman or similar
4. **UI Changes**: Test on different screen sizes

## 🐛 Common Issues & Solutions

### "Command not found: supabase"
```bash
# Install Supabase CLI
brew install supabase/tap/supabase
# Or download from: https://github.com/supabase/cli/releases
```

### "Port already in use"
```bash
# Stop Supabase and restart
supabase stop
supabase start
```

### "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Environment variables not working
```bash
# Check if .env.local exists and has correct values
cat .env.local

# Restart the development server
npm run dev
```

### Database connection issues
```bash
# Check Supabase status
supabase status

# Reset database if needed
supabase db reset
```

## 📋 Development Checklist

Before submitting a Pull Request:

- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] No console.log statements in production code
- [ ] Environment variables are properly configured
- [ ] Database migrations are included (if schema changes)
- [ ] UI is responsive on mobile and desktop
- [ ] No linting errors (`npm run lint`)
- [ ] Build passes (`npm run build`)

## 🔄 Database Management

### Making Schema Changes

1. **Create Migration**:
   ```bash
   supabase migration new your_migration_name
   ```

2. **Edit Migration File**: Located in `supabase/migrations/`

3. **Apply Migration**:
   ```bash
   supabase db reset
   ```

4. **Commit Migration**: Include migration files in your PR

### Database Schema Overview

- **`user_profiles`**: User information and preferences
- **`accounts`**: Bank accounts with balances
- **`transactions`**: Transaction history with GPT analysis
- **`goals`**: Savings goals and progress tracking

## 🚀 Deployment

### Staging Environment
- Automatic deployment from `develop` branch
- Uses Supabase Cloud for database
- Environment variables managed in deployment platform

### Production Environment
- Automatic deployment from `main` branch
- Requires approval for deployment
- All environment variables must be configured

## 📞 Getting Help

### Team Resources
- **GitHub Issues**: For bugs and feature requests
- **Slack/Discord**: For quick questions and discussions
- **Code Reviews**: All PRs require review before merging

### Documentation
- **README.md**: Project overview and features
- **SETUP.md**: Quick setup for new developers
- **API Documentation**: Inline code comments and JSDoc

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## 🎯 Team Goals & Priorities

### Current Sprint Focus
- [ ] Feature development priorities
- [ ] Bug fixes and improvements
- [ ] Performance optimizations
- [ ] User experience enhancements

### Code Quality Standards
- **Type Safety**: 100% TypeScript coverage
- **Performance**: Core Web Vitals compliance
- **Accessibility**: WCAG 2.1 AA compliance
- **Security**: Regular dependency updates

## 🔐 Security Guidelines

### API Keys & Secrets
- **Never commit API keys** to version control
- **Use environment variables** for all sensitive data
- **Rotate keys regularly** in production
- **Use different keys** for development and production

### Code Security
- **Validate all inputs** from users
- **Use parameterized queries** for database operations
- **Implement proper authentication** checks
- **Follow OWASP guidelines** for web security

---

## 🎉 Welcome to the Team!

You're all set up! If you run into any issues, don't hesitate to ask for help. The team is here to support you.

**Next Steps:**
1. Complete the setup above
2. Explore the codebase
3. Pick up your first task
4. Start contributing!

Happy coding! 🚀
