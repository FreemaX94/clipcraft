import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <header className="w-full px-6 py-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span aria-hidden className="text-2xl">🎬</span>
            <span className="font-semibold tracking-tight">ClipCraft</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-24 flex flex-col items-center gap-6 text-center">
        <div className="text-7xl" aria-hidden>🎞️</div>
        <h1 className="text-4xl font-semibold tracking-tight">
          This page got cut from the edit.
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-md">
          We couldn&apos;t find what you&apos;re looking for. Maybe it never
          existed, or maybe it was trimmed off.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity"
          >
            Go to the converter
          </Link>
          <Link
            href="/privacy"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            Privacy policy
          </Link>
        </div>
      </main>

      <footer className="w-full px-6 py-6 border-t border-zinc-200/60 dark:border-zinc-800/60 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="max-w-3xl mx-auto flex justify-center">
          Built in public · 100% browser-side · Open source
        </div>
      </footer>
    </div>
  );
}
