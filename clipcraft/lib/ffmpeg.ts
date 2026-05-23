import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const CORE_VERSION = "0.12.10";
const CDN_BASE = `https://unpkg.com/@ffmpeg/core-mt@${CORE_VERSION}/dist/esm`;
const CDN_BASE_ST = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`;

let _instance: FFmpeg | null = null;
let _loadPromise: Promise<FFmpeg> | null = null;

export type LoadProgress = (msg: string) => void;

function detectCrossOriginIsolated(): boolean {
  if (typeof window === "undefined") return false;
  return window.crossOriginIsolated === true;
}

async function loadCoreFromCDN(
  baseURL: string,
  useWorker: boolean,
  onProgress: LoadProgress,
): Promise<{ coreURL: string; wasmURL: string; workerURL?: string }> {
  onProgress("Downloading conversion engine (~25 MB, one-time)...");
  const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript");
  const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm");
  if (!useWorker) return { coreURL, wasmURL };
  const workerURL = await toBlobURL(
    `${baseURL}/ffmpeg-core.worker.js`,
    "text/javascript",
  );
  return { coreURL, wasmURL, workerURL };
}

export function getFFmpeg(): FFmpeg {
  if (_instance) return _instance;
  _instance = new FFmpeg();
  return _instance;
}

export async function ensureLoaded(onProgress: LoadProgress = () => {}): Promise<FFmpeg> {
  const ffmpeg = getFFmpeg();
  if (ffmpeg.loaded) return ffmpeg;
  if (_loadPromise) return _loadPromise;

  _loadPromise = (async () => {
    const isolated = detectCrossOriginIsolated();
    const baseURL = isolated ? CDN_BASE : CDN_BASE_ST;
    const useWorker = isolated;

    if (!isolated) {
      onProgress(
        "Running in single-thread mode (slower). Production deploy will be multi-thread.",
      );
    }

    const urls = await loadCoreFromCDN(baseURL, useWorker, onProgress);
    onProgress("Initializing engine...");
    await ffmpeg.load(urls);
    onProgress("Ready.");
    return ffmpeg;
  })();

  try {
    return await _loadPromise;
  } catch (err) {
    _loadPromise = null;
    throw err;
  }
}

export function isFFmpegLoaded(): boolean {
  return _instance?.loaded === true;
}

// =========================================================================
// Tools
// =========================================================================

export type ToolId = "gif" | "audio" | "compress" | "convert";

export type ToolMeta = {
  id: ToolId;
  label: string;
  description: string;
  outputExt: string;
  outputMime: string;
};

export const TOOLS: ToolMeta[] = [
  {
    id: "gif",
    label: "Video → GIF",
    description: "Make a viral-ready animated GIF",
    outputExt: "gif",
    outputMime: "image/gif",
  },
  {
    id: "audio",
    label: "Extract audio",
    description: "Pull the soundtrack as MP3",
    outputExt: "mp3",
    outputMime: "audio/mpeg",
  },
  {
    id: "compress",
    label: "Compress",
    description: "Shrink the file, keep MP4",
    outputExt: "mp4",
    outputMime: "video/mp4",
  },
  {
    id: "convert",
    label: "Convert format",
    description: "MP4 ↔ WebM ↔ MOV",
    outputExt: "mp4",
    outputMime: "video/mp4",
  },
];

// ----- GIF presets -----

export type GifPreset = {
  id: "twitter" | "discord" | "high";
  label: string;
  description: string;
  fps: number;
  scale: number;
  maxColors: number;
};

export const GIF_PRESETS: GifPreset[] = [
  {
    id: "twitter",
    label: "Twitter / X",
    description: "~5 MB target, 480px wide, smooth",
    fps: 12,
    scale: 480,
    maxColors: 64,
  },
  {
    id: "discord",
    label: "Discord / Slack",
    description: "~8 MB target, 540px wide, balanced",
    fps: 15,
    scale: 540,
    maxColors: 128,
  },
  {
    id: "high",
    label: "High quality",
    description: "720px wide, full palette, largest file",
    fps: 20,
    scale: 720,
    maxColors: 256,
  },
];

export function buildGifFilter(preset: GifPreset): string {
  const { fps, scale, maxColors } = preset;
  return (
    `fps=${fps},scale=${scale}:-1:flags=lanczos,split[s0][s1];` +
    `[s0]palettegen=max_colors=${maxColors}[p];` +
    `[s1][p]paletteuse=dither=bayer:bayer_scale=5`
  );
}

// ----- Audio presets -----

export type AudioPreset = {
  id: "high" | "standard" | "small";
  label: string;
  description: string;
  bitrate: string;
};

export const AUDIO_PRESETS: AudioPreset[] = [
  {
    id: "high",
    label: "High quality",
    description: "192 kbps — best fidelity",
    bitrate: "192k",
  },
  {
    id: "standard",
    label: "Standard",
    description: "128 kbps — balanced",
    bitrate: "128k",
  },
  {
    id: "small",
    label: "Small file",
    description: "96 kbps — voice memos, podcasts",
    bitrate: "96k",
  },
];

// ----- Compress presets -----

export type CompressPreset = {
  id: "heavy" | "medium" | "light";
  label: string;
  description: string;
  crf: number;
  preset: string;
};

export const COMPRESS_PRESETS: CompressPreset[] = [
  {
    id: "heavy",
    label: "Heavy compression",
    description: "Smallest file, lower quality (CRF 32)",
    crf: 32,
    preset: "fast",
  },
  {
    id: "medium",
    label: "Balanced",
    description: "Recommended for most uses (CRF 26)",
    crf: 26,
    preset: "fast",
  },
  {
    id: "light",
    label: "Light compression",
    description: "Keep most quality (CRF 22)",
    crf: 22,
    preset: "fast",
  },
];

// ----- Convert formats -----

export type ConvertFormat = {
  id: "mp4" | "webm" | "mov";
  label: string;
  description: string;
  ext: string;
  mime: string;
  videoCodec: string;
  audioCodec: string;
};

export const CONVERT_FORMATS: ConvertFormat[] = [
  {
    id: "mp4",
    label: "MP4 (H.264)",
    description: "Universal — Twitter, iPhone, every app",
    ext: "mp4",
    mime: "video/mp4",
    videoCodec: "libx264",
    audioCodec: "aac",
  },
  {
    id: "webm",
    label: "WebM (VP9)",
    description: "Lighter, perfect for web embeds",
    ext: "webm",
    mime: "video/webm",
    videoCodec: "libvpx-vp9",
    audioCodec: "libopus",
  },
  {
    id: "mov",
    label: "MOV (H.264)",
    description: "QuickTime, Final Cut, ProRes",
    ext: "mov",
    mime: "video/quicktime",
    videoCodec: "libx264",
    audioCodec: "aac",
  },
];

// =========================================================================
// FFmpeg argument builders
// =========================================================================

export type TrimRange = {
  enabled: boolean;
  startSec: number;
  endSec: number;
  durationSec: number;
};

function trimArgs(trim: TrimRange | null): string[] {
  if (!trim || !trim.enabled) return [];
  // Use -ss before -i for fast (keyframe-accurate is good enough for MVP)
  return ["-ss", trim.startSec.toFixed(3), "-to", trim.endSec.toFixed(3)];
}

export function buildGifArgs(
  inputName: string,
  outputName: string,
  preset: GifPreset,
  trim: TrimRange | null,
): string[] {
  const trimPart = trimArgs(trim);
  // For GIF with filters, -ss/-to must be applied to the input. Use -ss before -i for performance.
  return [
    ...trimPart,
    "-i",
    inputName,
    "-vf",
    buildGifFilter(preset),
    "-loop",
    "0",
    outputName,
  ];
}

export function buildAudioArgs(
  inputName: string,
  outputName: string,
  preset: AudioPreset,
  trim: TrimRange | null,
): string[] {
  return [
    ...trimArgs(trim),
    "-i",
    inputName,
    "-vn",
    "-c:a",
    "libmp3lame",
    "-b:a",
    preset.bitrate,
    outputName,
  ];
}

export function buildCompressArgs(
  inputName: string,
  outputName: string,
  preset: CompressPreset,
  trim: TrimRange | null,
): string[] {
  return [
    ...trimArgs(trim),
    "-i",
    inputName,
    "-c:v",
    "libx264",
    "-crf",
    String(preset.crf),
    "-preset",
    preset.preset,
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    outputName,
  ];
}

export function buildConvertArgs(
  inputName: string,
  outputName: string,
  format: ConvertFormat,
  trim: TrimRange | null,
): string[] {
  const args = [...trimArgs(trim), "-i", inputName];
  if (format.id === "webm") {
    // WebM needs explicit codecs; use VP9 with reasonable defaults
    args.push(
      "-c:v",
      format.videoCodec,
      "-b:v",
      "0",
      "-crf",
      "32",
      "-c:a",
      format.audioCodec,
    );
  } else {
    args.push("-c:v", format.videoCodec, "-crf", "23", "-preset", "fast", "-c:a", format.audioCodec, "-b:a", "128k");
  }
  args.push(outputName);
  return args;
}
