import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const event = await Event.findById(id);
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const userId = session.user.id;
  const already = event.participants.find((p) => String(p) === String(userId));
  if (!already) {
    event.participants.push(new mongoose.Types.ObjectId(userId));
    await event.save();
  }
  return NextResponse.json({ ok: true });
}
