import Link from "next/link";

type Event = {
  _id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
};

export default function EventsWidget({ events }: { events: Event[] }) {
  return (
    <div className="cc-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-medium">Upcoming Events</h3>
        <Link
          href="/events"
          className="text-sm text-(--cc-primary) hover:underline"
        >
          View All
        </Link>
      </div>
      {events.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-(--cc-text-muted)">
          <p>No upcoming events.</p>
          <Link
            href="/events"
            className="mt-2 inline-block text-(--cc-primary) hover:underline"
          >
            Explore events
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {events.map((ev) => (
            <li
              key={ev._id}
              className="rounded-lg border p-3 transition-colors hover:bg-zinc-50"
            >
              <h4 className="font-medium">{ev.title}</h4>
              <div className="mt-1 text-sm text-(--cc-text-muted)">
                {new Date(ev.date).toLocaleDateString()}{" "}
                {ev.time && `· ${ev.time}`}
              </div>
              {ev.location && (
                <div className="mt-1 text-xs text-(--cc-text-muted)">
                  📍 {ev.location}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
