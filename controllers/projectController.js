import Project from '../models/Project.js';
import projectSchema from '../validators/projectValidator.js';

// Existing createProject function remains unchanged

export const getProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Check if the projectId is a valid MongoDB ObjectId
    if (!projectId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'invalid_id', message: 'Invalid project ID format' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'not_found', message: 'Project not found' });
    }

    // Format response
    const response = {
      id: `proj_${project._id}`,
      name: project.name,
      type: project.type,
      subtype: project.subtype,
      priority: project.priority,
      description: project.description,
      startDate: project.startDate.toISOString(),
      estimatedCompletionDate: project.estimatedCompletionDate.toISOString(),
      clientId: project.clientId,
      location: {
        coordinates: {
          latitude: project.location.coordinates.latitude,
          longitude: project.location.coordinates.longitude
        },
        address: project.location.address
      },
      budget: {
        allocated: project.budget.allocated,
        currency: project.budget.currency
      },
      createdAt: project.createdAt.toISOString(),
      status: project.status
    };

    res.status(200).json(response);
  } catch (err) {
    console.error('Project retrieval error:', err);
    res.status(500).json({ error: 'internal_server_error', message: 'An unexpected error occurred' });
  }
};

