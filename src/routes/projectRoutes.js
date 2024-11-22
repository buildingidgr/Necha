import express from 'express';
import { createProject } from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { validateProjectCreation } from '../middleware/validation.js';

const router = express.Router();

router.post('/projects', authenticate, validateProjectCreation, createProject);

export default router;

