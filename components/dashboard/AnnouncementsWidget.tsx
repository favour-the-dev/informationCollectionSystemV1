import Link from "next/link";

type Announcement = {
  _id: string;
  title: string;
  content: string;
  datePosted: Date;
};

export default function AnnouncementsWidget({
  announcements,
}: {
  announcements: Announcement[];
}) {
  return (
    <div className="cc-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-medium">Recent Announcements</h3>
        <Link
          href="/announcements"
          className="text-sm text-(--cc-primary) hover:underline"
        >
          View All
        </Link>
      </div>
      {announcements.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-(--cc-text-muted)">
          <p>No recent announcements.</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-96 overflow-y-auto">
          {announcements.map((ann) => (
            <li
              key={ann._id}
              className="rounded-lg border p-3 transition-colors hover:bg-zinc-50"
            >
              <h4 className="font-medium">{ann.title}</h4>
              <p className="mt-1 text-sm text-(--cc-text-muted) line-clamp-2">
                {ann.content}
              </p>
              <div className="mt-2 text-xs text-(--cc-text-muted)">
                {new Date(ann.datePosted).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
