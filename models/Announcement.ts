import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  datePosted: Date;
  expirationDate?: Date;
  postedBy?: Types.ObjectId;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    datePosted: { type: Date, default: Date.now },
    expirationDate: { type: Date },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
