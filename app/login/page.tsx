"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //   const toast = useToast();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials");
      //   toast.error("Invalid email or password");
    } else {
      //   toast.success("Signed in");
      // Fetch session to determine role
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      // Redirect based on role
      if (session?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-sm"
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-zinc-600">Sign in to your account</p>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 cc-input ${error ? "cc-input--error" : ""}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 cc-input ${error ? "cc-input--error" : ""}`}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner /> Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
        <p className="text-center text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <a className="text-black underline" href="/register">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
