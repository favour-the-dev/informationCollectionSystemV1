import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Complaint } from "@/models/Complaint";
import { Event } from "@/models/Event";
import { Announcement } from "@/models/Announcement";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const userId = session.user.id;

  // Total complaints
  const totalComplaints = await Complaint.countDocuments({ userId });

  // Active complaints (Submitted or In Progress)
  const activeComplaints = await Complaint.countDocuments({
    userId,
    status: { $in: ["Submitted", "In Progress"] },
  });

  // Registered events (where user is in participants array)
  const now = new Date();
  const registeredEvents = await Event.countDocuments({
    date: { $gte: now },
    participants: userId,
  });

  // Recent announcements (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentAnnouncements = await Announcement.countDocuments({
    datePosted: { $gte: sevenDaysAgo },
  });

  return NextResponse.json({
    totalComplaints,
    activeComplaints,
    registeredEvents,
    recentAnnouncements,
  });
}
