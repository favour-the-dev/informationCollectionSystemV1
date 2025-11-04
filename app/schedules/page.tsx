import { connectDB } from "@/lib/db";
import { ServiceSchedule } from "@/models/ServiceSchedule";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SchedulesPage() {
  const session = await getServerSession(authOptions);
  await connectDB();
  const now = new Date();
  const raw = await ServiceSchedule.find({ date: { $gte: now } })
    .sort({ date: 1 })
    .lean();
  const items = (raw as Array<Record<string, unknown>>).map((s) => ({
    _id: String(s._id),
    serviceType: s.serviceType as string,
    description: s.description as string | undefined,
    date: new Date(s.date as string | Date),
    time: s.time as string | undefined,
    responsibleDepartment: s.responsibleDepartment as string | undefined,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Service Schedules</h1>
        {session?.user?.role === "admin" && (
          <Link href="/schedules/new" className="cc-btn cc-btn--primary">
            New
          </Link>
        )}
      </div>
      {items.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-zinc-600">
          No upcoming schedules.
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((s) => (
            <li key={String(s._id)} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{s.serviceType}</h3>
                <div className="text-sm text-zinc-600">
                  {new Date(s.date).toLocaleDateString()}{" "}
                  {s.time ? `· ${s.time}` : ""}
                </div>
              </div>
              {s.description && (
                <p className="mt-2 text-sm text-zinc-700">{s.description}</p>
              )}
              {s.responsibleDepartment && (
                <div className="mt-2 text-xs text-zinc-500">
                  Dept: {s.responsibleDepartment}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
