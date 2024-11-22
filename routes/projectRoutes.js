import express from 'express';
import { createProject } from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// New test-auth route
router.get('/test-auth', async (req, res) => {
  try {
    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/api/auth/get-token`);
    const data = await response.text();
    res.send(`Auth service response: ${data}`);
  } catch (error) {
    res.status(500).send(`Error contacting auth service: ${error.message}`);
  }
});

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'too_many_requests', message: 'Too many requests, please try again later.' }
});

router.post('/projects', authenticateToken, apiLimiter, createProject);

// New test route
router.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

export default router;

