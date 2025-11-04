import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Complaint } from "@/models/Complaint";
import { Event } from "@/models/Event";
import { Announcement } from "@/models/Announcement";
import { ServiceSchedule } from "@/models/ServiceSchedule";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-lg border p-8 text-center text-zinc-600">
          You must be an administrator to view this page.
        </div>
      </div>
    );
  }

  await connectDB();
  const [complaintAgg, events, announcements, schedules] = await Promise.all([
    Complaint.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5)
      .lean(),
    Announcement.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ServiceSchedule.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5)
      .lean(),
  ]);

  type Agg = { _id: string; count: number };
  const complaintCounts = {
    Submitted:
      (complaintAgg as Agg[]).find((c) => c._id === "Submitted")?.count || 0,
    "In Progress":
      (complaintAgg as Agg[]).find((c) => c._id === "In Progress")?.count || 0,
    Resolved:
      (complaintAgg as Agg[]).find((c) => c._id === "Resolved")?.count || 0,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-zinc-600">Complaints: Submitted</div>
          <div className="text-3xl font-semibold">
            {complaintCounts.Submitted}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-zinc-600">Complaints: In Progress</div>
          <div className="text-3xl font-semibold">
            {complaintCounts["In Progress"]}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-zinc-600">Complaints: Resolved</div>
          <div className="text-3xl font-semibold">
            {complaintCounts.Resolved}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-medium">Upcoming Events</h2>
          <ul className="space-y-2 text-sm">
            {(
              events as unknown as {
                _id: string;
                title: string;
                date: Date;
                time?: string;
              }[]
            ).map(
              (ev: {
                _id: string;
                title: string;
                date: string | Date;
                time?: string;
              }) => (
                <li
                  key={String(ev._id)}
                  className="flex items-center justify-between"
                >
                  <span>{ev.title}</span>
                  <span className="text-zinc-600">
                    {new Date(ev.date).toLocaleDateString()}{" "}
                    {ev.time ? `· ${ev.time}` : ""}
                  </span>
                </li>
              )
            )}
            {events.length === 0 && (
              <li className="text-zinc-600">No upcoming events</li>
            )}
          </ul>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-medium">Recent Announcements</h2>
          <ul className="space-y-2 text-sm">
            {(
              announcements as unknown as {
                _id: string;
                title: string;
                createdAt: Date;
              }[]
            ).map(
              (a: { _id: string; title: string; createdAt: string | Date }) => (
                <li
                  key={String(a._id)}
                  className="flex items-center justify-between"
                >
                  <span className="truncate">{a.title}</span>
                  <span className="text-zinc-600">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </li>
              )
            )}
            {announcements.length === 0 && (
              <li className="text-zinc-600">No announcements</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-medium">Recent Service Schedules</h2>
        <ul className="space-y-2 text-sm">
          {(
            schedules as unknown as {
              _id: string;
              serviceType: string;
              date: Date;
              time?: string;
            }[]
          ).map(
            (s: {
              _id: string;
              serviceType: string;
              date: string | Date;
              time?: string;
            }) => (
              <li
                key={String(s._id)}
                className="flex items-center justify-between"
              >
                <span>{s.serviceType}</span>
                <span className="text-zinc-600">
                  {new Date(s.date).toLocaleDateString()}{" "}
                  {s.time ? `· ${s.time}` : ""}
                </span>
              </li>
            )
          )}
          {schedules.length === 0 && (
            <li className="text-zinc-600">No upcoming schedules</li>
          )}
        </ul>
      </div>
    </div>
  );
}
