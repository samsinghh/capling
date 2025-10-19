# 🤝 Contributing to Capling

Thank you for your interest in contributing to Capling! This guide will help you understand our development process and ensure your contributions are successful.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Release Process](#release-process)

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

- **Node.js 18+** and npm
- **Git** installed and configured
- **Supabase CLI** (for local development)
- **OpenAI API Key** (for GPT analysis)
- **Code Editor** (VS Code recommended)

### Initial Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/capling.git
   cd capling
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/samsinghh/capling.git
   ```
4. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```
5. **Set up environment variables**:
   ```bash
   npm run setup-openai
   npm run setup-supabase
   ```
6. **Start local development**:
   ```bash
   supabase start
   supabase db reset
   npm run dev
   ```

## 🔄 Development Workflow

### Branch Strategy

We use **Git Flow** with the following branches:

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: Feature development branches
- **`bugfix/*`**: Bug fix branches
- **`hotfix/*`**: Critical production fixes

### Creating a Feature Branch

```bash
# Make sure you're on develop and up to date
git checkout develop
git pull upstream develop

# Create your feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code changes ...

# Commit your changes
git add .
git commit -m "feat: add your feature description"

# Push to your fork
git push origin feature/your-feature-name
```

### Branch Naming Convention

Use descriptive branch names with prefixes:

- **Features**: `feature/add-user-dashboard`
- **Bug fixes**: `bugfix/fix-transaction-sync`
- **Hotfixes**: `hotfix/security-patch`
- **Documentation**: `docs/update-readme`
- **Refactoring**: `refactor/optimize-database-queries`

## 📝 Code Standards

### TypeScript Guidelines

- **Use TypeScript** for all new code
- **Define interfaces** for complex data structures
- **Use type annotations** for function parameters and return types
- **Avoid `any` type** - use proper typing instead

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
}

const getUser = async (id: string): Promise<User | null> => {
  // implementation
};

// ❌ Bad
const getUser = async (id: any): Promise<any> => {
  // implementation
};
```

### React Component Guidelines

- **Use functional components** with hooks
- **Use TypeScript interfaces** for props
- **Follow the single responsibility principle**
- **Use meaningful component names**

```typescript
// ✅ Good
interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  // component implementation
};

// ❌ Bad
export const TransactionItem = (props: any) => {
  // component implementation
};
```

### Styling Guidelines

- **Use Tailwind CSS** for styling
- **Follow mobile-first** responsive design
- **Use design system colors** from the theme
- **Keep components reusable** and composable

```typescript
// ✅ Good
<div className="flex flex-col gap-4 p-6 bg-background rounded-lg border">
  <h2 className="text-xl font-semibold text-foreground">Title</h2>
  <p className="text-muted-foreground">Description</p>
</div>

