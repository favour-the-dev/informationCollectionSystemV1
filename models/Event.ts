import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description?: string;
  location?: string;
  date: Date;
  time?: string;
  participants: Types.ObjectId[];
  createdBy?: Types.ObjectId;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
