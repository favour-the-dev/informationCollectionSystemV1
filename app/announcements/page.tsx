import { connectDB } from "@/lib/db";
import { Announcement } from "@/models/Announcement";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AnnouncementActions from "@/components/AnnouncementActions";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const session = await getServerSession(authOptions);
  await connectDB();
  const raw = await Announcement.find({
    $or: [
      { expirationDate: { $exists: false } },
      { expirationDate: { $gte: new Date() } },
    ],
  })
    .sort({ datePosted: -1 })
    .select("title content datePosted expirationDate _id")
    .lean();
  const items = (raw as Array<Record<string, unknown>>).map((a) => ({
    _id: String(a._id),
    title: a.title as string,
    content: a.content as string,
    datePosted: new Date(a.datePosted as string | number | Date),
    expirationDate: a.expirationDate
      ? new Date(a.expirationDate as string | number | Date)
      : undefined,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Announcements</h1>
        <Link
          href="/announcements/new"
          className="rounded-md bg-black px-3 py-1.5 text-white hover:bg-zinc-800"
        >
          New
        </Link>
      </div>
      {items.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-zinc-600">
          No announcements yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((a) => (
            <li key={String(a._id)} className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">{a.title}</h3>
              <p className="mt-2 text-sm text-zinc-700 whitespace-pre-wrap">
                {a.content}
              </p>
              <div className="mt-3 text-xs text-zinc-500">
                Posted on {new Date(a.datePosted).toLocaleString()}
                {a.expirationDate && (
                  <span>
                    {" "}
                    · Expires {new Date(a.expirationDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              {session?.user?.role === "admin" && (
                <div className="mt-3">
                  <AnnouncementActions id={String(a._id)} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