// ❌ Bad
<div style={{ display: 'flex', padding: '24px', backgroundColor: '#fff' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Title</h2>
</div>
```

### File Organization

- **Use kebab-case** for file names
- **Group related files** in folders
- **Use index files** for clean imports
- **Keep components small** and focused

```
components/
├── auth/
│   ├── auth-form.tsx
│   ├── user-menu.tsx
│   └── index.ts
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   └── index.ts
└── transaction-item.tsx
```

### Database Guidelines

- **Use migrations** for schema changes
- **Follow naming conventions** (snake_case for tables/columns)
- **Add proper indexes** for performance
- **Use Row Level Security** for data protection

```sql
-- ✅ Good migration
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'light',
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);
```

## 🔍 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Run the linter**: `npm run lint`
3. **Check the build**: `npm run build`
4. **Update documentation** if needed
5. **Add tests** for new functionality

### PR Template

When creating a Pull Request, use this template:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested this change locally
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated checks** must pass (linting, build, tests)
2. **Code review** by at least one team member
3. **Testing** by the reviewer
4. **Approval** before merging

### Merge Requirements

- **All checks passing**
- **At least one approval**
- **No merge conflicts**
- **Up-to-date with target branch**

## 🐛 Issue Guidelines

### Bug Reports

When reporting bugs, include:

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

### Feature Requests

When requesting features, include:

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## 🚀 Release Process

### Version Numbering

We follow **Semantic Versioning** (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with new features/fixes
3. **Create release branch** from `main`
4. **Test release** thoroughly
5. **Create GitHub release** with release notes
6. **Deploy to production**

### Changelog Format

```markdown
## [1.2.0] - 2024-01-15

### Added
- New user dashboard with spending insights
- Dark mode support
- Export transactions to CSV

### Changed
- Improved transaction categorization accuracy
- Updated UI components to latest design system

### Fixed
- Fixed issue with transaction sync
- Resolved memory leak in dashboard
- Fixed mobile responsiveness issues

### Security
- Updated dependencies to latest versions
- Improved input validation
```

## 🧪 Testing Guidelines

### Unit Tests

- **Test business logic** thoroughly
- **Mock external dependencies**
- **Use descriptive test names**
- **Follow AAA pattern** (Arrange, Act, Assert)

```typescript
// ✅ Good test
describe('TransactionAnalyzer', () => {
  it('should classify grocery purchase as responsible', async () => {
    // Arrange
    const transaction = {
      description: 'Whole Foods - $45',
      amount: 45,
      category: 'groceries'
    };
    
    // Act
    const result = await analyzeTransaction(transaction);
    
    // Assert
    expect(result.classification).toBe('responsible');
    expect(result.reasoning).toContain('essential');
  });
});
```

### Integration Tests

- **Test API endpoints** with real database
- **Test user workflows** end-to-end
- **Use test database** for isolation

### Manual Testing

- **Test on multiple browsers**
- **Test responsive design**
- **Test accessibility** with screen readers
- **Test performance** with large datasets

## 📚 Documentation

### Code Documentation

- **Use JSDoc** for functions and classes
- **Add inline comments** for complex logic
- **Update README** for new features
- **Keep API documentation** current

```typescript
/**
 * Analyzes a transaction using GPT and returns classification
 * @param transaction - The transaction to analyze
 * @returns Promise resolving to analysis result
 */
export async function analyzeTransaction(
  transaction: Transaction
): Promise<AnalysisResult> {
  // implementation
}
```

### README Updates

When adding new features, update:

- **Feature list** in README
- **Installation instructions** if changed
- **Configuration options** if new
- **Usage examples** if applicable

## 🎯 Performance Guidelines

### Frontend Performance

- **Use React.memo** for expensive components
- **Implement lazy loading** for large components
- **Optimize images** and assets
- **Use proper caching** strategies

### Backend Performance

- **Optimize database queries**
- **Use proper indexing**
- **Implement caching** where appropriate
- **Monitor API response times**

### Bundle Size

- **Keep bundle size** under 500KB
- **Use dynamic imports** for large libraries
- **Remove unused dependencies**
- **Optimize images** and assets

## 🔒 Security Guidelines

### Code Security

- **Validate all inputs** from users
- **Use parameterized queries** for database
- **Implement proper authentication** checks
- **Follow OWASP guidelines**

### API Security

- **Rate limiting** on API endpoints
- **Input sanitization** and validation
- **Proper error handling** (don't expose internals)
- **Use HTTPS** in production

### Dependency Security

- **Regular dependency updates**
- **Use npm audit** to check for vulnerabilities
- **Keep dependencies minimal**
- **Use lock files** for reproducible builds

## 🎉 Recognition

We appreciate all contributions! Contributors will be:

- **Listed in CONTRIBUTORS.md**
- **Mentioned in release notes**
- **Given credit** in relevant documentation
- **Invited to team discussions** for major contributors

## 📞 Getting Help

### Resources

- **GitHub Discussions**: For questions and ideas
- **GitHub Issues**: For bugs and feature requests
- **Team Chat**: For quick questions
- **Code Reviews**: For feedback and learning

### Mentorship

New contributors can:

- **Request a mentor** for guidance
- **Join pair programming** sessions
- **Attend team meetings** to learn
- **Ask questions** in team channels

---

## 🚀 Ready to Contribute?

1. **Read this guide** thoroughly
2. **Set up your development environment**
3. **Pick an issue** labeled "good first issue"
4. **Start coding** and have fun!

Thank you for contributing to Capling! 🦕
