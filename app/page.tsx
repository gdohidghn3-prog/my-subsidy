"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Clock, TrendingUp } from "lucide-react";
import { BUSINESS_TYPES, INDUSTRIES, REGIONS, getActiveSubsidies, getDeadlineSubsidies } from "@/lib/subsidies";
import SubsidyCard from "@/components/SubsidyCard";

export default function LandingPage() {
  const router = useRouter();
  const [businessType, setBusinessType] = useState("");
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState("");

  const activeCount = getActiveSubsidies().length;
  const deadlineSubsidies = getDeadlineSubsidies(7);

  const isPersonal = businessType === "개인";
  const canSubmit = businessType && (isPersonal || industry) && region;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const params = new URLSearchParams({ businessType, region });
    if (!isPersonal && industry) params.set("industry", industry);
    router.push(`/search?${params}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      {/* 헤더 */}
      <header className="pt-6 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#2563EB]">내지원금</h1>
        <nav className="flex gap-2">
          <Link href="/deadline" className="text-xs text-[#64748B] hover:text-[#2563EB]">
            마감임박
          </Link>
          <Link href="/search" className="text-xs text-[#64748B] hover:text-[#2563EB]">
            전체검색
          </Link>
        </nav>
      </header>

      {/* 히어로 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8"
      >
        <h2 className="text-2xl font-bold text-[#0F172A] leading-tight mb-2">
          내가 받을 수 있는<br />정부 지원금, 지금 확인하세요
        </h2>
        <p className="text-sm text-[#64748B]">
          개인·사업자 모두 가능! 간단한 선택으로 맞춤 지원금을 찾아드립니다.
        </p>
      </motion.section>

      {/* 간편 자격 체크 폼 */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-[#E2E8F0] rounded-2xl p-5 mb-8 space-y-4"
      >
        <div>
          <label className="text-sm font-medium text-[#0F172A] mb-1.5 block">대상 유형</label>
          <select
            value={businessType}
            onChange={(e) => { setBusinessType(e.target.value); if (e.target.value === "개인") setIndustry(""); }}
            className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
          >
            <option value="">선택하세요</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {!isPersonal && (
          <div>
            <label className="text-sm font-medium text-[#0F172A] mb-1.5 block">업종</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            >
              <option value="">선택하세요</option>
              {INDUSTRIES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-[#0F172A] mb-1.5 block">지역</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
          >
            <option value="">선택하세요</option>
            <option value="전국">전국 (공통)</option>
            {REGIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-3.5 bg-[#2563EB] text-white font-medium rounded-xl disabled:opacity-40 hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2"
        >
          <Search size={18} />
          내 지원금 찾기
        </button>
      </motion.form>

      {/* 통계 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-4"
      >
        <Link
          href="/search"
          className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center hover:border-[#2563EB] transition-colors block"
        >
          <div className="flex items-center justify-center gap-1 text-[#2563EB] mb-1">
            <TrendingUp size={16} />
          </div>
          <p className="text-2xl font-bold text-[#0F172A]">{activeCount}건</p>
          <p className="text-xs text-[#64748B]">신청 가능한 지원금</p>
        </Link>
        <Link
          href="/deadline"
          className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center hover:border-[#EF4444] transition-colors block"
        >
          <div className="flex items-center justify-center gap-1 text-[#EF4444] mb-1">
            <Clock size={16} />
          </div>
          <p className="text-2xl font-bold text-[#0F172A]">{deadlineSubsidies.length}건</p>
          <p className="text-xs text-[#64748B]">이번 주 마감</p>
        </Link>
      </motion.div>
      <p className="text-[11px] text-[#94A3B8] mb-8 text-center">
        현재 접수 기간 내 지원금 기준 · 매일 업데이트
      </p>

      {/* 마감 임박 TOP */}
      {deadlineSubsidies.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#0F172A]">마감 임박</h3>
            <Link href="/deadline" className="text-xs text-[#2563EB]">전체보기</Link>
          </div>
          <div className="space-y-2">
            {deadlineSubsidies.slice(0, 3).map((s, i) => (
              <SubsidyCard key={s.id} subsidy={s} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
