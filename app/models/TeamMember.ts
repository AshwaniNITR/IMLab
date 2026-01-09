import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  imageUrl: string;
  imagePublicId: string;
  enrolledDate: Date;
  graduatedDate?: Date;
  designation: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    imagePublicId: {
      type: String,
      required: [true, 'Image public ID is required'],
    },
    enrolledDate: {
      type: Date,
      required: [true, 'Enrolled date is required'],
    },
    graduatedDate: {
      type: Date,
      default: null,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.TeamMember || 
  mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);