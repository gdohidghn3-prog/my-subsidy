import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSubsidiesAsync, getSubsidyByIdAsync, getDday, toJsonLd } from "@/lib/subsidies";
import { formatKoreanDate } from "@/lib/format";
import { ArrowLeft, Building2, Calendar, Banknote, Phone, ExternalLink, Search } from "lucide-react";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const all = await getAllSubsidiesAsync();
    const seen = new Set<string>();
    const params: { id: string }[] = [];
    for (const s of all) {
      if (typeof s.id !== "string") continue;
      const id = s.id.trim();
      if (!id) continue;
      if (seen.has(id)) continue;
      seen.add(id);
      params.push({ id });
    }
    return params;
  } catch (e) {
    console.error("[generateStaticParams] getAllSubsidiesAsync failed:", e);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const s = await getSubsidyByIdAsync(id);
  if (!s) return { title: "지원금을 찾을 수 없습니다" };

  return {
    title: `${s.title} — ${s.supportAmount}`,
    description: `${s.organization} | ${s.supportDetails}`,
  };
}

export default async function SubsidyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = await getSubsidyByIdAsync(id);
  if (!s) notFound();

  const dday = getDday(s.endDate);
  const hasDday = Number.isFinite(dday);
  const isUrgent = hasDday && dday <= 7 && dday >= 0;
  const isExpired = hasDday && dday < 0;
  const startLabel = formatKoreanDate(s.startDate, "미정");
  const endLabel = formatKoreanDate(s.endDate, "미정");
  const announcementLabel = formatKoreanDate(s.announcementDate, "미정");

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(toJsonLd(s))
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e")
            .replace(/&/g, "\\u0026"),
        }}
      />
      <header className="pt-6 pb-4 flex items-center gap-3">
        <Link href="/search" className="text-[#64748B] hover:text-[#2563EB]">
          <ArrowLeft size={20} />
        </Link>
        <span className="text-sm text-[#64748B]">지원금 상세</span>
      </header>

      {/* D-day */}
      <div className="flex items-center gap-2 mb-4">
        {isExpired ? (
          <span className="text-sm font-bold text-[#94A3B8]">마감됨</span>
        ) : hasDday ? (
          <span className={`text-sm font-bold ${isUrgent ? "text-[#EF4444]" : "text-[#2563EB]"}`}>
            D-{dday}
          </span>
        ) : (
          <span className="text-sm font-bold text-[#94A3B8]">마감일 미정</span>
        )}
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#059669] text-white font-medium">
          {s.supportType}
        </span>
      </div>

      {/* 제목 */}
      <h1 className="text-xl font-bold text-[#0F172A] mb-2 leading-snug">
        {s.title}
      </h1>

      {/* 기관 */}
      <div className="flex items-center gap-1.5 text-sm text-[#64748B] mb-6">
        <Building2 size={14} />
        {s.organization}
      </div>

      {/* 지원 금액 */}
      <section className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Banknote size={16} className="text-[#059669]" />
          <span className="text-sm font-medium text-[#059669]">지원 금액</span>
        </div>
        <p className="text-xl font-bold text-[#0F172A]">{s.supportAmount}</p>
      </section>

      {/* 지원 내용 */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-[#0F172A] mb-2">지원 내용</h2>
        <p className="text-sm text-[#374151] leading-relaxed">{s.supportDetails}</p>
      </section>

      {/* 자격 요건 */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-[#0F172A] mb-3">자격 요건</h2>
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="text-[#94A3B8] w-16 shrink-0">대상</span>
            <span className="text-[#0F172A]">{s.eligibility.businessTypes.join(", ")}</span>
          </div>
          {s.eligibility.industries.length > 0 && (
            <div className="flex gap-2">
              <span className="text-[#94A3B8] w-16 shrink-0">업종</span>
              <span className="text-[#0F172A]">{s.eligibility.industries.join(", ")}</span>
            </div>
          )}
          <div className="flex gap-2">
            <span className="text-[#94A3B8] w-16 shrink-0">지역</span>
            <span className="text-[#0F172A]">{s.eligibility.regions.join(", ")}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#94A3B8] w-16 shrink-0">업력</span>
            <span className="text-[#0F172A]">
              {s.eligibility.businessAge.min ?? 0}년 ~ {s.eligibility.businessAge.max ?? "제한없음"}년
            </span>
          </div>
          {s.eligibility.specialConditions.length > 0 && (
            <div className="flex gap-2">
              <span className="text-[#94A3B8] w-16 shrink-0">특수조건</span>
              <span className="text-[#0F172A]">{s.eligibility.specialConditions.join(", ")}</span>
            </div>
          )}
        </div>
      </section>

      {/* 일정 */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-[#0F172A] mb-3">일정</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#94A3B8]" />
            <span className="text-[#64748B]">접수 기간</span>
            <span className="text-[#0F172A] font-medium">{startLabel} ~ {endLabel}</span>
          </div>
          {s.announcementDate && (
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#94A3B8]" />
              <span className="text-[#64748B]">결과 발표</span>
              <span className="text-[#0F172A] font-medium">{announcementLabel}</span>
            </div>
          )}
        </div>
      </section>

      {/* 문의 + 원본 링크 */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {s.contactPhone && (
            <a
              href={`tel:${s.contactPhone}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#0F172A] hover:border-[#2563EB] transition-colors"
            >
              <Phone size={16} />
              {s.contactPhone}
            </a>
          )}
          <a
            href={`https://search.naver.com/search.naver?query=${encodeURIComponent(s.title)}`}
            target="_blank"
            rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors"
        >
          <Search size={16} />
          공고 검색 (네이버)
        </a>
        </div>
        <a
          href={s.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
        >
          <ExternalLink size={16} />
          {s.organization} 홈페이지
        </a>
      </div>
    </div>
  );
}
