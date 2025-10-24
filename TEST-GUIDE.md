# Backend API Testing Guide

## Prerequisites
- Docker and Docker Compose installed

## Quick Start - Test Backend + Database

### 1. Start the Backend and Database
```bash
docker-compose -f docker-compose.test.yml up --build
```

This will:
- Start MySQL database on port 3306
- Initialize the database with sample data
- Start the backend API on port 5000

Wait for the message: `🚀 Server running on port 5000`

### 2. Test the API

**Option A: Using curl (Linux/Mac/Git Bash)**
```bash
bash test-api.sh
```

**Option B: Manual Testing with curl**

#### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

#### Test 2: Get All Tasks (should return 5 most recent)
```bash
curl http://localhost:5000/api/tasks
```

#### Test 3: Create New Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy groceries\",\"description\":\"Milk, bread, eggs\"}"
```

#### Test 4: Mark Task as Complete (replace 1 with actual task ID)
```bash
curl -X PATCH http://localhost:5000/api/tasks/1/complete
```

#### Test 5: Verify Task Disappeared
```bash
curl http://localhost:5000/api/tasks
```

**Option C: Using Postman**

1. **Import these requests into Postman:**

**GET** `http://localhost:5000/api/tasks`
- Get all incomplete tasks

**POST** `http://localhost:5000/api/tasks`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "title": "Test Task",
  "description": "This is a test task"
}
```

**PATCH** `http://localhost:5000/api/tasks/1/complete`
- Mark task ID 1 as completed

### 3. Expected Results

**GET /api/tasks** - Returns array of up to 5 incomplete tasks:
```json
[
  {
    "id": 5,
    "title": "Help Saman",
    "description": "Saman need help with his software project",
    "completed": false,
    "created_at": "2025-10-24T...",
    "updated_at": "2025-10-24T..."
  },
  ...
]
```

**POST /api/tasks** - Returns created task:
```json
{
  "id": 6,
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "completed": false,
  "created_at": "2025-10-24T...",
  "updated_at": "2025-10-24T..."
}
```

**PATCH /api/tasks/1/complete** - Returns completed task:
```json
{
  "id": 1,
  "title": "Buy books",
  "description": "Buy books for the next school year",
  "completed": true,
  "created_at": "2025-10-24T...",
  "updated_at": "2025-10-24T..."
}
```

### 4. Stop the Services
```bash
docker-compose -f docker-compose.test.yml down
```

To remove volumes as well:
```bash
docker-compose -f docker-compose.test.yml down -v
```

## Testing Validation

**Empty Title (should return 400)**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"\",\"description\":\"Test\"}"
```

**Missing Description (should return 400)**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Test\"}"
```

**Non-existent Task (should return 404)**
```bash
curl -X PATCH http://localhost:5000/api/tasks/9999/complete
```

## Troubleshooting

**Database connection failed**
- Ensure MySQL container is healthy: `docker ps`
- Check logs: `docker-compose -f docker-compose.test.yml logs db`

**Port already in use**
- Change ports in `docker-compose.test.yml`
- Or stop conflicting services

**Cannot connect to API**
- Verify backend is running: `docker-compose -f docker-compose.test.yml logs backend`
- Check if port 5000 is accessible: `curl http://localhost:5000/health`
