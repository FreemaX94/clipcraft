import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://clipcraftapp.vercel.app";
  const lastModified = new Date("2026-05-23");
  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
