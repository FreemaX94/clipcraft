import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "ClipCraft processes videos 100% in your browser. Your files never reach our servers. Here's how to verify it yourself.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <header className="w-full px-6 py-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span aria-hidden className="text-2xl">🎬</span>
            <span className="font-semibold tracking-tight">ClipCraft</span>
          </Link>
          <nav className="text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href="/"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              ← Back to app
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Privacy, in one paragraph.
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            ClipCraft does not have a backend. Your video file never reaches our
            servers. Every conversion runs inside your own browser using
            WebAssembly.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">How to verify yourself</h2>
          <ol className="list-decimal list-inside flex flex-col gap-2 text-zinc-700 dark:text-zinc-300">
            <li>Open ClipCraft in any browser.</li>
            <li>
              Open DevTools (right-click → Inspect, or <code>F12</code>) and go
              to the <strong>Network</strong> tab.
            </li>
            <li>
              Drop a video and run any conversion. You&apos;ll see one initial
              load (the app and the WebAssembly engine from a public CDN). After
              that: <strong>no outgoing requests carrying your file</strong>.
              Ever.
            </li>
            <li>
              The source code is open. You can read it on GitHub and run a copy
              locally with no internet.
            </li>
          </ol>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">What we collect</h2>
          <ul className="list-disc list-inside flex flex-col gap-2 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Anonymous web analytics</strong> via Vercel Analytics:
              page views, country, device type. No personal data, no cookies for
              tracking, no fingerprinting. You can block it with any ad blocker
              and the app keeps working.
            </li>
            <li>
              <strong>No accounts, no emails, no payments.</strong>{" "}
              We don&apos;t ask you for anything.
            </li>
            <li>
              <strong>No file metadata leaves your machine.</strong>{" "}
              Filenames, durations, sizes &mdash; all stay local.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">What we do not collect</h2>
          <ul className="list-disc list-inside flex flex-col gap-2 text-zinc-700 dark:text-zinc-300">
            <li>The videos you convert.</li>
            <li>Your IP address (beyond standard CDN logs from Vercel).</li>
            <li>Behavioral tracking or marketing pixels.</li>
            <li>Anything sold or shared with third parties.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Third parties involved</h2>
          <ul className="list-disc list-inside flex flex-col gap-2 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Vercel</strong> hosts the static app (HTML/JS/CSS).
            </li>
            <li>
              <strong>unpkg.com</strong> serves the open-source ffmpeg.wasm
              engine (a one-time download of ~25 MB, cached forever).
            </li>
            <li>
              <strong>Google Fonts</strong>{" "}
              serves the typeface (loaded from Vercel&apos;s edge, no direct hit).
            </li>
          </ul>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            None of these third parties receive your video.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-zinc-700 dark:text-zinc-300">
            Found a privacy bug or want to suggest an improvement? Open an issue
            on{" "}
            <a
              href="https://github.com/FreemaX94/clipcraft"
              className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">
          Last updated: 2026-05-23.
        </p>
      </main>

      <footer className="w-full px-6 py-6 border-t border-zinc-200/60 dark:border-zinc-800/60 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="max-w-3xl mx-auto flex justify-center">
          Built in public · 100% browser-side · Open source
        </div>
      </footer>
    </div>
  );
}
