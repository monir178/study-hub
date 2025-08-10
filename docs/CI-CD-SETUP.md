# 🔄 CI/CD Pipeline Documentation

## Overview

This project uses a comprehensive CI/CD pipeline with GitHub Actions and Vercel for automated testing, quality checks, and deployment.

## 🏗️ Pipeline Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Code Push     │───▶│   CI Pipeline   │───▶│   Deployment    │
│                 │    │                 │    │                 │
│ • Git Push      │    │ • Quality       │    │ • Production    │
│ • Pull Request  │    │ • Build         │    │ • Preview       │
│                 │    │ • Test          │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔍 CI Pipeline Stages

### 1. **Setup Dependencies**

- Installs Node.js 18 and pnpm
- Caches dependencies for faster subsequent runs
- Uses frozen lockfile for consistent dependency versions

### 2. **Code Quality Checks**

- **ESLint**: Checks for code style and potential errors
- **TypeScript**: Validates type safety
- **Prettier**: Ensures consistent code formatting

### 3. **Build Verification**

- Tests production build process
- Validates that the application can be built successfully
- Uploads build artifacts for deployment

### 4. **Automated Testing**

- Runs Jest test suite
- Generates code coverage reports
- Ensures all functionality works as expected

### 5. **Security Audit**

- Checks for known vulnerabilities in dependencies
- Runs pnpm audit with moderate level security checks

## 🚀 Deployment Workflows

### Production Deployment (`main` branch)

- **Trigger**: Push to `main` branch
- **Process**:
  1. CI pipeline must pass completely
  2. Automatic deployment to Vercel production
  3. Live at your production URL

### Preview Deployment (Pull Requests)

- **Trigger**: Opening/updating a pull request
- **Process**:
  1. Creates temporary preview environment
  2. Comments on PR with preview URL
  3. Perfect for testing and code review

## 📋 Setup Instructions

### 1. **GitHub Repository Setup**

```bash
# Ensure workflows are in the correct location
.github/workflows/
├── ci.yml        # Main CI pipeline
├── deploy.yml    # Production deployment
└── preview.yml   # Preview deployments
```

### 2. **Vercel Integration**

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Connect to Vercel

```bash
vercel login
vercel link
```

#### Step 3: Get Vercel Token

1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Create a new token
3. Copy the token value

#### Step 4: Set GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

- `VERCEL_TOKEN`: Your Vercel token
- `VERCEL_ORG_ID`: Found in `.vercel/project.json`
- `VERCEL_PROJECT_ID`: Found in `.vercel/project.json`

### 3. **Environment Variables**

Add your environment variables in Vercel dashboard:

- Go to Project Settings → Environment Variables
- Add all your `.env` variables
- Set appropriate scopes (Production, Preview, Development)

## 🎯 What Happens When You...

### Push to `main` branch:

1. ✅ CI pipeline runs (quality, build, test, security)
2. 🚀 If CI passes → Automatic production deployment
3. 🌐 Live on your production URL
4. 📧 Deployment notifications

### Open a Pull Request:

1. ✅ CI pipeline runs for validation
2. 🔍 Preview deployment created
3. 💬 Bot comments with preview URL
4. 👥 Team can test changes before merging

### Push to PR branch:

1. ✅ CI re-runs with latest changes
2. 🔄 Preview deployment updates automatically
3. 🔗 Same preview URL, new content

## ⚙️ Available Scripts

### Local Development

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
```

### Quality Assurance

```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm type-check       # Check TypeScript
pnpm format           # Format with Prettier
pnpm format:check     # Check Prettier formatting
```

### Testing

```bash
pnpm test             # Run tests
pnpm test:ci          # Run tests for CI
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
```

### Security

```bash
pnpm audit            # Security audit
```

## 🚨 Pipeline Failure Handling

### If CI Fails:

1. **Check the GitHub Actions tab** in your repository
2. **Review the failed step** logs
3. **Fix the issue** locally
4. **Push the fix** → Pipeline re-runs automatically

### Common Issues:

- **ESLint errors**: Run `pnpm lint:fix`
- **TypeScript errors**: Fix type issues
- **Test failures**: Debug and fix failing tests
- **Build failures**: Check for missing dependencies

## 📊 Monitoring & Notifications

### GitHub Actions Dashboard

- View all pipeline runs
- Download artifacts (build files, coverage reports)
- Check detailed logs for each step

### Vercel Dashboard

- Monitor deployment status
- View preview URLs
- Check performance metrics
- Manage environment variables

## 🔒 Security Best Practices

1. **Never commit secrets** to the repository
2. **Use GitHub Secrets** for sensitive data
3. **Regularly update dependencies** (`pnpm update`)
4. **Monitor security advisories**
5. **Use environment-specific configurations**

## 🎉 Benefits You Get

### For Development:

- ✅ **Early bug detection**
- 🔄 **Consistent code quality**
- 🧪 **Automated testing**
- 📝 **Code review improvements**

### For Deployment:

- 🚀 **Zero-downtime deployments**
- 🔙 **Easy rollbacks**
- 🌐 **Preview environments**
- 📊 **Deployment tracking**

### For Team:

- 👥 **Collaborative reviews**
- 🔒 **Protected main branch**
- 📈 **Deployment confidence**
- ⚡ **Faster releases**

## 🛠️ Customization

You can customize the pipeline by modifying the workflow files:

- **Add more quality checks** in `ci.yml`
- **Configure deployment environments** in `deploy.yml`
- **Customize preview comments** in `preview.yml`
- **Add notification integrations** (Slack, Discord, etc.)

---

**Ready to deploy? Push your changes and watch the magic happen! 🪄**
