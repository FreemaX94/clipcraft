"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import {
  ensureLoaded,
  getFFmpeg,
  GIF_PRESETS,
  buildGifFilter,
  type GifPreset,
} from "@/lib/ffmpeg";

type Status =
  | { kind: "empty" }
  | { kind: "loaded"; file: File; previewUrl: string }
  | { kind: "loading-engine"; file: File; previewUrl: string; message: string }
  | { kind: "converting"; file: File; previewUrl: string; progress: number }
  | { kind: "done"; file: File; previewUrl: string; resultUrl: string; resultSize: number }
  | { kind: "error"; file: File | null; previewUrl: string | null; message: string };

const MAX_FILE_MB = 500;

function bytesToMB(b: number): string {
  return (b / (1024 * 1024)).toFixed(1);
}

function inferOutputName(input: string, ext: string): string {
  const dot = input.lastIndexOf(".");
  const base = dot > 0 ? input.slice(0, dot) : input;
  return `${base}.${ext}`;
}

export default function Home() {
  const [status, setStatus] = useState<Status>({ kind: "empty" });
  const [preset, setPreset] = useState<GifPreset>(GIF_PRESETS[0]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cleanup blob URLs on unmount or change
  useEffect(() => {
    return () => {
      if (status.kind !== "empty" && "previewUrl" in status && status.previewUrl) {
        // Note: don't revoke here during normal lifecycle, only on unmount
      }
    };
  }, [status]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) {
      setStatus({
        kind: "error",
        file: null,
        previewUrl: null,
        message: `That doesn't look like a video file (${file.type || "unknown"}).`,
      });
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setStatus({
        kind: "error",
        file: null,
        previewUrl: null,
        message: `File is ${bytesToMB(file.size)} MB. Limit is ${MAX_FILE_MB} MB to avoid browser crashes.`,
      });
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setStatus({ kind: "loaded", file, previewUrl });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onPickFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const reset = useCallback(() => {
    if (status.kind !== "empty" && "previewUrl" in status && status.previewUrl) {
      URL.revokeObjectURL(status.previewUrl);
    }
    if (status.kind === "done") {
      URL.revokeObjectURL(status.resultUrl);
    }
    setStatus({ kind: "empty" });
    if (inputRef.current) inputRef.current.value = "";
  }, [status]);

  const convertToGif = useCallback(async () => {
    if (status.kind !== "loaded") return;
    const { file, previewUrl } = status;
    setStatus({ kind: "loading-engine", file, previewUrl, message: "Preparing engine..." });
    try {
      await ensureLoaded((msg) => {
        setStatus((s) =>
          s.kind === "loading-engine" ? { ...s, message: msg } : s,
        );
      });

      setStatus({ kind: "converting", file, previewUrl, progress: 0 });

      const ffmpeg = getFFmpeg();
      const progressHandler = ({ progress }: { progress: number }) => {
        setStatus((s) =>
          s.kind === "converting"
            ? { ...s, progress: Math.max(0, Math.min(1, progress)) }
            : s,
        );
      };
      ffmpeg.on("progress", progressHandler);

      const inputName = "input.mp4";
      const outputName = "output.gif";
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const filter = buildGifFilter(preset);
      await ffmpeg.exec([
        "-i",
        inputName,
        "-vf",
        filter,
        "-loop",
        "0",
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);
      ffmpeg.off("progress", progressHandler);

      // data is Uint8Array; create blob
      const buffer =
        data instanceof Uint8Array
          ? data
          : new TextEncoder().encode(String(data));
      const blob = new Blob([buffer.buffer as ArrayBuffer], { type: "image/gif" });
      const resultUrl = URL.createObjectURL(blob);

      setStatus({
        kind: "done",
        file,
        previewUrl,
        resultUrl,
        resultSize: blob.size,
      });
    } catch (err) {
      console.error(err);
      setStatus({
        kind: "error",
        file,
        previewUrl,
        message:
          err instanceof Error ? err.message : "Conversion failed for an unknown reason.",
      });
    }
  }, [status, preset]);

  const downloadName = useMemo(() => {
    if (status.kind !== "done") return "clipcraft.gif";
    return inferOutputName(status.file.name, "gif");
  }, [status]);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <header className="w-full px-6 py-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-2xl">🎬</span>
            <span className="font-semibold tracking-tight">ClipCraft</span>
          </div>
          <nav className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-4">
            <a
              href="https://github.com/freemanlopez94140/clipcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 sm:py-20 flex flex-col gap-12">
        <section className="text-center max-w-3xl mx-auto flex flex-col gap-5">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Convert any video to GIF.
            <br />
            <span className="text-zinc-500 dark:text-zinc-400">
              Right in your browser.
            </span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Drag a video. Get a viral-ready GIF in seconds. Your file{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">never leaves your laptop</strong>.{" "}
            No upload. No signup. No watermark. Forever free.
          </p>
        </section>

        <section className="w-full">
          {status.kind === "empty" && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={[
                "w-full block border-2 border-dashed rounded-2xl px-8 py-16 sm:py-24",
                "transition-colors cursor-pointer text-center",
                isDragging
                  ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-900"
                  : "border-zinc-300 bg-white hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:border-zinc-500",
              ].join(" ")}
            >
              <div className="text-5xl mb-4" aria-hidden>
                🎞️
              </div>
              <div className="text-xl font-medium mb-1">
                Drop a video here, or click to choose
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                MP4, WebM, MOV, MKV — up to {MAX_FILE_MB} MB
              </div>
            </button>
          )}

          {status.kind !== "empty" && status.previewUrl && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {status.kind === "done" ? (
                  <img
                    src={status.resultUrl}
                    alt="Converted GIF preview"
                    className="max-w-full max-h-full"
                  />
                ) : (
                  <video
                    src={status.previewUrl}
                    controls
                    className="max-w-full max-h-full"
                  />
                )}
              </div>

              <div className="flex flex-col gap-5">
                {status.kind === "loaded" && (
                  <>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {status.file.name}
                      </span>{" "}
                      · {bytesToMB(status.file.size)} MB
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Preset</div>
                      <div className="grid grid-cols-1 gap-2">
                        {GIF_PRESETS.map((p) => (
                          <label
                            key={p.id}
                            className={[
                              "flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors",
                              preset.id === p.id
                                ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
                                : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600",
                            ].join(" ")}
                          >
                            <input
                              type="radio"
                              name="preset"
                              value={p.id}
                              checked={preset.id === p.id}
                              onChange={() => setPreset(p)}
                              className="mt-1"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{p.label}</span>
                              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                {p.description}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={convertToGif}
                        className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity"
                      >
                        Convert to GIF
                      </button>
                      <button
                        type="button"
                        onClick={reset}
                        className="px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                      >
                        Choose another
                      </button>
                    </div>
                  </>
                )}

                {status.kind === "loading-engine" && (
                  <div className="flex flex-col gap-3">
                    <div className="text-sm font-medium">Loading…</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {status.message}
                    </div>
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
                    </div>
                  </div>
                )}

                {status.kind === "converting" && (
                  <div className="flex flex-col gap-3">
                    <div className="text-sm font-medium">
                      Converting… {Math.round(status.progress * 100)}%
                    </div>
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all"
                        style={{ width: `${Math.round(status.progress * 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      All processing happens in your browser. Open DevTools → Network to verify zero upload.
                    </p>
                  </div>
                )}

                {status.kind === "done" && (
                  <div className="flex flex-col gap-3">
                    <div className="text-sm">
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        ✓ Done
                      </span>{" "}
                      <span className="text-zinc-500 dark:text-zinc-400">
                        — {bytesToMB(status.resultSize)} MB
                      </span>
                    </div>
                    <a
                      href={status.resultUrl}
                      download={downloadName}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity"
                    >
                      Download {downloadName}
                    </a>
                    <button
                      type="button"
                      onClick={reset}
                      className="px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                      Convert another
                    </button>
                  </div>
                )}

                {status.kind === "error" && (
                  <div className="flex flex-col gap-3">
                    <div className="text-sm font-medium text-red-700 dark:text-red-400">
                      Something went wrong
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {status.message}
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className="self-start px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={onPickFile}
          />
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
          <div className="flex flex-col gap-1">
            <div className="text-2xl" aria-hidden>🔒</div>
            <div className="font-medium">Zero upload</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Your file never leaves your laptop. Verifiable in DevTools.
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl" aria-hidden>⚡</div>
            <div className="font-medium">Instant</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              ffmpeg.wasm runs directly in your browser. No server roundtrip.
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl" aria-hidden>🎁</div>
            <div className="font-medium">Forever free</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              No watermark, no signup, no paywall. Support on Ko-fi if you love it.
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full px-6 py-6 border-t border-zinc-200/60 dark:border-zinc-800/60 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-2 sm:gap-6 items-center justify-between">
          <div>Built in public · 100% browser-side · Open source</div>
          <div className="flex items-center gap-4">
            <a
              href="https://ko-fi.com/clipcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              ☕ Support on Ko-fi
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
