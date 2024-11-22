import Joi from 'joi';

const projectSchema = Joi.object({
  name: Joi.string().min(3).max(200).required(),
  type: Joi.string().valid('infrastructure', 'residential', 'commercial', 'industrial').required(),
  subtype: Joi.string().required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').required(),
  description: Joi.string().required(),
  startDate: Joi.date().iso().required(),
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
    currency: Joi.string().length(3).required()
  }).required()
});

export default projectSchema;

