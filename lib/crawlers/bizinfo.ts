import * as cheerio from "cheerio";
import type { Subsidy } from "@/types/subsidy";

const CATEGORY_TO_TYPE: Record<string, Subsidy["supportType"]> = {
  금융: "융자",
  수출: "보조금",
  창업: "보조금",
  기술: "보조금",
  인력: "교육",
  경영: "멘토링",
  내수: "보조금",
  기타: "복합",
};

function parseDateRange(text: string): { start: string; end: string } {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const match = cleaned.match(
    /(\d{4})[.\-/](\d{2})[.\-/](\d{2})\s*~\s*(\d{4})[.\-/](\d{2})[.\-/](\d{2})/
  );
  if (match) {
    return {
      start: `${match[1]}-${match[2]}-${match[3]}`,
      end: `${match[4]}-${match[5]}-${match[6]}`,
    };
  }
  return { start: "", end: "" };
}

export async function crawlBizinfo(pages = 5): Promise<Subsidy[]> {
  const crawlStart = Date.now();
  const subsidies: Subsidy[] = [];
  const seenIds = new Set<string>();

  for (let page = 1; page <= pages; page++) {
    try {
      const res = await fetch(
        `https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do?rows=15&cpage=${page}&schEndAt=Y`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "text/html",
          },
        }
      );

      const html = await res.text();
      const $ = cheerio.load(html);

      $("table tbody tr").each((_, tr) => {
        const tds = $(tr).find("td");
        if (tds.length < 7) return;

        const category = $(tds[1]).text().trim();
        const titleEl = $(tr).find("a[href*=pblancId]");
        const title = titleEl.text().trim();
        const href = titleEl.attr("href") || "";
        const pblancId =
          href.match(/pblancId=([^&]+)/)?.[1] || `biz-${Date.now()}-${Math.random()}`;
        const dateText = $(tds[3]).text().trim();
        const region = $(tds[4]).text().trim();
        const org = $(tds[5]).text().trim();
        const regDate = $(tds[6]).text().trim();

        if (!title || seenIds.has(pblancId)) return;
        seenIds.add(pblancId);

        const { start, end } = parseDateRange(dateText);
        const regionName = region.replace(/특별자치도|광역시|특별시|특별자치시/g, "").trim();

        subsidies.push({
          id: pblancId,
          title,
          organization: org,
          source: "bizinfo.go.kr",
          sourceUrl: `https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=${pblancId}`,
          eligibility: {
            businessTypes: ["소상공인", "중소기업"],
            industries: [],
            regions: regionName ? [regionName] : ["전국"],
            businessAge: { min: 0, max: 100 },
            specialConditions: category ? [category] : [],
          },
          supportAmount: "공고 참조",
          supportType: CATEGORY_TO_TYPE[category] || "복합",
          supportDetails: `[${category}] ${title} - 상세 내용은 공고를 확인하세요.`,
          startDate: start,
          endDate: end,
          announcementDate: regDate.replace(/\./g, "-"),
        });
      });
    } catch (e) {
      console.error(`Bizinfo page ${page} crawl failed:`, e);
    }
  }

  console.log(`[기업마당] ${subsidies.length}건 크롤링 완료, ${pages}페이지 (${Date.now() - crawlStart}ms)`);
  return subsidies;
}
