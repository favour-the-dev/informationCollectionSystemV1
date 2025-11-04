import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Announcement } from "@/models/Announcement";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await connectDB();
  const items = await Announcement.find({
    $or: [
      { expirationDate: { $exists: false } },
      { expirationDate: { $gte: new Date() } },
    ],
  })
    .sort({ datePosted: -1 })
    .lean();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  const body = await req.json();
  const { title, content, expirationDate } = body || {};
  if (!title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const created = await Announcement.create({
    title,
    content,
    expirationDate: expirationDate ? new Date(expirationDate) : undefined,
    postedBy: session.user.id,
  });
  return NextResponse.json(created, { status: 201 });
}
