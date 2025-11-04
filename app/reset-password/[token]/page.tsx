"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function ResetWithTokenPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Could not reset password");
      return;
    }
    setMessage("Password reset. You can now sign in.");
    setTimeout(() => router.push("/login"), 1200);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-4 text-2xl font-semibold">Set a new password</h1>
      {message && (
        <div className="mb-4 rounded-md bg-zinc-50 p-3 text-sm text-zinc-700">
          {message}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">New password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
