# Docker Setup Guide - CoverageX

This guide explains how to run the entire CoverageX To-Do application stack using Docker.

---

## Quick Start

### Start the entire application with one command:

```bash
docker-compose up --build
```

That's it! The command will:
1. Build all Docker images (db, backend, frontend)
2. Create a custom network for service communication
3. Start all services in the correct order with health checks
4. Initialize the database with schema and sample data

### Access the application:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Checks**:
  - Backend: http://localhost:5000/health
  - Frontend: http://localhost:3000/health

---

## Docker Services

### 1. Database (MySQL 8.0)
- **Container**: `coveragex-db`
- **Port**: 3306 (exposed on localhost:3306)
- **Volume**: `db-data` (persistent storage)
- **Initialization**: Runs `database/init.sql` on first start

### 2. Backend API (Node.js + Express)
- **Container**: `coveragex-backend`
- **Port**: 5000 (exposed on localhost:5000)
- **Depends on**: Database (waits for healthy status)
- **Environment**: Production mode

### 3. Frontend (React + Nginx)
- **Container**: `coveragex-frontend`
- **Port**: 3000 (exposed on localhost:3000)
- **Depends on**: Backend (waits for healthy status)
- **Serves**: Built React application

---

## Commands

### Start services (detached mode)
```bash
docker-compose up -d
```

### Start services with rebuild
```bash
docker-compose up --build
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stop services
```bash
docker-compose down
```

### Stop services and remove volumes (clean slate)
```bash
docker-compose down -v
```

### View running containers
```bash
docker-compose ps
```

### Restart a specific service
```bash
docker-compose restart backend
docker-compose restart frontend
```

---

## Architecture

```
┌─────────────────────┐
│   User Browser      │
└──────────┬──────────┘
           │
           │ HTTP (localhost:3000)
           ↓
┌─────────────────────┐
│   Frontend          │
│   (Nginx + React)   │
│   Port: 3000        │
└──────────┬──────────┘
           │
           │ HTTP API (localhost:5000/api)
           ↓
┌─────────────────────┐
│   Backend           │
│   (Express API)     │
│   Port: 5000        │
└──────────┬──────────┘
           │
           │ MySQL Connection (internal)
           ↓
┌─────────────────────┐
│   Database          │
│   (MySQL 8.0)       │
│   Port: 3306        │
│   Volume: db-data   │
└─────────────────────┘

Network: app-network (bridge)
```

---

## Health Checks

All services have health checks configured:

### Database
- **Check**: `mysqladmin ping`
- **Interval**: 10s
- **Start period**: 30s

### Backend
- **Check**: HTTP GET to `/health`
- **Interval**: 30s
- **Start period**: 40s

### Frontend
- **Check**: HTTP GET to `/health`
- **Interval**: 30s
- **Start period**: 40s

---

## Startup Sequence

1. **Database** starts first
   - Waits for MySQL to be ready (health check)
   - Runs initialization script

2. **Backend** starts after database is healthy
   - Connects to database
   - Starts API server
   - Waits for health check to pass

3. **Frontend** starts after backend is healthy
   - Serves built React application
   - Ready to accept connections

---

## Environment Variables

Environment variables are configured in `docker-compose.yml`:

### Backend Environment:
```yaml
PORT: 5000
NODE_ENV: production
DB_HOST: db                    # Docker service name
DB_PORT: 3306                  # Internal port
DB_USER: root
DB_PASSWORD: rootpassword
DB_NAME: todoapp
```

### Frontend Build Args:
```yaml
VITE_API_BASE_URL: http://localhost:5000/api
```

---

## Volumes

### Database Volume (`db-data`)
- **Type**: Named volume
- **Purpose**: Persist MySQL data between container restarts
- **Location**: Managed by Docker

**View volume:**
```bash
docker volume ls
docker volume inspect coveragex_db-data
```

**Remove volume (warning: deletes all data):**
```bash
docker-compose down -v
```

---

## Network

### Custom Bridge Network (`app-network`)
- All services communicate via this network
- Services can reach each other using service names
- Example: Backend connects to database using hostname `db`

---

## Troubleshooting

### Issue: "Port already in use"

**Solution**: Check if services are already running
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :3306

# Linux/Mac
lsof -i :3000
lsof -i :5000
lsof -i :3306

# Stop conflicting services or use different ports
```

### Issue: "Database connection failed"

**Solution**: Check database health
```bash
docker-compose logs db
docker-compose ps

# Restart database
docker-compose restart db
```

### Issue: "Frontend shows blank page"

**Solution**: 
1. Check if backend is accessible:
   ```bash
   curl http://localhost:5000/health
   ```
2. Check frontend logs:
   ```bash
   docker-compose logs frontend
   ```
3. Hard refresh browser: `Ctrl+Shift+R`

### Issue: "Services fail to start"

**Solution**: Clean build and restart
```bash
# Stop everything
docker-compose down -v

# Remove old images
docker-compose rm -f

# Rebuild and start
docker-compose up --build
```

---

## Development vs Production

### Development (separate terminals):
```bash
# Terminal 1: Database only
docker-compose up db

# Terminal 2: Backend (local)
cd backend && npm run dev

# Terminal 3: Frontend (local)
cd frontend && npm run dev
```

### Production (single command):
```bash
docker-compose up --build
```

---

## Testing with Docker

### Run backend tests in container:
```bash
# Build backend
docker-compose build backend

# Run tests
docker-compose run --rm backend npm test
```

### Run frontend tests in container:
```bash
# Build frontend
docker-compose build frontend

# Run tests (during build stage)
docker-compose run --rm --entrypoint npm frontend test
```

---

## Cleanup

### Remove stopped containers:
```bash
docker-compose rm
```

### Remove all project containers, networks, and volumes:
```bash
docker-compose down -v --rmi local
```

### Remove all Docker data (warning: affects all projects):
```bash
docker system prune -a --volumes
```

---

## Ports Summary

| Service  | Internal Port | External Port | Access URL |
|----------|---------------|---------------|------------|
| Frontend | 3000          | 3000          | http://localhost:3000 |
| Backend  | 5000          | 5000          | http://localhost:5000 |
| Database | 3306          | 3306          | localhost:3306 |

---

## Production Deployment

For production deployment (AWS, Azure, GCP):

1. **Update environment variables** in docker-compose.yml
2. **Use secrets management** for sensitive data
3. **Configure reverse proxy** (Nginx/Traefik)
4. **Set up SSL/TLS** certificates
5. **Use container orchestration** (Kubernetes, Docker Swarm)
6. **Enable monitoring** and logging

---

## Success Criteria

After `docker-compose up --build`, you should see:

✅ All 3 containers running:
```bash
$ docker-compose ps
NAME                  STATUS          PORTS
coveragex-db          Up (healthy)    0.0.0.0:3306->3306/tcp
coveragex-backend     Up (healthy)    0.0.0.0:5000->5000/tcp
coveragex-frontend    Up (healthy)    0.0.0.0:3000->3000/tcp
```

✅ Application accessible at http://localhost:3000

✅ Can create, view, and complete tasks

✅ Data persists after restart

---

**Ready to Deploy! 🚀**
