"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { getMatchedSubsidies, getActiveSubsidies, searchSubsidies, calculateMatch } from "@/lib/subsidies";
import type { Subsidy, UserProfile, MatchResult } from "@/types/subsidy";
import SubsidyCard from "@/components/SubsidyCard";

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-[#94A3B8]">불러오는 중...</div>}>
      <SearchPage />
    </Suspense>
  );
}

// 지원 유형별 라벨
const TYPE_INFO: Record<string, { label: string; emoji: string }> = {
  "보조금": { label: "보조금 (무상지원)", emoji: "💰" },
  "융자": { label: "융자 (저금리 대출)", emoji: "🏦" },
  "교육": { label: "교육/훈련", emoji: "📚" },
  "멘토링": { label: "멘토링/컨설팅", emoji: "🤝" },
  "복합": { label: "복합 지원", emoji: "📦" },
};

function SearchPage() {
  const params = useSearchParams();
  const businessType = params.get("businessType") || "";
  const industry = params.get("industry") || "";
  const region = params.get("region") || "";

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"match" | "deadline">("match");
  const [typeFilter, setTypeFilter] = useState<Set<string>>(new Set());
  const [allSubsidies, setAllSubsidies] = useState<Subsidy[]>([]);

  useEffect(() => {
    fetch("/api/subsidies?filter=active")
      .then((r) => r.json())
      .then((data) => { if (data.subsidies?.length) setAllSubsidies(data.subsidies); })
      .catch(() => {});
  }, []);

  const isPersonal = businessType === "개인";
  const hasProfile = businessType && (isPersonal || industry) && region;

  // 크롤링 데이터가 있으면 사용, 없으면 정적 데이터 폴백
  const dataReady = allSubsidies.length > 0;

  const results = useMemo(() => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const source = dataReady ? allSubsidies : getActiveSubsidies();
      return source
        .filter((s) => s.title.toLowerCase().includes(q) || s.organization.toLowerCase().includes(q) || s.supportDetails.toLowerCase().includes(q))
        .map((s) => ({ subsidy: s, score: 0, reasons: [] as string[] }));
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
      if (dataReady) {
        const today = new Date().toISOString().slice(0, 10);
        return allSubsidies
          .filter((s) => s.startDate <= today && s.endDate >= today)
          .map((s) => calculateMatch(profile, s))
          .filter((r) => r.score > 0)
          .sort((a, b) => b.score - a.score);
      }
      return getMatchedSubsidies(profile);
    }

    const source = dataReady ? allSubsidies : getActiveSubsidies();
    return source.map((s) => ({ subsidy: s, score: 0, reasons: [] as string[] }));
  }, [businessType, industry, region, hasProfile, isPersonal, query, allSubsidies, dataReady]);

  const sorted = useMemo(() => {
    const items = [...results];
    if (sortBy === "deadline") {
      items.sort((a, b) => {
        const dateA = new Date(a.subsidy.endDate).getTime();
        const dateB = new Date(b.subsidy.endDate).getTime();
        return dateA - dateB;
      });
    } else {
      items.sort((a, b) => b.score - a.score);
    }
    return items;
  }, [results, sortBy]);

  // 유형별 개수 (필터 칩 표시용)
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of sorted) {
      const type = r.subsidy.supportType;
      counts[type] = (counts[type] || 0) + 1;
    }
    return counts;
  }, [sorted]);

  const allTypes = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a]);

  // 필터 적용
  const filtered = useMemo(() => {
    if (typeFilter.size === 0) return sorted;
    return sorted.filter((r) => typeFilter.has(r.subsidy.supportType));
  }, [sorted, typeFilter]);

  // 카테고리별 그룹화
  const grouped = useMemo(() => {
    const groups: Record<string, MatchResult[]> = {};
    for (const r of filtered) {
      const type = r.subsidy.supportType;
      if (!groups[type]) groups[type] = [];
      groups[type].push(r);
    }
    return groups;
  }, [filtered]);

  const groupKeys = Object.keys(grouped).sort((a, b) => grouped[b].length - grouped[a].length);

  const toggleTypeFilter = (type: string) => {
    setTypeFilter((prev) => {
      if (type === "__all__") return new Set();
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

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
          <span className="ml-2 font-medium text-[#2563EB]">{filtered.length}건</span>
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

      {/* 유형 필터 칩 */}
      {allTypes.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-1">
          <button
            onClick={() => toggleTypeFilter("__all__")}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              typeFilter.size === 0 ? "bg-[#2563EB] text-white" : "bg-white border border-[#E2E8F0] text-[#64748B]"
            }`}
          >
            전체 ({sorted.length})
          </button>
          {allTypes.map((type) => {
            const info = TYPE_INFO[type] || { label: type, emoji: "📋" };
            const isActive = typeFilter.size === 0 || typeFilter.has(type);
            return (
              <button
                key={type}
                onClick={() => toggleTypeFilter(type)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  isActive ? "bg-[#2563EB] text-white" : "bg-white border border-[#E2E8F0] text-[#64748B]"
                }`}
              >
                {info.emoji} {info.label.split(" ")[0]} ({typeCounts[type]})
              </button>
            );
          })}
        </div>
      )}

      {/* 카테고리별 결과 */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[#94A3B8]">
          매칭되는 지원금이 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {groupKeys.map((type) => {
            const info = TYPE_INFO[type] || { label: type, emoji: "📋" };
            return (
              <section key={type}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{info.emoji}</span>
                  <h3 className="text-sm font-bold text-[#0F172A]">{info.label}</h3>
                  <span className="text-[11px] text-[#94A3B8]">{grouped[type].length}건</span>
                </div>
                <div className="space-y-2">
                  {grouped[type].map((r, i) => (
                    <SubsidyCard
                      key={r.subsidy.id}
                      subsidy={r.subsidy}
                      matchScore={hasProfile ? r.score : undefined}
                      index={i}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
