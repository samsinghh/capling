# 🛠️ Development Environment Setup

This guide provides detailed instructions for setting up a complete development environment for the Capling app.

## 📋 Prerequisites

### Required Software

| Software | Version | Purpose | Installation |
|----------|---------|---------|--------------|
| **Node.js** | 18+ | JavaScript runtime | [nodejs.org](https://nodejs.org/) |
| **npm** | 9+ | Package manager | Comes with Node.js |
| **Git** | 2.30+ | Version control | [git-scm.com](https://git-scm.com/) |
| **Supabase CLI** | Latest | Local database | [supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli/getting-started) |
| **VS Code** | Latest | Code editor | [code.visualstudio.com](https://code.visualstudio.com/) |

### Recommended VS Code Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "supabase.supabase",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-eslint"
  ]
}
```

### System Requirements

- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 2GB free space
- **OS**: macOS 10.15+, Windows 10+, or Linux
- **Internet**: Stable connection for API calls and package downloads

## 🚀 Installation Steps

### 1. Install Node.js and npm

#### macOS (using Homebrew)
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version  # Should be 18+
npm --version   # Should be 9+
```

#### Windows
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Verify installation in Command Prompt:
   ```cmd
   node --version
   npm --version
   ```

#### Linux (Ubuntu/Debian)
```bash
# Update package index
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install Supabase CLI

#### macOS
```bash
brew install supabase/tap/supabase
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

### 3. Install Git

#### macOS
```bash
# Git comes with Xcode Command Line Tools
xcode-select --install

# Or install via Homebrew
brew install git
```

#### Windows
1. Download from [git-scm.com](https://git-scm.com/)
2. Run the installer with default settings
3. Configure Git:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

#### Linux
```bash
sudo apt update
sudo apt install git
```

### 4. Install VS Code

#### macOS
```bash
brew install --cask visual-studio-code
```

#### Windows/Linux
1. Download from [code.visualstudio.com](https://code.visualstudio.com/)
2. Run the installer

## 🔧 Project Setup

### 1. Clone the Repository

```bash
# Clone the main repository
git clone https://github.com/samsinghh/capling.git
cd capling

# Add your fork as origin (if contributing)
git remote add origin https://github.com/YOUR_USERNAME/capling.git
git remote add upstream https://github.com/samsinghh/capling.git
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install --legacy-peer-deps

# Note: --legacy-peer-deps is required due to React 19 compatibility
```

### 3. Set Up Environment Variables

The project includes automated setup scripts:

```bash
# Set up OpenAI API key
npm run setup-openai

# Set up Supabase configuration
npm run setup-supabase
```

These scripts will create a `.env.local` file with the necessary environment variables.

### 4. Start Local Supabase

```bash
# Start Supabase locally
supabase start

# Apply database migrations
supabase db reset

# Check status
supabase status
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 API Keys Setup

### OpenAI API Key

1. **Create Account**: Go to [OpenAI Platform](https://platform.openai.com/)
2. **Generate API Key**: Navigate to API Keys section
3. **Add Billing**: Add a payment method (required for API usage)
4. **Set Environment Variable**: Use the setup script or manually add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```

**Cost Information**: OpenAI charges per token used. For development, costs are typically very low (a few dollars per month).

### Supabase Credentials

#### Option A: Local Development (Recommended)
Local Supabase automatically provides these values:
```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

#### Option B: Supabase Cloud
1. **Create Project**: Go to [supabase.com](https://supabase.com)
2. **Get Credentials**: Find URL and anon key in project settings
3. **Set Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 🗄️ Database Setup

### Local Supabase (Recommended for Development)

```bash
# Start Supabase
supabase start

# This will:
# - Start PostgreSQL database on port 54322
# - Start Supabase API on port 54321
# - Start Supabase Studio on port 54323
# - Start Inbucket (email testing) on port 54324

# Apply migrations
supabase db reset

# View database in browser
open http://localhost:54323
```

### Database Schema

The app uses the following tables:

- **`user_profiles`**: User information and preferences
- **`accounts`**: Bank accounts with balances
- **`transactions`**: Transaction history with GPT analysis
- **`goals`**: Savings goals and progress tracking

### Making Database Changes

```bash
# Create a new migration
supabase migration new your_migration_name

# Edit the migration file in supabase/migrations/
# Apply the migration
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > lib/database.types.ts
```

## 🧪 Testing Setup

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Database

Tests use a separate test database:

```bash
# Set up test database
supabase test db setup

# Run tests against test database
npm run test:db
```

## 🔍 Development Tools

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### Type Checking

```bash
# Run TypeScript compiler
npm run type-check

# Watch for type errors
npm run type-check:watch
```

### Build Verification

```bash
# Build the project
npm run build

# Start production server
npm run start
```

## 🐛 Troubleshooting

### Common Issues

#### "Command not found: supabase"
```bash
# Verify installation
which supabase

# Reinstall if needed
brew reinstall supabase/tap/supabase
```

#### "Port already in use"
```bash
# Check what's using the port
lsof -i :54321

# Stop Supabase and restart
supabase stop
supabase start
```

#### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

#### Environment variables not working
```bash
# Check if .env.local exists
ls -la .env.local

# Verify file contents (don't commit this!)
cat .env.local

# Restart development server
npm run dev
```

#### Database connection issues
```bash
# Check Supabase status
supabase status

# Reset database
supabase db reset

# Check logs
supabase logs
```

### Performance Issues

#### Slow development server
```bash
# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev
```

#### Large bundle size
```bash
# Analyze bundle
npm run analyze

# Check for unused dependencies
npx depcheck
```

### Network Issues

#### API calls failing
- Check internet connection
- Verify API keys are correct
- Check firewall settings
- Try different network

#### Supabase connection issues
```bash
# Check Supabase status
supabase status

# Restart Supabase
supabase stop
supabase start
```

## 🔧 Advanced Configuration

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Git Configuration

```bash
# Set up Git hooks
npm install --save-dev husky lint-staged

# Configure pre-commit hooks
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Environment-Specific Configuration

#### Development
```bash
# .env.local
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Staging
```bash
# .env.staging
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.capling.app
```

#### Production
```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://capling.app
```

## 📊 Monitoring and Debugging

### Development Tools

- **React Developer Tools**: Browser extension for React debugging
- **Supabase Studio**: Database management interface
- **Network Tab**: Monitor API calls and responses
- **Console**: Check for JavaScript errors

### Logging

```typescript
// Development logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Production logging
console.error('Error occurred:', error);
```

### Performance Monitoring

```bash
# Bundle analyzer
npm run analyze

# Lighthouse audit
npm run lighthouse

# Performance profiling
npm run profile
```

## 🚀 Deployment Preparation

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] No linting errors
- [ ] Build successful
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Performance optimized
- [ ] Security review completed

### Build Optimization

```bash
# Analyze bundle size
npm run analyze

# Optimize images
npm run optimize-images

# Generate sitemap
npm run generate-sitemap
```

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com)
- [React Community](https://reactjs.org/community/support.html)

### Tools
- [VS Code Extensions](https://marketplace.visualstudio.com/)
- [GitHub Desktop](https://desktop.github.com/)
- [Postman](https://www.postman.com/) (for API testing)

---

## 🎉 You're All Set!

Your development environment is now ready! You can:

1. **Start coding** with full TypeScript support
2. **Debug** with integrated tools
3. **Test** your changes locally
4. **Deploy** when ready

Happy coding! 🚀
