# Product Requirements Document (PRD)
## CoverageX To-Do Application - Full Stack Engineer Assessment

---

## 1. Project Overview

### Purpose
Build a simple to-do task management web application as part of CoverageX's Full Stack Engineer technical assessment.

### Goals
- Demonstrate full-stack development skills
- Show understanding of clean code and SOLID principles
- Implement comprehensive testing strategy
- Create a production-ready Dockerized application

### Timeline
3 days from start to submission

---

## 2. User Requirements

### 2.1 Core Features
1. **Create Tasks**
   - Users can create to-do tasks via web UI
   - Each task requires:
     - Title (required)
     - Description (required)

2. **View Tasks**
   - Display only the 5 most recent incomplete tasks
   - Tasks shown in reverse chronological order (newest first)
   - No pagination needed

3. **Complete Tasks**
   - Users can mark tasks as completed via "Done" button
   - Completed tasks disappear from the UI immediately
   - Completed tasks remain in database but are not displayed

### 2.2 User Interface
- Simple, clean SPA (Single Page Application)
- Left panel: "Add a Task" form with title and description inputs
- Right panel: List of 5 most recent incomplete tasks
- Each task card shows:
  - Task title (bold)
  - Task description
  - "Done" button
- Modern, attractive UI design (bonus points)

---

## 3. Technical Specifications

### 3.1 Tech Stack

#### Database
- **RDBMS**: MySQL 8.0
- **Reason**: Industry standard, excellent Docker support, reliable

#### Backend
- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5.x
- **Framework**: Express.js 4.x
- **Additional Libraries**:
  - `mysql2` - MySQL driver with Promise support
  - `cors` - CORS middleware
  - `express-validator` - Input validation
  - `dotenv` - Environment variables
  - `jest` - Testing framework
  - `supertest` - Integration testing

#### Frontend
- **Framework**: React 18
- **Language**: TypeScript 5.x
- **Build Tool**: Vite
- **Additional Libraries**:
  - `axios` - HTTP client
  - `react-testing-library` - Component testing
  - `jest` - Testing framework

#### Testing
- **Unit Tests**: Jest
- **Integration Tests**: Supertest
- **Frontend Tests**: React Testing Library + Jest
- **E2E Tests**: Playwright

#### Infrastructure
- **Containerization**: Docker
- **Orchestration**: docker-compose
- **Web Server (Frontend)**: Nginx (for serving built React app)

### 3.2 Architecture

```
┌─────────────┐      HTTP       ┌─────────────┐      SQL       ┌─────────────┐
│   Frontend  │ ───────────────> │   Backend   │ ──────────────>│   Database  │
│  (React)    │ <─────────────── │  (Express)  │ <──────────────│   (MySQL)   │
│  Port 3000  │    JSON/REST     │  Port 5000  │    Connection  │  Port 3306  │
└─────────────┘                  └─────────────┘                └─────────────┘
```

**Simple Layered Architecture (Backend)**:
- **Routes Layer**: HTTP endpoint definitions
- **Controller Layer**: Request/response handling, validation
- **Service Layer**: Business logic
- **Model/Repository Layer**: Database operations

---

## 4. Database Design

### 4.1 Schema

#### Table: `task`

| Column       | Type         | Constraints                    | Description                |
|--------------|--------------|--------------------------------|----------------------------|
| id           | INT          | PRIMARY KEY, AUTO_INCREMENT    | Unique task identifier     |
| title        | VARCHAR(255) | NOT NULL                       | Task title                 |
| description  | TEXT         | NOT NULL                       | Task description           |
| completed    | BOOLEAN      | NOT NULL, DEFAULT FALSE        | Completion status          |
| created_at   | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp    |
| updated_at   | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Indexes
- PRIMARY KEY on `id`
- INDEX on `completed, created_at` (for efficient querying of incomplete tasks)

### 4.2 Sample Queries

```sql
-- Get 5 most recent incomplete tasks
SELECT * FROM task
WHERE completed = FALSE
ORDER BY created_at DESC
LIMIT 5;

-- Create new task
INSERT INTO task (title, description)
VALUES (?, ?);

-- Mark task as completed
UPDATE task
SET completed = TRUE
WHERE id = ?;
```

---

## 5. API Specifications

### 5.1 Base URL
- Development: `http://localhost:5000/api`
- All endpoints return JSON
- Content-Type: `application/json`

### 5.2 Endpoints

#### 1. Create Task
```
POST /api/tasks
```

