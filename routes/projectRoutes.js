import express from 'express';
import { createProject } from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'too_many_requests', message: 'Too many requests, please try again later.' }
});

router.post('/projects', authenticateToken, apiLimiter, createProject);

export default router;

