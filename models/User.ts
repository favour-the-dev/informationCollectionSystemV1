import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "resident" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // hashed
  role: UserRole;
  phoneNumber?: string;
  dateRegistered: Date;
  resetToken?: string;
  resetTokenExpires?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["resident", "admin"], default: "resident" },
    phoneNumber: { type: String },
    dateRegistered: { type: Date, default: Date.now },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
