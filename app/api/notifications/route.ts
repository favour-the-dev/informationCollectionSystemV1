import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const items = await Notification.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  // Mark as read (all or ids)
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { ids } = await req.json().catch(() => ({ ids: [] }));
  if (Array.isArray(ids) && ids.length > 0) {
    await Notification.updateMany(
      { _id: { $in: ids }, userId: session.user.id },
      { $set: { read: true } }
    );
  } else {
    await Notification.updateMany(
      { userId: session.user.id },
      { $set: { read: true } }
    );
  }
  return NextResponse.json({ ok: true });
}