**Request Body**:
```json
{
  "title": "Buy books",
  "description": "Buy books for the next school year"
}
```

**Validation Rules**:
- `title`: Required, string, max 255 characters
- `description`: Required, string, max 5000 characters

**Success Response** (201 Created):
```json
{
  "id": 1,
  "title": "Buy books",
  "description": "Buy books for the next school year",
  "completed": false,
  "created_at": "2025-10-24T10:30:00.000Z",
  "updated_at": "2025-10-24T10:30:00.000Z"
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

#### 2. Get Recent Tasks
```
GET /api/tasks
```

**Query Parameters**: None

**Success Response** (200 OK):
```json
[
  {
    "id": 5,
    "title": "Help Saman",
    "description": "Saman need help with his software project",
    "completed": false,
    "created_at": "2025-10-24T10:35:00.000Z",
    "updated_at": "2025-10-24T10:35:00.000Z"
  },
  {
    "id": 4,
    "title": "Play Cricket",
    "description": "Play the soft ball cricket match on next Sunday",
    "completed": false,
    "created_at": "2025-10-24T10:34:00.000Z",
    "updated_at": "2025-10-24T10:34:00.000Z"
  }
  // ... up to 5 tasks total
]
```

#### 3. Complete Task
```
PATCH /api/tasks/:id/complete
```

**Path Parameters**:
- `id`: Task ID (integer)

**Request Body**: None

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Buy books",
  "description": "Buy books for the next school year",
  "completed": true,
  "created_at": "2025-10-24T10:30:00.000Z",
  "updated_at": "2025-10-24T10:40:00.000Z"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Task not found"
}
```

### 5.3 Error Handling

All errors follow this format:
```json
{
  "error": "Error message",
  "details": [] // Optional, for validation errors
}
```

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 404: Not Found
- 500: Internal Server Error

---

## 6. Frontend Specifications

### 6.1 Component Structure

```
src/
├── components/
│   ├── TaskForm.tsx       # Form to create new tasks
│   ├── TaskList.tsx       # List of tasks
│   └── TaskCard.tsx       # Individual task card
├── services/
│   └── api.ts             # API client (axios)
├── types/
│   └── task.ts            # TypeScript interfaces
├── App.tsx                # Main app component
├── App.css                # Global styles
└── main.tsx               # Entry point
```

### 6.2 Component Specifications

#### TaskForm
**Props**: None
**State**:
- `title`: string
- `description`: string
- `loading`: boolean
- `error`: string | null

**Behavior**:
- Two input fields (title, description)
- Submit button
- On submit: POST to `/api/tasks`
- Clear form on success
- Show error message on failure
- Disable form during submission

#### TaskList
**Props**: None
**State**:
- `tasks`: Task[]
- `loading`: boolean
- `error`: string | null

**Behavior**:
- Fetch tasks on mount
- Display loading state
- Show error if fetch fails
- Render TaskCard for each task
- Refresh when new task created

#### TaskCard
**Props**:
- `task`: Task object
- `onComplete`: (id: number) => void

**Behavior**:
- Display title and description
- "Done" button
- On click: Call onComplete handler
- Optimistic UI update

### 6.3 TypeScript Interfaces

```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateTaskRequest {
  title: string;
  description: string;
}
```

### 6.4 Styling Requirements
- Clean, modern design
- Responsive layout (desktop-first, but mobile-friendly)
- Two-column layout (form on left, tasks on right)
- Card-based design for tasks
- Clear visual hierarchy
- Professional color scheme
- Hover effects on buttons

---

## 7. Testing Strategy

### 7.1 Backend Testing

#### Unit Tests (Target: 80%+ coverage)
- **Service Layer**:
  - Create task with valid data
  - Validate input data
  - Get recent tasks (limit 5)
  - Complete task by ID
  - Handle non-existent task

- **Controller Layer**:
  - Request validation
  - Error handling
  - Response formatting

#### Integration Tests
- **API Endpoints**:
  - POST /api/tasks - Success & validation errors
  - GET /api/tasks - Returns max 5 tasks, newest first
  - PATCH /api/tasks/:id/complete - Success & not found

- **Database Integration**:
  - Test with real MySQL test database
  - Cleanup between tests

### 7.2 Frontend Testing

#### Component Tests
- **TaskForm**:
  - Renders input fields
  - Validates required fields
  - Submits form data
  - Clears form on success
  - Shows error message

