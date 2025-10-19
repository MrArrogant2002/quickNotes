# Docker Setup for QuickNotes

This document explains how to run QuickNotes using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed (Windows/Mac) or Docker Engine (Linux)
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### 1. Environment Setup

Create a `.env` file in the project root:

```bash
cp .env.docker.example .env
```

Edit the `.env` file and set your `NEXTAUTH_SECRET`:

```env
DATABASE_URL=mongodb://mongodb:27017/quicknotes
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secure-secret-key-here
NODE_ENV=production
```

To generate a secure secret, run:
```bash
openssl rand -base64 32
```

### 2. Build and Run

Build and start all services:

```bash
docker-compose up --build
```

Or run in detached mode:

```bash
docker-compose up -d --build
```

The application will be available at: **http://localhost:3000**

### 3. Stop the Application

```bash
docker-compose down
```

To remove volumes (database data) as well:

```bash
docker-compose down -v
```

## Docker Commands

### View Running Containers

```bash
docker-compose ps
```

### View Logs

All services:
```bash
docker-compose logs -f
```

Specific service:
```bash
docker-compose logs -f app
docker-compose logs -f mongodb
```

### Execute Commands in Container

Access the app container shell:
```bash
docker-compose exec app sh
```

Access MongoDB shell:
```bash
docker-compose exec mongodb mongosh
```

### Run Prisma Commands

Generate Prisma Client:
```bash
docker-compose exec app npx prisma generate
```

Push database schema:
```bash
docker-compose exec app npx prisma db push
```

Open Prisma Studio:
```bash
docker-compose exec app npx prisma studio
```

### Rebuild Containers

Rebuild after code changes:
```bash
docker-compose up --build
```

Force rebuild without cache:
```bash
docker-compose build --no-cache
docker-compose up
```

## Architecture

### Services

1. **app** (Next.js Application)
   - Port: 3000
   - Built from Dockerfile using multi-stage build
   - Optimized production image with standalone output
   - Depends on MongoDB

2. **mongodb** (MongoDB Database)
   - Port: 27017
   - Persistent data using Docker volumes
   - Health checks enabled
   - No authentication (for development)

### Networking

- Both services run on a custom bridge network: `quicknotes-network`
- Services can communicate using service names (e.g., `mongodb`)
- MongoDB is accessible from host at `localhost:27017`

### Volumes

- `mongodb_data`: Stores MongoDB database files
- `mongodb_config`: Stores MongoDB configuration files
- Ensures data persistence across container restarts

## Dockerfile Explanation

The Dockerfile uses a **multi-stage build** for optimization:

1. **deps**: Installs dependencies using pnpm
2. **builder**: Builds the Next.js application
3. **runner**: Creates minimal production image

Benefits:
- Smaller final image size
- Faster builds with layer caching
- Secure (runs as non-root user)
- Optimized for production

## Production Deployment

### Environment Variables

For production, update these environment variables:

```env
DATABASE_URL=mongodb://your-production-mongodb:27017/quicknotes
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=very-secure-random-string
NODE_ENV=production
```

### Security Considerations

1. **MongoDB Authentication**: Enable authentication in production
2. **HTTPS**: Use a reverse proxy (nginx, Traefik) with SSL/TLS
3. **Secrets**: Use Docker secrets or environment variable management
4. **Network**: Restrict port exposure in production
5. **Updates**: Regularly update base images and dependencies

### Docker Hub Deployment

Build and tag the image:
```bash
docker build -t yourusername/quicknotes:latest .
```

Push to Docker Hub:
```bash
docker push yourusername/quicknotes:latest
```

### Cloud Deployment

The Docker setup is compatible with:
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**
- **Railway**
- **Render**

## Troubleshooting

### Port Already in Use

If port 3000 or 27017 is already in use, update the ports in `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "3001:3000"  # Change host port
  mongodb:
    ports:
      - "27018:27017"  # Change host port
```

### MongoDB Connection Issues

Check MongoDB health:
```bash
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Application Crashes

View logs:
```bash
docker-compose logs app
```

Restart the app:
```bash
docker-compose restart app
```

### Clear Everything and Start Fresh

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Development vs Production

### Development (Current Setup)

```bash
# Use local Node.js and MongoDB
pnpm dev
```

### Production (Docker)

```bash
# Use containerized setup
docker-compose up
```

You can run both setups, but make sure to use different MongoDB ports to avoid conflicts.

## Performance Tips

1. **Build Cache**: Docker caches layers, subsequent builds are faster
2. **Volume Mounts**: For development, mount code as volume for hot reload
3. **Resources**: Allocate sufficient CPU/RAM in Docker Desktop settings
4. **Prune**: Regularly clean unused images/volumes: `docker system prune`

## Monitoring

For production monitoring, consider adding:
- **Logging**: ELK Stack, Grafana Loki
- **Metrics**: Prometheus + Grafana
- **Tracing**: Jaeger, Zipkin
- **Health Checks**: Built-in Docker health checks

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Verify environment variables: `docker-compose config`
3. Test MongoDB connection: `docker-compose exec mongodb mongosh`
4. Rebuild containers: `docker-compose up --build`
