"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Subsidy } from "@/types/subsidy";
import SubsidyCard from "@/components/SubsidyCard";

export default function DeadlineClient({ deadlines }: { deadlines: Subsidy[] }) {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      <header className="pt-6 pb-4 flex items-center gap-3">
        <Link href="/" className="text-[#64748B] hover:text-[#2563EB]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-[#0F172A]">마감 임박 지원금</h1>
      </header>

      <p className="text-sm text-[#64748B] mb-4">
        30일 이내 마감되는 지원금 {deadlines.length}건
      </p>

      <div className="space-y-2">
        {deadlines.map((s, i) => (
          <SubsidyCard key={s.id} subsidy={s} index={i} />
        ))}
      </div>

      {deadlines.length === 0 && (
        <div className="text-center py-12 text-[#94A3B8]">
          30일 이내 마감되는 지원금이 없습니다.
        </div>
      )}
    </div>
  );
}
