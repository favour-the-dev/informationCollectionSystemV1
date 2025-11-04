import Link from "next/link";
import Badge from "@/components/ui/Badge";

type Complaint = {
  _id: string;
  title: string;
  status: string;
  category: string;
  createdAt: Date;
};

export default function ComplaintsWidget({
  complaints,
}: {
  complaints: Complaint[];
}) {
  return (
    <div className="cc-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-medium">My Recent Complaints</h3>
        <Link
          href="/complaints"
          className="text-sm text-(--cc-primary) hover:underline"
        >
          View All
        </Link>
      </div>
      {complaints.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-(--cc-text-muted)">
          <p>No complaints yet.</p>
          <Link
            href="/complaints/new"
            className="mt-2 inline-block text-(--cc-primary) hover:underline"
          >
            Submit your first complaint
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {complaints.map((c) => (
            <li
              key={c._id}
              className="rounded-lg border p-3 transition-colors hover:bg-zinc-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-medium">{c.title}</h4>
                  <p className="mt-1 text-xs text-(--cc-text-muted)">
                    {c.category}
                  </p>
                </div>
                <Badge
                  variant={
                    c.status === "Resolved"
                      ? "green"
                      : c.status === "In Progress"
                      ? "orange"
                      : "blue"
                  }
                >
                  {c.status}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
