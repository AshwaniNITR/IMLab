// models/Vacancy.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVacancy extends Document {
  content: string;
  isActive: boolean;
  expiryDate?: Date;
  tags: string[];
  department?: string;
  positions: Array<{
    title: string;
    description: string;
    requirements: string[];
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    location: string;
    salaryRange?: {
      min: number;
      max: number;
      currency: string;
    };
    applicationDeadline: Date;
    numberOfOpenings: number;
  }>;
  contactEmail: string;
  applicationInstructions: string;
  createdAt: Date;
  updatedAt: Date;
}

const PositionSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  numberOfOpenings: {
    type: Number,
    default: 1,
    min: 1
  }
}, { _id: false });

const VacancySchema = new Schema<IVacancy>({
  content: {
    type: String,
    required: true,
    default: 'No vacancies available at the moment. Please check back later.'
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  expiryDate: {
    type: Date,
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  department: {
    type: String,
    trim: true
  },
  positions: [PositionSchema],
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  applicationInstructions: {
    type: String,
    default: 'Please submit your CV and cover letter to the email address provided.'
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  versionKey: false
});


// Middleware to update expiry status


// Check if model already exists to prevent OverwriteModelError
const Vacancy = mongoose.models.Vacancy as Model<IVacancy> || 
  mongoose.model<IVacancy>('Vacancy', VacancySchema);

export default Vacancy;