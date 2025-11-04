import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ ok: true });
  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 mins
  await user.save();
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const link = `${base}/reset-password/${token}`;
  // For prototype: return the link directly
  return NextResponse.json({ ok: true, link });
}
