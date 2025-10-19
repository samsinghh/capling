# 🐛 Troubleshooting Guide

This guide helps you resolve common issues when working with the Capling app. If you don't find your issue here, please check the [GitHub Issues](https://github.com/samsinghh/capling/issues) or create a new one.

## 📋 Quick Diagnostics

Before diving into specific issues, run these commands to check your setup:

```bash
# Check Node.js version
node --version  # Should be 18+

# Check npm version
npm --version   # Should be 9+

# Check Supabase CLI
supabase --version

# Check if Supabase is running
supabase status

# Check environment variables
cat .env.local

# Check if dependencies are installed
ls node_modules
```

## 🚀 Setup Issues

### "Command not found: supabase"

**Problem**: Supabase CLI is not installed or not in PATH.

**Solutions**:

#### macOS
```bash
# Install via Homebrew
brew install supabase/tap/supabase

# Verify installation
which supabase
supabase --version
```

#### Windows
```powershell
# Using Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or download from GitHub releases
# https://github.com/supabase/cli/releases
```

#### Linux
```bash
# Download and install
wget -O supabase https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64
chmod +x supabase
sudo mv supabase /usr/local/bin/
```

### "Command not found: node" or "Command not found: npm"

**Problem**: Node.js is not installed or not in PATH.

**Solutions**:

#### macOS
```bash
# Install via Homebrew
brew install node

# Or download from nodejs.org
```

#### Windows
1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Restart your terminal

#### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### "npm install" fails with peer dependency warnings

**Problem**: React 19 compatibility issues with some packages.

**Solution**:
```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps

# If that doesn't work, try:
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

## 🗄️ Database Issues

### "Connection refused" or "Database not found"

**Problem**: Supabase is not running or not properly configured.

**Solutions**:

```bash
# Check if Supabase is running
supabase status

# If not running, start it
supabase start

# If ports are in use, stop and restart
supabase stop
supabase start

# Reset database if corrupted
supabase db reset
```

### "Migration failed" or "Schema error"

**Problem**: Database schema is out of sync.

**Solutions**:

```bash
# Reset database to apply all migrations
supabase db reset

# Check migration status
supabase migration list

# If specific migration fails, check the SQL syntax
# Edit the migration file in supabase/migrations/
```

### "Row Level Security" errors

**Problem**: RLS policies are blocking data access.

**Solutions**:

```bash
# Check RLS policies
supabase db diff

# Reset policies
supabase db reset

# Or manually check policies in Supabase Studio
# Go to http://localhost:54323
```

### Database connection timeout

**Problem**: Database is slow or unresponsive.

**Solutions**:

```bash
# Check database logs
supabase logs

# Restart Supabase
supabase stop
supabase start

# Check system resources
# Make sure you have enough RAM (8GB+ recommended)
```

## 🔑 Authentication Issues

### "Invalid API key" or "Unauthorized"

**Problem**: API keys are missing or incorrect.

**Solutions**:

```bash
# Check environment variables
cat .env.local

# Verify OpenAI API key format
# Should start with 'sk-'
echo $OPENAI_API_KEY

# Verify Supabase credentials
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Re-run setup scripts
npm run setup-openai
npm run setup-supabase
```

### "User not found" or "Authentication failed"

**Problem**: User authentication is not working.

**Solutions**:

```bash
# Check Supabase Auth settings
# Go to http://localhost:54323 -> Authentication

# Clear browser storage
# Open DevTools -> Application -> Storage -> Clear All

# Check if user exists in database
# Go to Supabase Studio -> Table Editor -> auth.users
```

### "Email confirmation required"

**Problem**: Email confirmation is enabled but emails aren't being sent.

**Solutions**:

```bash
# Check email settings in Supabase
# Go to http://localhost:54323 -> Authentication -> Settings

# For local development, check Inbucket
# Go to http://localhost:54324

# Disable email confirmation for development
# In Supabase Studio -> Authentication -> Settings
```

## 🤖 GPT Analysis Issues

### "OpenAI API error" or "Rate limit exceeded"

**Problem**: OpenAI API is not working or rate limited.

**Solutions**:

```bash
# Check API key
echo $OPENAI_API_KEY

# Verify API key has credits
# Go to https://platform.openai.com/usage

