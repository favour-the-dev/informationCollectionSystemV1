"use client";

import { useRouter } from "next/navigation";

export default function AnnouncementActions({ id }: { id: string }) {
  const router = useRouter();

  async function onDelete() {
    if (!confirm("Delete this announcement?")) return;
    const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {/* Simple delete for MVP; editing can be added later */}
      <button
        onClick={onDelete}
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50"
      >
        Delete
      </button>
    </div>
  );
}
