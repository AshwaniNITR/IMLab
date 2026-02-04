import mongoose, { Schema, Document } from 'mongoose';

export interface RScope extends Document {
    imageUrlOne: string;
    title: string;
    brief: string;
    description: string;
    imageUrlTwo: string;
}

const RScopeSchema: Schema = new Schema(
  {
    imageUrlOne: {
      type: String,
      required: [true, 'First image URL is required'],
    },
    title: {
      type: String,
      required: [true, 'Project Title is required'],
    },
    brief: {
      type: String,
      required: [true, 'Project brief is required'],
      maxlength: [2000, 'Brief cannot exceed 2000 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    imageUrlTwo: {
      type: String,
      required: [true, 'Project image URL is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
RScopeSchema.index({ name: 1 });
RScopeSchema.index({ status: 1 });
RScopeSchema.index({ createdAt: -1 });

export default mongoose.models.RScope || mongoose.model<RScope>('RScope', RScopeSchema);