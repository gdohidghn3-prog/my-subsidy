import type { MetadataRoute } from "next";
import { getAllSubsidiesAsync } from "@/lib/subsidies";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://my-subsidy-beta.vercel.app";

// 크롤링 데이터(기업마당 등) 포함을 위해 async 사용.
// Next.js sitemap.(js|ts) 는 default export 가 async 일 수 있다.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/deadline`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  // 빌드 타임/런타임 어떤 단계에서 호출되어도 sitemap 자체는 깨지지 않도록 폴백.
  let subsidies: Awaited<ReturnType<typeof getAllSubsidiesAsync>> = [];
  try {
    subsidies = await getAllSubsidiesAsync();
  } catch (e) {
    console.error("[sitemap] getAllSubsidiesAsync failed, falling back to static-only:", e);
  }

  const subsidyEntries = subsidies
    // id 가 비거나 공백/특수문자만 들어간 케이스 방어 (크롤링 fallback id 도 허용)
    .filter((s) => typeof s.id === "string" && s.id.trim().length > 0)
    .map((s) => ({
      url: `${BASE_URL}/subsidy/${encodeURIComponent(s.id)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticEntries, ...subsidyEntries];
}
