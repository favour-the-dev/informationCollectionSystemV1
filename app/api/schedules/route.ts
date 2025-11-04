import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ServiceSchedule } from "@/models/ServiceSchedule";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await connectDB();
  const now = new Date();
  const items = await ServiceSchedule.find({ date: { $gte: now } })
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
  const { serviceType, description, date, time, responsibleDepartment } =
    await req.json();
  if (!serviceType || !date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const created = await ServiceSchedule.create({
    serviceType,
    description,
    date: new Date(date),
    time,
    responsibleDepartment,
    createdBy: session.user.id,
  });
  return NextResponse.json(created, { status: 201 });
}
