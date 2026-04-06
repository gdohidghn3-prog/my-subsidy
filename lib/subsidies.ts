import type { Subsidy, UserProfile, MatchResult } from "@/types/subsidy";

// ─── 샘플 데이터 (실제 존재하는 지원사업 기반) ────────────────

const subsidies: Subsidy[] = [
  {
    id: "semas-digital-2026",
    title: "2026년 소상공인 디지털전환 지원사업",
    organization: "소상공인시장진흥공단",
    source: "semas.or.kr",
    sourceUrl: "https://www.semas.or.kr/web/board/webBoardList.kmdc?bCd=1030",
    eligibility: {
      businessTypes: ["소상공인"],
      industries: ["음식점", "소매업", "서비스업", "제조업"],
      regions: ["전국"],
      businessAge: { min: 0, max: 100 },
      specialConditions: [],
    },
    supportAmount: "최대 400만원",
    supportType: "보조금",
    supportDetails: "스마트 기기, 키오스크, POS, 온라인 쇼핑몰 구축 등 디지털 전환 비용 지원 (자부담 30%)",
    startDate: "2026-03-15",
    endDate: "2026-05-15",
    contactPhone: "1357",
  },
  {
    id: "kstartup-doyak-2026",
    title: "2026년 창업도약패키지",
    organization: "창업진흥원",
    source: "k-startup.go.kr",
    sourceUrl: "https://www.k-startup.go.kr/homepage/businessManage/businessList.do",
    eligibility: {
      businessTypes: ["스타트업", "중소기업"],
      industries: ["IT", "제조업", "서비스업", "바이오"],
      regions: ["전국"],
      businessAge: { min: 3, max: 7 },
      specialConditions: [],
    },
    supportAmount: "최대 3억원",
    supportType: "보조금",
    supportDetails: "사업화 자금 + 멘토링 + 마케팅 + 글로벌 진출 지원",
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    contactPhone: "044-410-1013",
  },
  {
    id: "kstartup-youth-2026",
    title: "2026년 청년창업사관학교",
    organization: "중소벤처기업부",
    source: "k-startup.go.kr",
    sourceUrl: "https://www.k-startup.go.kr/homepage/businessManage/businessList.do",
    eligibility: {
      businessTypes: ["예비창업자", "스타트업"],
      industries: ["IT", "제조업", "서비스업", "콘텐츠"],
      regions: ["전국"],
      businessAge: { min: 0, max: 3 },
      specialConditions: ["청년창업"],
    },
    supportAmount: "최대 1억원",
    supportType: "보조금",
    supportDetails: "사업화 자금 + 창업 공간 + 멘토링 + 시제품 제작",
    startDate: "2026-03-01",
    endDate: "2026-04-15",
    announcementDate: "2026-05-30",
    contactPhone: "044-204-7654",
  },
  {
    id: "semas-loan-2026",
    title: "2026년 소상공인 정책자금 (일반경영안정)",
    organization: "소상공인시장진흥공단",
    source: "semas.or.kr",
    sourceUrl: "https://www.semas.or.kr",
    eligibility: {
      businessTypes: ["소상공인"],
      industries: ["음식점", "소매업", "서비스업", "제조업", "도매업"],
      regions: ["전국"],
      businessAge: { min: 0, max: 100 },
      specialConditions: [],
    },
    supportAmount: "최대 7,000만원",
    supportType: "융자",
    supportDetails: "연 2%대 저금리 융자, 5년 상환 (2년 거치)",
    startDate: "2026-01-02",
    endDate: "2026-11-30",
    contactPhone: "1357",
  },
  {
    id: "seoul-startup-2026",
    title: "2026년 서울시 자영업자 경영안정자금",
    organization: "서울신용보증재단",
    source: "seoul.go.kr",
    sourceUrl: "https://www.seoul.go.kr",
    eligibility: {
      businessTypes: ["소상공인"],
      industries: ["음식점", "소매업", "서비스업"],
      regions: ["서울"],
      businessAge: { min: 1, max: 100 },
      specialConditions: [],
    },
    supportAmount: "최대 5,000만원",
    supportType: "융자",
    supportDetails: "서울시 소상공인 저금리 운전자금 융자",
    startDate: "2026-02-01",
    endDate: "2026-06-30",
    contactPhone: "02-2094-0600",
  },
  {
    id: "gg-small-2026",
    title: "2026년 경기도 소상공인 경영안정자금",
    organization: "경기도경제과학진흥원",
    source: "gg.go.kr",
    sourceUrl: "https://www.gg.go.kr",
    eligibility: {
      businessTypes: ["소상공인"],
      industries: ["음식점", "소매업", "서비스업", "제조업"],
      regions: ["경기"],
      businessAge: { min: 0, max: 100 },
      specialConditions: [],
    },
    supportAmount: "최대 3,000만원",
    supportType: "융자",
    supportDetails: "경기도 내 소상공인 저금리 운전자금",
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    contactPhone: "031-259-6000",
  },
  {
    id: "women-startup-2026",
    title: "2026년 여성기업 성장지원사업",
    organization: "여성기업종합지원센터",
    source: "bizinfo.go.kr",
    sourceUrl: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do",
    eligibility: {
      businessTypes: ["소상공인", "중소기업", "스타트업"],
      industries: ["IT", "제조업", "서비스업", "소매업"],
      regions: ["전국"],
      businessAge: { min: 1, max: 7 },
      specialConditions: ["여성기업"],
    },
    supportAmount: "최대 5,000만원",
    supportType: "보조금",
    supportDetails: "여성 대표 기업 마케팅, 제품 개발, 판로 개척 지원",
    startDate: "2026-04-01",
    endDate: "2026-05-10",
    contactPhone: "02-369-0900",
  },
  {
    id: "mss-export-2026",
    title: "2026년 중소기업 수출바우처",
    organization: "중소벤처기업부",
    source: "mss.go.kr",
    sourceUrl: "https://www.exportvoucher.com",
    eligibility: {
      businessTypes: ["중소기업", "스타트업"],
      industries: ["제조업", "IT", "바이오", "콘텐츠"],
      regions: ["전국"],
      businessAge: { min: 1, max: 100 },
      employeeCount: { min: 1, max: 500 },
      specialConditions: [],
    },
    supportAmount: "최대 1억원",
    supportType: "보조금",
    supportDetails: "해외 마케팅, 통번역, 해외 인증, 물류비 등 수출 관련 서비스 바우처",
    startDate: "2026-02-15",
    endDate: "2026-04-30",
    contactPhone: "1600-5765",
  },
  {
    id: "kised-incubating-2026",
    title: "2026년 예비창업패키지",
    organization: "창업진흥원",
    source: "k-startup.go.kr",
    sourceUrl: "https://www.k-startup.go.kr/homepage/businessManage/businessList.do",
    eligibility: {
      businessTypes: ["예비창업자"],
      industries: ["IT", "제조업", "서비스업", "콘텐츠", "바이오"],
      regions: ["전국"],
      businessAge: { min: 0, max: 0 },
      specialConditions: [],
    },
    supportAmount: "최대 1억원",
    supportType: "보조금",
    supportDetails: "예비창업자 사업화 자금 + 교육 + 멘토링",
    startDate: "2026-03-01",
    endDate: "2026-04-20",
    contactPhone: "044-410-1013",
  },
  {
    id: "semas-online-2026",
    title: "2026년 소상공인 온라인판로지원",
    organization: "소상공인시장진흥공단",
    source: "semas.or.kr",
    sourceUrl: "https://www.semas.or.kr",
    eligibility: {
      businessTypes: ["소상공인"],
      industries: ["소매업", "제조업", "서비스업", "음식점"],
      regions: ["전국"],
      businessAge: { min: 0, max: 100 },
      specialConditions: [],
    },
    supportAmount: "최대 300만원",
    supportType: "보조금",
    supportDetails: "온라인 쇼핑몰 입점, 라이브커머스, 상세페이지 제작 등 지원",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    contactPhone: "1357",
  },
  {
    id: "kised-social-2026",
    title: "2026년 사회적기업 성장지원",
    organization: "한국사회적기업진흥원",
    source: "bizinfo.go.kr",
    sourceUrl: "https://www.socialenterprise.or.kr",
    eligibility: {
      businessTypes: ["소상공인", "중소기업"],
      industries: ["서비스업", "제조업", "교육"],
      regions: ["전국"],
      businessAge: { min: 1, max: 10 },
      specialConditions: ["사회적기업"],
    },
    supportAmount: "최대 2,000만원",
    supportType: "보조금",
    supportDetails: "사회적기업 인건비, 사업 개발비, 컨설팅 지원",
    startDate: "2026-03-15",
    endDate: "2026-05-31",
    contactPhone: "02-6370-8600",
  },
  {
    id: "ip-nara-2026",
    title: "2026년 지식재산 바우처 사업",
    organization: "특허청",
    source: "bizinfo.go.kr",
    sourceUrl: "https://www.kipa.org",
    eligibility: {
      businessTypes: ["소상공인", "중소기업", "스타트업"],
      industries: ["IT", "제조업", "바이오", "콘텐츠"],
      regions: ["전국"],
      businessAge: { min: 0, max: 100 },
      specialConditions: [],
    },
    supportAmount: "최대 500만원",
    supportType: "보조금",
    supportDetails: "특허/상표 출원, IP 전략 수립, 기술이전 등 지식재산 서비스",
    startDate: "2026-04-01",
    endDate: "2026-05-31",
    contactPhone: "1544-8080",
  },

  // ── 개인 대상 지원금 ──

  {
    id: "youth-rent-2026",
    title: "2026년 청년 월세 한시 특별지원",
    organization: "국토교통부",
    source: "gov.kr",
    sourceUrl: "https://www.gov.kr/portal/rcvfvrSvc/main",
    eligibility: {
      businessTypes: ["개인"],
      industries: [],
      regions: ["전국"],
      businessAge: { min: 0, max: 100 },
      specialConditions: ["청년"],
    },
    supportAmount: "월 최대 20만원 (12개월)",
    supportType: "보조금",
    supportDetails: "만 19~34세 무주택 청년, 중위소득 60% 이하 대상. 월세 최대 20만원 지원 (최대 12개월)",
    startDate: "2026-01-02",
    endDate: "2026-12-31",
    contactPhone: "1600-0777",
  },
  {
    id: "youth-savings-2026",
    title: "2026년 청년내일저축계좌",
    organization: "보건복지부",
    source: "gov.kr",
    sourceUrl: "https://www.gov.kr/portal/rcvfvrSvc/main",
    eligibility: {
      businessTypes: ["개인"],
      industries: [],
      regions: ["전국"],
      businessAge: { min: 0, max: 100 },
      specialConditions: ["청년"],
    },
    supportAmount: "월 10만원 매칭 (3년)",
    supportType: "보조금",
    supportDetails: "만 19~34세 근로청년, 월 10만원 저축 시 정부가 월 10만원 매칭 (3년간 총 720만원+)",
    startDate: "2026-05-01",
    endDate: "2026-07-31",
    contactPhone: "129",
  },
  {
    id: "childbirth-2026",
    title: "2026년 첫만남 이용권 (출산지원금)",
    organization: "보건복지부",
    source: "gov.kr",
    sourceUrl: "https://www.gov.kr/portal/rcvfvrSvc/main",
    eligibility: {
      businessTypes: ["개인"],
      industries: [],
      regions: ["전국"],
      businessAge: { min: 0, max: 100 },
      specialConditions: [],
    },
    supportAmount: "첫째 200만원, 둘째 이상 300만원",
    supportType: "보조금",
    supportDetails: "출생아 1인당 바우처 지급. 첫째 200만원, 둘째 이상 300만원. 출생일로부터 1년 이내 신청.",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    contactPhone: "129",
  },
  {
    id: "parental-leave-2026",
    title: "2026년 부모급여",
    organization: "보건복지부",
    source: "gov.kr",
    sourceUrl: "https://www.gov.kr/portal/rcvfvrSvc/main",
    eligibility: {
      businessTypes: ["개인"],
      industries: [],
      regions: ["전국"],
      businessAge: { min: 0, max: 100 },
      specialConditions: [],
    },
    supportAmount: "0세 월 100만원, 1세 월 50만원",
    supportType: "보조금",
    supportDetails: "만 0세(0~11개월) 월 100만원, 만 1세(12~23개월) 월 50만원 지급",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    contactPhone: "129",
  },
  {
    id: "job-support-2026",
    title: "2026년 국민취업지원제도",
    organization: "고용노동부",
    source: "gov.kr",
    sourceUrl: "https://www.kua.go.kr/uapaa010/selectMain.do",
    eligibility: {
      businessTypes: ["개인"],
      industries: [],
      regions: ["전국"],
      businessAge: { min: 0, max: 100 },
      specialConditions: [],
    },
    supportAmount: "월 50만원 (6개월)",
    supportType: "보조금",
    supportDetails: "구직촉진수당 월 50만원 × 6개월 + 취업성공수당 최대 150만원. 15~69세 구직자 대상.",
    startDate: "2026-01-02",
    endDate: "2026-12-31",
    contactPhone: "1350",
  },
  {
    id: "eitc-2026",
    title: "2026년 근로장려금",
    organization: "국세청",
    source: "nts.go.kr",
    sourceUrl: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2452&cntntsId=7783",
    eligibility: {
      businessTypes: ["개인"],
      industries: [],
      regions: ["전국"],
      businessAge: { min: 0, max: 100 },
      specialConditions: [],
    },
    supportAmount: "최대 330만원",
    supportType: "보조금",
    supportDetails: "저소득 근로자 가구. 단독가구 최대 165만원, 홑벌이 최대 285만원, 맞벌이 최대 330만원.",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    contactPhone: "126",
  },
  {
    id: "energy-voucher-2026",
    title: "2026년 에너지 바우처",
    organization: "산업통상자원부",
    source: "gov.kr",
    sourceUrl: "https://www.energyv.or.kr",
    eligibility: {
      businessTypes: ["개인"],
      industries: [],
      regions: ["전국"],
      businessAge: { min: 0, max: 100 },
      specialConditions: [],
    },
    supportAmount: "가구당 최대 18만원",
    supportType: "보조금",
    supportDetails: "기초생활수급자·차상위계층 대상 전기/가스/난방 에너지 바우처 지원",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    contactPhone: "1600-3190",
  },
  {
    id: "digital-education-2026",
    title: "2026년 국민내일배움카드",
    organization: "고용노동부",
    source: "hrd.go.kr",
    sourceUrl: "https://www.hrd.go.kr",
    eligibility: {
      businessTypes: ["개인"],
      industries: [],
      regions: ["전국"],
      businessAge: { min: 0, max: 100 },
      specialConditions: [],
    },
    supportAmount: "최대 500만원 (5년)",
    supportType: "교육",
    supportDetails: "국민 누구나 직업훈련비 300~500만원 지원. IT, 디자인, 요리, 자격증 등 다양한 과정.",
    startDate: "2026-01-02",
    endDate: "2026-12-31",
    contactPhone: "1350",
  },
];

