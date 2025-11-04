import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">
        CommunityConnect
      </h1>
      <p className="max-w-2xl text-lg text-zinc-700">
        A simple, modern platform for community announcements, complaints,
        service schedules, and events.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          className="rounded-md border px-4 py-2 hover:bg-zinc-50"
          href="/announcements"
        >
          View Announcements
        </Link>
        <Link
          className="rounded-md border px-4 py-2 hover:bg-zinc-50"
          href="/complaints"
        >
          Complaints
        </Link>
        <Link
          className="rounded-md border px-4 py-2 hover:bg-zinc-50"
          href="/schedules"
        >
          Service Schedules
        </Link>
        <Link
          className="rounded-md border px-4 py-2 hover:bg-zinc-50"
          href="/events"
        >
          Events
        </Link>
      </div>
    </main>
  );
}
