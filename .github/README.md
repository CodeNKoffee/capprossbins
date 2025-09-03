# GitHub Actions Setup for CapprossBins Frontend

## 🚀 Overview

This document explains the GitHub Actions CI/CD setup for the CapprossBins frontend, including how to configure secrets and deploy to various platforms.

## 📁 Workflow Files

### `ci-cd.yml` - Main CI/CD Pipeline
- **Triggers**: Push to `main`, `master`, `develop`, `feat/full-app` branches and PRs
- **Jobs**:
  - `test-and-build`: Builds and tests the app on Node 18.x and 20.x
  - `lighthouse-audit`: Performance testing (PR only)
  - `security-scan`: Security vulnerability scanning
  - `deployment-ready`: Prepares deployment artifacts (main branch only)

### `deploy.yml` - Deployment Pipeline
- **Triggers**: After successful CI/CD completion
- **Jobs**:
  - `deploy-production`: Deploys to Vercel production
  - `deploy-preview`: Creates preview deployments for PRs
  - `deploy-custom`: Alternative custom server deployment (disabled by default)

## 🔧 Required Secrets Setup

### For Vercel Deployment (Recommended)

1. **Get Vercel Project Info**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login and get project details
   vercel login
   vercel link
   ```

2. **Add GitHub Secrets**:
   Go to `Settings > Secrets and variables > Actions` in your GitHub repository and add:

   ```
   VERCEL_TOKEN=your_vercel_token_here
   VERCEL_ORG_ID=your_org_id_here
   VERCEL_PROJECT_ID=your_project_id_here
   ```

   **How to get these values**:
   - `VERCEL_TOKEN`: Create at https://vercel.com/account/tokens
   - `VERCEL_ORG_ID` & `VERCEL_PROJECT_ID`: Found in `.vercel/project.json` after `vercel link`

### For Custom Server Deployment (Optional)

If you prefer to deploy to your own server instead of Vercel:

1. **Enable Custom Deployment**:
   In `.github/workflows/deploy.yml`, change:
   ```yaml
   if: false # Change this to 'true'
   ```

2. **Add GitHub Secrets**:
   ```
   SSH_PRIVATE_KEY=your_ssh_private_key
   SERVER_IP=your_server_ip_address
   SERVER_USER=your_server_username
   ```

## 🌐 Backend Connection Configuration

The workflows automatically configure the frontend to connect to your backend:

```bash
# Environment variable set in workflows
NEXT_PUBLIC_API_URL=https://capprossbins-server.onrender.com
```

This is already configured in:
- `.github/workflows/ci-cd.yml`
- `.github/workflows/deploy.yml`
- `lib/api.ts`
- `.env` file

## 🧪 Testing the Connection

### Automated Testing
The workflows include automatic backend connection testing during build.

### Manual Testing

1. **In Development**:
   ```bash
   npm run dev
   # Check browser console for connection test results
   ```

2. **Test API Directly**:
   ```bash
   # Test backend health endpoint
   curl https://capprossbins-server.onrender.com/api/health
   
   # Expected response:
   # {
   #   "status": "healthy",
   #   "version": "2.5.1",
   #   "algorithms": "loaded"
   # }
   ```

3. **In Browser Console**:
   ```javascript
   // Run connection test
   const { testBackendConnection } = await import('/lib/api-test')
   const result = await testBackendConnection()
   console.log(result)
   ```

## 📋 Deployment Process

### Automatic Deployment (Vercel)
1. Push to `main` or `master` branch
2. CI/CD pipeline runs tests and builds
3. If successful, deployment workflow triggers
4. App deploys to Vercel production

### Preview Deployments
1. Create a Pull Request
2. CI/CD pipeline runs
3. Preview deployment is created
4. PR comment includes preview URL

### Manual Deployment
```bash
# Trigger manual deployment
gh workflow run deploy.yml -f environment=production
```

## 🔍 Monitoring & Debugging

### Check Workflow Status
- Go to your repository's **Actions** tab
- View workflow runs and logs
- Download artifacts for debugging

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Deployment Failures**:
   - Verify Vercel secrets are correct
   - Check API endpoint availability
   - Review deployment logs

3. **Connection Issues**:
   - Verify backend is running at `https://capprossbins-server.onrender.com`
   - Check CORS configuration
   - Test API endpoints manually

## 🚀 Quick Start

1. **Add this folder to your repository**:
   ```bash
   git add .github/
   git commit -m "Add GitHub Actions CI/CD workflows"
   git push
   ```

2. **Configure Vercel secrets** (see above)

3. **Push to main branch** to trigger first deployment

4. **Check Actions tab** to monitor progress

## 📊 Features

- ✅ Multi-Node.js version testing (18.x, 20.x)
- ✅ Automated TypeScript checking
- ✅ ESLint code quality checks
- ✅ Security vulnerability scanning
- ✅ Performance auditing with Lighthouse
- ✅ Automatic backend connection testing
- ✅ Preview deployments for PRs
- ✅ Production deployments to Vercel
- ✅ Build artifact management
- ✅ Comprehensive logging and monitoring

---

**Need Help?** 
- Check the Actions tab for detailed logs
- Review the workflow files for configuration
- Test API connection manually using the provided tools
