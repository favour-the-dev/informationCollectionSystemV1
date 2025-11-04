import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  await connectDB();
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gte: new Date() },
  });
  if (!user)
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  return NextResponse.json({ ok: true });
}
