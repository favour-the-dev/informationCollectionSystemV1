import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-lg border p-8 text-center text-zinc-600">
          Please sign in to view your notifications.
        </div>
      </div>
    );
  }
  await connectDB();
  const raw = await Notification.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();
  const items = (raw as Array<Record<string, unknown>>).map((n) => ({
    _id: String(n._id),
    title: n.title as string,
    message: n.message as string,
    read: Boolean(n.read),
    createdAt: new Date(n.createdAt as string | Date),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        {items.some((n) => !n.read) && (
          <form action="/api/notifications" method="post">
            <button className="rounded-md border px-3 py-1.5 hover:bg-zinc-50">
              Mark all as read
            </button>
          </form>
        )}
      </div>
      {items.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-zinc-600">
          No notifications yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li
              key={String(n._id)}
              className={`rounded-lg border p-4 ${n.read ? "opacity-70" : ""}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{n.title}</h3>
                <span className="text-xs text-zinc-500">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-700">{n.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
