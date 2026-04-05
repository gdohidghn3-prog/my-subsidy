import type { MetadataRoute } from "next";
import { getAllSubsidies } from "@/lib/subsidies";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://my-subsidy-beta.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const subsidies = getAllSubsidies();

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/deadline`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    ...subsidies.map((s) => ({
      url: `${BASE_URL}/subsidy/${s.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
