"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Building2, Banknote } from "lucide-react";
import type { Subsidy } from "@/types/subsidy";
import { getDday } from "@/lib/subsidies";
import { formatKoreanDateShort } from "@/lib/format";

const TYPE_COLORS: Record<string, string> = {
  "보조금": "#059669",
  "융자": "#2563EB",
  "멘토링": "#8B5CF6",
  "교육": "#F59E0B",
  "복합": "#64748B",
};

export default function SubsidyCard({
  subsidy,
  matchScore,
  index = 0,
}: {
  subsidy: Subsidy;
  matchScore?: number;
  index?: number;
}) {
  const dday = getDday(subsidy.endDate);
  const hasDday = Number.isFinite(dday);
  const isUrgent = hasDday && dday <= 7 && dday >= 0;
  const typeColor = TYPE_COLORS[subsidy.supportType] || "#64748B";
  const endDateLabel = formatKoreanDateShort(subsidy.endDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
    >
      <Link
        href={`/subsidy/${subsidy.id}`}
        className={`block bg-white border rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
          isUrgent ? "border-[#EF4444] ring-1 ring-[#EF4444]/20" : "border-[#E2E8F0]"
        }`}
      >
        {/* 상단: 매칭 점수 + D-day */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {matchScore !== undefined && matchScore > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-[#DBEAFE] text-[#2563EB]">
                매칭 {matchScore}%
              </span>
            )}
            <span
              className="text-[11px] px-2 py-0.5 rounded-full font-medium text-white"
              style={{ backgroundColor: typeColor }}
            >
              {subsidy.supportType}
            </span>
          </div>
          {hasDday && dday >= 0 && (
            <span
              className={`text-xs font-bold ${
                isUrgent ? "text-[#EF4444] animate-pulse" : "text-[#64748B]"
              }`}
            >
              D-{dday}
            </span>
          )}
        </div>

        {/* 제목 */}
        <h3 className="font-semibold text-[#0F172A] text-sm mb-1 leading-snug">
          {subsidy.title}
        </h3>

        {/* 기관 */}
        <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-2">
          <Building2 size={12} />
          {subsidy.organization}
        </div>

        {/* 하단: 금액 + 마감일 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-bold text-[#059669]">
            <Banknote size={14} />
            {subsidy.supportAmount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
            <Calendar size={11} />
            ~{endDateLabel}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
