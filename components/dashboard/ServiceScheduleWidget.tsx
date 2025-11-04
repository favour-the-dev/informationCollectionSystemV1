import Link from "next/link";

type ServiceSchedule = {
  _id: string;
  serviceType: string;
  date: Date;
  time?: string;
  provider?: string;
};

export default function ServiceScheduleWidget({
  schedules,
}: {
  schedules: ServiceSchedule[];
}) {
  return (
    <div className="cc-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-medium">Upcoming Services</h3>
        <Link
          href="/schedules"
          className="text-sm text-(--cc-primary) hover:underline"
        >
          View All
        </Link>
      </div>
      {schedules.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-(--cc-text-muted)">
          <p>No services scheduled for the next 7 days.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {schedules.map((sched) => (
            <li
              key={sched._id}
              className="rounded-lg border p-3 transition-colors hover:bg-zinc-50"
            >
              <h4 className="font-medium capitalize">{sched.serviceType}</h4>
              <div className="mt-1 text-sm text-(--cc-text-muted)">
                {new Date(sched.date).toLocaleDateString()}{" "}
                {sched.time && `· ${sched.time}`}
              </div>
              {sched.provider && (
                <div className="mt-1 text-xs text-(--cc-text-muted)">
                  Provider: {sched.provider}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
