import validator from 'validator';
const { isISO4217Currency } = validator;

import Joi from 'joi';

export const validateProject = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(200).required(),
    type: Joi.string().valid('infrastructure', 'residential', 'commercial', 'industrial').required(),
    subtype: Joi.string().required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').required(),
    description: Joi.string().required(),
    startDate: Joi.date().iso().min('now').required(),
    estimatedCompletionDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    clientId: Joi.string().optional(),
    location: Joi.object({
      coordinates: Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required()
      }).required(),
      address: Joi.string().required()
    }).required(),
    budget: Joi.object({
      allocated: Joi.number().positive().precision(2).required(),
      currency: Joi.string().custom((value, helpers) => {
        if (!isISO4217Currency(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'validate ISO 4217 currency code').required()
    }).required()
  });

  const { error } = schema.validate(req.body);
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

  next();
};