# Check API key permissions
# Go to https://platform.openai.com/api-keys

# Test API key manually
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models
```

### "Analysis failed" or "Invalid response"

**Problem**: GPT analysis is not working properly.

**Solutions**:

```bash
# Check server logs
npm run dev
# Look for errors in the terminal

# Test with a simple transaction
# Try adding a transaction like "Coffee - $5"

# Check API endpoint
curl -X POST http://localhost:3000/api/analyze-transaction \
     -H "Content-Type: application/json" \
     -d '{"description": "Coffee - $5", "amount": 5}'
```

### "Analysis timeout" or "Slow response"

**Problem**: GPT analysis is taking too long.

**Solutions**:

```bash
# Check network connection
ping api.openai.com

# Check API status
# Go to https://status.openai.com/

# Try with a simpler prompt
# Edit lib/llm-analyzer.ts to reduce prompt complexity
```

## 🌐 Network Issues

### "Failed to fetch" or "Network error"

**Problem**: Network connectivity issues.

**Solutions**:

```bash
# Check internet connection
ping google.com

# Check if ports are accessible
curl http://localhost:3000
curl http://localhost:54321

# Check firewall settings
# Make sure ports 3000, 54321-54324 are not blocked

# Try different network
# Switch to different WiFi or use mobile hotspot
```

### "CORS error" or "Cross-origin request blocked"

**Problem**: CORS policy is blocking requests.

**Solutions**:

```bash
# Check if running on correct port
# Should be http://localhost:3000

# Check browser console for CORS errors
# Open DevTools -> Console

# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### "SSL/TLS errors"

**Problem**: Certificate or security issues.

**Solutions**:

```bash
# For local development, use HTTP not HTTPS
# Make sure you're using http://localhost:3000

# Check system date/time
# SSL certificates can fail if system time is wrong

# Clear browser SSL cache
# Chrome: Settings -> Privacy -> Clear browsing data -> Advanced
```

## 🎨 UI/UX Issues

### "Page not loading" or "White screen"

**Problem**: React app is not rendering.

**Solutions**:

```bash
# Check browser console for errors
# Open DevTools -> Console

# Check if development server is running
npm run dev

# Clear Next.js cache
rm -rf .next
npm run dev

# Check for JavaScript errors
# Look for syntax errors in components
```

### "Styling not working" or "CSS not loading"

**Problem**: Tailwind CSS or styles are not applied.

**Solutions**:

```bash
# Check if Tailwind is properly configured
# Look for tailwind.config.js

# Restart development server
npm run dev

# Check for CSS import errors
# Look in browser DevTools -> Network tab

# Verify Tailwind classes
# Make sure classes are spelled correctly
```

### "Mobile responsiveness issues"

**Problem**: App doesn't work well on mobile devices.

**Solutions**:

```bash
# Test in browser dev tools
# Open DevTools -> Toggle device toolbar

# Check Tailwind responsive classes
# Make sure you're using sm:, md:, lg: prefixes

# Test on actual device
# Use ngrok or similar to test on real mobile device
```

## 🔧 Build Issues

### "Build failed" or "Compilation error"

**Problem**: TypeScript or build errors.

**Solutions**:

```bash
# Check TypeScript errors
npm run type-check

# Check for syntax errors
npm run lint

# Clear build cache
rm -rf .next
npm run build

# Check for missing dependencies
npm install --legacy-peer-deps
```

### "Module not found" errors

**Problem**: Import paths are incorrect or modules are missing.

**Solutions**:

```bash
# Check import paths
# Make sure paths are correct relative to file location

# Check if modules are installed
ls node_modules/package-name

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Check for typos in import statements
```

### "Type errors" or "TypeScript compilation failed"

**Problem**: TypeScript type errors.

**Solutions**:

```bash
# Check TypeScript errors
npm run type-check

# Fix type errors one by one
# Look for missing type annotations

# Check for outdated types
npm update @types/node @types/react @types/react-dom

# Use type assertions if needed
# const data = response as ApiResponse;
```

## 🚀 Performance Issues

### "Slow loading" or "App is sluggish"

**Problem**: Performance issues.

**Solutions**:

```bash
# Check bundle size
npm run analyze

# Check for memory leaks
# Use browser DevTools -> Memory tab

# Optimize images
# Use next/image for images

# Check for unnecessary re-renders
# Use React.memo and useMemo
```

