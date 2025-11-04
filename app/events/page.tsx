import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  await connectDB();
  const now = new Date();
  const raw = await Event.find({ date: { $gte: now } })
    .sort({ date: 1 })
    .lean();
  const items = (raw as Array<Record<string, unknown>>).map((ev) => ({
    _id: String(ev._id),
    title: ev.title as string,
    description: ev.description as string | undefined,
    location: ev.location as string | undefined,
    date: new Date(ev.date as string | Date),
    time: ev.time as string | undefined,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Upcoming Events</h1>
        {session?.user?.role === "admin" && (
          <a
            href="/events/new"
            className="rounded-md bg-black px-3 py-1.5 text-white hover:bg-zinc-800"
          >
            New
          </a>
        )}
      </div>
      {items.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-zinc-600">
          No upcoming events.
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((ev) => (
            <li key={String(ev._id)} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{ev.title}</h3>
                  <div className="text-sm text-zinc-600">
                    {new Date(ev.date).toLocaleDateString()}{" "}
                    {ev.time ? `· ${ev.time}` : ""}
                  </div>
                </div>
                {session?.user && (
                  <form action={`/api/events/${ev._id}/register`} method="post">
                    <button className="rounded-md border px-3 py-1.5 hover:bg-zinc-50">
                      Register
                    </button>
                  </form>
                )}
              </div>
              {ev.description && (
                <p className="mt-2 text-sm text-zinc-700">{ev.description}</p>
              )}
              {ev.location && (
                <div className="mt-2 text-xs text-zinc-500">
                  Location: {ev.location}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
