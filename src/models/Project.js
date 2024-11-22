import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  type: {
    type: String,
    required: true,
    enum: ['infrastructure', 'residential', 'commercial', 'industrial'],
  },
  subtype: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  estimatedCompletionDate: {
    type: Date,
    required: true,
  },
  clientId: {
    type: String,
    default: null,
  },
  location: {
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },
    address: {
      type: String,
      required: true,
    },
  },
  budget: {
    allocated: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);

