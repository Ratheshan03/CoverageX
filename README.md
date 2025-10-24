# TaskFlow - Modern To-Do Application

A beautifully designed, full-stack to-do application built with React, TypeScript, Express, and MySQL. Features a modern glassmorphism UI, comprehensive testing, and production-ready Docker deployment.

![TaskFlow](https://img.shields.io/badge/Status-Production%20Ready-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-19.x-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

---

## Features

### Core Functionality
- Create Tasks - Add tasks with title and description
- View Tasks - Display 5 most recent incomplete tasks
- Complete Tasks - Mark tasks as done with single click
- Real-time Updates - Instant UI updates with optimistic rendering
- Data Persistence - All tasks stored in MySQL database

### Technical Highlights
- Modern UI - Glassmorphism design with Tailwind CSS
- Type-Safe - Full TypeScript implementation
- Well-Tested - Unit, integration, and E2E tests
- Docker-Ready - Single command deployment
- Responsive - Works on desktop, tablet, and mobile
- Fast - Optimized builds with Vite
- Clean Code - SOLID principles and best practices


## Quick Start

### Prerequisites
- Node.js 20.x or higher
- Docker & Docker Compose
- Git

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd CoverageX
```

2. Start the application with Docker
```bash
docker-compose up --build
```

3. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Database: localhost:3306

That's it! The entire stack (Database, Backend, Frontend) is now running.

---

## Project Structure

```
CoverageX/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript types
│   ├── tests/              # Unit & integration tests
│   ├── Dockerfile          # Backend container config
│   └── package.json
│
├── frontend/                # React + TypeScript UI
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   └── types/          # TypeScript types
│   ├── Dockerfile          # Frontend container config
│   └── package.json
│
├── database/                # MySQL setup
│   └── init.sql            # Database schema
│
├── e2e-tests/              # Playwright E2E tests
│   ├── tests/              # Test scenarios
│   └── playwright.config.ts
│
├── docker-compose.yml       # Production orchestration
└── README.md               # This file
```


## Architecture

### System Overview

```
User Browser
     |
     v (HTTP)
Frontend (React + Tailwind)
     |
     v (REST API)
Backend (Express + TypeScript)
     |
     v (SQL)
Database (MySQL 8.0)
```

### Backend Layers

```
Routes → Controller → Service → Model → Database
```

---

## Technology Stack

### Frontend
- React 19.1.1 - UI framework
- TypeScript 5.9.3 - Type safety
- Tailwind CSS 3.4.0 - Styling
- Vite 7.1.7 - Build tool
- Axios 1.12.2 - HTTP client

### Backend
- Node.js 20.x - Runtime
- Express 4.18.2 - Web framework
- TypeScript 5.3.3 - Type safety
- MySQL2 3.6.5 - Database driver
- Jest 29.7.0 - Testing

### DevOps
- Docker & Docker Compose
- Nginx (Alpine) - Web server
- Playwright 1.40.1 - E2E testing

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Get milk, bread, and eggs"
}
```

Response (201 Created):
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Get milk, bread, and eggs",
  "completed": false,
  "created_at": "2025-10-24T10:30:00.000Z",
  "updated_at": "2025-10-24T10:30:00.000Z"
}
```

#### 2. Get Recent Tasks
```http
GET /api/tasks
```

Returns 5 most recent incomplete tasks.

#### 3. Complete Task
```http
PATCH /api/tasks/:id/complete
```

Marks task as completed.

#### 4. Health Check
```http
GET /health
```

Returns server health status.


## Testing

### Test Coverage
- Backend: 31 tests (19 unit + 12 integration)
- Frontend: 18 component tests
- E2E: 25+ end-to-end scenarios

### Running Tests

#### Backend Tests
```bash
cd backend
npm install
npm test                    # Run all tests with coverage
npm run test:watch         # Watch mode
npm run test:integration   # Integration tests only
```

#### Frontend Tests
```bash
cd frontend
npm install
npm test                # Run all tests
npm run test:ui        # Visual test UI
npm run test:coverage  # With coverage report
```

#### E2E Tests
```bash
cd e2e-tests
npm install
npx playwright install    # Install browsers

npm test                  # Run all E2E tests
npm run test:headed      # Run with browser UI
npm run test:ui          # Interactive mode
```

---

## Docker Deployment

### Production

Start all services:
```bash
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f
```

Stop services:
```bash
docker-compose down
```

Clean restart:
```bash
docker-compose down -v
docker-compose up --build
```

### Development

Run database only (develop backend/frontend locally):
```bash
docker-compose up db -d
```

Then run backend and frontend in separate terminals.


## Database Schema

### Table: task

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Task title |
| description | TEXT | NOT NULL | Task description |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | NOT NULL, ON UPDATE CURRENT_TIMESTAMP | Update time |

Indexes:
- PRIMARY KEY on id
- INDEX on (completed, created_at) for efficient querying

---

## UI Design

### Design System

Colors:
- Background: Dark gradient (gray-900 to black)
- Primary Accent: Orange (#f97316)
- Text: White & gray tones
- Cards: Glassmorphism (backdrop-blur + transparency)

Typography:
- Font: Inter with system fallbacks
- Responsive sizing using Tailwind scale

Components:
- Glassmorphism cards with backdrop blur
- Gradient buttons with hover effects
- Smooth animations and transitions
- Loading states with spinners
- Empty and error states

### Responsive Design

- Mobile: < 640px (single column)
- Tablet: 640px - 1024px (optimized layout)
- Desktop: > 1024px (two columns)

---

## Security

- Input validation on frontend and backend
- SQL injection prevention (parameterized queries)
- XSS protection (React automatic escaping)
- CORS configured properly
- Security headers via Nginx
- Type safety with TypeScript
- Environment variables for secrets

---

## Troubleshooting

### Port already in use
```bash
# Check and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database connection failed
```bash
# Check if database is running
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Frontend shows blank page
- Check browser console (F12) for errors
- Verify backend is running: `curl http://localhost:5000/health`
- Hard refresh browser: Ctrl+Shift+R
- Check if Tailwind is properly configured

### Tests failing
```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild Docker images
docker-compose build --no-cache
```

---

## Additional Documentation

- [Docker Setup Guide](./DOCKER-GUIDE.md)
- [E2E Testing Guide](./e2e-tests/README.md)
- [PRD](./PRD.md)

---

## Project Goals Achieved

✅ Modern, production-ready to-do application
✅ Clean architecture with separation of concerns
✅ Comprehensive testing (Unit + Integration + E2E)
✅ Beautiful, responsive UI with glassmorphism
✅ Single-command Docker deployment
✅ Well-documented codebase
✅ Type-safe with TypeScript
✅ RESTful API design
✅ Best practices and clean code

---

## Author

Built with ❤️ as part of CoverageX Full Stack Engineer Assessment

---

**Happy Task Managing! 🚀**
