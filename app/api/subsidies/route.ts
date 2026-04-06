import { NextResponse } from "next/server";
import {
  getAllSubsidiesAsync,
  getActiveSubsidiesAsync,
  getDeadlineSubsidiesAsync,
  searchSubsidiesAsync,
} from "@/lib/subsidies";

export const revalidate = 21600; // 6시간 캐시

export async function GET(request: Request) {
  const start = Date.now();
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter");
  const query = searchParams.get("q");
  const days = parseInt(searchParams.get("days") || "30", 10);

  let subsidies;

  if (query) {
    subsidies = await searchSubsidiesAsync(query);
  } else {
    switch (filter) {
      case "active":
        subsidies = await getActiveSubsidiesAsync();
        break;
      case "deadline":
        subsidies = await getDeadlineSubsidiesAsync(days);
        break;
      default:
        subsidies = await getAllSubsidiesAsync();
    }
  }

  const elapsed = Date.now() - start;
  console.log(`[API] GET /api/subsidies?filter=${filter || "all"}${query ? "&q=" + query : ""} → ${subsidies.length}건 (${elapsed}ms)`);

  return NextResponse.json({
    subsidies,
    count: subsidies.length,
    updatedAt: new Date().toISOString(),
  });
}
