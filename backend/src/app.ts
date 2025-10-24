import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/task.routes';
import { testConnection } from './config/database';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

/**
 * Middleware Configuration
 */
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

/**
 * Request Logging Middleware (simple)
 */
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Routes
 */
app.use('/api/tasks', taskRoutes);

/**
 * Health Check Endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Root Endpoint
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'CoverageX To-Do API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      tasks: '/api/tasks',
    },
  });
});

/**
 * 404 Handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

/**
 * Global Error Handler
 */
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📝 API: http://localhost:${PORT}/api/tasks`);
      console.log(`💚 Health: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
