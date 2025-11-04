import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-linear-to-br from-[#2563eb] to-[#1d4ed8]">
        <svg
          className="absolute -right-10 -top-10 h-64 w-64 opacity-20"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fill="#ffffff"
            d="M47.6,-54.4C61.8,-45.5,73.7,-30.5,76.4,-14.2C79.1,2,72.6,19.6,62.3,34.6C52,49.6,37.9,62,21.5,67.6C5.2,73.1,-13.4,71.7,-30.6,65.1C-47.9,58.5,-63.8,46.7,-71.2,31.1C-78.5,15.6,-77.4,-3.7,-69.6,-18.7C-61.8,-33.6,-47.3,-44.2,-32.5,-53.8C-17.6,-63.4,-2.5,-71.9,12.5,-76.1C27.6,-80.3,55.2,-80.2,47.6,-54.4Z"
            transform="translate(100 100)"
          />
        </svg>
        <div className="cc-container relative py-24 text-center text-white">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Connect, organize, and thrive as a community
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            Announcements, complaints, service schedules, and events—everything
            in one trusted place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/announcements" className="cc-btn cc-btn--secondary">
              Explore announcements
            </Link>
            <Link href="/register" className="cc-btn cc-btn--primary">
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="cc-container grid grid-cols-1 gap-6 py-10 md:grid-cols-3">
        {[
          {
            title: "Announcements",
            desc: "Stay informed with timely updates.",
            href: "/announcements",
          },
          {
            title: "Complaints",
            desc: "Report issues and track resolutions.",
            href: "/complaints",
          },
          {
            title: "Events",
            desc: "Discover and participate in community events.",
            href: "/events",
          },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="cc-card animate-fade-in p-5 transition-shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-(--cc-text-muted)">{item.desc}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
