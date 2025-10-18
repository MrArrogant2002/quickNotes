# Vercel Deployment Guide for QuickNotes

This guide will help you deploy QuickNotes to Vercel with all necessary configurations.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier available)
3. Your GitHub repository connected to Vercel

## Step 1: Set Up MongoDB Atlas

1. Create a free MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for Vercel access
4. Get your connection string (it should look like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/quicknotes?retryWrites=true&w=majority
   ```

## Step 2: Generate NextAuth Secret

Run this command in your terminal to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output - you'll need it for environment variables.

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `pnpm install && prisma generate && next build`
   - **Install Command**: `pnpm install`
   - **Output Directory**: .next

5. Add Environment Variables:
   ```
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/quicknotes?retryWrites=true&w=majority
   NEXTAUTH_URL=https://your-project-name.vercel.app
   NEXTAUTH_SECRET=your-generated-secret-from-step-2
   ```

6. Click "Deploy"

### Option B: Via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables:
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   ```

5. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

## Step 4: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your MongoDB Atlas connection string | Production, Preview, Development |
| `NEXTAUTH_URL` | Your Vercel app URL (e.g., https://quicknotes.vercel.app) | Production |
| `NEXTAUTH_SECRET` | Your generated secret | Production, Preview, Development |

**Important Notes:**
- Make sure to replace `username`, `password`, and `cluster` in the MongoDB URL
- For `NEXTAUTH_URL`, use your actual Vercel deployment URL
- Keep `NEXTAUTH_SECRET` secure and never commit it to git

## Step 5: Initialize Database

After deployment, you need to push the Prisma schema to your database:

1. In your Vercel project, go to Settings → General → Git
2. Note your main branch name
3. In your local repository:
   ```bash
   # Set the DATABASE_URL temporarily
   export DATABASE_URL="your-mongodb-atlas-url"
   
   # Push the schema to MongoDB
   pnpm prisma db push
   ```

Alternatively, you can use Vercel's serverless functions to initialize the database on first use.

## Step 6: Test Your Deployment

1. Visit your deployed app at `https://your-project-name.vercel.app`
2. Register a new account
3. Create a test note
4. Verify all features work correctly

## Troubleshooting

### Build Fails

**Error**: "Prisma Client could not be generated"
- **Solution**: Make sure `prisma generate` is in your build command

**Error**: "DATABASE_URL environment variable not found"
- **Solution**: Add DATABASE_URL to environment variables in Vercel dashboard

### Runtime Errors

**Error**: "Database connection failed"
- **Solution**: Verify MongoDB Atlas connection string is correct
- **Solution**: Check that IP whitelist includes 0.0.0.0/0 in MongoDB Atlas

**Error**: "NextAuth configuration error"
- **Solution**: Verify NEXTAUTH_URL matches your Vercel deployment URL
- **Solution**: Verify NEXTAUTH_SECRET is set

### Performance Issues

If you experience slow cold starts:
1. Consider upgrading to Vercel Pro for better performance
2. Use MongoDB Atlas M10+ cluster for better database performance
3. Implement edge caching for static content

## Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to main/master branch
- **Preview**: When you create/update a pull request

## Custom Domain

To add a custom domain:
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable to use your custom domain

## Monitoring

Monitor your deployment:
- **Logs**: Vercel Dashboard → Your Project → Deployments → Click deployment → Logs
- **Analytics**: Vercel Dashboard → Your Project → Analytics
- **Errors**: Check MongoDB Atlas logs and Vercel function logs

## Scaling

For production use with many users:
1. Upgrade MongoDB Atlas cluster (M10+)
2. Consider Vercel Pro for better performance
3. Implement rate limiting
4. Add CDN for static assets
5. Enable Vercel Analytics and Web Vitals

## Environment-Specific Configuration

For different environments:

### Production
```env
DATABASE_URL=mongodb+srv://prod-user:password@prod-cluster.mongodb.net/quicknotes
NEXTAUTH_URL=https://quicknotes.vercel.app
NEXTAUTH_SECRET=your-production-secret
```

### Preview (PR deployments)
```env
DATABASE_URL=mongodb+srv://preview-user:password@preview-cluster.mongodb.net/quicknotes
NEXTAUTH_URL=https://quicknotes-preview.vercel.app
NEXTAUTH_SECRET=your-preview-secret
```

### Development
```env
DATABASE_URL=mongodb://localhost:27017/quicknotes
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-development-secret
```

## Security Checklist

- ✅ NEXTAUTH_SECRET is strong and unique
- ✅ MongoDB credentials are secure
- ✅ Environment variables are not committed to git
- ✅ MongoDB Atlas IP whitelist is configured
- ✅ All dependencies are up to date
- ✅ HTTPS is enabled (automatic with Vercel)

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/

## Quick Deploy Button

Add this to your README.md for one-click deployment:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/quicknotes&env=DATABASE_URL,NEXTAUTH_URL,NEXTAUTH_SECRET)
```

Replace `yourusername/quicknotes` with your actual repository path.
