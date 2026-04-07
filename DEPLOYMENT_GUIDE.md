# Vercel Deployment Guide

## Prerequisites

Before deploying to Vercel, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your project pushed to GitHub
3. **Database**: PostgreSQL database with connection URLs ready

## Step 1: Set Up Environment Variables in Vercel

When deploying to Vercel, you **must** configure environment variables in the Vercel project settings. Follow these steps:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

```
DATABASE_URL = postgresql://user:password@host/database?sslmode=require
DIRECT_URL = postgresql://user:password@host/database?sslmode=require
```

**Important**: 
- Get `DATABASE_URL` from your database provider with **connection pooling ON**
- Get `DIRECT_URL` from your database provider with connection pooling **OFF** (needed for Prisma migrations)
- These values should be set for **Production**, **Preview**, and **Development** environments

## Step 2: Important Security Notes

⚠️ **WARNING**: Never commit `.env.local` or `.env.production.local` files to GitHub!

The `.gitignore` file already protects `.env*` files, but ensure:

1. Your `.env.local` file is NOT tracked by Git:
   ```bash
   git rm --cached .env.local
   git commit -m "Remove .env.local from tracking"
   ```

2. Local environment variables should only be in your `.env.local` (not committed)

3. For reference, use `.env.example` to document required variables

## Step 3: Automatic Prisma Setup

The `package.json` now includes:
- **`postinstall` script**: Automatically generates Prisma client during `pnpm install`
- **`build` script**: Ensures Prisma client is generated before building

This means:
- ✅ Prisma client will automatically generate on Vercel
- ✅ Your database migrations are ready during build

## Step 4: Deploy

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **New Project** or **Add New** → **Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click **Deploy**

Vercel will:
1. Install dependencies with `pnpm install`
2. Run `postinstall` (generates Prisma client)
3. Run `pnpm run build` (with Prisma already generated)
4. Deploy the project

## Troubleshooting

### Issue: "DATABASE_URL is not set"

**Solution**: 
- Double-check that `DATABASE_URL` and `DIRECT_URL` are set in Vercel Environment Variables
- Wait 2-3 minutes after setting environment variables before redeploying

### Issue: "Prisma client not generated"

**Solution**: 
- Check that the `postinstall` script is in `package.json` (already configured)
- Redeploy with `pnpm install` to regenerate

### Issue: Database connection fails on Vercel

**Solution**:
- Ensure your database allows connections from Vercel's IP ranges
- For Neon PostgreSQL: Allow "All IPS" or add Vercel's IP range
- For other providers: Check your firewall settings

## Local Development

To run locally:

```bash
# Install dependencies (this runs postinstall and generates Prisma client)
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual database URLs

# Generate Prisma client (if needed)
pnpm run db:generate

# Run development server
pnpm run dev
```

## Database Migrations

For production database updates on Vercel:

1. Create migration locally:
   ```bash
   pnpm run db:migrate
   ```

2. Test and commit migration files

3. Vercel will apply migrations during deployment (if configured in schema)

For more info: [Prisma Deployment Docs](https://www.prisma.io/docs/orm/prisma-migrate/deployment)
