"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import {
  ensureLoaded,
  getFFmpeg,
  GIF_PRESETS,
  AUDIO_PRESETS,
  COMPRESS_PRESETS,
  CONVERT_FORMATS,
  TOOLS,
  buildGifArgs,
  buildAudioArgs,
  buildCompressArgs,
  buildConvertArgs,
  type ToolId,
  type ToolMeta,
  type GifPreset,
  type AudioPreset,
  type CompressPreset,
  type ConvertFormat,
  type TrimRange,
} from "@/lib/ffmpeg";

type Status =
  | { kind: "empty" }
  | { kind: "loaded"; file: File; previewUrl: string }
  | { kind: "loading-engine"; file: File; previewUrl: string; message: string }
  | {
      kind: "converting";
      file: File;
      previewUrl: string;
      progress: number;
      toolLabel: string;
    }
  | {
      kind: "done";
      file: File;
      previewUrl: string;
      resultUrl: string;
      resultSize: number;
      tool: ToolMeta;
      downloadName: string;
    }
  | {
      kind: "error";
      file: File | null;
      previewUrl: string | null;
      message: string;
    };

const MAX_FILE_MB = 500;

function bytesToMB(b: number): string {
  return (b / (1024 * 1024)).toFixed(1);
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function inferOutputName(input: string, ext: string): string {
  const dot = input.lastIndexOf(".");
  const base = dot > 0 ? input.slice(0, dot) : input;
  return `${base}.${ext}`;
}

function getOutputExt(tool: ToolId, convertFormat: ConvertFormat): string {
  if (tool === "convert") return convertFormat.ext;
  if (tool === "gif") return "gif";
  if (tool === "audio") return "mp3";
  return "mp4";
}

function getOutputMime(tool: ToolId, convertFormat: ConvertFormat): string {
  if (tool === "convert") return convertFormat.mime;
  if (tool === "gif") return "image/gif";
  if (tool === "audio") return "audio/mpeg";
  return "video/mp4";
}

export default function Home() {
  const [status, setStatus] = useState<Status>({ kind: "empty" });
  const [tool, setTool] = useState<ToolId>("gif");
  const [gifPreset, setGifPreset] = useState<GifPreset>(GIF_PRESETS[0]);
  const [audioPreset, setAudioPreset] = useState<AudioPreset>(AUDIO_PRESETS[1]);
  const [compressPreset, setCompressPreset] = useState<CompressPreset>(
    COMPRESS_PRESETS[1],
  );
  const [convertFormat, setConvertFormat] = useState<ConvertFormat>(
    CONVERT_FORMATS[1],
  );
  const [trim, setTrim] = useState<TrimRange>({
    enabled: false,
    startSec: 0,
    endSec: 0,
    durationSec: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    setTrim({ enabled: false, startSec: 0, endSec: 0, durationSec: 0 });
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

  const onVideoLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const d = v.duration;
    if (Number.isFinite(d) && d > 0) {
      setTrim((t) => ({
        enabled: t.enabled,
        startSec: 0,
        endSec: d,
        durationSec: d,
      }));
    }
  }, []);

  const setMarkIn = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const t = v.currentTime;
    setTrim((cur) => ({
      ...cur,
      startSec: Math.min(t, cur.endSec - 0.1),
      enabled: true,
    }));
  }, []);

  const setMarkOut = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const t = v.currentTime;
    setTrim((cur) => ({
      ...cur,
      endSec: Math.max(t, cur.startSec + 0.1),
      enabled: true,
    }));
  }, []);

  const resetTrim = useCallback(() => {
    setTrim((cur) => ({
      enabled: false,
      startSec: 0,
      endSec: cur.durationSec,
      durationSec: cur.durationSec,
    }));
  }, []);

  const reset = useCallback(() => {
    if (status.kind !== "empty" && "previewUrl" in status && status.previewUrl) {
      URL.revokeObjectURL(status.previewUrl);
    }
    if (status.kind === "done") {
      URL.revokeObjectURL(status.resultUrl);
    }
    setStatus({ kind: "empty" });
    setTrim({ enabled: false, startSec: 0, endSec: 0, durationSec: 0 });
    if (inputRef.current) inputRef.current.value = "";
  }, [status]);

  const currentTool = useMemo<ToolMeta>(
    () => TOOLS.find((t) => t.id === tool) ?? TOOLS[0],
    [tool],
  );

  const convert = useCallback(async () => {
    if (status.kind !== "loaded") return;
    const { file, previewUrl } = status;
    const toolMeta = currentTool;
    setStatus({
      kind: "loading-engine",
      file,
      previewUrl,
      message: "Preparing engine...",
    });
    try {
      await ensureLoaded((msg) => {
        setStatus((s) =>
          s.kind === "loading-engine" ? { ...s, message: msg } : s,
        );
      });

      setStatus({
        kind: "converting",
        file,
        previewUrl,
        progress: 0,
        toolLabel: toolMeta.label,
      });

      const ffmpeg = getFFmpeg();
      const progressHandler = ({ progress }: { progress: number }) => {
        setStatus((s) =>
          s.kind === "converting"
            ? { ...s, progress: Math.max(0, Math.min(1, progress)) }
            : s,
        );
      };
      ffmpeg.on("progress", progressHandler);

      const inputExt = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const inputName = `input.${inputExt}`;
      const outputExt = getOutputExt(tool, convertFormat);
      const outputName = `output.${outputExt}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const trimArg: TrimRange | null = trim.enabled ? trim : null;

      let args: string[];
      switch (tool) {
        case "gif":
          args = buildGifArgs(inputName, outputName, gifPreset, trimArg);
          break;
        case "audio":
          args = buildAudioArgs(inputName, outputName, audioPreset, trimArg);
          break;
        case "compress":
          args = buildCompressArgs(
            inputName,
            outputName,
            compressPreset,
            trimArg,
          );
          break;
        case "convert":
          args = buildConvertArgs(
            inputName,
            outputName,
            convertFormat,
            trimArg,
          );
          break;
      }

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      ffmpeg.off("progress", progressHandler);

      const buffer =
        data instanceof Uint8Array
          ? data
          : new TextEncoder().encode(String(data));
      const mime = getOutputMime(tool, convertFormat);
      const blob = new Blob([buffer.buffer as ArrayBuffer], { type: mime });
      const resultUrl = URL.createObjectURL(blob);
      const downloadName = inferOutputName(file.name, outputExt);

      // Cleanup ffmpeg fs
      try {
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);
      } catch {
        // ignore cleanup errors
      }

      setStatus({
        kind: "done",
        file,
        previewUrl,
        resultUrl,
        resultSize: blob.size,
        tool: toolMeta,
        downloadName,
      });
    } catch (err) {
      console.error(err);
      setStatus({
        kind: "error",
        file,
        previewUrl,
        message:
          err instanceof Error
            ? err.message
            : "Conversion failed for an unknown reason.",
      });
    }
  }, [
    status,
    currentTool,
    tool,
    gifPreset,
    audioPreset,
    compressPreset,
    convertFormat,
    trim,
  ]);

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
              href="/privacy"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Privacy
            </a>
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
            Convert, compress, GIF-ify videos.
            <br />
            <span className="text-zinc-500 dark:text-zinc-400">
              Right in your browser.
            </span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Drop a video and pick a tool. Your file{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">
              never leaves your laptop
            </strong>
            . No upload. No signup. No watermark. Forever free.
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
              {/* Preview pane */}
              <div className="flex flex-col gap-3">
                <div className="bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                  {status.kind === "done" && status.tool.id === "gif" ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={status.resultUrl}
                      alt="Converted GIF preview"
                      className="max-w-full max-h-full"
                    />
                  ) : status.kind === "done" && status.tool.id === "audio" ? (
                    <div className="w-full px-6 flex flex-col items-center gap-3 text-white">
                      <div className="text-5xl" aria-hidden>🎵</div>
                      <audio src={status.resultUrl} controls className="w-full" />
                    </div>
                  ) : status.kind === "done" ? (
                    <video
                      src={status.resultUrl}
                      controls
                      className="max-w-full max-h-full"
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={status.previewUrl}
                      controls
                      onLoadedMetadata={onVideoLoadedMetadata}
                      className="max-w-full max-h-full"
                    />
                  )}
                </div>
                {status.kind !== "done" && status.file && (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {status.file.name}
                    </span>{" "}
                    · {bytesToMB(status.file.size)} MB
                    {trim.durationSec > 0 && (
                      <> · {formatTime(trim.durationSec)}</>
                    )}
                  </div>
                )}
              </div>

              {/* Right pane */}
              <div className="flex flex-col gap-5">
                {status.kind === "loaded" && (
                  <>
                    {/* Tool selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {TOOLS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTool(t.id)}
                          className={[
                            "px-3 py-2 rounded-xl text-sm font-medium transition-colors text-center",
                            tool === t.id
                              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                              : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600",
                          ].join(" ")}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 -mt-3">
                      {currentTool.description}
                    </div>

                    {/* Per-tool options */}
                    {tool === "gif" && (
                      <PresetGroup
                        items={GIF_PRESETS}
                        selectedId={gifPreset.id}
                        onSelect={(p) => setGifPreset(p)}
                      />
                    )}
                    {tool === "audio" && (
                      <PresetGroup
                        items={AUDIO_PRESETS}
                        selectedId={audioPreset.id}
                        onSelect={(p) => setAudioPreset(p)}
                      />
                    )}
                    {tool === "compress" && (
                      <PresetGroup
                        items={COMPRESS_PRESETS}
                        selectedId={compressPreset.id}
                        onSelect={(p) => setCompressPreset(p)}
                      />
                    )}
                    {tool === "convert" && (
                      <PresetGroup
                        items={CONVERT_FORMATS}
                        selectedId={convertFormat.id}
                        onSelect={(p) => setConvertFormat(p)}
                      />
                    )}

                    {/* Trim panel */}
                    {trim.durationSec > 0 && (
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 flex flex-col gap-3">
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={trim.enabled}
                            onChange={(e) =>
                              setTrim((t) => ({ ...t, enabled: e.target.checked }))
                            }
                          />
                          Trim before exporting
                        </label>
                        {trim.enabled && (
                          <div className="flex flex-col gap-2 text-sm">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={setMarkIn}
                                className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                              >
                                Mark IN ({formatTime(trim.startSec)})
                              </button>
                              <button
                                type="button"
                                onClick={setMarkOut}
                                className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                              >
                                Mark OUT ({formatTime(trim.endSec)})
                              </button>
                            </div>
                            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                              <span>
                                Clip: {formatTime(trim.endSec - trim.startSec)}
                              </span>
                              <button
                                type="button"
                                onClick={resetTrim}
                                className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
                              >
                                Reset
                              </button>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Play the video above, pause at your in/out points, and click the buttons.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={convert}
                        className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity"
                      >
                        {currentTool.label}
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
                      {status.toolLabel} · {Math.round(status.progress * 100)}%
                    </div>
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all"
                        style={{
                          width: `${Math.round(status.progress * 100)}%`,
                        }}
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
                        — {bytesToMB(status.resultSize)} MB · {status.tool.label}
                      </span>
                    </div>
                    <a
                      href={status.resultUrl}
                      download={status.downloadName}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity"
                    >
                      Download {status.downloadName}
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
            <div className="font-medium">Four tools, one page</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              GIF, audio extract, compress, and format convert in one go.
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

// =========================================================================
// Helper component: preset radio group (works for any tool's preset list)
// =========================================================================

type PresetItem = {
  id: string;
  label: string;
  description: string;
};

function PresetGroup<T extends PresetItem>({
  items,
  selectedId,
  onSelect,
}: {
  items: readonly T[];
  selectedId: string;
  onSelect: (item: T) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {items.map((p) => (
        <label
          key={p.id}
          className={[
            "flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors",
            selectedId === p.id
              ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
              : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600",
          ].join(" ")}
        >
          <input
            type="radio"
            name="preset"
            value={p.id}
            checked={selectedId === p.id}
            onChange={() => onSelect(p)}
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
  );
}
