import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await connectDB();
  const now = new Date();
  const items = await Event.find({ date: { $gte: now } })
    .sort({ date: 1 })
    .lean();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  const { title, description, location, date, time } = await req.json();
  if (!title || !date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const created = await Event.create({
    title,
    description,
    location,
    date: new Date(date),
    time,
    participants: [],
    createdBy: session.user.id,
  });
  return NextResponse.json(created, { status: 201 });
}