- **TaskList**:
  - Displays loading state
  - Renders tasks
  - Handles empty state
  - Shows error state

- **TaskCard**:
  - Renders task data
  - Calls onComplete handler

### 7.3 End-to-End Tests (Playwright)

**Test Scenarios**:
1. **Complete User Flow**:
   - Visit application
   - Create 3 tasks
   - Verify tasks appear in list
   - Complete one task
   - Verify task disappears

2. **Validation**:
   - Try to submit empty form
   - Verify error messages

3. **Task Limit**:
   - Create 7 tasks
   - Verify only 5 most recent shown

---

## 8. Docker Setup

### 8.1 Services

#### 1. Database (MySQL)
- **Image**: mysql:8.0
- **Port**: 3306
- **Volume**: Persist data
- **Init Script**: Create schema and indexes
- **Health Check**: MySQL ready check

#### 2. Backend (Node.js)
- **Base Image**: node:20-alpine
- **Build**: Multi-stage (build TypeScript, then production)
- **Port**: 5000
- **Depends On**: Database (wait for health check)
- **Environment**: Database connection string

#### 3. Frontend (React)
- **Base Image**: node:20-alpine (build), nginx:alpine (serve)
- **Build**: Multi-stage (Vite build, then Nginx serve)
- **Port**: 3000
- **Static Files**: Serve built React app

### 8.2 docker-compose.yml Structure

```yaml
version: '3.8'

services:
  db:
    # MySQL configuration

  backend:
    # Express API configuration
    depends_on:
      db:
        condition: service_healthy

  frontend:
    # React app configuration
    depends_on:
      - backend

networks:
  app-network:

volumes:
  db-data:
```

### 8.3 Startup Command
```bash
docker-compose up --build
```

Single command starts entire application!

---

## 9. Success Criteria

### 9.1 Functional Requirements
- [ ] Users can create tasks with title and description
- [ ] Only 5 most recent incomplete tasks are displayed
- [ ] Users can mark tasks as completed
- [ ] Completed tasks disappear from UI
- [ ] Tasks are persisted in MySQL database

### 9.2 Technical Requirements
- [ ] Backend REST API with 3 endpoints
- [ ] Frontend SPA built with React
- [ ] MySQL database with proper schema
- [ ] All components run in Docker containers
- [ ] Single `docker-compose up` command starts everything

### 9.3 Testing Requirements
- [ ] Backend unit tests (80%+ coverage)
- [ ] Backend integration tests
- [ ] Frontend component tests
- [ ] End-to-end tests with Playwright

### 9.4 Code Quality
- [ ] Clean, readable code
- [ ] SOLID principles applied where appropriate
- [ ] Proper error handling
- [ ] Input validation
- [ ] Clear comments and documentation
- [ ] TypeScript types properly defined

### 9.5 Documentation
- [ ] Comprehensive README with:
  - Project description
  - Architecture overview
  - Setup instructions
  - API documentation
  - Testing instructions
- [ ] Code comments where necessary
- [ ] Clear commit messages

### 9.6 Bonus (Extra Marks)
- [ ] End-to-end tests implemented
- [ ] Attractive, modern UI design

---

## 10. Implementation Phases

### Phase 1: Foundation (Day 1)
1. Set up project structure
2. Initialize database with schema
3. Create backend API skeleton
4. Implement core API endpoints
5. Backend testing

### Phase 2: Frontend (Day 1-2)
1. Set up React project with Vite
2. Create components
3. Implement API integration
4. Frontend testing
5. UI styling

### Phase 3: Docker & Integration (Day 2)
1. Create Dockerfiles for all services
2. Set up docker-compose
3. Test full stack integration
4. E2E testing

### Phase 4: Polish & Documentation (Day 2-3)
1. Improve UI design
2. Write comprehensive README
3. Final testing
4. Code cleanup and refactoring
5. Prepare for submission

---

## 11. Deliverables

1. **GitHub Repository** (public)
2. **Source Code**:
   - Backend (TypeScript)
   - Frontend (React + TypeScript)
   - Database init scripts
   - Docker configuration
3. **Tests**:
   - Unit tests
   - Integration tests
   - E2E tests
4. **Documentation**:
   - README.md
   - API documentation
   - Setup instructions

---

## Notes
- Keep implementation simple and clean (1-2 year experience level)
- Don't over-engineer - focus on clarity and correctness
- Prioritize test coverage and code quality
- Ensure Docker setup works on Linux environment
- Make README crystal clear for evaluators
