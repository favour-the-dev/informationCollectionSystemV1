import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Complaint } from "@/models/Complaint";
import Link from "next/link";

export default async function ComplaintsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-lg border p-8 text-center">
          <p className="text-zinc-700">
            Please{" "}
            <a className="underline" href="/login">
              sign in
            </a>{" "}
            to view and submit complaints.
          </p>
        </div>
      </div>
    );
  }

  await connectDB();
  const isAdmin = session.user.role === "admin";
  const filter = isAdmin ? {} : { userId: session.user.id };
  const raw = await Complaint.find(filter).sort({ createdAt: -1 }).lean();
  const complaints = (raw as Array<Record<string, unknown>>).map((c) => ({
    _id: String(c._id),
    title: c.title as string,
    description: c.description as string,
    status: c.status as string,
    category: c.category as string,
    location: c.location as string | undefined,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isAdmin ? "All Complaints" : "My Complaints"}
        </h1>
        {!isAdmin && (
          <Link
            href="/complaints/new"
            className="rounded-md bg-black px-3 py-1.5 text-white hover:bg-zinc-800"
          >
            New Complaint
          </Link>
        )}
      </div>
      {complaints.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-zinc-600">
          {isAdmin
            ? "No complaints yet."
            : "You haven't submitted any complaints yet."}
        </div>
      ) : (
        <ul className="space-y-4">
          {complaints.map((c) => (
            <li key={String(c._id)} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{c.title}</h3>
                <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
                  {c.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-700">{c.description}</p>
              <div className="mt-2 text-xs text-zinc-500">
                {c.category}
                {c.location ? ` · ${c.location}` : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
