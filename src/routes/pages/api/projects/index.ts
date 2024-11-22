import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import Project from '../../../models/Project';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await new Promise((resolve) => authMiddleware(req as AuthenticatedRequest, res, resolve));

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await connectToDatabase();

  if (req.method === 'POST') {
    try {
      const project = new Project({
        ...req.body,
        userId: req.user.userId,
      });
      await project.save();
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: 'Error creating project' });
    }
  } else if (req.method === 'GET') {
    try {
      const projects = await Project.find({ userId: req.user.userId });
      res.status(200).json(projects);
    } catch (error) {
      res.status(400).json({ error: 'Error fetching projects' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

