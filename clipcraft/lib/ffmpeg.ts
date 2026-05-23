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

export type ToolId = "gif" | "audio" | "compress" | "convert" | "snapshot";

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
  {
    id: "snapshot",
    label: "Snapshot frame",
    description: "Grab the current frame as a high-quality PNG",
    outputExt: "png",
    outputMime: "image/png",
  },
];

// ----- GIF presets -----

export type GifAspect = "original" | "vertical" | "square";

export type GifPreset = {
  id: "twitter" | "discord" | "high" | "tiktok" | "instagram";
  label: string;
  description: string;
  fps: number;
  scale: number;
  maxColors: number;
  aspect: GifAspect;
};

export const GIF_PRESETS: GifPreset[] = [
  {
    id: "twitter",
    label: "Twitter / X",
    description: "~5 MB target, 480px wide, smooth",
    fps: 12,
    scale: 480,
    maxColors: 64,
    aspect: "original",
  },
  {
    id: "discord",
    label: "Discord / Slack",
    description: "~8 MB target, 540px wide, balanced",
    fps: 15,
    scale: 540,
    maxColors: 128,
    aspect: "original",
  },
  {
    id: "high",
    label: "High quality",
    description: "720px wide, full palette, largest file",
    fps: 20,
    scale: 720,
    maxColors: 256,
    aspect: "original",
  },
  {
    id: "tiktok",
    label: "TikTok / Reels (9:16)",
    description: "Vertical crop, 480x854, optimized for mobile feeds",
    fps: 15,
    scale: 480,
    maxColors: 96,
    aspect: "vertical",
  },
  {
    id: "instagram",
    label: "Instagram Square (1:1)",
    description: "Square crop, 540x540, ready for the grid",
    fps: 15,
    scale: 540,
    maxColors: 96,
    aspect: "square",
  },
];

function aspectPrefix(aspect: GifAspect, scale: number): string {
  // The aspect prefix runs BEFORE fps + palette filters.
  // It uses scale+crop to force the target aspect ratio.
  switch (aspect) {
    case "vertical": {
      // 9:16, e.g. 480x854. Keep `scale` as the WIDTH.
      const targetH = Math.round((scale * 16) / 9);
      return `scale=${scale}:${targetH}:force_original_aspect_ratio=increase,crop=${scale}:${targetH}`;
    }
    case "square": {
      return `scale=${scale}:${scale}:force_original_aspect_ratio=increase,crop=${scale}:${scale}`;
    }
    case "original":
    default:
      return `scale=${scale}:-1:flags=lanczos`;
  }
}

