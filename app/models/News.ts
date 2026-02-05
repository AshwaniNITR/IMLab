import mongoose, { Document, Schema } from "mongoose";

export interface INews extends Document {
  title: string;
  description: string;
  date: Date;
}
const newsSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
newsSchema.index({ date: -1 }); // Index for sorting by date
newsSchema.index({ title: 'text', description: 'text' }); // For text search

export default mongoose.models.News || mongoose.model<INews>('News', newsSchema);
