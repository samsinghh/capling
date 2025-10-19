# 🚀 Quick Setup Guide

## The Issue
You're seeing a loading screen because Supabase isn't running. Here's how to fix it:

## Option 1: Install Supabase CLI (Recommended)

### 1. Install Supabase CLI
```bash
# On macOS with Homebrew
brew install supabase/tap/supabase

# Or download from: https://github.com/supabase/cli/releases
```

### 2. Start Supabase
```bash
cd /Users/samsingh/Downloads/capling-app
supabase start
```

### 3. Apply Database Migrations
```bash
supabase db reset
```

### 4. Refresh Your Browser
Go to http://localhost:3000 and refresh the page.

## Option 2: Use Supabase Cloud (Alternative)

If you can't install the CLI, you can use Supabase Cloud:

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key
4. Update `.env.local` with your cloud credentials
5. Run the SQL migrations in your Supabase dashboard

## What You'll See

Once Supabase is running, you'll see:
- ✅ A beautiful login/signup form
- ✅ The ability to create an account
- ✅ GPT-powered transaction analysis
- ✅ Your data saved securely

## Troubleshooting

### "Command not found: supabase"
- Make sure you installed the Supabase CLI
- Try restarting your terminal

### "Port already in use"
- Stop other services using ports 54321-54324
- Or run `supabase stop` then `supabase start`

### Still stuck on loading?
- Check the browser console for errors
- Make sure all environment variables are set
- Try refreshing the page

## Need Help?

The app is fully functional once Supabase is running. You'll be able to:
- Create an account
- Add transactions
- See GPT analysis
- Track your spending
- Set goals

Just follow the steps above and you'll be up and running! 🌱
