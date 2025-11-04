import Link from "next/link";
export default function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-semibold">Unauthorized</h1>
      <p className="mt-2 text-zinc-600">
        You don’t have permission to access this page.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md border px-4 py-2 hover:bg-zinc-50"
      >
        Go home
      </Link>
    </div>
  );
}
