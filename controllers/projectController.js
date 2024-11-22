import Project from '../models/Project.js';
import projectSchema from '../validators/projectValidator.js';

export const createProject = async (req, res) => {
  try {
    const now = new Date();
    console.log('Server current time (UTC):', now.toUTCString());
    console.log('Received startDate:', req.body.startDate);

    // Validate request body
    const { error, value } = projectSchema.validate(req.body, {
      abortEarly: false
    });
    
    if (error) {
      console.log('Validation error:', error);
      return res.status(400).json({
        error: 'validation_error',
        message: 'Invalid request body',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    // Additional date validation
    const startDate = new Date(value.startDate);
    if (startDate < now) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Invalid request body',
        details: [{
          field: 'startDate',
          message: 'Start date must be greater than or equal to the current date'
        }]
      });
    }

    // Create new project
    const project = new Project(value);
    await project.save();

    // Format response
    const response = {
      id: `proj_${project._id}`,
      ...project.toObject(),
      _id: undefined,
      __v: undefined
    };

    res.status(201).json(response);
  } catch (err) {
    console.error('Project creation error:', err);
    res.status(500).json({ error: 'internal_server_error', message: 'An unexpected error occurred' });
  }
};

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

