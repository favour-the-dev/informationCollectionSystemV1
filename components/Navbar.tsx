"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Button from "./ui/Button";
import Portal from "./Portal";

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [open, setOpen] = useState(false);

  const avatar = (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--cc-primary) text-white text-xs">
      {(session?.user?.name || session?.user?.email || "U")
        .slice(0, 1)
        .toUpperCase()}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="cc-container flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border sm:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            {/* hamburger icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-(--cc-text)"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-(--cc-text)"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-(--cc-primary)"></span>
            CommunityConnect
          </Link>
        </div>
        <nav className="hidden items-center gap-3 text-sm sm:flex">
          <Link
            href="/announcements"
            className="text-(--cc-text-muted) hover:text-(--cc-text)"
          >
            Announcements
          </Link>
          <Link
            href="/complaints"
            className="text-(--cc-text-muted) hover:text-(--cc-text)"
          >
            Complaints
          </Link>
          <Link
            href="/schedules"
            className="text-(--cc-text-muted) hover:text-(--cc-text)"
          >
            Schedules
          </Link>
          <Link
            href="/events"
            className="text-(--cc-text-muted) hover:text-(--cc-text)"
          >
            Events
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="relative group">
              <button className="flex items-center gap-2">
                {avatar}
                <span className="hidden text-sm text-(--cc-text) md:inline">
                  {session.user.name || session.user.email}
                </span>
              </button>
              {/* Dropdown */}
              <div className="invisible absolute right-0 z-50 mt-2 min-w-44 rounded-md border bg-white p-1 opacity-0 shadow-sm transition-all group-hover:visible group-hover:opacity-100">
                <div className="px-2 py-1.5 text-xs text-(--cc-text-muted)">
                  Account
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block rounded px-2 py-1.5 text-sm hover:bg-zinc-50"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-zinc-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile slide-over */}
      {open && (
        <Portal>
          <div
            className="fixed inset-0 z-100 sm:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpen(false)}
            ></div>
            <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <span className="font-semibold">Menu</span>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-3 text-sm">
                <Link
                  href="/announcements"
                  className="rounded px-2 py-2 hover:bg-zinc-50"
                  onClick={() => setOpen(false)}
                >
                  Announcements
                </Link>
                <Link
                  href="/complaints"
                  className="rounded px-2 py-2 hover:bg-zinc-50"
                  onClick={() => setOpen(false)}
                >
                  Complaints
                </Link>
                <Link
                  href="/schedules"
                  className="rounded px-2 py-2 hover:bg-zinc-50"
                  onClick={() => setOpen(false)}
                >
                  Schedules
                </Link>
                <Link
                  href="/events"
                  className="rounded px-2 py-2 hover:bg-zinc-50"
                  onClick={() => setOpen(false)}
                >
                  Events
                </Link>
                <div className="my-2 border-t"></div>
                {session?.user ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="rounded px-2 py-2 hover:bg-zinc-50"
                        onClick={() => setOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      className="rounded px-2 py-2 text-left hover:bg-zinc-50"
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded px-2 py-2 hover:bg-zinc-50"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="rounded px-2 py-2 hover:bg-zinc-50"
                      onClick={() => setOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </Portal>
      )}
    </header>
  );
}
