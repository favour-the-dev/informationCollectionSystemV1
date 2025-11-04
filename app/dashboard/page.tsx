import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Complaint } from "@/models/Complaint";
import { Event } from "@/models/Event";
import { Announcement } from "@/models/Announcement";
import { ServiceSchedule } from "@/models/ServiceSchedule";
import StatsCard from "@/components/dashboard/StatsCard";
import ComplaintsWidget from "@/components/dashboard/ComplaintsWidget";
import EventsWidget from "@/components/dashboard/EventsWidget";
import AnnouncementsWidget from "@/components/dashboard/AnnouncementsWidget";
import ServiceScheduleWidget from "@/components/dashboard/ServiceScheduleWidget";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  // Restrict dashboard to residents only
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  await connectDB();

  // Fetch stats
  const userId = session.user.id;
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    totalComplaints,
    activeComplaints,
    registeredEvents,
    recentAnnouncements,
    recentComplaintsData,
    upcomingEventsData,
    announcementsData,
    schedulesData,
  ] = await Promise.all([
    Complaint.countDocuments({ userId }),
    Complaint.countDocuments({
      userId,
      status: { $in: ["Submitted", "In Progress"] },
    }),
    Event.countDocuments({ date: { $gte: now }, participants: userId }),
    Announcement.countDocuments({ datePosted: { $gte: sevenDaysAgo } }),
    Complaint.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
    Event.find({ date: { $gte: now }, participants: userId })
      .sort({ date: 1 })
      .limit(5)
      .lean(),
    Announcement.find().sort({ datePosted: -1 }).limit(5).lean(),
    ServiceSchedule.find({ date: { $gte: now, $lte: sevenDaysFromNow } })
      .sort({ date: 1 })
      .lean(),
  ]);

  return (
    <div className="cc-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {session.user.name || "Resident"}!
        </h1>
        <p className="mt-2 text-(--cc-text-muted)">
          Here&apos;s what&apos;s happening in your community.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Complaints" value={totalComplaints} />
        <StatsCard
          title="Active Complaints"
          value={activeComplaints}
          subtitle="Submitted or In Progress"
        />
        <StatsCard
          title="Registered Events"
          value={registeredEvents}
          subtitle="Upcoming events"
        />
        <StatsCard
          title="New Announcements"
          value={recentAnnouncements}
          subtitle="Last 7 days"
        />
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ComplaintsWidget
          complaints={recentComplaintsData.map((c) => ({
            _id: String(c._id),
            title: c.title,
            status: c.status,
            category: c.category,
            createdAt: c.dateSubmitted,
          }))}
        />
        <EventsWidget
          events={upcomingEventsData.map((e) => ({
            _id: String(e._id),
            title: e.title,
            date: e.date,
            time: e.time,
            location: e.location,
          }))}
        />
        <AnnouncementsWidget
          announcements={announcementsData.map((a) => ({
            _id: String(a._id),
            title: a.title,
            content: a.content,
            datePosted: a.datePosted,
          }))}
        />
        <ServiceScheduleWidget
          schedules={schedulesData.map((s) => ({
            _id: String(s._id),
            serviceType: s.serviceType,
            date: s.date,
            time: s.time,
            provider: s.responsibleDepartment,
          }))}
        />
      </div>
    </div>
  );
}
