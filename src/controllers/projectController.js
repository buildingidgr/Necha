import Project from '../models/Project.js';

export const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    
    const response = {
      id: `proj_${project._id}`,
      ...project.toObject(),
      _id: undefined,
      __v: undefined,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({
      error: 'validation_error',
      message: 'Invalid request body',
      details: error.errors ? Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      })) : [{ message: error.message }],
    });
  }
};

