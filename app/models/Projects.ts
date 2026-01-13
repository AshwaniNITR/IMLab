import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  author: string; 
  type: 'Journal' | 'Conference' | 'book-chapter' | 'patent';
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },

    author: {
      type: String,
      trim: true,
      default: 'Unknown Author',
    },

    type: {
      type: String,
      required: [true, 'Project type is required'],
      enum: {
        values: ['Journal', 'Conference', 'book-chapter', 'patent'],
        message:
          'Invalid project type. Must be one of: Journal, Conference, book-chapter, patent',
      },
    },

    year: {
      type: Number,
      required: [true, 'Project year is required'],
      min: [1900, 'Year must be at least 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the far future'],
    },
  },
  {
    timestamps: true,
  }
);


// Create compound index for better query performance
ProjectSchema.index({ type: 1, year: -1 });
ProjectSchema.index({ title: 'text' }); // For text search

// Check if model already exists to prevent recompilation in Next.js
export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);