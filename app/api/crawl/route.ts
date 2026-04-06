import { NextResponse } from "next/server";
import { crawlAllSubsidies } from "@/lib/crawlers";

export async function POST() {
  const startTime = Date.now();
  console.log("[API] POST /api/crawl 시작");

  const subsidies = await crawlAllSubsidies();
  const elapsed = Date.now() - startTime;

  console.log(`[API] POST /api/crawl 완료 → ${subsidies.length}건 (${elapsed}ms)`);

  return NextResponse.json({
    success: true,
    total: subsidies.length,
    elapsed: `${elapsed}ms`,
    subsidies,
  });
}
