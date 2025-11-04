import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Complaint } from "@/models/Complaint";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const category = url.searchParams.get("category");
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (session.user.role !== "admin") {
    filter.userId = session.user.id;
  }
  const items = await Complaint.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { category, title, description, location } = await req.json();
  if (!category || !title || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const created = await Complaint.create({
    category,
    title,
    description,
    location,
    userId: session.user.id,
  });
  return NextResponse.json(created, { status: 201 });
}
