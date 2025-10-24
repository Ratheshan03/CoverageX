import { Router } from 'express';
import { body } from 'express-validator';
import taskController from '../controllers/task.controller';

const router = Router();

/**
 * Task Routes
 * Defines API endpoints and validation rules
 */

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Public
 */
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 255 })
      .withMessage('Title must not exceed 255 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ max: 5000 })
      .withMessage('Description must not exceed 5000 characters'),
  ],
  taskController.createTask.bind(taskController)
);

/**
 * @route   GET /api/tasks
 * @desc    Get recent incomplete tasks (max 5)
 * @access  Public
 */
router.get('/', taskController.getTasks.bind(taskController));

/**
 * @route   PATCH /api/tasks/:id/complete
 * @desc    Mark task as completed
 * @access  Public
 */
router.patch('/:id/complete', taskController.completeTask.bind(taskController));

export default router;
