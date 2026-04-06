"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { getMatchedSubsidies, getActiveSubsidies, searchSubsidies, BUSINESS_TYPES, INDUSTRIES, REGIONS } from "@/lib/subsidies";
import type { UserProfile } from "@/types/subsidy";
import SubsidyCard from "@/components/SubsidyCard";

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-[#94A3B8]">불러오는 중...</div>}>
      <SearchPage />
    </Suspense>
  );
}

function SearchPage() {
  const params = useSearchParams();
  const businessType = params.get("businessType") || "";
  const industry = params.get("industry") || "";
  const region = params.get("region") || "";

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"match" | "deadline" | "amount">("match");

  const isPersonal = businessType === "개인";
  const hasProfile = businessType && (isPersonal || industry) && region;

  const results = useMemo(() => {
    if (query.trim()) {
      return searchSubsidies(query).map((s) => ({ subsidy: s, score: 0, reasons: [] }));
    }

    if (hasProfile) {
      const profile: UserProfile = {
        businessType,
        industry: isPersonal ? "" : industry,
        region,
        businessAge: 2,
        employeeCount: 3,
        specialTags: isPersonal ? ["청년"] : [],
      };
      return getMatchedSubsidies(profile);
    }

    return getActiveSubsidies().map((s) => ({ subsidy: s, score: 0, reasons: [] }));
  }, [businessType, industry, region, hasProfile, query]);

  const sorted = useMemo(() => {
    const items = [...results];
    if (sortBy === "deadline") {
      items.sort((a, b) => a.subsidy.endDate.localeCompare(b.subsidy.endDate));
    } else if (sortBy === "match") {
      items.sort((a, b) => b.score - a.score);
    }
    return items;
  }, [results, sortBy]);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      <header className="pt-6 pb-4 flex items-center gap-3">
        <Link href="/" className="text-[#64748B] hover:text-[#2563EB]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-[#0F172A]">지원금 검색</h1>
      </header>

      {/* 검색바 */}
      <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl px-4 h-12 mb-4 focus-within:border-[#2563EB]">
        <Search size={18} className="text-[#94A3B8]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="지원금 이름, 기관 검색"
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      {/* 프로필 요약 + 정렬 */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-[#64748B]">
          {hasProfile ? (
            <span>{businessType}{industry ? ` · ${industry}` : ""} · {region} 기준</span>
          ) : query ? (
            <span>&quot;{query}&quot; 검색 결과</span>
          ) : (
            <span>전체 지원금</span>
          )}
          <span className="ml-2 font-medium text-[#2563EB]">{sorted.length}건</span>
        </div>
        <div className="flex gap-1">
          {(["match", "deadline"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`text-[11px] px-2.5 py-1 rounded-full ${
                sortBy === s ? "bg-[#2563EB] text-white" : "bg-[#F1F5F9] text-[#64748B]"
              }`}
            >
              {s === "match" ? "매칭순" : "마감순"}
            </button>
          ))}
        </div>
      </div>

      {/* 결과 */}
      <div className="space-y-2">
        {sorted.map((r, i) => (
          <SubsidyCard
            key={r.subsidy.id}
            subsidy={r.subsidy}
            matchScore={hasProfile ? r.score : undefined}
            index={i}
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-12 text-[#94A3B8]">
          매칭되는 지원금이 없습니다.
        </div>
      )}
    </div>
  );
}
