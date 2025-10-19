# Deployment Guide for QuickNotes

This guide covers deployment options for QuickNotes application.

## 🌐 Deployment Options

### 1. Vercel (Recommended for Next.js)

**Pros**: Zero-config, automatic HTTPS, global CDN, serverless functions
**Cons**: Need external MongoDB

#### Steps:

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/quicknotes.git
git push -u origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project

3. **Environment Variables**

Add these in Vercel dashboard:
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/quicknotes
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=[your-secure-secret]
```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

#### MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Update DATABASE_URL in Vercel

---

### 2. Railway

**Pros**: Easy deployment, built-in MongoDB, affordable
**Cons**: Paid service after trial

#### Steps:

1. **Install Railway CLI**
```bash
npm install -g railway
```

2. **Login and Initialize**
```bash
railway login
railway init
```

3. **Add MongoDB Plugin**
   - Go to Railway dashboard
   - Add MongoDB plugin to project
   - Copy connection string

4. **Set Environment Variables**
```bash
railway variables set NEXTAUTH_SECRET=your-secret
railway variables set NEXTAUTH_URL=https://your-app.up.railway.app
```

5. **Deploy**
```bash
railway up
```

---

### 3. DigitalOcean App Platform

**Pros**: Simple, managed service, good pricing
**Cons**: Need external database or droplet

#### Steps:

1. **Create App**
   - Go to DigitalOcean dashboard
   - Create new App from GitHub

2. **Configure Build**
   - Build Command: `pnpm install && pnpm build`
   - Run Command: `pnpm start`

3. **Add MongoDB**
   - Create managed MongoDB database
   - Or use MongoDB droplet

4. **Environment Variables**
   - Add in App settings
   - DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET

5. **Deploy**
   - Click deploy
   - App will be live at provided URL

---

### 4. Docker + VPS (Self-hosted)

**Pros**: Full control, cost-effective for multiple apps
**Cons**: Manual setup and maintenance

#### Steps:

1. **Get VPS**
   - DigitalOcean, Linode, Vultr, AWS EC2
   - Minimum: 2GB RAM, 2 CPU cores

2. **Install Docker**
```bash
# On Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose
```

3. **Clone Repository**
```bash
git clone https://github.com/yourusername/quicknotes.git
cd quicknotes
```

4. **Configure Environment**
```bash
cp .env.docker.example .env
nano .env  # Edit with your values
```

5. **Deploy**
```bash
docker-compose up -d
```

6. **Set up Reverse Proxy (nginx)**
```bash
# Install nginx
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/quicknotes
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/quicknotes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Enable HTTPS with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### 5. AWS ECS/Fargate

**Pros**: Scalable, managed container service
**Cons**: Complex setup, higher cost

#### Steps:

1. **Build and Push Image**
```bash
# Build image
docker build -t quicknotes:latest .

# Tag for ECR
docker tag quicknotes:latest your-account.dkr.ecr.region.amazonaws.com/quicknotes:latest

# Login to ECR
aws ecr get-login-password --region region | docker login --username AWS --password-stdin your-account.dkr.ecr.region.amazonaws.com

# Push
docker push your-account.dkr.ecr.region.amazonaws.com/quicknotes:latest
```

2. **Create Task Definition**
   - Define container (image, CPU, memory)
   - Add environment variables
   - Configure networking

3. **Create Service**
   - Choose Fargate launch type
   - Configure load balancer
   - Set desired tasks count

4. **Configure MongoDB**
   - Use MongoDB Atlas
   - Or AWS DocumentDB

---

### 6. Google Cloud Run

**Pros**: Serverless, pay-per-use, auto-scaling
**Cons**: Need external MongoDB

#### Steps:

1. **Build and Push to GCR**
```bash
# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build
gcloud builds submit --tag gcr.io/PROJECT-ID/quicknotes

# Or using Docker
docker build -t gcr.io/PROJECT-ID/quicknotes .
docker push gcr.io/PROJECT-ID/quicknotes
```

2. **Deploy to Cloud Run**
```bash
gcloud run deploy quicknotes \
  --image gcr.io/PROJECT-ID/quicknotes \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=your-mongodb-url,NEXTAUTH_SECRET=your-secret
```

3. **Update NEXTAUTH_URL**
   - Get Cloud Run URL
   - Update environment variable

---

## 🔒 Production Security Checklist

### MongoDB
- [ ] Enable authentication
- [ ] Use connection string with credentials
- [ ] Whitelist only necessary IPs
- [ ] Enable SSL/TLS
- [ ] Regular backups
- [ ] Monitor query performance

### Application
- [ ] Set strong NEXTAUTH_SECRET (32+ chars)
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set secure headers
- [ ] Enable rate limiting
- [ ] Add error monitoring (Sentry)
- [ ] Set up logging (Winston, Pino)
- [ ] Configure CORS properly
- [ ] Remove console.logs from production
- [ ] Set NODE_ENV=production

### Infrastructure
- [ ] Use firewall rules
- [ ] Enable DDoS protection
- [ ] Set up monitoring/alerts
- [ ] Configure auto-scaling
- [ ] Regular security updates
- [ ] Backup strategy
- [ ] Disaster recovery plan

---

## 📊 Performance Optimization

### Next.js
```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  images: {
    domains: ['your-cdn.com'],
  },
}
```

### Database
- Create indexes on frequently queried fields
- Use MongoDB aggregation for complex queries
- Enable connection pooling
- Cache frequently accessed data (Redis)

### CDN
- Use Vercel's Edge Network
- Or CloudFlare CDN
- Optimize images with Next.js Image component

---

## 🔍 Monitoring

### Application Monitoring
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **New Relic**: APM

### Infrastructure Monitoring
- **Datadog**: Full-stack monitoring
- **Prometheus + Grafana**: Metrics and dashboards
- **UptimeRobot**: Uptime monitoring

### Database Monitoring
- **MongoDB Atlas**: Built-in monitoring
- **MongoDB Cloud Manager**: Advanced monitoring

---

## 💰 Cost Estimates

### Free Tier
- **Vercel**: Free (hobby plan)
- **MongoDB Atlas**: Free (512MB)
- **Total**: $0/month ✨

### Small Production
- **Vercel Pro**: $20/month
- **MongoDB Atlas M10**: $57/month
- **Total**: ~$77/month

### Medium Production
- **Railway**: $5-20/month
- **MongoDB Atlas M20**: $107/month
- **Total**: ~$112-127/month

### Self-Hosted VPS
- **DigitalOcean Droplet (2GB)**: $12/month
- **Domain**: $10-15/year
- **Total**: ~$13/month

---

## 🚀 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '20'
    
    - name: Install pnpm
      run: npm install -g pnpm
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Build
      run: pnpm build
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
        NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
    
    - name: Deploy to Vercel
      run: vercel --prod
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test MongoDB connection
4. Check security groups/firewall rules
5. Review build logs

---

## 🎯 Recommended Setup

For most users:
**Vercel + MongoDB Atlas (Free Tier)**
- Zero DevOps required
- Auto-scaling
- Global CDN
- Free SSL
- Perfect for MVP and small apps

For teams/production:
**Railway/DigitalOcean + MongoDB Atlas M10+**
- Good balance of cost and features
- Managed services
- Good monitoring
- Scalable

For enterprise:
**AWS ECS + DocumentDB**
- High availability
- Advanced monitoring
- Full control
- Enterprise support

---

**Happy Deploying! 🚀**
