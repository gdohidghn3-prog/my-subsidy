import type { Subsidy } from "@/types/subsidy";
import { crawlBizinfo } from "./bizinfo";

export async function crawlAllSubsidies(): Promise<Subsidy[]> {
  const results = await Promise.allSettled([crawlBizinfo(5)]);
  const subsidies: Subsidy[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      subsidies.push(...result.value);
    }
  }

  console.log(`[Crawl] 기업마당: ${subsidies.length}건`);
  return subsidies;
}
