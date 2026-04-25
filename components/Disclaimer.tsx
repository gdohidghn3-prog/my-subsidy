export default function Disclaimer() {
  return (
    <div className="mx-4 mb-4 mt-4 bg-[#FFF8F0] border border-[#FDDCB5] rounded-lg px-3 py-2 text-center">
      <p className="text-[11px] text-[#9A6B3C] leading-relaxed">
        본 정보는 참고용이며 실제와 다를 수 있습니다. 정확한 내용은 공식 공고에서 확인하세요.
        <br />
        오류나 의견이 있으시면{' '}
        <a
          href="https://smart-ai-life.tistory.com/guestbook"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#7A4B1C]"
        >
          방명록
        </a>
        에 남겨주세요.
      </p>
    </div>
  );
}
