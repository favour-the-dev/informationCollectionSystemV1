import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Complaint } from "@/models/Complaint";
import { Notification } from "@/models/Notification";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rawId = params.id ?? "";
  // Normalize id: handle URL encoding and potential ObjectId("...") wrappers
  const decoded = decodeURIComponent(rawId);
  const m = decoded.match(/^ObjectId\("([0-9a-fA-F]{24})"\)$/);
  const id = m ? m[1] : decoded.trim();
  const body = await req.json().catch(() => ({}));
  const message = (body?.message || "").toString().trim();
  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }
  await connectDB();
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  complaint.replies = complaint.replies || [];
  complaint.replies.push({
    message,
    authorId: new mongoose.Types.ObjectId(session.user.id),
    authorRole: "admin",
    createdAt: new Date(),
  });
  await complaint.save();

  // Create a notification for the complaint owner
  try {
    await Notification.create({
      userId: complaint.userId,
      type: "complaint-status",
      title: "New admin reply",
      message: message.slice(0, 200),
      read: false,
    });
  } catch {}

  return NextResponse.json({ ok: true });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const rawId = params.id ?? "";
  const decoded = decodeURIComponent(rawId);
  const m = decoded.match(/^ObjectId\("([0-9a-fA-F]{24})"\)$/);
  const id = m ? m[1] : decoded.trim();
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const complaint = await Complaint.findById(id).select("replies").lean();
  if (!complaint)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(complaint.replies || []);
}