export function buildGifFilter(preset: GifPreset): string {
  const { fps, scale, maxColors, aspect } = preset;
  return (
    `${aspectPrefix(aspect, scale)},fps=${fps},split[s0][s1];` +
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

// ----- Speed (used by GIF, Compress, Convert) -----

export type SpeedOption = {
  id: "0.5" | "1.5" | "2" | "4";
  factor: number; // multiplier on playback speed (>1 = faster, <1 = slower)
  label: string;
  description: string;
};

export const SPEED_OPTIONS: SpeedOption[] = [
  {
    id: "0.5",
    factor: 0.5,
    label: "Slow 0.5×",
    description: "Half speed — slow-mo dramatic effect",
  },
  {
    id: "1.5",
    factor: 1.5,
    label: "Speed 1.5×",
    description: "Slightly faster, keeps content readable",
  },
  {
    id: "2",
    factor: 2,
    label: "Speed 2×",
    description: "Most popular for Twitter/X virals",
  },
  {
    id: "4",
    factor: 4,
    label: "Speed 4×",
    description: "Compressed time, meme-friendly",
  },
];

/**
 * Returns a video filter fragment that re-times the stream.
 * @param factor speed multiplier (e.g. 2 = play twice as fast)
 */
function videoSpeedFilter(factor: number): string {
  // setpts divides the presentation timestamps by the factor.
  return `setpts=PTS/${factor}`;
}

/**
 * Returns an audio filter fragment that re-times the audio without
 * changing pitch. atempo accepts 0.5-100.0 per filter; for larger ratios
 * we chain multiple atempo filters.
 */
function audioSpeedFilter(factor: number): string {
  if (factor === 1) return "atempo=1.0";
  if (factor >= 0.5 && factor <= 100) {
    // single-stage works
    if (factor >= 0.5 && factor <= 2) return `atempo=${factor}`;
    // chain by halving / doubling until in [0.5, 2]
    const stages: number[] = [];
    let remaining = factor;
    while (remaining > 2) {
      stages.push(2);
      remaining /= 2;
    }
    while (remaining < 0.5) {
      stages.push(0.5);
      remaining /= 0.5;
    }
    stages.push(remaining);
    return stages.map((s) => `atempo=${s}`).join(",");
  }
  return "atempo=1.0";
}

export function buildGifArgs(
  inputName: string,
  outputName: string,
  preset: GifPreset,
  trim: TrimRange | null,
  speed: SpeedOption | null = null,
): string[] {
  const trimPart = trimArgs(trim);
  // Compose the GIF filter, prepending the speed re-time before the palette pipeline.
  let vf = buildGifFilter(preset);
  if (speed && speed.factor !== 1) {
    vf = `${videoSpeedFilter(speed.factor)},${vf}`;
  }
  return [
    ...trimPart,
    "-i",
    inputName,
    "-vf",
    vf,
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
  speed: SpeedOption | null = null,
): string[] {
  const args = [...trimArgs(trim), "-i", inputName, "-vn"];
  if (speed && speed.factor !== 1) {
    // Re-time audio without changing pitch (chained atempo handles 4x / 0.5x)
    args.push("-af", audioSpeedFilter(speed.factor));
  }
  args.push(
    "-c:a",
    "libmp3lame",
    "-b:a",
    preset.bitrate,
    outputName,
  );
  return args;
}

// ----- Video aspect ratio (used by Compress, Convert — GIF handles aspect via its presets) -----

export type VideoAspect = "original" | "vertical" | "square";

export const VIDEO_ASPECTS: { id: VideoAspect; label: string; description: string }[] = [
  {
    id: "original",
    label: "Original",
    description: "Keep the source aspect ratio",
  },
  {
    id: "vertical",
    label: "Vertical 9:16",
    description: "Cropped for TikTok / Reels / Shorts (720×1280)",
  },
  {
    id: "square",
    label: "Square 1:1",
    description: "Cropped for Instagram feed (720×720)",
  },
];

/**
 * Builds a scale+crop filter chain for the requested aspect ratio.
 * For Compress / Convert we target 720px on the constrained axis to keep
 * a reasonable resolution after the crop.
 */
function videoAspectFilter(aspect: VideoAspect): string | null {
  if (aspect === "original") return null;
  if (aspect === "vertical") {
    return "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280";
  }
  // square
  return "scale=720:720:force_original_aspect_ratio=increase,crop=720:720";
}

function composeFilter(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(",");
}

export function buildCompressArgs(
  inputName: string,
  outputName: string,
  preset: CompressPreset,
  trim: TrimRange | null,
  speed: SpeedOption | null = null,
  aspect: VideoAspect = "original",
): string[] {
  const args = [...trimArgs(trim), "-i", inputName];
  const hasSpeed = speed && speed.factor !== 1;
  const hasAspect = aspect !== "original";

  if (hasSpeed || hasAspect) {
    // Compose a single video filter chain and a separate audio chain when speed is requested.
    const vFilter = composeFilter([
      hasSpeed ? videoSpeedFilter(speed!.factor) : null,
      hasAspect ? videoAspectFilter(aspect) : null,
    ]);
    if (hasSpeed) {
      args.push(
        "-filter_complex",
        `[0:v]${vFilter}[v];[0:a]${audioSpeedFilter(speed!.factor)}[a]`,
        "-map",
        "[v]",
        "-map",
        "[a]",
      );
    } else {
      args.push("-vf", vFilter);
    }
  }

  args.push(
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
  );
  return args;
}

/**
 * Extract one frame at `timeSec` as a high-quality PNG.
 * Uses -ss before -i for fast seeking (keyframe-accurate is enough for
 * a thumbnail; for sub-frame precision we'd need -ss after -i which is
 * much slower).
 */
export function buildSnapshotArgs(
  inputName: string,
  outputName: string,
  timeSec: number,
): string[] {
  return [
    "-ss",
    timeSec.toFixed(3),
    "-i",
    inputName,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    "-update",
    "1",
    outputName,
  ];
}

export function buildConvertArgs(
  inputName: string,
  outputName: string,
  format: ConvertFormat,
  trim: TrimRange | null,
  speed: SpeedOption | null = null,
  aspect: VideoAspect = "original",
): string[] {
  const args = [...trimArgs(trim), "-i", inputName];
  const hasSpeed = speed && speed.factor !== 1;
  const hasAspect = aspect !== "original";

  if (hasSpeed || hasAspect) {
    const vFilter = composeFilter([
      hasSpeed ? videoSpeedFilter(speed!.factor) : null,
      hasAspect ? videoAspectFilter(aspect) : null,
    ]);
    if (hasSpeed) {
      args.push(
        "-filter_complex",
        `[0:v]${vFilter}[v];[0:a]${audioSpeedFilter(speed!.factor)}[a]`,
        "-map",
        "[v]",
        "-map",
        "[a]",
      );
    } else {
      args.push("-vf", vFilter);
    }
  }

  if (format.id === "webm") {
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
