import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ComplaintStatus = "Submitted" | "In Progress" | "Resolved";

export interface IComplaint extends Document {
  category: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  location?: string;
  dateSubmitted: Date;
  dateResolved?: Date;
  userId: Types.ObjectId;
  notes?: string; // internal notes
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Submitted", "In Progress", "Resolved"],
      default: "Submitted",
    },
    location: { type: String },
    dateSubmitted: { type: Date, default: Date.now },
    dateResolved: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Complaint: Model<IComplaint> =
  mongoose.models.Complaint ||
  mongoose.model<IComplaint>("Complaint", ComplaintSchema);
