import mongoose, { Schema, Document } from 'mongoose';

export interface IRProject extends Document {
  name: string;
  status: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const RProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [200, 'Project name cannot exceed 200 characters'],
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed'],
      default: 'ongoing',
      required: [true, 'Project status is required'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Project image URL is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
RProjectSchema.index({ name: 1 });
RProjectSchema.index({ status: 1 });
RProjectSchema.index({ createdAt: -1 });

export default mongoose.models.RProject || mongoose.model<IRProject>('RProject', RProjectSchema);