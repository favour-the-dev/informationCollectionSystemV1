"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ComplaintReplyForm({
  id,
  onPosted,
}: {
  id: string;
  onPosted?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please enter a reply");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/complaints/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        const t = await res.json().catch(() => ({}));
        throw new Error(t?.error || "Failed to post reply");
      }
      setMessage("");
      onPosted?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to post reply";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 space-y-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={`cc-input h-24 w-full ${error ? "cc-input--error" : ""}`}
        placeholder="Write a reply to the resident..."
      />
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Posting..." : "Post reply"}
        </Button>
      </div>
    </form>
  );
}
