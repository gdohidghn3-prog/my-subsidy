// 날짜·금액 등 사용자 친화적 표기 헬퍼.
// 외부 의존성 없이 빌트인 Intl.DateTimeFormat 만 사용한다.

const KOREAN_DATE_FMT = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
});

const KOREAN_DATE_FMT_SHORT = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "short",
});

function isValidISODate(d: string | undefined | null): d is string {
  return typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);
}

/**
 * "2026-05-15" → "2026년 5월 15일 (금)"
 * 빈 문자열·잘못된 형식 → fallback 문자열.
 */
export function formatKoreanDate(
  dateStr: string | undefined | null,
  fallback = "마감일 미정",
): string {
  if (!isValidISODate(dateStr)) return fallback;
  // 'YYYY-MM-DD' 를 로컬 자정 기준으로 파싱 (UTC 0시로 두면 KST 환경에서 하루 밀릴 수 있다)
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return fallback;
  return KOREAN_DATE_FMT.format(date);
}

/**
 * 카드 등 좁은 영역용 짧은 포맷 — "5월 15일 (금)"
 */
export function formatKoreanDateShort(
  dateStr: string | undefined | null,
  fallback = "마감일 미정",
): string {
  if (!isValidISODate(dateStr)) return fallback;
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return fallback;
  return KOREAN_DATE_FMT_SHORT.format(date);
}
