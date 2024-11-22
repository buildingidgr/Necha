import validator from 'validator';

export const validateProjectCreation = (req, res, next) => {
  const { name, type, subtype, priority, description, startDate, estimatedCompletionDate, clientId, location, budget } = req.body;

  const errors = [];

  if (!name || name.length < 3 || name.length > 200) {
    errors.push({ field: 'name', message: 'Project name must be between 3 and 200 characters' });
  }

  if (!['infrastructure', 'residential', 'commercial', 'industrial'].includes(type)) {
    errors.push({ field: 'type', message: 'Invalid project type' });
  }

  if (!subtype) {
    errors.push({ field: 'subtype', message: 'Project subtype is required' });
  }

  if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
    errors.push({ field: 'priority', message: 'Invalid priority level' });
  }

  if (!description) {
    errors.push({ field: 'description', message: 'Project description is required' });
  }

  const currentDate = new Date();
  const parsedStartDate = new Date(startDate);
  const parsedCompletionDate = new Date(estimatedCompletionDate);

  if (isNaN(parsedStartDate) || parsedStartDate <= currentDate) {
    errors.push({ field: 'startDate', message: 'Start date must be a future date' });
  }

  if (isNaN(parsedCompletionDate) || parsedCompletionDate <= parsedStartDate) {
    errors.push({ field: 'estimatedCompletionDate', message: 'Estimated completion date must be after the start date' });
  }

  if (clientId && typeof clientId !== 'string') {
    errors.push({ field: 'clientId', message: 'Invalid client ID' });
  }

  if (!location || !location.coordinates || !location.address) {
    errors.push({ field: 'location', message: 'Invalid location information' });
  } else {
    const { latitude, longitude } = location.coordinates;
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      errors.push({ field: 'location.coordinates.latitude', message: 'Invalid latitude' });
    }
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      errors.push({ field: 'location.coordinates.longitude', message: 'Invalid longitude' });
    }
  }

  if (!budget || typeof budget.allocated !== 'number' || budget.allocated <= 0) {
    errors.push({ field: 'budget.allocated', message: 'Invalid budget allocation' });
  }

  if (!budget || !validator.isISO4217(budget.currency)) {
    errors.push({ field: 'budget.currency', message: 'Invalid currency code' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'validation_error',
      message: 'Invalid request body',
      details: errors,
    });
  }

  next();
};

