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
        "Running in single-thread mode (slower). For best perf, deploy with COOP/COEP headers.",
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
