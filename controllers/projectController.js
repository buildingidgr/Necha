import Project from '../models/Project.js';
import projectSchema from '../validators/projectValidator.js';

export const createProject = async (req, res) => {
  try {
    const now = new Date();
    // Validate request body
    const { error, value } = projectSchema.validate(req.body, {
      context: { now },
      abortEarly: false
    });
    
    if (error) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Invalid request body',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
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

