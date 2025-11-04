import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Complaint } from "@/models/Complaint";
import { Notification } from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  const data = await req.json();
  const prev = await Complaint.findById(params.id);
  const updated = await Complaint.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  if (updated && prev && data.status && data.status !== prev.status) {
    await Notification.create({
      userId: updated.userId,
      type: "complaint-status",
      title: `Complaint ${data.status}`,
      message: `Your complaint "${updated.title}" is now ${data.status}.`,
    });
  }
  return NextResponse.json(updated);
}
