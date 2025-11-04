import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ComplaintStatus = "Submitted" | "In Progress" | "Resolved";

export interface IComplaintReply {
  message: string;
  authorId: Types.ObjectId;
  authorRole: "admin" | "resident";
  createdAt: Date;
}

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
  replies?: IComplaintReply[];
}

const ComplaintReplySchema = new Schema<IComplaintReply>(
  {
    message: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorRole: { type: String, enum: ["admin", "resident"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

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
    replies: { type: [ComplaintReplySchema], default: [] },
  },
  { timestamps: true }
);

export const Complaint: Model<IComplaint> =
  mongoose.models.Complaint ||
  mongoose.model<IComplaint>("Complaint", ComplaintSchema);