### "High memory usage"

**Problem**: App is using too much memory.

**Solutions**:

```bash
# Check for memory leaks
# Use browser DevTools -> Memory tab

# Check for infinite loops
# Look for useEffect without dependencies

# Optimize data fetching
# Use proper caching and pagination
```

### "Slow database queries"

**Problem**: Database performance issues.

**Solutions**:

```bash
# Check query performance
# Use Supabase Studio -> SQL Editor

# Add database indexes
# Create indexes for frequently queried columns

# Optimize queries
# Use proper WHERE clauses and LIMIT
```

## 🔒 Security Issues

### "Security warnings" or "Vulnerable dependencies"

**Problem**: Security vulnerabilities in dependencies.

**Solutions**:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### "Environment variables exposed"

**Problem**: Sensitive data is exposed in client-side code.

**Solutions**:

```bash
# Check environment variables
# Make sure sensitive vars start with NEXT_PUBLIC_ only if needed

# Use server-side API routes for sensitive operations
# Don't expose API keys to client

# Check browser DevTools -> Sources
# Make sure sensitive data isn't visible
```

## 📱 Mobile Issues

### "App doesn't work on mobile"

**Problem**: Mobile-specific issues.

**Solutions**:

```bash
# Test in browser dev tools
# Open DevTools -> Toggle device toolbar

# Check responsive design
# Make sure Tailwind responsive classes are used

# Test on actual device
# Use ngrok or similar to test on real mobile device

# Check for touch events
# Make sure buttons are large enough for touch
```

### "PWA issues" or "Installation failed"

**Problem**: Progressive Web App issues.

**Solutions**:

```bash
# Check PWA configuration
# Look for manifest.json and service worker

# Test PWA installation
# Use browser DevTools -> Application -> Manifest

# Check for HTTPS
# PWAs require HTTPS in production
```

## 🧪 Testing Issues

### "Tests are failing"

**Problem**: Test suite is not working.

**Solutions**:

```bash
# Run tests individually
npm test -- --testNamePattern="specific test"

# Check test environment
# Make sure test database is set up

# Check for async issues
# Make sure tests wait for async operations

# Check for mocking issues
# Make sure mocks are properly set up
```

### "Test database issues"

**Problem**: Test database is not working.

**Solutions**:

```bash
# Set up test database
supabase test db setup

# Check test database connection
# Make sure test environment variables are set

# Reset test database
supabase test db reset
```

## 🆘 Getting Help

### When to Ask for Help

Ask for help when:
- You've tried the solutions above and they don't work
- You're getting an error you don't understand
- You need clarification on how something works
- You want to suggest an improvement

### How to Ask for Help

1. **Check existing issues**: Search [GitHub Issues](https://github.com/samsinghh/capling/issues)
2. **Create a new issue**: Use the bug report template
3. **Provide details**: Include error messages, steps to reproduce, and your environment
4. **Be specific**: Describe what you expected vs. what happened

### Information to Include

When asking for help, include:

```markdown
**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Node.js version: [e.g. 18.17.0]
- npm version: [e.g. 9.6.7]
- Supabase CLI version: [e.g. 1.45.0]

**Error Message:**
```
Paste the exact error message here
```

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What you expected to happen

**Actual Behavior:**
What actually happened

**Additional Context:**
Any other relevant information
```

### Community Resources

- **GitHub Issues**: [github.com/samsinghh/capling/issues](https://github.com/samsinghh/capling/issues)
- **GitHub Discussions**: [github.com/samsinghh/capling/discussions](https://github.com/samsinghh/capling/discussions)
- **Documentation**: Check README.md and other docs in the repository
- **External Resources**: 
  - [Next.js Documentation](https://nextjs.org/docs)
  - [Supabase Documentation](https://supabase.com/docs)
  - [OpenAI API Documentation](https://platform.openai.com/docs)

---

## 🎉 Still Stuck?

If you've tried everything above and still can't resolve your issue:

1. **Create a GitHub issue** with all the details
2. **Ask in team chat** if you have access
3. **Check the logs** for more specific error messages
4. **Try a fresh setup** on a different machine to isolate the issue

Remember: Every developer runs into issues - it's part of the learning process! 🚀