// ─── 유틸 함수 ───────────────────────────────────────────────

export function getAllSubsidies(): Subsidy[] {
  return subsidies;
}

export function getSubsidyById(id: string): Subsidy | undefined {
  return subsidies.find((s) => s.id === id);
}

export function getActiveSubsidies(): Subsidy[] {
  const today = new Date().toISOString().slice(0, 10);
  return subsidies.filter((s) => s.startDate <= today && s.endDate >= today);
}

export function getDeadlineSubsidies(days: number = 7): Subsidy[] {
  const today = new Date();
  const limit = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const todayStr = today.toISOString().slice(0, 10);

  return subsidies
    .filter((s) => s.endDate >= todayStr && s.endDate <= limit)
    .sort((a, b) => a.endDate.localeCompare(b.endDate));
}

export function getDday(endDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── 매칭 로직 ───────────────────────────────────────────────

export function calculateMatch(profile: UserProfile, subsidy: Subsidy): MatchResult {
  let score = 0;
  const reasons: string[] = [];
  const e = subsidy.eligibility;

  // 1. 사업자 유형 (필수)
  if (!e.businessTypes.includes(profile.businessType)) {
    return { subsidy, score: 0, reasons: ["사업자 유형 불일치"] };
  }
  score += 30;
  reasons.push(`사업자 유형 일치 (${profile.businessType})`);

  // 2. 업종 (필수, 개인은 스킵)
  if (profile.businessType !== "개인" && e.industries.length > 0 && !e.industries.includes(profile.industry)) {
    return { subsidy, score: 0, reasons: ["업종 불일치"] };
  }
  score += 20;
  if (profile.businessType === "개인") {
    reasons.push("개인 대상 (업종 무관)");
  } else {
    reasons.push(`업종 일치 (${profile.industry})`);
  }

  // 3. 지역 (필수)
  if (!e.regions.includes("전국") && !e.regions.includes(profile.region)) {
    return { subsidy, score: 0, reasons: ["지역 불일치"] };
  }
  score += 15;
  reasons.push(e.regions.includes("전국") ? "전국 대상" : `지역 일치 (${profile.region})`);

  // 4. 업력 (필수, 개인은 스킵)
  if (profile.businessType !== "개인") {
    if (
      (e.businessAge.min !== undefined && profile.businessAge < e.businessAge.min) ||
      (e.businessAge.max !== undefined && profile.businessAge > e.businessAge.max)
    ) {
      return { subsidy, score: 0, reasons: ["업력 조건 불일치"] };
    }
  }
  score += 15;
  reasons.push("업력 조건 충족");

  // 5. 직원수 (가점)
  if (e.employeeCount) {
    if (
      (!e.employeeCount.min || profile.employeeCount >= e.employeeCount.min) &&
      (!e.employeeCount.max || profile.employeeCount <= e.employeeCount.max)
    ) {
      score += 5;
      reasons.push("직원 수 조건 충족");
    }
  } else {
    score += 5;
  }

  // 6. 특수 조건 (가점 — 없어도 매칭, 있으면 점수 높음)
  if (e.specialConditions.length > 0) {
    const matched = e.specialConditions.filter((c) => profile.specialTags.includes(c));
    if (matched.length > 0) {
      score += 15;
      reasons.push(`특수 조건 일치 (${matched.join(", ")})`);
    } else {
      // 특수조건이 있지만 해당 안 됨 — 그래도 매칭은 됨 (가점만 없음)
      reasons.push(`참고: ${e.specialConditions.join(", ")} 대상 우대`);
    }
  } else {
    score += 5;
  }

  return { subsidy, score, reasons };
}

export function getMatchedSubsidies(profile: UserProfile): MatchResult[] {
  return getActiveSubsidies()
    .map((s) => calculateMatch(profile, s))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ─── 검색 ────────────────────────────────────────────────────

export function searchSubsidies(query: string): Subsidy[] {
  const q = query.toLowerCase();
  return subsidies.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.organization.toLowerCase().includes(q) ||
      s.supportDetails.toLowerCase().includes(q),
  );
}

// ─── 상수 ────────────────────────────────────────────────────

export const BUSINESS_TYPES = ["개인", "소상공인", "중소기업", "스타트업", "예비창업자"];
export const INDUSTRIES = ["음식점", "소매업", "서비스업", "제조업", "IT", "콘텐츠", "바이오", "도매업", "교육"];
export const REGIONS = ["서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
