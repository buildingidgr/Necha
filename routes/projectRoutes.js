import express from 'express';
import { createProject, getProject } from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.post('/projects', authenticateToken, apiLimiter, createProject);
router.get('/projects/:id', authenticateToken, apiLimiter, getProject);

export default router;

