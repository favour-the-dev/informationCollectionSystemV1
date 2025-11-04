"use client";

import { useState, FormEvent } from "react";

export default function RequestResetPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setLink(null);
    const res = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) {
      setMessage("Could not process request");
      return;
    }
    const data = await res.json();
    setMessage(
      "If an account exists, a reset link is provided below (prototype mode)."
    );
    if (data.link) setLink(data.link);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-4 text-2xl font-semibold">Reset Password</h1>
      <p className="mb-6 text-sm text-zinc-600">
        Enter your email to request a password reset link.
      </p>
      {message && (
        <div className="mb-4 rounded-md bg-zinc-50 p-3 text-sm text-zinc-700">
          {message}
          {link && (
            <div className="mt-2 truncate text-xs">
              <a className="text-black underline" href={link}>
                {link}
              </a>
            </div>
          )}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Requesting..." : "Request Reset"}
        </button>
      </form>
    </div>
  );
}
