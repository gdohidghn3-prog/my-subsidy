import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import Disclaimer from "@/components/Disclaimer";

const noto = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: {
    default: "내지원금 — 나에게 맞는 정부 지원금 자동 매칭",
    template: "%s | 내지원금",
  },
  description: "사업자 유형, 업종, 지역만 입력하면 받을 수 있는 정부 지원금을 자동으로 찾아드립니다.",
  keywords: ["정부 지원금", "소상공인 지원금", "창업 지원금", "보조금", "지원사업"],
  openGraph: {
    title: "내지원금 — 나에게 맞는 정부 지원금 자동 매칭",
    description: "사업자 유형, 업종, 지역만 입력하면 받을 수 있는 정부 지원금을 자동으로 찾아드립니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${noto.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC]">
        {children}
        <Disclaimer />
        <Analytics />
      </body>
    </html>
  );
}
