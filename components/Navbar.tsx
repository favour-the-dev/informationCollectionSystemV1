"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60">
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!session?.user) return setUnread(0);
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      if (active)
        setUnread((data as { read: boolean }[]).filter((n) => !n.read).length);
    }
    load();
    const id = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(id);
