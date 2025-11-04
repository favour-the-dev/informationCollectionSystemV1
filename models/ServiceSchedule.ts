import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IServiceSchedule extends Document {
  serviceType: string;
  description?: string;
  date: Date;
  time?: string;
  responsibleDepartment?: string;
  createdBy?: Types.ObjectId;
}

const ServiceScheduleSchema = new Schema<IServiceSchedule>(
  {
    serviceType: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    responsibleDepartment: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const ServiceSchedule: Model<IServiceSchedule> =
  mongoose.models.ServiceSchedule ||
  mongoose.model<IServiceSchedule>("ServiceSchedule", ServiceScheduleSchema);
